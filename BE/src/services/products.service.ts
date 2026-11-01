import { ERROR_CODES } from "../constants/error.constants.js";
import type { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import type { ProductDto } from "../types/catalog.js";
import type { PaginationMeta } from "../types/pagination.js";
import { AppError } from "../utils/app-error.js";
import { omitUndefined } from "../utils/omit-undefined.js";
import { PRISMA_ERROR_CODES, isPrismaError } from "../utils/prisma-error.js";
import { statusToIsActive } from "../utils/status-filter.js";
import type { CreateProductInput, ProductListQuery, UpdateProductInput } from "../validators/products.validator.js";

const NOT_FOUND_MESSAGE = "Barang tidak ditemukan.";

const productInclude = {
  category: { select: { id: true, name: true, isActive: true } },
} satisfies Prisma.ProductInclude;

type ProductWithCategory = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

function toProductDto(product: ProductWithCategory): ProductDto {
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    description: product.description,
    category: product.category,
    // Decimal → string dengan 2 desimal tetap, tanpa melewati number JS (DEC-011).
    sellPrice: product.sellPrice.toFixed(2),
    costPrice: product.costPrice.toFixed(2),
    stockQty: product.stockQty,
    isActive: product.isActive,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

// Barang baru atau pindah kategori hanya boleh ke kategori yang ada dan aktif.
async function assertCategoryAssignable(categoryId: number): Promise<void> {
  const category = await prisma.category.findUnique({ where: { id: categoryId }, select: { isActive: true } });
  if (!category?.isActive) {
    const message = "Kategori tidak ditemukan atau sudah nonaktif.";
    throw new AppError(409, ERROR_CODES.CONFLICT, message, [{ field: "categoryId", message }]);
  }
}

// Prisma meneruskan `contains` sebagai ILIKE tanpa meng-escape wildcard, sehingga "%" atau "_" dari pengguna
// akan cocok dengan semua baris. Backslash adalah karakter escape default LIKE di PostgreSQL.
function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, (character) => `\\${character}`);
}

export async function listProducts(query: ProductListQuery): Promise<{ items: ProductDto[]; meta: PaginationMeta }> {
  const isActive = statusToIsActive(query.status);
  const search = query.search === undefined ? undefined : escapeLikePattern(query.search);
  const where: Prisma.ProductWhereInput = {
    ...(isActive !== undefined && { isActive }),
    ...(query.categoryId !== undefined && { categoryId: query.categoryId }),
    ...(search !== undefined && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  // Data halaman dan total dibaca dalam satu transaksi agar meta konsisten dengan isi halaman.
  const [products, totalItems] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items: products.map(toProductDto),
    meta: {
      page: query.page,
      pageSize: query.pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / query.pageSize),
    },
  };
}

export async function getProductById(id: number): Promise<ProductDto> {
  const product = await prisma.product.findUnique({ where: { id }, include: productInclude });
  if (!product) {
    throw new AppError(404, ERROR_CODES.NOT_FOUND, NOT_FOUND_MESSAGE);
  }
  return toProductDto(product);
}

// SKU dan stok awal (0) diisi database. Pelaku diambil dari sesi, bukan body.
export async function createProduct(input: CreateProductInput, actorId: number): Promise<ProductDto> {
  await assertCategoryAssignable(input.categoryId);
  const product = await prisma.product.create({
    data: {
      name: input.name,
      categoryId: input.categoryId,
      sellPrice: input.sellPrice,
      createdById: actorId,
      ...omitUndefined({ costPrice: input.costPrice, description: input.description }),
    },
    include: productInclude,
  });
  return toProductDto(product);
}

// TODO(TASK-020): perubahan harga jual/beli wajib dicatat di audit log (PRD FR-15.1) setelah tabel audit_logs ada.
export async function updateProduct(id: number, input: UpdateProductInput): Promise<ProductDto> {
  const current = await prisma.product.findUnique({ where: { id }, select: { categoryId: true } });
  if (!current) {
    throw new AppError(404, ERROR_CODES.NOT_FOUND, NOT_FOUND_MESSAGE);
  }
  // Barang yang kategorinya sudah nonaktif tetap bisa diubah selama kategorinya tidak dipindah.
  if (input.categoryId !== undefined && input.categoryId !== current.categoryId) {
    await assertCategoryAssignable(input.categoryId);
  }

  try {
    const product = await prisma.product.update({ where: { id }, data: omitUndefined(input), include: productInclude });
    return toProductDto(product);
  } catch (error) {
    if (isPrismaError(error, PRISMA_ERROR_CODES.RECORD_NOT_FOUND)) {
      throw new AppError(404, ERROR_CODES.NOT_FOUND, NOT_FOUND_MESSAGE);
    }
    throw error;
  }
}

// Hapus permanen hanya untuk barang yang belum dipakai dokumen lain. Setelah tabel transaksi ada (Tahap 5+),
// FK ON DELETE RESTRICT menolak barang bertransaksi (AC-03.2); barang seperti itu dinonaktifkan.
export async function deleteProduct(id: number): Promise<void> {
  try {
    await prisma.product.delete({ where: { id } });
  } catch (error) {
    if (isPrismaError(error, PRISMA_ERROR_CODES.RECORD_NOT_FOUND)) {
      throw new AppError(404, ERROR_CODES.NOT_FOUND, NOT_FOUND_MESSAGE);
    }
    if (isPrismaError(error, PRISMA_ERROR_CODES.FOREIGN_KEY_VIOLATION)) {
      throw new AppError(
        409,
        ERROR_CODES.CONFLICT,
        "Barang sudah dipakai di transaksi sehingga tidak bisa dihapus. Nonaktifkan barang ini.",
      );
    }
    throw error;
  }
}
