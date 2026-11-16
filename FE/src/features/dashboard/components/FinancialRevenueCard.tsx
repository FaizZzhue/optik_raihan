import { useState } from "react"
import { Glasses, Wifi } from "lucide-react"
import { PillTabs, type PillTabOption } from "@/components/shared/PillTabs"
import { formatRupiah } from "@/utils/formatting/format-currency"

type RevenueMode = "gross" | "net"

const MODE_OPTIONS: readonly PillTabOption<RevenueMode>[] = [
  { value: "net", label: "Net" },
  { value: "gross", label: "Gross" },
]

type FinancialRevenueCardProps = {
  grossRevenue: number
  netRevenue: number
  periodLabel: string
  // false selama modul penjualan belum ada: nilai Rp0 diberi keterangan agar tidak dibaca sebagai omzet nol.
  salesAvailable: boolean
}

// Kartu pendapatan ringkas bergaya kartu bank (rasio ~1.6:1). Latar selalu gelap di kedua tema.
export function FinancialRevenueCard({ grossRevenue, netRevenue, periodLabel, salesAvailable }: FinancialRevenueCardProps) {
  const [mode, setMode] = useState<RevenueMode>("gross")
  const amount = mode === "gross" ? grossRevenue : netRevenue

  return (
    <section
      aria-label="Kartu pendapatan Optik Raihan"
      className="relative mx-auto flex aspect-[1.6/1] w-full max-w-[380px] flex-col justify-between overflow-hidden rounded-card bg-linear-135 from-bank-from via-bank-via to-bank-to p-5 text-bank-foreground shadow-card-hover"
    >
      {/* Kilau lime samar di pojok agar kartu terasa seperti permukaan kartu fisik. */}
      <div aria-hidden className="pointer-events-none absolute -top-20 -right-16 size-56 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span aria-hidden className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Glasses className="size-4" />
          </span>
          <span className="text-xs font-bold tracking-wider uppercase">Optik Raihan</span>
        </div>
        <PillTabs options={MODE_OPTIONS} value={mode} onChange={setMode} ariaLabel="Jenis pendapatan" surface="onDark" size="sm" />
      </div>

      <div className="relative flex items-center gap-3">
        <span aria-hidden className="grid h-7 w-10 grid-cols-2 grid-rows-2 gap-px overflow-hidden rounded-md bg-linear-135 from-chip-gold-from to-chip-gold-to p-1 opacity-95">
          <span className="rounded-[2px] border border-black/15" />
          <span className="rounded-[2px] border border-black/15" />
          <span className="rounded-[2px] border border-black/15" />
          <span className="rounded-[2px] border border-black/15" />
        </span>
        <Wifi aria-hidden className="size-4 rotate-90 text-bank-foreground/70" />
      </div>

      <div className="relative flex flex-col gap-0.5">
        <span className="text-[11px] font-medium text-bank-foreground/75">
          {mode === "gross" ? "Pendapatan kotor" : "Pendapatan bersih"}
        </span>
        <span className="truncate text-2xl font-bold tracking-tight tabular-nums">{formatRupiah(String(amount))}</span>
      </div>

      <div className="relative flex items-end justify-between gap-2 text-[11px]">
        <span className="font-mono tracking-wider text-bank-foreground/75 uppercase">{periodLabel}</span>
        {!salesAvailable && (
          <span className="rounded-full bg-bank-foreground/10 px-2 py-0.5 text-[10px] font-medium text-bank-foreground/80">
            Modul penjualan belum aktif
          </span>
        )}
      </div>
    </section>
  )
}
