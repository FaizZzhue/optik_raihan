import { useState } from "react"
import { History } from "lucide-react"
import { EmptyState } from "@/components/shared/EmptyState"
import { ErrorState } from "@/components/shared/ErrorState"
import { ListPagination } from "@/components/shared/ListPagination"
import { TableSkeleton } from "@/components/shared/TableSkeleton"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Product } from "@/types/catalog"
import { getApiErrorMessage } from "@/utils/api-error"
import { formatRupiah } from "@/utils/format-currency"
import { formatDateTime } from "@/utils/format-date"
import { useStockMovements } from "../hooks/use-products"

// Nilai sama dengan enum movement_type di BE. Jenis lain ditambahkan bersama fiturnya (penjualan, retur, opname).
const MOVEMENT_TYPE_LABELS: Record<string, string> = {
  purchase_in: "Pembelian",
}

type StockCardDialogProps = {
  product: Product | null
  onOpenChange: (open: boolean) => void
}

// Kartu stok (PRD FR-08.3): setiap perubahan stok beserta sumber dan pelakunya.
export function StockCardDialog({ product, onOpenChange }: StockCardDialogProps) {
  return (
    <Dialog open={product !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Riwayat stok {product?.sku ?? ""}</DialogTitle>
          <DialogDescription>
            {product ? `${product.name}. Stok saat ini ${product.stockQty}.` : ""}
          </DialogDescription>
        </DialogHeader>
        {product && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 rounded-xl border border-border/80 bg-muted/30 p-3.5 text-xs sm:grid-cols-4">
              <div>
                <span className="text-muted-foreground">SKU Internal</span>
                <p className="mt-0.5 font-mono font-semibold text-foreground">{product.sku}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Kategori</span>
                <p className="mt-0.5 font-medium text-foreground">{product.category.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Harga Jual</span>
                <p className="mt-0.5 font-semibold tabular-nums text-foreground">{formatRupiah(product.sellPrice)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Saldo Stok Saat Ini</span>
                <p className="mt-0.5 font-semibold tabular-nums text-primary">{product.stockQty} pcs</p>
              </div>
            </div>
            <StockMovementList productId={product.id} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function StockMovementList({ productId }: { productId: number }) {
  const [page, setPage] = useState(1)
  const movementsQuery = useStockMovements(productId, page)

  if (movementsQuery.isPending) {
    return <TableSkeleton label="Memuat riwayat stok..." rows={3} />
  }
  if (movementsQuery.isError) {
    return (
      <ErrorState
        title="Riwayat stok tidak dapat dimuat"
        description={getApiErrorMessage(movementsQuery.error)}
        onRetry={() => void movementsQuery.refetch()}
      />
    )
  }
  const { data: movements, meta } = movementsQuery.data
  if (movements.length === 0) {
    return (
      <EmptyState icon={History} title="Belum ada perubahan stok" description="Stok berubah lewat pembelian." />
    )
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="pl-4">Waktu</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead className="text-right">Perubahan</TableHead>
              <TableHead className="text-right">Stok setelah</TableHead>
              <TableHead className="pr-4">Oleh</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell className="pl-4 tabular-nums text-muted-foreground">
                  {formatDateTime(movement.createdAt)}
                </TableCell>
                <TableCell className="font-medium">
                  {MOVEMENT_TYPE_LABELS[movement.movementType] ?? movement.movementType}
                  {movement.purchaseId !== null && (
                    <span className="ml-1 font-mono text-xs text-muted-foreground">#{movement.purchaseId}</span>
                  )}
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums text-primary">
                  {movement.quantityChange > 0 ? `+${movement.quantityChange}` : movement.quantityChange}
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">{movement.stockAfter}</TableCell>
                <TableCell className="pr-4 text-muted-foreground">{movement.createdBy.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ListPagination meta={meta} itemLabel="mutasi" onPageChange={setPage} isFetching={movementsQuery.isFetching} />
    </div>
  )
}
