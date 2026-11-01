import { z } from "zod";
import { statusFilterSchema } from "./common.validator.js";

const categoryNameSchema = z
  .string({ error: "Nama kategori wajib diisi." })
  .trim()
  .min(1, "Nama kategori wajib diisi.")
  .max(100, "Nama kategori maksimal 100 karakter.");

export const categoryListQuerySchema = z.object({
  status: statusFilterSchema,
});

export const createCategorySchema = z.object({
  name: categoryNameSchema,
});

export const updateCategorySchema = z
  .object({
    name: categoryNameSchema.optional(),
    isActive: z.boolean({ error: "Status aktif harus true atau false." }).optional(),
  })
  .refine((input) => input.name !== undefined || input.isActive !== undefined, "Tidak ada data yang diubah.");

export type CategoryListQuery = z.infer<typeof categoryListQuerySchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
