import { useState } from "react"
import { Plus, SearchX, ShoppingCart } from "lucide-react"
import { Link } from "react-router-dom"
import { EmptyState } from "@/components/shared/EmptyState"
import { ErrorState } from "@/components/shared/ErrorState"
import { ListPagination } from "@/components/shared/ListPagination"
import { TableSkeleton } from "@/components/shared/TableSkeleton"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ALL_SUPPLIERS_VALUE } from "@/constants/owner.constants"
import { getApiErrorMessage } from "@/utils/api-error"
import { formatRupiah } from "@/utils/format-currency"
import { formatDateTime } from "@/utils/format-date"
import { usePurchases } from "../hooks/use-purchases"
import { useSuppliers } from "../hooks/use-suppliers"

export function PurchasesPanel() {
  const [page, setPage] = useState(1)
  const [supplierValue, setSupplierValue] = useState(ALL_SUPPLIERS_VALUE)
  const supplierId = supplierValue === ALL_SUPPLIERS_VALUE ? undefined : Number(supplierValue)

  const purchasesQuery = usePurchases(page, supplierId)
  const suppliersQuery = useSuppliers()
  const suppliers = suppliersQuery.data ?? []

  const handleSupplierFilterChange = (value: string) => {
    setSupplierValue(value)
    setPage(1)
  }

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
      return supplierId !== undefined ? (
        <EmptyState
          icon={SearchX}
          title="Belum ada pembelian dari supplier ini"
          description="Pilih supplier lain atau tampilkan semua supplier."
        />
      ) : (
        <EmptyState
          icon={ShoppingCart}
          title="Belum ada pembelian"
          description="Catat pembelian dari supplier untuk menambah stok barang."
        />
      )
    }
    return (
      <div className="flex flex-col gap-3" aria-busy={purchasesQuery.isFetching}>
        <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="pl-4">ID</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>No. Faktur Supplier</TableHead>
                <TableHead className="text-right">Jumlah baris</TableHead>
                <TableHead className="text-right">Total Pembelian</TableHead>
                <TableHead>Dicatat oleh</TableHead>
                <TableHead className="pr-4 text-right">
                  <span className="sr-only">Detail</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell className="pl-4 font-mono text-xs tabular-nums text-muted-foreground">
                    #{purchase.id}
                  </TableCell>
                  <TableCell className="tabular-nums">{formatDateTime(purchase.purchasedAt)}</TableCell>
                  <TableCell className="font-medium text-foreground">{purchase.supplier.name}</TableCell>
                  <TableCell>
                    {purchase.supplierInvoiceNo ? (
                      <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                        {purchase.supplierInvoiceNo}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{purchase.itemCount} baris</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {formatRupiah(purchase.total)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{purchase.createdBy.name}</TableCell>
                  <TableCell className="pr-4 text-right">
                    <Button asChild variant="link" size="sm">
                      <Link
                        to={`/pembelian/${purchase.id}`}
                        aria-label={`Detail pembelian ${purchase.supplier.name} ${formatDateTime(purchase.purchasedAt)}`}
                      >
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
    <section className="flex flex-col gap-5" aria-label="Daftar pembelian">
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select value={supplierValue} onValueChange={handleSupplierFilterChange}>
            <SelectTrigger className="w-full sm:w-64" aria-label="Filter supplier">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_SUPPLIERS_VALUE}>Semua supplier</SelectItem>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={String(supplier.id)}>
                  {supplier.isActive ? supplier.name : `${supplier.name} (nonaktif)`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Faktur yang sudah disimpan bersifat permanen dan langsung menambah buku besar stok.
          </p>
        </div>
        <Button asChild className="self-start sm:self-auto">
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
