import { z } from "zod"
import type { Product, ProductPayload } from "@/types/catalog"

// Validasi untuk kenyamanan pengguna. Penentu tetap BE/src/validators/{categories,products}.validator.ts.

export const categoryFormSchema = z.object({
  name: z.string().trim().min(1, "Nama kategori wajib diisi.").max(100, "Nama kategori maksimal 100 karakter."),
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>

// Rupiah diisi bilangan bulat. Titik dan koma ditolak karena "1.250" bisa berarti seribu dua ratus lima puluh
// (kebiasaan Indonesia) atau 1,25 (format desimal API).
function priceSchema(label: string) {
  return z
    .string()
    .trim()
    .min(1, `${label} wajib diisi.`)
    .regex(/^\d{1,12}$/, `${label} diisi angka saja tanpa titik atau koma, mis. 1250000.`)
}

export const productFormSchema = z.object({
  name: z.string().trim().min(1, "Nama barang wajib diisi.").max(150, "Nama barang maksimal 150 karakter."),
  categoryId: z.string().min(1, "Kategori wajib dipilih."),
  sellPrice: priceSchema("Harga jual"),
  costPrice: priceSchema("Harga beli"),
  description: z.string().trim().max(1000, "Deskripsi maksimal 1000 karakter."),
})

export type ProductFormValues = z.infer<typeof productFormSchema>

export const EMPTY_PRODUCT_FORM: ProductFormValues = {
  name: "",
  categoryId: "",
  sellPrice: "",
  costPrice: "0",
  description: "",
}

// "1250000.00" dari API → "1250000" untuk diedit di form. Pecahan selain ,00 dibiarkan agar terlihat dan dikoreksi.
function toPriceInput(value: string): string {
  return value.replace(/\.00$/, "")
}

export function toProductFormValues(product: Product): ProductFormValues {
  return {
    name: product.name,
    categoryId: String(product.category.id),
    sellPrice: toPriceInput(product.sellPrice),
    costPrice: toPriceInput(product.costPrice),
    description: product.description ?? "",
  }
}

export function toProductPayload(values: ProductFormValues): ProductPayload {
  return { ...values, categoryId: Number(values.categoryId) }
}
