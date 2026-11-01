import { ERROR_CODES } from "../constants/error.constants.js";
import { prisma } from "../lib/prisma.js";
import type { PaginationMeta } from "../types/pagination.js";
import type { StockMovementDto } from "../types/purchasing.js";
import { AppError } from "../utils/app-error.js";

type Pagination = { page: number; pageSize: number };

// Kartu stok satu barang (PRD FR-08.3): mutasi terbaru lebih dulu. Tidak ada endpoint yang menulis mutasi langsung.
export async function listProductStockMovements(
  productId: number,
  pagination: Pagination,
): Promise<{ items: StockMovementDto[]; meta: PaginationMeta }> {
  const product = await prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
  if (!product) {
    throw new AppError(404, ERROR_CODES.NOT_FOUND, "Barang tidak ditemukan.");
  }
  const where = { productId };
  const [movements, totalItems] = await prisma.$transaction([
    prisma.stockMovement.findMany({
      where,
      include: { createdBy: { select: { id: true, name: true } } },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (pagination.page - 1) * pagination.pageSize,
      take: pagination.pageSize,
    }),
    prisma.stockMovement.count({ where }),
  ]);
  return {
    items: movements.map((movement) => ({
      id: movement.id,
      movementType: movement.movementType,
      quantityChange: movement.quantityChange,
      stockAfter: movement.stockAfter,
      purchaseId: movement.purchaseId,
      note: movement.note,
      createdBy: movement.createdBy,
      createdAt: movement.createdAt.toISOString(),
    })),
    meta: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pagination.pageSize),
    },
  };
}
