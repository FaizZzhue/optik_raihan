import { CheckCircle2, TriangleAlert } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

type StockAlertCardProps = {
  zeroStockCount: number
  sampleSize: number
}

// Dihitung dari sampel barang aktif terbaru, bukan seluruh katalog; teksnya menyebut batas itu.
export function StockAlertCard({ zeroStockCount, sampleSize }: StockAlertCardProps) {
  const hasAlert = zeroStockCount > 0

  return (
    <section
      aria-label={hasAlert ? "Peringatan stok kosong" : "Status stok"}
      className="flex items-start gap-3 rounded-card border border-border bg-card p-5 shadow-card"
    >
      <span
        aria-hidden
        className={
          hasAlert
            ? "flex size-10 shrink-0 items-center justify-center rounded-full bg-warning/12 text-warning-text"
            : "flex size-10 shrink-0 items-center justify-center rounded-full bg-success/10 text-success-text"
        }
      >
        {hasAlert ? <TriangleAlert className="size-5" /> : <CheckCircle2 className="size-5" />}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h2 className="text-sm font-semibold text-foreground">{hasAlert ? "Stok kosong" : "Stok siap operasional"}</h2>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {hasAlert ? (
            <>
              <strong className="font-semibold text-foreground">
                {zeroStockCount} dari {sampleSize}
              </strong>{" "}
              barang aktif terbaru berstok 0 pcs. Rencanakan pengadaan.
            </>
          ) : (
            `Semua ${sampleSize} barang aktif terbaru memiliki stok.`
          )}
        </p>
        {hasAlert && (
          <Button asChild variant="outline" size="sm" className="mt-2 w-fit rounded-full px-4">
            <Link to="/barang">Tinjau Katalog</Link>
          </Button>
        )}
      </div>
    </section>
  )
}
