import { Check, Copy, Glasses, Printer, X } from "lucide-react"
import { useState } from "react"
import { PAYMENT_METHOD_LABELS, type Sale } from "@/types/sales"
import { formatRupiah } from "@/utils/formatting/format-currency"
import { formatDateTime } from "@/utils/formatting/format-date"

type ReceiptDialogProps = {
  sale: Sale | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReceiptDialog({ sale, open, onOpenChange }: ReceiptDialogProps) {
  const [copied, setCopied] = useState(false)

  if (!open || !sale) return null

  const handlePrint = () => {
    window.print()
  }

  const handleCopy = () => {
    const text = `*OPTIK RAIHAN*\nNo: ${sale.invoiceNumber}\nTanggal: ${formatDateTime(sale.saleDate)}\nKasir: ${sale.cashierName}\nPelanggan: ${sale.customerName}\n--------------------------------\n${sale.items.map((i) => `${i.productName} (${i.quantity}x) = ${formatRupiah(i.lineTotal)}`).join("\n")}\n--------------------------------\nTotal: ${formatRupiah(sale.totalAmount)}\nBayar: ${PAYMENT_METHOD_LABELS[sale.paymentMethod]}\nTerima kasih!`
    void navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative flex w-full max-w-md flex-col rounded-3xl border border-border bg-card p-6 shadow-2xl">
        {/* Tombol Tutup */}
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          aria-label="Tutup nota"
          className="focus-ring absolute top-4 right-4 flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>

        {/* Tampilan Kertas Struk Termal */}
        <div className="flex flex-col items-center border-b border-dashed border-border/80 pb-5 text-center">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-xs">
            <Glasses className="size-5 stroke-[2.2]" />
          </span>
          <span className="mt-2 text-base font-bold tracking-tight text-foreground">OPTIK RAIHAN</span>
          <span className="text-[11px] text-muted-foreground leading-tight">
            Jl. Raya Perdagangan Kacamata No. 12<br />
            Telp: 0812-3456-7890
          </span>
        </div>

        {/* Info Nota */}
        <div className="flex flex-col gap-1 border-b border-dashed border-border/80 py-3 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">No. Nota:</span>
            <span className="font-mono font-bold text-foreground">{sale.invoiceNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Waktu:</span>
            <span className="text-foreground">{formatDateTime(sale.saleDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Kasir:</span>
            <span className="text-foreground">{sale.cashierName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pelanggan:</span>
            <span className="text-foreground font-medium">{sale.customerName}</span>
          </div>
        </div>

        {/* Daftar Barang */}
        <div className="flex flex-col gap-2.5 border-b border-dashed border-border/80 py-4 max-h-56 overflow-y-auto">
          {sale.items.map((item) => (
            <div key={item.id} className="flex justify-between text-xs leading-tight">
              <div className="flex flex-col max-w-[240px]">
                <span className="font-semibold text-foreground">{item.productName}</span>
                <span className="text-[11px] text-muted-foreground">
                  {item.quantity} × {formatRupiah(item.unitPrice)}
                </span>
              </div>
              <span className="font-bold text-foreground tabular-nums">
                {formatRupiah(item.lineTotal)}
              </span>
            </div>
          ))}
        </div>

        {/* Rincian Pembayaran */}
        <div className="flex flex-col gap-1.5 pt-4 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal:</span>
            <span>{formatRupiah(sale.subtotal)}</span>
          </div>
          {sale.discountAmount > 0 && (
            <div className="flex justify-between text-primary font-semibold">
              <span>Diskon Khusus:</span>
              <span>-{formatRupiah(sale.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-bold text-foreground pt-1 border-t border-border/60">
            <span>TOTAL BAYAR:</span>
            <span className="text-base text-primary tabular-nums">{formatRupiah(sale.totalAmount)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground pt-1">
            <span>Metode Pembayaran:</span>
            <span className="font-semibold text-foreground">{PAYMENT_METHOD_LABELS[sale.paymentMethod]}</span>
          </div>
          {sale.cashReceived && sale.cashReceived > 0 && (
            <>
              <div className="flex justify-between text-muted-foreground">
                <span>Uang Diterima:</span>
                <span>{formatRupiah(sale.cashReceived)}</span>
              </div>
              <div className="flex justify-between font-semibold text-foreground">
                <span>Kembalian:</span>
                <span>{formatRupiah(sale.changeAmount ?? 0)}</span>
              </div>
            </>
          )}
        </div>

        {/* Footer Nota */}
        <div className="mt-5 border-t border-dashed border-border/80 pt-3 text-center text-[11px] text-muted-foreground">
          <p>Terima kasih atas kunjungan Anda</p>
          <p>Barang yang sudah dibeli dapat diservis garansi di toko</p>
        </div>

        {/* Tombol Aksi Cetak & Salin */}
        <div className="mt-5 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="focus-ring flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
            <span>{copied ? "Tersalin!" : "Salin Struk"}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="focus-ring flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:opacity-90 active:scale-95 transition-all"
          >
            <Printer className="size-4" />
            <span>Cetak Struk</span>
          </button>
        </div>
      </div>
    </div>
  )
}
