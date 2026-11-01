import { z } from "zod";
import { moneySchema, nullableTextSchema, paginationQuerySchema } from "./common.validator.js";

const positiveIdSchema = (label: string) =>
  z.number({ error: `${label} wajib dipilih.` }).int(`${label} tidak valid.`).positive(`${label} tidak valid.`);

const purchaseItemSchema = z.object({
  productId: positiveIdSchema("Barang"),
  quantity: z
    .number({ error: "Jumlah wajib diisi." })
    .int("Jumlah harus bilangan bulat.")
    .min(1, "Jumlah minimal 1.")
    .max(100_000, "Jumlah maksimal 100000."),
  unitCost: moneySchema("Harga beli"),
});

export const purchaseListQuerySchema = paginationQuerySchema.extend({
  supplierId: z.coerce.number({ error: "Supplier tidak valid." }).int().positive("Supplier tidak valid.").optional(),
});

// Tanggal pembelian = waktu pencatatan (default database). Input tanggal mundur menunggu keputusan zona waktu toko (BR-10).
export const createPurchaseSchema = z.object({
  supplierId: positiveIdSchema("Supplier"),
  supplierInvoiceNo: nullableTextSchema("Nomor faktur supplier", 50).optional(),
  notes: nullableTextSchema("Catatan", 1000).optional(),
  items: z
    .array(purchaseItemSchema, { error: "Daftar barang wajib diisi." })
    .min(1, "Minimal satu barang.")
    .max(100, "Maksimal 100 barang per pembelian.")
    // Satu barang satu baris (UNIQUE purchase_id, product_id): jumlah digabung di form, bukan dua baris.
    .superRefine((items, ctx) => {
      const seen = new Set<number>();
      items.forEach((item, index) => {
        if (seen.has(item.productId)) {
          ctx.addIssue({ code: "custom", path: [index, "productId"], message: "Barang ini sudah ada di daftar." });
        }
        seen.add(item.productId);
      });
    }),
});

export type PurchaseListQuery = z.infer<typeof purchaseListQuerySchema>;
export type CreatePurchaseInput = z.infer<typeof createPurchaseSchema>;
