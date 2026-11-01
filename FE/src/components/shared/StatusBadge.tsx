import { Badge } from "@/components/ui/badge"

type StatusBadgeProps = {
  isActive: boolean
}

// Status selalu berupa teks, bukan hanya warna.
export function StatusBadge({ isActive }: StatusBadgeProps) {
  return isActive ? <Badge variant="secondary">Aktif</Badge> : <Badge variant="outline">Nonaktif</Badge>
}
