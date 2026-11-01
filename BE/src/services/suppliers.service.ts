import { ERROR_CODES } from "../constants/error.constants.js";
import type { Supplier } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import type { SupplierDto } from "../types/purchasing.js";
import { AppError } from "../utils/app-error.js";
import { omitUndefined } from "../utils/omit-undefined.js";
import { PRISMA_ERROR_CODES, isPrismaError } from "../utils/prisma-error.js";
import { statusToIsActive } from "../utils/status-filter.js";
import type { CreateSupplierInput, SupplierListQuery, UpdateSupplierInput } from "../validators/suppliers.validator.js";

const NOT_FOUND_MESSAGE = "Supplier tidak ditemukan.";

function toSupplierDto(supplier: Supplier): SupplierDto {
  return {
    id: supplier.id,
    name: supplier.name,
    phone: supplier.phone,
    address: supplier.address,
    notes: supplier.notes,
    isActive: supplier.isActive,
    createdAt: supplier.createdAt.toISOString(),
    updatedAt: supplier.updatedAt.toISOString(),
  };
}

// Supplier adalah master data kecil yang dipakai sebagai pilihan di form pembelian, jadi daftar tidak dipaginasi.
export async function listSuppliers(query: SupplierListQuery): Promise<SupplierDto[]> {
  const isActive = statusToIsActive(query.status);
  const suppliers = await prisma.supplier.findMany({
    where: isActive === undefined ? {} : { isActive },
    orderBy: [{ name: "asc" }, { id: "asc" }],
  });
  return suppliers.map(toSupplierDto);
}

export async function getSupplierById(id: number): Promise<SupplierDto> {
  const supplier = await prisma.supplier.findUnique({ where: { id } });
  if (!supplier) {
    throw new AppError(404, ERROR_CODES.NOT_FOUND, NOT_FOUND_MESSAGE);
  }
  return toSupplierDto(supplier);
}

export async function createSupplier(input: CreateSupplierInput): Promise<SupplierDto> {
  const supplier = await prisma.supplier.create({ data: { ...omitUndefined(input), name: input.name } });
  return toSupplierDto(supplier);
}

export async function updateSupplier(id: number, input: UpdateSupplierInput): Promise<SupplierDto> {
  try {
    const supplier = await prisma.supplier.update({ where: { id }, data: omitUndefined(input) });
    return toSupplierDto(supplier);
  } catch (error) {
    if (isPrismaError(error, PRISMA_ERROR_CODES.RECORD_NOT_FOUND)) {
      throw new AppError(404, ERROR_CODES.NOT_FOUND, NOT_FOUND_MESSAGE);
    }
    throw error;
  }
}

// Sama seperti kategori (DEC-036): hapus permanen hanya bila belum dipakai pembelian (FK RESTRICT); selain itu nonaktifkan.
export async function deleteSupplier(id: number): Promise<void> {
  try {
    await prisma.supplier.delete({ where: { id } });
  } catch (error) {
    if (isPrismaError(error, PRISMA_ERROR_CODES.RECORD_NOT_FOUND)) {
      throw new AppError(404, ERROR_CODES.NOT_FOUND, NOT_FOUND_MESSAGE);
    }
    if (isPrismaError(error, PRISMA_ERROR_CODES.FOREIGN_KEY_VIOLATION)) {
      throw new AppError(
        409,
        ERROR_CODES.CONFLICT,
        "Supplier sudah dipakai di pembelian sehingga tidak bisa dihapus. Nonaktifkan supplier ini.",
      );
    }
    throw error;
  }
}
