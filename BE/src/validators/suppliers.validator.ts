import { z } from "zod";
import { nullableTextSchema, statusFilterSchema } from "./common.validator.js";

const supplierNameSchema = z
  .string({ error: "Nama supplier wajib diisi." })
  .trim()
  .min(1, "Nama supplier wajib diisi.")
  .max(150, "Nama supplier maksimal 150 karakter.");

const optionalFields = {
  phone: nullableTextSchema("Telepon", 30).optional(),
  address: nullableTextSchema("Alamat", 255).optional(),
  notes: nullableTextSchema("Catatan", 1000).optional(),
};

export const supplierListQuerySchema = z.object({
  status: statusFilterSchema,
});

export const createSupplierSchema = z.object({
  name: supplierNameSchema,
  ...optionalFields,
});

export const updateSupplierSchema = z
  .object({
    name: supplierNameSchema.optional(),
    ...optionalFields,
    isActive: z.boolean({ error: "Status aktif harus true atau false." }).optional(),
  })
  .refine((input) => Object.values(input).some((value) => value !== undefined), "Tidak ada data yang diubah.");

export type SupplierListQuery = z.infer<typeof supplierListQuerySchema>;
export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;
