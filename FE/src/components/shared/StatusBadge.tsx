import { Badge } from "@/components/ui/badge"

type StatusBadgeProps = {
  isActive: boolean
}

// Status selalu berupa teks disertai penanda titik semantik, bukan hanya warna.
export function StatusBadge({ isActive }: StatusBadgeProps) {
  return isActive ? (
    <Badge variant="secondary" className="gap-1.5">
      <span aria-hidden className="size-1.5 rounded-full bg-success" />
      Aktif
    </Badge>
  ) : (
    <Badge variant="outline" className="gap-1.5 text-muted-foreground">
      <span aria-hidden className="size-1.5 rounded-full bg-muted-foreground" />
      Nonaktif
    </Badge>
  )
}
