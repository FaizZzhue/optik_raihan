import { Calendar, Filter, Search, SlidersHorizontal, X } from "lucide-react"
import { PAYMENT_METHOD_LABELS, type PaymentMethod, type SaleStatus } from "@/types/sales"

type CashierFiltersProps = {
  search: string
  onSearchChange: (value: string) => void
  status: SaleStatus | "all"
  onStatusChange: (status: SaleStatus | "all") => void
  paymentMethod: PaymentMethod | "all"
  onPaymentMethodChange: (method: PaymentMethod | "all") => void
  onResetFilters: () => void
}

export function CashierFilters({
  search,
  onSearchChange,
  status,
  onPaymentMethodChange,
  paymentMethod,
  onStatusChange,
  onResetFilters,
}: CashierFiltersProps) {
  const activeFilterCount =
    (status !== "all" ? 1 : 0) + (paymentMethod !== "all" ? 1 : 0) + (search.trim() ? 1 : 0)

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      {/* Kiri: Active Filter Counter & Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Active Filter Pill Badge */}
        <div className="flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1.5 text-xs font-semibold text-foreground">
          <Filter className="size-3.5 text-muted-foreground" />
          <span>Filter Aktif</span>
          <span className="flex size-4.5 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
            {activeFilterCount}
          </span>
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as SaleStatus | "all")}
            className="focus-ring h-10 appearance-none rounded-full border border-border bg-card pr-9 pl-4 text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-muted"
            aria-label="Filter status transaksi"
          >
            <option value="all">Semua Status</option>
            <option value="completed">Lunas</option>
            <option value="draft">Draft</option>
            <option value="void">Dibatalkan (Void)</option>
          </select>
          <SlidersHorizontal className="pointer-events-none absolute top-1/2 right-3 size-3 -translate-y-1/2 text-muted-foreground" />
        </div>

        {/* Metode Pembayaran Dropdown */}
        <div className="relative">
          <select
            value={paymentMethod}
            onChange={(e) => onPaymentMethodChange(e.target.value as PaymentMethod | "all")}
            className="focus-ring h-10 appearance-none rounded-full border border-border bg-card pr-9 pl-4 text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-muted"
            aria-label="Filter metode pembayaran"
          >
            <option value="all">Semua Pembayaran</option>
            {Object.entries(PAYMENT_METHOD_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <SlidersHorizontal className="pointer-events-none absolute top-1/2 right-3 size-3 -translate-y-1/2 text-muted-foreground" />
        </div>

        {/* Periode Tanggal Badge */}
        <div className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground sm:flex">
          <Calendar className="size-3.5" />
          <span>Hari ini · {new Date().toLocaleDateString("id-ID", { month: "short", year: "numeric" })}</span>
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="focus-ring flex items-center gap-1 rounded-full px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Kanan: Search Input Box */}
      <div className="relative w-full sm:w-72">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari no. nota, pelanggan, SKU..."
          className="focus-ring h-10.5 w-full rounded-full border border-border bg-background pr-4 pl-10 text-sm text-foreground placeholder:text-muted-foreground transition-all"
        />
      </div>
    </div>
  )
}
