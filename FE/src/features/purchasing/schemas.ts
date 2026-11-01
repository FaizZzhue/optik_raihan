import { z } from "zod"
import type { PurchasePayload, Supplier } from "@/types/purchasing"

// Validasi untuk kenyamanan pengguna. Penentu tetap BE/src/validators/{suppliers,purchases}.validator.ts.

export const supplierFormSchema = z.object({
  name: z.string().trim().min(1, "Nama supplier wajib diisi.").max(150, "Nama supplier maksimal 150 karakter."),
  phone: z.string().trim().max(30, "Telepon maksimal 30 karakter."),
  address: z.string().trim().max(255, "Alamat maksimal 255 karakter."),
  notes: z.string().trim().max(1000, "Catatan maksimal 1000 karakter."),
})

export type SupplierFormValues = z.infer<typeof supplierFormSchema>

export function toSupplierFormValues(supplier: Supplier | null): SupplierFormValues {
  return {
    name: supplier?.name ?? "",
    phone: supplier?.phone ?? "",
    address: supplier?.address ?? "",
    notes: supplier?.notes ?? "",
  }
}

// Sama dengan aturan harga di form barang: angka bulat Rupiah tanpa titik atau koma.
const unitCostSchema = z
  .string()
  .trim()
  .min(1, "Harga beli wajib diisi.")
  .regex(/^\d{1,12}$/, "Isi angka saja tanpa titik atau koma.")

const quantitySchema = z
  .string()
  .trim()
  .regex(/^\d{1,6}$/, "Isi jumlah berupa angka.")
  .refine((value) => Number(value) >= 1 && Number(value) <= 100_000, "Jumlah 1 sampai 100000.")

export const purchaseFormSchema = z.object({
  supplierId: z.string().min(1, "Supplier wajib dipilih."),
  supplierInvoiceNo: z.string().trim().max(50, "Nomor faktur maksimal 50 karakter."),
  notes: z.string().trim().max(1000, "Catatan maksimal 1000 karakter."),
  items: z
    .array(
      z.object({
        // Nama dan SKU hanya untuk tampilan baris; yang dikirim ke BE hanya productId.
        productId: z.number(),
        productLabel: z.string(),
        quantity: quantitySchema,
        unitCost: unitCostSchema,
      }),
    )
    .min(1, "Tambahkan minimal satu barang.")
    .max(100, "Maksimal 100 barang per pembelian."),
})

export type PurchaseFormValues = z.infer<typeof purchaseFormSchema>
export type PurchaseItemFormValues = PurchaseFormValues["items"][number]

export const EMPTY_PURCHASE_FORM: PurchaseFormValues = { supplierId: "", supplierInvoiceNo: "", notes: "", items: [] }

export function toPurchasePayload(values: PurchaseFormValues): PurchasePayload {
  return {
    supplierId: Number(values.supplierId),
    supplierInvoiceNo: values.supplierInvoiceNo,
    notes: values.notes,
    items: values.items.map((item) => ({
      productId: item.productId,
      quantity: Number(item.quantity),
      unitCost: item.unitCost,
    })),
  }
}
