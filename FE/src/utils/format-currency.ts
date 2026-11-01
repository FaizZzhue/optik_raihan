const rupiahNumberFormatter = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 })

// Satu format Rupiah untuk seluruh aplikasi, mis. "1250000.00" → "Rp1.250.000" (PROJECT-CONTEXT.md bagian 4, Aturan UI).
// Hanya untuk tampilan; nilai resmi tetap string dari BE.
export function formatRupiah(value: string): string {
  return `Rp${rupiahNumberFormatter.format(Number(value))}`
}
