import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description: string
  // Tombol tindak lanjut opsional, mis. "Catat Pembelian".
  action?: ReactNode
  // "compact" untuk di dalam kartu: tanpa bingkai putus-putus dan padding lebih kecil.
  variant?: "default" | "compact"
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, variant = "default", className }: EmptyStateProps) {
  const isCompact = variant === "compact"

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 text-center",
        isCompact ? "px-4 py-6" : "rounded-xl border border-dashed border-input bg-card px-6 py-12",
        className,
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-full bg-muted text-muted-foreground",
          isCompact ? "size-11" : "size-12",
        )}
      >
        <Icon className={isCompact ? "size-5" : "size-6"} aria-hidden />
      </span>
      {isCompact ? (
        <p className="text-sm font-semibold text-foreground">{title}</p>
      ) : (
        <h2 className="text-base font-semibold">{title}</h2>
      )}
      <p className={cn("max-w-md text-muted-foreground", isCompact ? "text-xs" : "text-sm")}>{description}</p>
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}
