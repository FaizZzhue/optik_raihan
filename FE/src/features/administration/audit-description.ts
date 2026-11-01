import type { AuditLogEntry } from "@/types/administration"
import { formatRupiah } from "@/utils/format-currency"

type PriceChange = { from: string; to: string }

function isPriceChange(value: unknown): value is PriceChange {
  return (
    typeof value === "object" &&
    value !== null &&
    "from" in value &&
    "to" in value &&
    typeof value.from === "string" &&
    typeof value.to === "string"
  )
}

function readString(details: Record<string, unknown>, key: string): string | null {
  const value = details[key]
  return typeof value === "string" ? value : null
}

// Ringkasan satu baris untuk kolom "Keterangan". Bentuk details mengikuti BE/src/services/{products,users}.service.ts.
export function describeAuditEntry(entry: AuditLogEntry): string {
  const details = entry.details ?? {}
  switch (entry.action) {
    case "price_change": {
      const changes = [
        isPriceChange(details.sellPrice) &&
          `harga jual ${formatRupiah(details.sellPrice.from)} → ${formatRupiah(details.sellPrice.to)}`,
        isPriceChange(details.costPrice) &&
          `harga beli ${formatRupiah(details.costPrice.from)} → ${formatRupiah(details.costPrice.to)}`,
      ].filter(Boolean)
      return `${readString(details, "sku") ?? ""} ${readString(details, "name") ?? ""}: ${changes.join("; ")}`.trim()
    }
    case "user_create":
    case "user_deactivate":
    case "user_activate":
    case "password_reset":
      return `Akun ${readString(details, "username") ?? `#${entry.entityId ?? "?"}`}`
    default:
      return "—"
  }
}
