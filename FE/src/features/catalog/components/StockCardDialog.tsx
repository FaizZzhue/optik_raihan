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
          <DialogTitle>Riwayat stok {product?.sku ?? ""}</DialogTitle>
          <DialogDescription>
            {product ? `${product.name}. Stok saat ini ${product.stockQty}.` : ""}
          </DialogDescription>
        </DialogHeader>
        {product && <StockMovementList productId={product.id} />}
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
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
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
                <TableCell className="pl-4 tabular-nums">{formatDateTime(movement.createdAt)}</TableCell>
                <TableCell>
                  {MOVEMENT_TYPE_LABELS[movement.movementType] ?? movement.movementType}
                  {movement.purchaseId !== null && (
                    <span className="text-muted-foreground"> #{movement.purchaseId}</span>
                  )}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {movement.quantityChange > 0 ? `+${movement.quantityChange}` : movement.quantityChange}
                </TableCell>
                <TableCell className="text-right tabular-nums">{movement.stockAfter}</TableCell>
                <TableCell className="pr-4">{movement.createdBy.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ListPagination meta={meta} itemLabel="mutasi" onPageChange={setPage} isFetching={movementsQuery.isFetching} />
    </div>
  )
}
