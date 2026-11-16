import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export type BadgeTone = "success" | "warning" | "danger" | "info" | "neutral" | "lime"

const TONE_CLASSES: Record<BadgeTone, string> = {
  success: "bg-success/10 text-success-text",
  warning: "bg-warning/12 text-warning-text",
  danger: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info-text",
  neutral: "bg-muted text-muted-foreground",
  lime: "bg-primary/30 text-primary-text",
}

type ToneBadgeProps = {
  tone?: BadgeTone
  // Titik penanda; warna tidak pernah menjadi satu-satunya informasi karena teks selalu ada.
  dot?: boolean
  children: ReactNode
  className?: string
}

export function ToneBadge({ tone = "neutral", dot = false, children, className }: ToneBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap tabular-nums",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

type StatusBadgeProps = {
  isActive: boolean
}

// Status aktif/nonaktif selalu berupa teks disertai titik semantik, bukan hanya warna.
export function StatusBadge({ isActive }: StatusBadgeProps) {
  return isActive ? (
    <ToneBadge tone="success" dot>
      Aktif
    </ToneBadge>
  ) : (
    <ToneBadge tone="neutral" dot>
      Nonaktif
    </ToneBadge>
  )
}
