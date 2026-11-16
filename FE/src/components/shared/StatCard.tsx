import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { ToneBadge, type BadgeTone } from "./StatusBadge"

export type StatTone = "lime" | "info" | "neutral" | "warning"

const ICON_TONE_CLASSES: Record<StatTone, string> = {
  lime: "bg-primary/30 text-primary-text",
  info: "bg-info/10 text-info-text",
  neutral: "bg-muted text-foreground",
  warning: "bg-warning/12 text-warning-text",
}

type StatCardProps = {
  label: string
  value: ReactNode
  icon: LucideIcon
  tone?: StatTone
  // Satuan kecil di samping angka, mis. "pcs".
  unit?: string
  badge?: { text: string; tone: BadgeTone }
  hint?: string
  // Bila diisi, seluruh kartu menjadi tautan ke halaman terkait.
  to?: string
}

export function StatCard({ label, value, icon: Icon, tone = "neutral", unit, badge, hint, to }: StatCardProps) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-full", ICON_TONE_CLASSES[tone])} aria-hidden>
          <Icon className="size-4.5" />
        </span>
        {badge && <ToneBadge tone={badge.tone}>{badge.text}</ToneBadge>}
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground sm:text-sm">{label}</span>
        <span className="flex min-w-0 items-baseline gap-1.5">
          <span className="truncate text-lg font-bold tracking-tight text-foreground tabular-nums sm:text-2xl">{value}</span>
          {unit && <span className="text-xs font-medium text-muted-foreground">{unit}</span>}
        </span>
        {hint && <span className="truncate text-[11px] text-muted-foreground sm:text-xs">{hint}</span>}
      </div>
    </>
  )

  const baseClasses = "flex min-w-0 flex-col gap-4 rounded-card border border-border bg-card p-4 shadow-card sm:p-5"

  if (!to) {
    return <div className={baseClasses}>{body}</div>
  }

  return (
    <Link
      to={to}
      className={cn(
        baseClasses,
        "focus-ring transition duration-200 hover:-translate-y-0.5 hover:shadow-card-hover",
      )}
    >
      {body}
    </Link>
  )
}
