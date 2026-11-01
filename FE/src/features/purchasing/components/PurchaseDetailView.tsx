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

  return (
    <div className="flex flex-col gap-4">
      <dl className="grid gap-4 rounded-xl border bg-card p-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-muted-foreground">Supplier</dt>
          <dd className="font-medium">{purchase.supplier.name}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Tanggal dicatat</dt>
          <dd className="tabular-nums">{formatDateTime(purchase.purchasedAt)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">No. faktur supplier</dt>
          <dd>{purchase.supplierInvoiceNo ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Dicatat oleh</dt>
          <dd>{purchase.createdBy.name}</dd>
        </div>
        {purchase.notes && (
          <div className="sm:col-span-2 lg:col-span-4">
            <dt className="text-muted-foreground">Catatan</dt>
            <dd className="whitespace-pre-line">{purchase.notes}</dd>
          </div>
        )}
      </dl>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">SKU</TableHead>
              <TableHead>Barang</TableHead>
              <TableHead className="text-right">Jumlah</TableHead>
              <TableHead className="text-right">Harga beli satuan</TableHead>
              <TableHead className="pr-4 text-right">Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchase.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="pl-4 tabular-nums text-muted-foreground">{item.product.sku}</TableCell>
                <TableCell className="font-medium">{item.product.name}</TableCell>
                <TableCell className="text-right tabular-nums">{item.quantity}</TableCell>
                <TableCell className="text-right tabular-nums">{formatRupiah(item.unitCost)}</TableCell>
                <TableCell className="pr-4 text-right tabular-nums">{formatRupiah(item.lineTotal)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} className="pl-4 text-right">
                Total
              </TableCell>
              <TableCell className="pr-4 text-right tabular-nums">{formatRupiah(purchase.total)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  )
}
