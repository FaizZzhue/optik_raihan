// Satu format tanggal untuk seluruh aplikasi (PROJECT-CONTEXT.md bagian 4, Aturan UI), mis. "2 Nov 2026 14.30".
// Ditampilkan dalam zona waktu perangkat; zona waktu toko (WIB) belum dikonfirmasi (BR-10).
const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})

const shortDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
})

export function formatDateTime(isoString: string): string {
  return dateTimeFormatter.format(new Date(isoString))
}

export function formatDateShort(isoString: string): string {
  return shortDateFormatter.format(new Date(isoString))
}

const monthYearFormatter = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" })

// Label periode berjalan, mis. "November 2026". Mengikuti tanggal perangkat.
export function formatMonthYear(date: Date): string {
  return monthYearFormatter.format(date)
}
