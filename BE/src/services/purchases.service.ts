import { ERROR_CODES } from "../constants/error.constants.js";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import type { PaginationMeta } from "../types/pagination.js";
import type { PurchaseDetailDto, PurchaseSummaryDto } from "../types/purchasing.js";
import { AppError } from "../utils/app-error.js";
import type { CreatePurchaseInput, PurchaseListQuery } from "../validators/purchases.validator.js";

const { Decimal } = Prisma;
const NOT_FOUND_MESSAGE = "Pembelian tidak ditemukan.";
// Batas NUMERIC(14,2) untuk line_total dan total.
const MAX_MONEY = new Decimal("999999999999.99");

const headerInclude = {
  supplier: { select: { id: true, name: true } },
  createdBy: { select: { id: true, name: true } },
} satisfies Prisma.PurchaseInclude;

const summaryInclude = { ...headerInclude, _count: { select: { items: true } } } satisfies Prisma.PurchaseInclude;

const detailInclude = {
  ...headerInclude,
  items: {
    include: { product: { select: { id: true, sku: true, name: true } } },
    orderBy: { id: "asc" },
  },
} satisfies Prisma.PurchaseInclude;

type PurchaseHeader = Prisma.PurchaseGetPayload<{ include: typeof headerInclude }>;
type PurchaseSummary = Prisma.PurchaseGetPayload<{ include: typeof summaryInclude }>;
type PurchaseDetail = Prisma.PurchaseGetPayload<{ include: typeof detailInclude }>;

function toHeaderDto(purchase: PurchaseHeader) {
  return {
    id: purchase.id,
    supplier: purchase.supplier,
    supplierInvoiceNo: purchase.supplierInvoiceNo,
    purchasedAt: purchase.purchasedAt.toISOString(),
    total: purchase.total.toFixed(2),
    notes: purchase.notes,
    createdBy: purchase.createdBy,
  };
}

function toSummaryDto(purchase: PurchaseSummary): PurchaseSummaryDto {
  return { ...toHeaderDto(purchase), itemCount: purchase._count.items };
}

function toDetailDto(purchase: PurchaseDetail): PurchaseDetailDto {
  return {
    ...toHeaderDto(purchase),
    items: purchase.items.map((item) => ({
      id: item.id,
      product: item.product,
      quantity: item.quantity,
      unitCost: item.unitCost.toFixed(2),
      lineTotal: item.lineTotal.toFixed(2),
    })),
  };
}

function conflict(field: string, message: string): AppError {
  return new AppError(409, ERROR_CODES.CONFLICT, message, [{ field, message }]);
}

export async function listPurchases(
  query: PurchaseListQuery,
): Promise<{ items: PurchaseSummaryDto[]; meta: PaginationMeta }> {
  const where: Prisma.PurchaseWhereInput = query.supplierId === undefined ? {} : { supplierId: query.supplierId };
  const [purchases, totalItems] = await prisma.$transaction([
    prisma.purchase.findMany({
      where,
      include: summaryInclude,
      orderBy: [{ purchasedAt: "desc" }, { id: "desc" }],
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
    prisma.purchase.count({ where }),
  ]);
  return {
    items: purchases.map(toSummaryDto),
    meta: { page: query.page, pageSize: query.pageSize, totalItems, totalPages: Math.ceil(totalItems / query.pageSize) },
  };
}

export async function getPurchaseById(id: number): Promise<PurchaseDetailDto> {
  const purchase = await prisma.purchase.findUnique({ where: { id }, include: detailInclude });
  if (!purchase) {
    throw new AppError(404, ERROR_CODES.NOT_FOUND, NOT_FOUND_MESSAGE);
  }
  return toDetailDto(purchase);
}

// Satu pembelian = satu transaksi database (PRD FR-06.2, AC-06.2): dokumen pembelian, kenaikan stok, dan mutasi
// tersimpan bersama atau tidak sama sekali. Total dihitung BE dengan Decimal, bukan dari klien.
// products.cost_price sengaja tidak diubah: aturan harga pokok menunggu P-05.
export async function createPurchase(input: CreatePurchaseInput, actorId: number): Promise<PurchaseDetailDto> {
  // Diproses berurutan menurut productId agar dua pembelian serentak mengunci baris dalam urutan sama (cegah deadlock).
  const items = [...input.items]
    .sort((a, b) => a.productId - b.productId)
    .map((item) => ({ ...item, lineTotal: new Decimal(item.unitCost).mul(item.quantity) }));
  const total = items.reduce((sum, item) => sum.add(item.lineTotal), new Decimal(0));
  if (total.greaterThan(MAX_MONEY)) {
    throw new AppError(400, ERROR_CODES.VALIDATION_ERROR, "Total pembelian melebihi batas yang bisa disimpan.");
  }

  const purchaseId = await prisma.$transaction(async (tx) => {
    const supplier = await tx.supplier.findUnique({ where: { id: input.supplierId }, select: { isActive: true } });
    if (!supplier?.isActive) {
      throw conflict("supplierId", "Supplier tidak ditemukan atau sudah nonaktif.");
    }
    const activeProductIds = new Set(
      (
        await tx.product.findMany({
          where: { id: { in: items.map((item) => item.productId) }, isActive: true },
          select: { id: true },
        })
      ).map((product) => product.id),
    );
    const unavailableIndex = input.items.findIndex((item) => !activeProductIds.has(item.productId));
    if (unavailableIndex !== -1) {
      throw conflict(`items.${unavailableIndex}.productId`, "Barang tidak ditemukan atau sudah nonaktif.");
    }

    const purchase = await tx.purchase.create({
      data: {
        supplierId: input.supplierId,
        supplierInvoiceNo: input.supplierInvoiceNo ?? null,
        notes: input.notes ?? null,
        total,
        createdById: actorId,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitCost: item.unitCost,
            lineTotal: item.lineTotal,
          })),
        },
      },
      select: { id: true },
    });

    for (const item of items) {
      // UPDATE ... SET stock_qty = stock_qty + n RETURNING: atomik, dan baris terkunci sampai commit,
      // sehingga stock_after pada mutasi selalu sesuai urutan perubahan.
      const product = await tx.product.update({
        where: { id: item.productId },
        data: { stockQty: { increment: item.quantity } },
        select: { stockQty: true },
      });
      await tx.stockMovement.create({
        data: {
          productId: item.productId,
          movementType: "purchase_in",
          quantityChange: item.quantity,
          stockAfter: product.stockQty,
          purchaseId: purchase.id,
          createdById: actorId,
        },
      });
    }
    return purchase.id;
  });

  return getPurchaseById(purchaseId);
}
