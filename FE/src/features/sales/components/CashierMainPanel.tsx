import { useState } from "react"
import { CheckCircle2, FileText, Glasses, Printer, ShoppingBag, User } from "lucide-react"
import { PAYMENT_METHOD_LABELS, SALE_STATUS_LABELS, type Sale } from "@/types/sales"
import { formatRupiah } from "@/utils/formatting/format-currency"
import { formatDateTime } from "@/utils/formatting/format-date"

type CashierMainPanelProps = {
  sales: Sale[]
  onPrintReceipt: (sale: Sale) => void
}

type TabFilter = "all" | "completed" | "draft"

export function CashierMainPanel({ sales, onPrintReceipt }: CashierMainPanelProps) {
  const [activeTab, setActiveTab] = useState<TabFilter>("all")
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(() => sales[0]?.id ?? null)

  const filteredSales = sales.filter((s) => {
    if (activeTab === "all") return true
    return s.status === activeTab
  })

  // Pastikan ada item yang terpilih
  const selectedSale = sales.find((s) => s.id === selectedSaleId) ?? filteredSales[0] ?? null

  const countCompleted = sales.filter((s) => s.status === "completed").length
  const countDraft = sales.filter((s) => s.status === "draft").length

  return (
    <div className="flex flex-col gap-3">
      {/* Tab Filter Pills (Persis Seperti Tab "All Invoices, Draft, Unpaid" di Atas Box Hitam Referensi) */}
      <div className="flex items-center justify-center sm:justify-start">
        <div className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-card p-1 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`focus-ring rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "all"
                ? "bg-foreground text-background shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Semua Nota <span className="ml-1 opacity-70">({sales.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("draft")}
            className={`focus-ring rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "draft"
                ? "bg-foreground text-background shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Draft <span className="ml-1 opacity-70">({countDraft})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            className={`focus-ring rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              activeTab === "completed"
                ? "bg-[#B5F34D] text-slate-950 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Lunas <span className="ml-1 opacity-80">({countCompleted})</span>
          </button>
        </div>
      </div>

      {/* Kontainer Utama Kontras Gelap / Hitam (Sesuai Referensi Gambar) */}
      <div className="rounded-[2.5rem] border border-slate-800/80 bg-[#16181D] p-5 text-slate-100 shadow-2xl md:p-6">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.1fr_1.9fr]">
          {/* KOLOM KIRI: Daftar Transaksi / Invoices List */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-bold text-slate-200 tracking-tight">Daftar Transaksi</span>
              <span className="text-xs text-slate-400">{filteredSales.length} transaksi</span>
            </div>

            <div className="flex flex-col gap-2 max-h-[560px] overflow-y-auto pr-1">
              {filteredSales.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
                  <FileText className="size-8 opacity-40 mb-2" />
                  <p className="text-sm font-medium">Tidak ada transaksi pada filter ini</p>
                </div>
              ) : (
                filteredSales.map((sale) => {
                  const isSelected = selectedSale?.id === sale.id
                  return (
                    <button
                      key={sale.id}
                      type="button"
                      onClick={() => setSelectedSaleId(sale.id)}
                      className={`group flex items-center justify-between rounded-2xl p-3.5 text-left transition-all ${
                        isSelected
                          ? "bg-[#283241] border border-sky-400/40 shadow-md ring-1 ring-sky-400/20"
                          : "bg-[#1E222A]/70 border border-slate-800/60 hover:bg-[#222731]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar bulat */}
                        <span
                          className={`flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            sale.status === "completed"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          {sale.customerName
                            .split(" ")
                            .map((p) => p[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </span>

                        <div className="flex flex-col min-w-0">
                          <span className="truncate text-xs font-bold text-slate-100 group-hover:text-white">
                            {sale.invoiceNumber}
                          </span>
                          <span className="truncate text-[11px] text-slate-400">
                            {sale.customerName}
                          </span>
                        </div>
                      </div>

                      {/* Status & Total */}
                      <div className="flex flex-col items-end gap-1 shrink-0 ml-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            sale.status === "completed"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {SALE_STATUS_LABELS[sale.status]}
                        </span>
                        <span className="text-xs font-bold text-white tabular-nums">
                          {formatRupiah(sale.totalAmount)}
                        </span>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* KOLOM KANAN: Detail Nota / Invoice & Keranjang Kasir (Seperti di Referensi Gambar) */}
          {selectedSale ? (
            <div className="flex min-h-[540px] flex-col justify-between rounded-[2rem] border border-slate-700/60 bg-[#222834]/85 p-6 backdrop-blur-xs">
              {/* Header Detail Invoice */}
              <div className="flex flex-col gap-4 border-b border-slate-700/60 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400">Invoice details</span>
                      <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                        {SALE_STATUS_LABELS[selectedSale.status]}
                      </span>
                    </div>
                    <span className="font-mono text-xl md:text-2xl font-bold tracking-tight text-white mt-0.5">
                      {selectedSale.invoiceNumber}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      {formatDateTime(selectedSale.saleDate)} · Kasir: {selectedSale.cashierName}
                    </span>
                  </div>

                  {/* Brand Logo Toko */}
                  <div className="flex items-center gap-2 rounded-xl bg-slate-900/60 px-3 py-2 border border-slate-700/60">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-[#B5F34D] text-slate-950 font-bold">
                      <Glasses className="size-4 stroke-[2.4]" />
                    </span>
                    <div className="flex flex-col leading-none">
                      <span className="text-xs font-bold text-white">Optik Raihan</span>
                      <span className="text-[10px] text-slate-400">Store Terminal</span>
                    </div>
                  </div>

                  {/* Customer Card */}
                  <div className="flex items-center gap-2.5 rounded-xl bg-slate-900/60 px-3 py-2 border border-slate-700/60">
                    <span className="flex size-7 items-center justify-center rounded-full bg-slate-800 text-slate-200">
                      <User className="size-3.5" />
                    </span>
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                        {selectedSale.customerName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {selectedSale.customerPhone ?? "Pelanggan Umum"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid 3 Kartu Rincian Item (Sesuai Referensi Gambar) */}
              <div className="my-5 flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-300">
                  Rincian Barang Belanja ({selectedSale.items.length} item)
                </span>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {selectedSale.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col justify-between rounded-2xl border border-slate-700/60 bg-slate-900/50 p-4 transition-colors hover:bg-slate-900/80"
                    >
                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] font-semibold text-[#B5F34D]">
                          {item.productSku}
                        </span>
                        <span className="font-semibold text-xs text-white line-clamp-2 mt-0.5">
                          {item.productName}
                        </span>
                        <span className="text-[11px] text-slate-400 mt-1">
                          {item.quantity} × {formatRupiah(item.unitPrice)}
                        </span>
                      </div>

                      <div className="mt-3 border-t border-slate-800 pt-2 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">Total</span>
                        <span className="font-bold text-xs text-white tabular-nums">
                          {formatRupiah(item.lineTotal)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bagian Bawah: Ringkasan Total & Tombol Aksi (Pay out now / Cetak Nota) */}
              <div className="border-t border-slate-700/60 pt-4 mt-auto">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-4 text-xs">
                  <div className="flex flex-col">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="font-semibold text-slate-200 mt-0.5">
                      {formatRupiah(selectedSale.subtotal)}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-slate-400">Diskon Khusus</span>
                    <span className="font-semibold text-[#B5F34D] mt-0.5">
                      {selectedSale.discountAmount > 0 ? `-${formatRupiah(selectedSale.discountAmount)}` : "Rp 0"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-slate-400">Metode Bayar</span>
                    <span className="font-semibold text-slate-200 mt-0.5 capitalize">
                      {PAYMENT_METHOD_LABELS[selectedSale.paymentMethod]}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-slate-400 font-medium">Total Akhir</span>
                    <span className="text-base font-bold text-white mt-0.5">
                      {formatRupiah(selectedSale.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Bar Tombol Aksi */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle2 className="size-4 text-emerald-400" />
                    <span>Transaksi terekam di buku besar kasir</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onPrintReceipt(selectedSale)}
                      className="focus-ring inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      <Printer className="size-3.5" />
                      <span>Cetak Nota</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onPrintReceipt(selectedSale)}
                      className="focus-ring inline-flex items-center gap-2 rounded-full bg-[#B5F34D] px-6 py-2.5 text-xs font-bold text-slate-950 shadow-lg hover:bg-[#a3e439] active:scale-95 transition-all"
                    >
                      <span>Lihat Struk Selesai</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[500px] flex-col items-center justify-center rounded-[2rem] border border-slate-800 bg-[#222834]/40 p-8 text-center text-slate-400">
              <ShoppingBag className="size-12 opacity-30 mb-3" />
              <p className="font-semibold text-slate-300">Pilih transaksi di sisi kiri</p>
              <p className="text-xs text-slate-500 mt-1">Detail rincian belanja dan nota akan ditampilkan di sini</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
