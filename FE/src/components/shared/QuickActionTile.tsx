import type { LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"

type QuickActionTileProps = {
  to: string
  label: string
  icon: LucideIcon
}

// Tile persegi membulat: ikon di atas, label di bawah; naik sedikit saat hover.
export function QuickActionTile({ to, label, icon: Icon }: QuickActionTileProps) {
  return (
    <Link
      to={to}
      className="group focus-ring flex aspect-square min-w-0 flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card p-2 text-center transition duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <span
        className="flex size-10 items-center justify-center rounded-full bg-muted text-foreground transition-colors duration-150 group-hover:bg-primary group-hover:text-primary-foreground"
        aria-hidden
      >
        <Icon className="size-4.5" />
      </span>
      <span className="text-[11px] leading-tight font-semibold text-foreground sm:text-xs">{label}</span>
    </Link>
  )
}
