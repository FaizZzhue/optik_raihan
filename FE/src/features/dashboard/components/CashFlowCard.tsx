import { useState } from "react"
import { BarChart3, Lock, Plus, Receipt } from "lucide-react"
import { Link } from "react-router-dom"
import { EmptyState } from "@/components/shared/EmptyState"
import { PillTabs, type PillTabOption } from "@/components/shared/PillTabs"
import { SectionCard } from "@/components/shared/SectionCard"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { PurchaseSummary } from "@/types/purchasing"
import { formatRupiah } from "@/utils/formatting/format-currency"
import { buildCashFlowBuckets, CASH_FLOW_PERIODS, type CashFlowBucket, type CashFlowPeriod } from "@/utils/dashboard/cash-flow"

type CashFlowMetric = "margin" | "procurement"

const METRIC_OPTIONS: readonly PillTabOption<CashFlowMetric>[] = [
  { value: "margin", label: "Margin Bersih" },
  { value: "procurement", label: "Pengadaan" },
]

const PERIOD_OPTIONS: readonly { value: CashFlowPeriod; label: string }[] = [
  { value: "daily", label: "Harian" },
  { value: "weekly", label: "Mingguan" },
  { value: "monthly", label: "Bulanan" },
  { value: "yearly", label: "Tahunan" },
]

// Tinggi batang dekoratif saat belum ada data; disamarkan dan disembunyikan dari pembaca layar.
const PLACEHOLDER_HEIGHTS = [38, 56, 44, 70, 52, 82, 46, 64, 40, 74, 54, 62]

type CashFlowCardProps = {
  purchases: readonly PurchaseSummary[]
  purchaseCount: number
  isPending: boolean
  canViewProcurement: boolean
}

type ChartState = "loading" | "locked" | "noSales" | "empty" | "ready"

function resolveChartState(metric: CashFlowMetric, props: CashFlowCardProps, total: number): ChartState {
  // Modul penjualan belum ada (Tahap 6), jadi margin bersih belum punya sumber data.
  if (metric === "margin") return "noSales"
  if (!props.canViewProcurement) return "locked"
  if (props.isPending) return "loading"
  return total > 0 ? "ready" : "empty"
}

export function CashFlowCard(props: CashFlowCardProps) {
  const { purchases, purchaseCount, canViewProcurement } = props
  const [period, setPeriod] = useState<CashFlowPeriod>("monthly")
  const [metric, setMetric] = useState<CashFlowMetric>("procurement")

  const buckets = buildCashFlowBuckets(canViewProcurement ? purchases : [], period)
  const total = buckets.reduce((sum, bucket) => sum + bucket.total, 0)
  const state = resolveChartState(metric, props, total)
  const rangeLabel = CASH_FLOW_PERIODS[period].rangeLabel

  return (
    <SectionCard
      title="Arus Kas"
      action={
        <Select value={period} onValueChange={(value) => setPeriod(value as CashFlowPeriod)}>
          <SelectTrigger aria-label="Periode grafik" className="focus-ring h-9 rounded-full border-border bg-card px-4 text-xs font-semibold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" align="end" className="rounded-xl">
            {PERIOD_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value} className="text-xs">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
      <div className="-mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          {state === "loading" ? (
            <Skeleton className="h-9 w-48" />
          ) : (
            <span className="text-3xl font-bold tracking-tight text-foreground tabular-nums sm:text-[2rem]">
              {state === "ready" || state === "empty" ? formatRupiah(String(total)) : "—"}
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {metric === "margin" ? "Margin bersih" : "Total pengadaan"} · {rangeLabel}
          </span>
        </div>
        <PillTabs options={METRIC_OPTIONS} value={metric} onChange={setMetric} ariaLabel="Data grafik" />
      </div>

      <div className="relative">
        {state === "ready" ? (
          <BarChart buckets={buckets} />
        ) : (
          <PlaceholderBars buckets={buckets} isLoading={state === "loading"} />
        )}
        {state !== "ready" && state !== "loading" && (
          <div className="absolute inset-x-0 top-0 bottom-7 flex items-center justify-center">
            <ChartEmptyState state={state} />
          </div>
        )}
      </div>

      {state === "ready" && purchases.length < purchaseCount && (
        <p className="text-[11px] text-muted-foreground">
          Grafik memuat {purchases.length} faktur terbaru dari {purchaseCount} faktur tercatat.
        </p>
      )}
    </SectionCard>
  )
}

function ChartEmptyState({ state }: { state: Exclude<ChartState, "ready" | "loading"> }) {
  if (state === "noSales") {
    return (
      <EmptyState
        variant="compact"
        icon={BarChart3}
        title="Margin bersih belum tersedia"
        description="Margin dihitung dari transaksi penjualan. Modul penjualan belum aktif, jadi belum ada data."
        className="rounded-2xl bg-card/90 backdrop-blur-sm"
      />
    )
  }

  if (state === "locked") {
    return (
      <EmptyState
        variant="compact"
        icon={Lock}
        title="Khusus owner"
        description="Data pengadaan hanya dapat dilihat oleh owner toko."
        className="rounded-2xl bg-card/90 backdrop-blur-sm"
      />
    )
  }

  return (
    <EmptyState
      variant="compact"
      icon={Receipt}
      title="Belum ada data pengadaan"
      description="Pembelian dari supplier pada periode ini akan tampil sebagai grafik di sini."
      className="rounded-2xl bg-card/90 backdrop-blur-sm"
      action={
        <Button asChild size="sm" className="h-9 rounded-full px-4">
          <Link to="/pembelian/baru">
            <Plus data-icon="inline-start" aria-hidden />
            Catat Pembelian
          </Link>
        </Button>
      }
    />
  )
}

function AxisLabel({ bucket, highlighted }: { bucket: CashFlowBucket; highlighted: boolean }) {
  return (
    <span className={cn("text-[10px] font-medium sm:text-[11px]", highlighted ? "text-foreground" : "text-muted-foreground")}>
      {bucket.label}
    </span>
  )
}

function PlaceholderBars({ buckets, isLoading }: { buckets: CashFlowBucket[]; isLoading: boolean }) {
  return (
    <div aria-hidden className={cn("flex h-60 gap-1.5 sm:gap-3", isLoading && "animate-pulse")}>
      {buckets.map((bucket, index) => (
        <div key={bucket.key} className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end justify-center">
            <div
              className="w-full max-w-10 rounded-full bg-chart-bar opacity-60"
              style={{ height: `${PLACEHOLDER_HEIGHTS[index % PLACEHOLDER_HEIGHTS.length]}%` }}
            />
          </div>
          <AxisLabel bucket={bucket} highlighted={false} />
        </div>
      ))}
    </div>
  )
}

// Batang abu sangat muda; batang periode berjalan atau yang di-hover/fokus berwarna lime dengan tooltip gelap.
function BarChart({ buckets }: { buckets: CashFlowBucket[] }) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const currentIndex = buckets.findIndex((bucket) => bucket.isCurrent)
  const activeIndex = focusedIndex ?? currentIndex
  const maxValue = Math.max(...buckets.map((bucket) => bucket.total), 1)

  return (
    <div role="group" aria-label="Grafik batang pengadaan per periode" className="flex h-60 gap-1.5 sm:gap-3" onMouseLeave={() => setFocusedIndex(null)}>
      {buckets.map((bucket, index) => {
        const isActive = index === activeIndex
        // Batang bernilai nol tetap terlihat sebagai potongan kecil agar sumbu waktu terbaca.
        const heightPct = bucket.total > 0 ? Math.max(8, (bucket.total / maxValue) * 82) : 3
        const tooltipAlign = index < 2 ? "left-0" : index > buckets.length - 3 ? "right-0" : "left-1/2 -translate-x-1/2"

        return (
          <button
            key={bucket.key}
            type="button"
            aria-label={`${bucket.fullLabel}: ${formatRupiah(String(bucket.total))}`}
            onMouseEnter={() => setFocusedIndex(index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            className="group focus-ring flex min-w-0 flex-1 flex-col items-center gap-2 rounded-lg"
          >
            <div className="relative flex w-full flex-1 items-end justify-center">
              <div
                className={cn(
                  "relative w-full max-w-10 rounded-full transition-colors duration-200",
                  isActive ? "bg-primary" : "bg-chart-bar group-hover:bg-primary/60",
                )}
                style={{ height: `${heightPct}%` }}
              >
                {isActive && (
                  <span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute bottom-full z-10 mb-2 flex flex-col rounded-xl bg-foreground px-3 py-1.5 text-left whitespace-nowrap text-background shadow-card-hover",
                      tooltipAlign,
                    )}
                  >
                    <span className="text-[10px] opacity-75">{bucket.fullLabel}</span>
                    <span className="text-xs font-bold tabular-nums">{formatRupiah(String(bucket.total))}</span>
                  </span>
                )}
              </div>
            </div>
            <AxisLabel bucket={bucket} highlighted={isActive} />
          </button>
        )
      })}
    </div>
  )
}
