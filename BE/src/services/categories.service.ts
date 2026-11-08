import { ERROR_CODES } from "../constants/error.constants.js";
import type { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import type { CategoryDto } from "../types/catalog.js";
import { AppError } from "../utils/app-error.js";
import { omitUndefined } from "../utils/omit-undefined.js";
import { PRISMA_ERROR_CODES, isPrismaError } from "../utils/prisma-error.js";
import { statusToIsActive } from "../utils/status-filter.js";
import type { CategoryListQuery, CreateCategoryInput, UpdateCategoryInput } from "../validators/categories.validator.js";

const NOT_FOUND_MESSAGE = "Kategori tidak ditemukan.";

// Jumlah barang dan total stok dipakai FE untuk ringkasan operasional dan inventaris.
const categoryInclude = {
  _count: { select: { products: true } },
  products: { select: { stockQty: true } },
} satisfies Prisma.CategoryInclude;

type CategoryWithCount = Prisma.CategoryGetPayload<{ include: typeof categoryInclude }>;

function toCategoryDto(category: CategoryWithCount): CategoryDto {
  const totalStock = category.products.reduce((sum, p) => sum + p.stockQty, 0);
  return {
    id: category.id,
    name: category.name,
    isActive: category.isActive,
    productCount: category._count.products,
    totalStock,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}

// Nama kembar (tanpa membedakan huruf besar/kecil) ditolak oleh indeks unik "categories_name_lower_key".
// Mengandalkan constraint database, bukan cek-lalu-simpan, agar dua request serentak tidak lolos bersamaan.
function toDuplicateNameError(): AppError {
  return new AppError(409, ERROR_CODES.CONFLICT, "Nama kategori sudah dipakai.", [
    { field: "name", message: "Nama kategori sudah dipakai." },
  ]);
}

// Kategori adalah master data kecil yang dipakai sebagai pilihan di form barang, jadi daftar tidak dipaginasi.
export async function listCategories(query: CategoryListQuery): Promise<CategoryDto[]> {
  const isActive = statusToIsActive(query.status);
  const categories = await prisma.category.findMany({
    where: isActive === undefined ? {} : { isActive },
    include: categoryInclude,
    orderBy: [{ name: "asc" }, { id: "asc" }],
  });
  return categories.map(toCategoryDto);
}

export async function getCategoryById(id: number): Promise<CategoryDto> {
  const category = await prisma.category.findUnique({ where: { id }, include: categoryInclude });
  if (!category) {
    throw new AppError(404, ERROR_CODES.NOT_FOUND, NOT_FOUND_MESSAGE);
  }
  return toCategoryDto(category);
}

export async function createCategory(input: CreateCategoryInput): Promise<CategoryDto> {
  try {
    const category = await prisma.category.create({ data: { name: input.name }, include: categoryInclude });
    return toCategoryDto(category);
  } catch (error) {
    if (isPrismaError(error, PRISMA_ERROR_CODES.UNIQUE_VIOLATION)) {
      throw toDuplicateNameError();
    }
    throw error;
  }
}

export async function updateCategory(id: number, input: UpdateCategoryInput): Promise<CategoryDto> {
  try {
    const category = await prisma.category.update({
      where: { id },
      data: omitUndefined(input),
      include: categoryInclude,
    });
    return toCategoryDto(category);
  } catch (error) {
    if (isPrismaError(error, PRISMA_ERROR_CODES.RECORD_NOT_FOUND)) {
      throw new AppError(404, ERROR_CODES.NOT_FOUND, NOT_FOUND_MESSAGE);
    }
    if (isPrismaError(error, PRISMA_ERROR_CODES.UNIQUE_VIOLATION)) {
      throw toDuplicateNameError();
    }
    throw error;
  }
}

// Hapus permanen hanya untuk kategori yang belum dipakai barang; FK ON DELETE RESTRICT menolak sisanya
// (AC-03.2). Kategori yang sudah dipakai dinonaktifkan lewat updateCategory.
export async function deleteCategory(id: number): Promise<void> {
  try {
    await prisma.category.delete({ where: { id } });
  } catch (error) {
    if (isPrismaError(error, PRISMA_ERROR_CODES.RECORD_NOT_FOUND)) {
      throw new AppError(404, ERROR_CODES.NOT_FOUND, NOT_FOUND_MESSAGE);
    }
    if (isPrismaError(error, PRISMA_ERROR_CODES.FOREIGN_KEY_VIOLATION)) {
      throw new AppError(
        409,
        ERROR_CODES.CONFLICT,
        "Kategori masih dipakai oleh barang sehingga tidak bisa dihapus. Nonaktifkan kategori ini.",
      );
    }
    throw error;
  }
}
