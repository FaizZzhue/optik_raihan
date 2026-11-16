import { Database } from "lucide-react"
import { cn } from "@/lib/utils"

type ConnectionStatus = "pending" | "success" | "error"

const STATUS_DISPLAY: Record<ConnectionStatus, { label: string; dotClass: string; textClass: string }> = {
  pending: { label: "Memeriksa...", dotClass: "bg-muted-foreground animate-pulse", textClass: "text-muted-foreground" },
  success: { label: "Terhubung", dotClass: "bg-success", textClass: "text-success-text" },
  error: { label: "Gagal terhubung", dotClass: "bg-destructive", textClass: "text-destructive" },
}

// Status diturunkan dari hasil query data katalog: berhasil berarti API dan database merespons.
export function DatabaseStatusCard({ status }: { status: ConnectionStatus }) {
  const display = STATUS_DISPLAY[status]

  return (
    <div className="flex items-center justify-between gap-3 rounded-card border border-border bg-card px-5 py-4 shadow-card">
      <div className="flex min-w-0 items-center gap-3">
        <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Database className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">Status database</p>
          <p className="truncate text-[11px] text-muted-foreground">Data toko Optik Raihan</p>
        </div>
      </div>
      <span role="status" className={cn("inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold", display.textClass)}>
        <span aria-hidden className={cn("size-2 rounded-full", display.dotClass)} />
        {display.label}
      </span>
    </div>
  )
}
