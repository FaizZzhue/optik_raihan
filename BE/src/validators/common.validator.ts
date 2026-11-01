import { z } from "zod";
import { PAGINATION, STATUS_FILTERS } from "../constants/catalog.constants.js";

// Parameter :id pada URL. Nilai bukan bilangan bulat positif = 400, bukan 404.
export const idParamSchema = z.object({
  id: z.coerce.number({ error: "ID tidak valid." }).int("ID tidak valid.").positive("ID tidak valid."),
});

export type IdParams = z.infer<typeof idParamSchema>;

export const statusFilterSchema = z
  .enum([STATUS_FILTERS.ALL, STATUS_FILTERS.ACTIVE, STATUS_FILTERS.INACTIVE], {
    error: "Status harus all, active, atau inactive.",
  })
  .default(STATUS_FILTERS.ALL);

export const paginationQuerySchema = z.object({
  page: z.coerce.number({ error: "Halaman tidak valid." }).int("Halaman tidak valid.").min(1, "Halaman minimal 1.").default(1),
  pageSize: z.coerce
    .number({ error: "Ukuran halaman tidak valid." })
    .int("Ukuran halaman tidak valid.")
    .min(1, "Ukuran halaman minimal 1.")
    .max(PAGINATION.MAX_PAGE_SIZE, `Ukuran halaman maksimal ${PAGINATION.MAX_PAGE_SIZE}.`)
    .default(PAGINATION.DEFAULT_PAGE_SIZE),
});

// Uang dikirim sebagai string desimal (DEC-011): maksimal 12 digit bulat dan 2 desimal sesuai NUMERIC(14,2),
// titik hanya sebagai pemisah desimal. "1.250.000" ditolak agar titik ribuan tidak terbaca sebagai desimal.
export function moneySchema(label: string) {
  return z
    .string({ error: `${label} wajib diisi sebagai teks angka.` })
    .trim()
    .regex(/^\d{1,12}(\.\d{1,2})?$/, `${label} harus angka 0 atau lebih tanpa titik ribuan, mis. 1250000.`);
}
