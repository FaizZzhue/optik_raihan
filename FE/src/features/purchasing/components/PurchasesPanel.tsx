import { useState } from "react"
import { Plus, ShoppingCart } from "lucide-react"
import { Link } from "react-router-dom"
import { EmptyState } from "@/components/shared/EmptyState"
import { ErrorState } from "@/components/shared/ErrorState"
import { ListPagination } from "@/components/shared/ListPagination"
import { TableSkeleton } from "@/components/shared/TableSkeleton"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getApiErrorMessage } from "@/utils/api-error"
import { formatRupiah } from "@/utils/format-currency"
import { formatDateTime } from "@/utils/format-date"
import { usePurchases } from "../hooks/use-purchases"

export function PurchasesPanel() {
  const [page, setPage] = useState(1)
  const purchasesQuery = usePurchases(page)

  const renderContent = () => {
    if (purchasesQuery.isPending) {
      return <TableSkeleton label="Memuat pembelian..." />
    }
    if (purchasesQuery.isError) {
      return (
        <ErrorState
          title="Pembelian tidak dapat dimuat"
          description={getApiErrorMessage(purchasesQuery.error)}
          onRetry={() => void purchasesQuery.refetch()}
        />
      )
    }
    const { data: purchases, meta } = purchasesQuery.data
    if (purchases.length === 0) {
      return (
        <EmptyState
          icon={ShoppingCart}
          title="Belum ada pembelian"
          description="Catat pembelian dari supplier untuk menambah stok barang."
        />
      )
    }
    return (
      <div className="flex flex-col gap-3" aria-busy={purchasesQuery.isFetching}>
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Tanggal</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>No. faktur</TableHead>
                <TableHead className="text-right">Jumlah barang</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Dicatat oleh</TableHead>
                <TableHead className="pr-4 text-right">
                  <span className="sr-only">Detail</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell className="pl-4 tabular-nums">{formatDateTime(purchase.purchasedAt)}</TableCell>
                  <TableCell className="font-medium">{purchase.supplier.name}</TableCell>
                  <TableCell>{purchase.supplierInvoiceNo ?? "—"}</TableCell>
                  <TableCell className="text-right tabular-nums">{purchase.itemCount}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatRupiah(purchase.total)}</TableCell>
                  <TableCell>{purchase.createdBy.name}</TableCell>
                  <TableCell className="pr-4 text-right">
                    <Button asChild variant="link" size="sm">
                      <Link to={`/pembelian/${purchase.id}`} aria-label={`Detail pembelian ${purchase.supplier.name} ${formatDateTime(purchase.purchasedAt)}`}>
                        Detail
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <ListPagination meta={meta} itemLabel="pembelian" onPageChange={setPage} isFetching={purchasesQuery.isFetching} />
      </div>
    )
  }

  return (
    <section className="flex flex-col gap-4" aria-label="Daftar pembelian">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Pembelian yang tersimpan tidak bisa diubah atau dibatalkan; stok bertambah saat disimpan.
        </p>
        <Button asChild>
          <Link to="/pembelian/baru">
            <Plus data-icon="inline-start" aria-hidden />
            Catat pembelian
          </Link>
        </Button>
      </div>
      {renderContent()}
    </section>
  )
}
