import { useMemo, useState } from "react"
import {
  AlertTriangle,
  ArrowLeftRight,
  Banknote,
  Calculator,
  CheckCircle2,
  CreditCard,
  Minus,
  Plus,
  QrCode,
  ReceiptText,
  RotateCcw,
  ShoppingBag,
  Wallet,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ReceiptDialog } from "@/features/sales/components/ReceiptDialog"
import { useCurrentUser } from "@/hooks/auth/use-auth"
import { calculateCashierKPI, useSales } from "@/hooks/sales/use-sales"
import { PAYMENT_METHOD_LABELS, SALE_STATUS_LABELS, type Sale } from "@/types/sales"
import { formatRupiah } from "@/utils/formatting/format-currency"
import { formatDateTime } from "@/utils/formatting/format-date"

const DENOMINATIONS = [100000, 50000, 20000, 10000, 5000, 2000, 1000] as const

function createEmptyCounts(): Record<number, number> {
  const counts: Record<number, number> = {}
  for (const denom of DENOMINATIONS) {
    counts[denom] = 0
  }
  return counts
}

export function CashierShiftPage() {
  const navigate = useNavigate()
  const user = useCurrentUser()
  const salesQuery = useSales()

  const [initialCash, setInitialCash] = useState<number>(0)
  const [counts, setCounts] = useState<Record<number, number>>(createEmptyCounts)
  const [extraCoins, setExtraCoins] = useState<number>(0)
  const [receiptSale, setReceiptSale] = useState<Sale | null>(null)

  const sales = useMemo(() => salesQuery.data ?? [], [salesQuery.data])
  const kpi = useMemo(() => calculateCashierKPI(sales), [sales])

  const todaySales = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    return sales
      .filter((sale) => sale.saleDate.slice(0, 10) === today)
      .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())
  }, [sales])

  const countedDenominations = useMemo(
    () => DENOMINATIONS.reduce((sum, denom) => sum + denom * (counts[denom] ?? 0), 0),
    [counts],
  )
  const physicalCash = countedDenominations + extraCoins
  const expectedDrawerCash = initialCash + kpi.cashAmount
  const variance = physicalCash - expectedDrawerCash

  const handleStepCount = (denom: number, delta: number) => {
    setCounts((prev) => ({
      ...prev,
      [denom]: Math.max(0, (prev[denom] ?? 0) + delta),
    }))
  }

  const handleSetCount = (denom: number, rawValue: string) => {
    const parsed = Math.max(0, Math.floor(Number(rawValue) || 0))
    setCounts((prev) => ({
      ...prev,
      [denom]: parsed,
    }))
  }

  const handleResetDrawer = () => {
    setInitialCash(0)
    setCounts(createEmptyCounts())
    setExtraCoins(0)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Tutup Buku Harian"
        title="Rekap Shift & Kas Laci"
        description={`Ringkasan penerimaan shift hari ini untuk ${user.name} beserta kalkulator pecah uang fisik laci kasir.`}
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/kasir")}
              className="rounded-full"
            >
              <ReceiptText className="size-4" aria-hidden />
              Riwayat Order
            </Button>
            <Button
              type="button"
              onClick={() => navigate("/kasir/order")}
              className="rounded-full shadow-xs"
            >
              <ShoppingBag className="size-4" aria-hidden />
              Input Orderan Baru
            </Button>
          </>
        }
      />

      {/* Ringkasan Penerimaan Shift Hari Ini */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="flex flex-col justify-between gap-2 rounded-2xl border border-primary/40 bg-primary/10 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-primary-text">
            <span>Total Omzet Hari Ini</span>
            <Wallet className="size-4.5" aria-hidden />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground tabular-nums">
              {formatRupiah(kpi.todaySalesAmount)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground tabular-nums">
              {kpi.todayTransactionCount} transaksi aktif hari ini
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-2 rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Penjualan Tunai</span>
            <Banknote className="size-4.5 text-emerald-600 dark:text-emerald-400" aria-hidden />
          </div>
          <p className="text-xl font-bold text-foreground tabular-nums">
            {formatRupiah(kpi.cashAmount)}
          </p>
        </div>

        <div className="flex flex-col justify-between gap-2 rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Pembayaran QRIS</span>
            <QrCode className="size-4.5 text-primary-text" aria-hidden />
          </div>
          <p className="text-xl font-bold text-foreground tabular-nums">
            {formatRupiah(kpi.qrisAmount)}
          </p>
        </div>

        <div className="flex flex-col justify-between gap-2 rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Transfer Bank</span>
            <ArrowLeftRight className="size-4.5 text-sky-600 dark:text-sky-400" aria-hidden />
          </div>
          <p className="text-xl font-bold text-foreground tabular-nums">
            {formatRupiah(kpi.transferAmount)}
          </p>
        </div>

        <div className="flex flex-col justify-between gap-2 rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Kartu Debit (EDC)</span>
            <CreditCard className="size-4.5 text-violet-600 dark:text-violet-400" aria-hidden />
          </div>
          <p className="text-xl font-bold text-foreground tabular-nums">
            {formatRupiah(kpi.debitAmount)}
          </p>
        </div>
      </div>

      {/* Konten Utama: Hitung Kas Fisik (Kiri) + Transaksi Hari Ini (Kanan) */}
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1.05fr_1fr]">
        {/* Kalkulator Kas Laci */}
        <section className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 shadow-xs sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/15 text-primary-text">
                <Calculator className="size-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-base font-bold text-foreground sm:text-lg">
                  Hitung Uang Fisik Laci
                </h2>
                <p className="text-xs text-muted-foreground">
                  Cocokkan jumlah uang pecahan di laci terhadap transaksi tunai sistem.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetDrawer}
              className="h-9 rounded-full px-3.5 text-xs font-semibold"
            >
              <RotateCcw className="size-3.5" aria-hidden />
              Reset Hitungan
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="shift-initial-cash" className="text-xs font-semibold text-foreground">
                Modal Awal Laci (Rp)
              </label>
              <Input
                id="shift-initial-cash"
                type="number"
                min={0}
                value={initialCash || ""}
                onChange={(e) => setInitialCash(Math.max(0, Number(e.target.value) || 0))}
                placeholder="Contoh: 200000"
                className="h-11 rounded-xl text-sm font-semibold tabular-nums"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="shift-extra-coins" className="text-xs font-semibold text-foreground">
                Uang Koin / Receh Tambahan (Rp)
              </label>
              <Input
                id="shift-extra-coins"
                type="number"
                min={0}
                value={extraCoins || ""}
                onChange={(e) => setExtraCoins(Math.max(0, Number(e.target.value) || 0))}
                placeholder="Contoh: 15000"
                className="h-11 rounded-xl text-sm font-semibold tabular-nums"
              />
            </div>
          </div>

          {/* Daftar Pecahan Uang Kertas */}
          <div className="flex flex-col gap-2.5">
            {DENOMINATIONS.map((denom) => {
              const qty = counts[denom] ?? 0
              const rowTotal = denom * qty

              return (
                <div
                  key={denom}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-muted/25 px-4 py-3"
                >
                  <span className="min-w-28 text-sm font-bold text-foreground tabular-nums">
                    {formatRupiah(denom)}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleStepCount(denom, -1)}
                      aria-label={`Kurangi lembar ${formatRupiah(denom)}`}
                      className="size-9 rounded-xl"
                    >
                      <Minus className="size-4" aria-hidden />
                    </Button>
                    <Input
                      type="number"
                      min={0}
                      value={qty}
                      onChange={(e) => handleSetCount(denom, e.target.value)}
                      aria-label={`Jumlah lembar ${formatRupiah(denom)}`}
                      className="h-10 w-20 rounded-xl bg-background text-center text-sm font-bold tabular-nums"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleStepCount(denom, 1)}
                      aria-label={`Tambah lembar ${formatRupiah(denom)}`}
                      className="size-9 rounded-xl"
                    >
                      <Plus className="size-4" aria-hidden />
                    </Button>
                  </div>

                  <span className="min-w-28 text-right text-sm font-bold text-foreground tabular-nums">
                    {formatRupiah(rowTotal)}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Hasil Perbandingan Kas */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/40 p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Target Kas Sistem (Modal + Tunai Hari Ini)</span>
              <span className="font-bold text-foreground tabular-nums">
                {formatRupiah(expectedDrawerCash)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Total Uang Fisik Terhitung</span>
              <span className="font-bold text-foreground tabular-nums">
                {formatRupiah(physicalCash)}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-3">
              <span className="text-sm font-bold text-foreground">Selisih Kas Laci</span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold tabular-nums ${
                  variance === 0
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                    : variance > 0
                      ? "bg-sky-500/15 text-sky-700 dark:text-sky-300"
                      : "bg-destructive/15 text-destructive"
                }`}
              >
                {variance === 0 ? (
                  <>
                    <CheckCircle2 className="size-4" aria-hidden />
                    Sesuai Sistem (Rp0)
                  </>
                ) : variance > 0 ? (
                  <>Lebih +{formatRupiah(variance)}</>
                ) : (
                  <>
                    <AlertTriangle className="size-4" aria-hidden />
                    Kurang -{formatRupiah(Math.abs(variance))}
                  </>
                )}
              </span>
            </div>
          </div>
        </section>

        {/* Daftar Transaksi Hari Ini */}
        <section className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-xs sm:p-6">
          <div className="flex items-center justify-between gap-2 border-b border-border/70 pb-4">
            <div>
              <h2 className="text-base font-bold text-foreground sm:text-lg">
                Transaksi Hari Ini ({todaySales.length})
              </h2>
              <p className="text-xs text-muted-foreground">
                Klik Lihat Nota untuk mencetak ulang struk transaksi hari ini.
              </p>
            </div>
          </div>

          {todaySales.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/20 px-4 py-12 text-center">
              <ReceiptText className="size-9 text-muted-foreground/50" aria-hidden />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-foreground">Belum ada transaksi hari ini</p>
                <p className="text-xs text-muted-foreground">
                  Transaksi yang tercatat hari ini akan muncul otomatis di daftar ini.
                </p>
              </div>
              <Button
                type="button"
                onClick={() => navigate("/kasir/order")}
                className="h-10 rounded-xl px-4 text-sm font-semibold"
              >
                Mulai Input Orderan
              </Button>
            </div>
          ) : (
            <div className="flex max-h-[620px] flex-col gap-3 overflow-y-auto pr-1">
              {todaySales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex flex-col justify-between gap-3 rounded-2xl border border-border bg-background/60 p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-foreground">
                        {sale.invoiceNumber}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          sale.status === "completed"
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                            : sale.status === "draft"
                              ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                              : "bg-destructive/15 text-destructive"
                        }`}
                      >
                        {SALE_STATUS_LABELS[sale.status]}
                      </span>
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {PAYMENT_METHOD_LABELS[sale.paymentMethod]}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{sale.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(sale.saleDate)} • {sale.items.length} item
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                    <span className="text-base font-bold text-foreground tabular-nums">
                      {formatRupiah(sale.totalAmount)}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setReceiptSale(sale)}
                      className="h-9 rounded-xl px-3.5 text-xs font-semibold"
                    >
                      Lihat Nota
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <ReceiptDialog
        open={receiptSale !== null}
        sale={receiptSale}
        onOpenChange={(open) => !open && setReceiptSale(null)}
      />
    </div>
  )
}
