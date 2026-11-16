import { ArrowUpRight, Banknote, CreditCard, QrCode, Wallet } from "lucide-react"
import type { CashierKPI } from "@/types/sales"
import { formatRupiah } from "@/utils/formatting/format-currency"

type CashierOverviewCardsProps = {
  kpi: CashierKPI
  onNewTransaction: () => void
}

export function CashierOverviewCards({ kpi, onNewTransaction }: CashierOverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_1fr]">
      {/* 1. CARD KIRI: Ringkasan Penjualan & Timeline Performa */}
      <div className="flex flex-col justify-between rounded-[2rem] border border-border/70 bg-card p-6 shadow-sm transition-all hover:shadow-md">
        {/* Metrik Atas */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">Penjualan Hari Ini</span>
            <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {formatRupiah(kpi.todaySalesAmount)}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">Omzet Bulan Ini</span>
            <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {formatRupiah(kpi.monthSalesAmount)}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">Transaksi Hari Ini</span>
            <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {kpi.todayTransactionCount} <span className="text-sm font-normal text-muted-foreground">Nota</span>
            </span>
          </div>
        </div>

        {/* Timeline Visual dengan Dot Neon Lime (Seperti Referensi) */}
        <div className="mt-8 flex flex-col gap-3">
          <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
            <span>Pagi (09:00 - 12:00)</span>
            <span>Siang (12:00 - 15:00)</span>
            <span>Sore (15:00 - 18:00)</span>
            <span>Malam (18:00 - 21:00)</span>
          </div>

          {/* Garis Progress dengan Dot Neon Lime */}
          <div className="relative flex h-2 w-full items-center justify-between rounded-full bg-muted/60 px-1">
            <div className="flex gap-1">
              <span className="size-2 rounded-full bg-[#B5F34D] shadow-xs" />
              <span className="size-2 rounded-full bg-[#B5F34D] shadow-xs" />
              <span className="size-2 rounded-full bg-[#B5F34D] shadow-xs" />
            </div>
            <div className="flex gap-1">
              <span className="size-2 rounded-full bg-[#B5F34D] shadow-xs" />
              <span className="size-2 rounded-full bg-[#B5F34D] shadow-xs" />
              <span className="size-2 rounded-full bg-[#B5F34D] shadow-xs" />
              <span className="size-2 rounded-full bg-[#B5F34D] shadow-xs" />
              <span className="size-2 rounded-full bg-[#B5F34D] shadow-xs" />
            </div>
            <div className="flex gap-1">
              <span className="size-2 rounded-full bg-[#B5F34D] shadow-xs" />
              <span className="size-2 rounded-full bg-[#B5F34D] shadow-xs" />
              <span className="size-2 rounded-full bg-[#B5F34D] shadow-xs" />
            </div>
            <div className="flex gap-1">
              <span className="size-2 rounded-full bg-muted-foreground/30" />
              <span className="size-2 rounded-full bg-muted-foreground/30" />
            </div>
          </div>
        </div>

        {/* Cluster Avatar Petugas Kasir & Pelanggan */}
        <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white ring-2 ring-background">
                OR
              </span>
              <span className="flex size-7 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white ring-2 ring-background">
                AS
              </span>
              <span className="flex size-7 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white ring-2 ring-background">
                BS
              </span>
            </div>
            <span className="text-xs text-muted-foreground">Kasir aktif bertugas hari ini</span>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground">
            Laci Kasir Terbuka
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          </span>
        </div>
      </div>

      {/* 2. CARD KANAN: Saldo Kas & Mini Cards Metode Pembayaran */}
      <div className="flex flex-col justify-between rounded-[2rem] border border-border/70 bg-card p-6 shadow-sm transition-all hover:shadow-md">
        <div>
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">Total Penerimaan Kasir</span>
              <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {formatRupiah(kpi.cashDrawerAmount + kpi.qrisAmount + kpi.transferAmount + kpi.debitAmount)}
              </span>
            </div>
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              Real-time
            </span>
          </div>

          {/* Mini Cards Metode Pembayaran (Sesuai Referensi Gambar) */}
          <div className="mt-5 grid grid-cols-3 gap-2.5">
            {/* Tunai */}
            <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-muted/40 p-3">
              <div className="flex items-center justify-between text-muted-foreground">
                <Banknote className="size-4" />
                <span className="text-[10px] font-mono font-medium">CASH</span>
              </div>
              <div className="mt-3">
                <span className="block text-[11px] font-semibold text-foreground truncate">
                  {formatRupiah(kpi.cashAmount)}
                </span>
                <span className="text-[10px] text-muted-foreground">Tunai</span>
              </div>
            </div>

            {/* QRIS - Kartu Aksen Neon Lime (Highlight Utama Seperti Stripe pada Gambar) */}
            <div className="flex flex-col justify-between rounded-2xl bg-[#B5F34D] p-3 text-slate-900 shadow-xs">
              <div className="flex items-center justify-between text-slate-900">
                <QrCode className="size-4 stroke-[2.4]" />
                <span className="text-[10px] font-mono font-bold">#QRIS</span>
              </div>
              <div className="mt-3">
                <span className="block text-[11px] font-bold text-slate-900 truncate">
                  {formatRupiah(kpi.qrisAmount)}
                </span>
                <span className="text-[10px] font-semibold text-slate-800">QRIS Statis</span>
              </div>
            </div>

            {/* Transfer / Debit */}
            <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-muted/40 p-3">
              <div className="flex items-center justify-between text-muted-foreground">
                <CreditCard className="size-4" />
                <span className="text-[10px] font-mono font-medium">EDC</span>
              </div>
              <div className="mt-3">
                <span className="block text-[11px] font-semibold text-foreground truncate">
                  {formatRupiah(kpi.debitAmount + kpi.transferAmount)}
                </span>
                <span className="text-[10px] text-muted-foreground">Debit &amp; Bank</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tombol Aksi Bawah: Buka Transaksi Baru */}
        <div className="mt-5 flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Wallet className="size-3.5" />
            <span>1 metode bayar / transaksi</span>
          </div>

          <button
            type="button"
            onClick={onNewTransaction}
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-xs font-semibold text-background shadow-xs transition-all hover:opacity-90 active:scale-95"
          >
            <span>Transaksi Baru</span>
            <ArrowUpRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
