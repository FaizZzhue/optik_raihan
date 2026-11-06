import { ErrorState } from "@/components/shared/ErrorState"
import { TableSkeleton } from "@/components/shared/TableSkeleton"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getApiErrorMessage } from "@/utils/api-error"
import { formatRupiah } from "@/utils/format-currency"
import { formatDateTime } from "@/utils/format-date"
import { usePurchase } from "../hooks/use-purchases"

type PurchaseDetailViewProps = {
  purchaseId: number
}

export function PurchaseDetailView({ purchaseId }: PurchaseDetailViewProps) {
  const purchaseQuery = usePurchase(purchaseId)

  if (purchaseQuery.isPending) {
    return <TableSkeleton label="Memuat detail pembelian..." rows={3} />
  }
  if (purchaseQuery.isError) {
    return (
      <ErrorState
        title="Detail pembelian tidak dapat dimuat"
        description={getApiErrorMessage(purchaseQuery.error)}
        onRetry={() => void purchaseQuery.refetch()}
      />
    )
  }
  const purchase = purchaseQuery.data
  const totalQuantity = purchase.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="flex flex-col gap-5">
      {/* Header Dokumen Faktur */}
      <dl className="grid gap-4 rounded-xl border bg-card p-5 text-sm shadow-xs sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-xs font-medium text-muted-foreground">Supplier</dt>
          <dd className="mt-1 font-serif text-base font-semibold text-foreground">{purchase.supplier.name}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-muted-foreground">No. faktur supplier</dt>
          <dd className="mt-1">
            {purchase.supplierInvoiceNo ? (
              <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs font-medium text-foreground">
                {purchase.supplierInvoiceNo}
              </span>
            ) : (
              "—"
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-muted-foreground">Tanggal dicatat</dt>
          <dd className="mt-1 font-medium tabular-nums">{formatDateTime(purchase.purchasedAt)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-muted-foreground">Dicatat oleh</dt>
          <dd className="mt-1 font-medium">{purchase.createdBy.name}</dd>
        </div>
        {purchase.notes && (
          <div className="border-t border-border/60 pt-3 sm:col-span-2 lg:col-span-4">
            <dt className="text-xs font-medium text-muted-foreground">Catatan</dt>
            <dd className="mt-1 whitespace-pre-line text-foreground">{purchase.notes}</dd>
          </div>
        )}
      </dl>

      {/* Ringkasan Faktur (Summary) */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-4 shadow-xs">
          <span className="text-xs text-muted-foreground">Jumlah Baris Barang</span>
          <p className="mt-1 font-serif text-xl font-semibold tabular-nums">{purchase.items.length} baris</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-xs">
          <span className="text-xs text-muted-foreground">Total Kuantitas Masuk</span>
          <p className="mt-1 font-serif text-xl font-semibold tabular-nums">{totalQuantity} pcs</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-xs">
          <span className="text-xs text-muted-foreground">Subtotal</span>
          <p className="mt-1 font-serif text-xl font-semibold tabular-nums">{formatRupiah(purchase.total)}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-xs">
          <span className="text-xs text-muted-foreground">Total Pembelian</span>
          <p className="mt-1 font-serif text-xl font-semibold tabular-nums text-primary">
            {formatRupiah(purchase.total)}
          </p>
        </div>
      </div>

      {/* Tabel Detail Baris Barang */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-12 pl-4">No.</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Barang</TableHead>
              <TableHead className="text-right">Jumlah (pcs)</TableHead>
              <TableHead className="text-right">Harga beli satuan</TableHead>
              <TableHead className="pr-4 text-right">Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchase.items.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="pl-4 font-mono text-xs tabular-nums text-muted-foreground">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs tabular-nums text-foreground">
                    {item.product.sku}
                  </span>
                </TableCell>
                <TableCell className="font-medium text-foreground">{item.product.name}</TableCell>
                <TableCell className="text-right tabular-nums">{item.quantity}</TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">
                  {formatRupiah(item.unitCost)}
                </TableCell>
                <TableCell className="pr-4 text-right font-medium tabular-nums">
                  {formatRupiah(item.lineTotal)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} className="pl-4 text-right font-medium">
                Total ({purchase.items.length} baris)
              </TableCell>
              <TableCell className="text-right font-semibold tabular-nums">{totalQuantity} pcs</TableCell>
              <TableCell className="text-right font-medium">Total Pembelian</TableCell>
              <TableCell className="pr-4 text-right font-semibold tabular-nums text-primary">
                {formatRupiah(purchase.total)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  )
}
