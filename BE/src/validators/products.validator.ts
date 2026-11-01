import { z } from "zod";
import { moneySchema, nullableTextSchema, paginationQuerySchema, statusFilterSchema } from "./common.validator.js";

const productNameSchema = z
  .string({ error: "Nama barang wajib diisi." })
  .trim()
  .min(1, "Nama barang wajib diisi.")
  .max(150, "Nama barang maksimal 150 karakter.");

const categoryIdSchema = z
  .number({ error: "Kategori wajib dipilih." })
  .int("Kategori tidak valid.")
  .positive("Kategori tidak valid.");

// String kosong berarti deskripsi dihapus.
const descriptionSchema = nullableTextSchema("Deskripsi", 1000);

// sku dan stockQty sengaja tidak ada: SKU dibuat database (FR-03.3) dan stok hanya berubah lewat mutasi (FR-03.9).
// z.object membuang field tersebut bila dikirim.
export const productListQuerySchema = paginationQuerySchema.extend({
  search: z
    .string({ error: "Kata kunci tidak valid." })
    .trim()
    .max(100, "Kata kunci maksimal 100 karakter.")
    .transform((value) => (value === "" ? undefined : value))
    .optional(),
  categoryId: z.coerce
    .number({ error: "Kategori tidak valid." })
    .int("Kategori tidak valid.")
    .positive("Kategori tidak valid.")
    .optional(),
  status: statusFilterSchema,
});

export const createProductSchema = z.object({
  name: productNameSchema,
  categoryId: categoryIdSchema,
  sellPrice: moneySchema("Harga jual"),
  costPrice: moneySchema("Harga beli").optional(),
  description: descriptionSchema.optional(),
});

export const updateProductSchema = z
  .object({
    name: productNameSchema.optional(),
    categoryId: categoryIdSchema.optional(),
    sellPrice: moneySchema("Harga jual").optional(),
    costPrice: moneySchema("Harga beli").optional(),
    description: descriptionSchema.optional(),
    isActive: z.boolean({ error: "Status aktif harus true atau false." }).optional(),
  })
  .refine((input) => Object.values(input).some((value) => value !== undefined), "Tidak ada data yang diubah.");

export type ProductListQuery = z.infer<typeof productListQuerySchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
