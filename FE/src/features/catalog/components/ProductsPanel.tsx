import { useState } from "react"
import { Package, Plus, SearchX } from "lucide-react"
import { ActionNotice, type Notice } from "@/components/shared/ActionNotice"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { EmptyState } from "@/components/shared/EmptyState"
import { ErrorState } from "@/components/shared/ErrorState"
import { ListPagination } from "@/components/shared/ListPagination"
import { TableSkeleton } from "@/components/shared/TableSkeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import type { UserRole } from "@/constants/auth.constants"
import { ALL_CATEGORIES_VALUE, CATALOG_PERMISSIONS } from "@/constants/catalog.constants"
import { DEFAULT_PAGE_SIZE, SEARCH_DEBOUNCE_MS } from "@/constants/pagination.constants"
import { STATUS_FILTERS, type StatusFilter } from "@/constants/status-filter.constants"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import type { Product, ProductListParams } from "@/types/catalog"
import { getApiErrorMessage } from "@/utils/api-error"
import { useCategories } from "../hooks/use-categories"
import { useDeleteProduct, useProducts, useUpdateProduct } from "../hooks/use-products"
import { ProductFilters } from "./ProductFilters"
import { ProductFormDialog } from "./ProductFormDialog"
import { ProductTable } from "./ProductTable"
import { StockCardDialog } from "./StockCardDialog"

type ProductsPanelProps = {
  role: UserRole
}

type FormDialogState = { open: boolean; product: Product | null }

export function ProductsPanel({ role }: ProductsPanelProps) {
  const [search, setSearch] = useState("")
  const [categoryValue, setCategoryValue] = useState(ALL_CATEGORIES_VALUE)
  const [status, setStatus] = useState<StatusFilter>(STATUS_FILTERS.ALL)
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DEBOUNCE_MS)

  const params: ProductListParams = {
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    search: debouncedSearch || undefined,
    categoryId: categoryValue === ALL_CATEGORIES_VALUE ? undefined : Number(categoryValue),
    status,
  }
  const productsQuery = useProducts(params)
  const categoriesQuery = useCategories()
  const updateMutation = useUpdateProduct()
  const deleteMutation = useDeleteProduct()

  const [formDialog, setFormDialog] = useState<FormDialogState>({ open: false, product: null })
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [stockTarget, setStockTarget] = useState<Product | null>(null)
  // Hasil aksi terakhir; sukses hanya ditulis setelah BE membalas.
  const [notice, setNotice] = useState<Notice | null>(null)

  const canDelete = CATALOG_PERMISSIONS.DELETE_PRODUCTS.includes(role)
  const isFiltered = Boolean(debouncedSearch) || categoryValue !== ALL_CATEGORIES_VALUE || status !== STATUS_FILTERS.ALL
  const categories = categoriesQuery.data ?? []

  // Setiap perubahan filter kembali ke halaman 1 agar tidak berada di halaman yang sudah tidak ada.
  const changeFilter = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value)
    setPage(1)
  }

  const openForm = (product: Product | null) => {
    setNotice(null)
    setFormDialog({ open: true, product })
  }

  const handleSaved = (product: Product) => {
    setNotice({ type: "success", message: `Barang ${product.sku} "${product.name}" disimpan.` })
    setFormDialog((current) => ({ ...current, open: false }))
  }

  const handleToggleActive = (product: Product) => {
    setNotice(null)
    updateMutation.mutate(
      { id: product.id, input: { isActive: !product.isActive } },
      {
        onSuccess: (updated) =>
          setNotice({
            type: "success",
            message: `Barang ${updated.sku} ${updated.isActive ? "diaktifkan" : "dinonaktifkan"}.`,
          }),
        onError: (error) => setNotice({ type: "error", message: getApiErrorMessage(error) }),
      },
    )
  }

  const openDeleteDialog = (product: Product) => {
    setNotice(null)
    deleteMutation.reset()
    setDeleteTarget(product)
  }

  const confirmDelete = () => {
    if (!deleteTarget) {
      return
    }
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        setNotice({ type: "success", message: `Barang ${deleteTarget.sku} dihapus.` })
        setDeleteTarget(null)
      },
    })
  }

  const renderContent = () => {
    if (productsQuery.isPending) {
      return <TableSkeleton label="Memuat barang..." />
    }
    if (productsQuery.isError) {
      return (
        <ErrorState
          title="Barang tidak dapat dimuat"
          description={getApiErrorMessage(productsQuery.error)}
          onRetry={() => void productsQuery.refetch()}
        />
      )
    }
    const { data: products, meta } = productsQuery.data
    if (products.length === 0) {
      return isFiltered ? (
        <EmptyState
          icon={SearchX}
          title="Tidak ada barang yang cocok"
          description="Ubah kata kunci atau filter untuk melihat barang lain."
        />
      ) : (
        <EmptyState
          icon={Package}
          title="Belum ada barang"
          description="Tambahkan barang pertama. SKU dibuat otomatis oleh sistem."
        />
      )
    }
    return (
      <div className="flex flex-col gap-3" aria-busy={productsQuery.isFetching}>
        <ProductTable
          products={products}
          pendingProductId={updateMutation.isPending ? updateMutation.variables.id : null}
          canDelete={canDelete}
          onEdit={openForm}
          onToggleActive={handleToggleActive}
          onDelete={openDeleteDialog}
          onShowStock={setStockTarget}
        />
        <ListPagination meta={meta} itemLabel="barang" onPageChange={setPage} isFetching={productsQuery.isFetching} />
      </div>
    )
  }

  return (
    <section className="flex flex-col gap-5" aria-label="Daftar barang">
      <div className="rounded-xl border border-border/80 bg-card/60 px-4 py-3 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Identitas SKU & Buku Besar Stok:</span> SKU internal (
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground">P-XXXXXX</code>) diterbitkan
        otomatis oleh sistem dan terpisah dari kode item supplier pada faktur. Saldo stok tidak dapat diubah dari form
        master barang—klik <span className="font-medium text-foreground">Riwayat stok</span> pada baris barang untuk
        memeriksa kartu stok inventaris.
      </div>

      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-xs">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <ProductFilters
            search={search}
            onSearchChange={changeFilter(setSearch)}
            categoryValue={categoryValue}
            onCategoryChange={changeFilter(setCategoryValue)}
            status={status}
            onStatusChange={changeFilter(setStatus)}
            categories={categories}
          />
          <Button onClick={() => openForm(null)} disabled={categoriesQuery.isPending} className="self-start lg:self-auto">
            <Plus data-icon="inline-start" aria-hidden />
            Tambah barang
          </Button>
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-3">
            <span className="mr-1 text-xs font-medium text-muted-foreground">Kategori cepat:</span>
            <button
              type="button"
              onClick={() => changeFilter(setCategoryValue)(ALL_CATEGORIES_VALUE)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                categoryValue === ALL_CATEGORIES_VALUE
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              Semua kategori
            </button>
            {categories.map((cat) => {
              const valueStr = String(cat.id)
              const active = categoryValue === valueStr
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => changeFilter(setCategoryValue)(valueStr)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {cat.name}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {categoriesQuery.isError && (
        <Alert variant="destructive">
          <AlertDescription>Daftar kategori gagal dimuat: {getApiErrorMessage(categoriesQuery.error)}</AlertDescription>
        </Alert>
      )}
      <ActionNotice notice={notice} />

      {renderContent()}

      <ProductFormDialog
        open={formDialog.open}
        onOpenChange={(open) => setFormDialog((current) => ({ ...current, open }))}
        product={formDialog.product}
        categories={categories}
        onSaved={handleSaved}
      />
      <StockCardDialog product={stockTarget} onOpenChange={(open) => !open && setStockTarget(null)} />
      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Hapus barang?"
        description={`Barang ${deleteTarget?.sku ?? ""} "${deleteTarget?.name ?? ""}" akan dihapus permanen. Barang yang sudah bertransaksi tidak bisa dihapus; nonaktifkan saja.`}
        confirmLabel="Hapus"
        onConfirm={confirmDelete}
        isPending={deleteMutation.isPending}
        errorMessage={deleteMutation.isError ? getApiErrorMessage(deleteMutation.error) : null}
      />
    </section>
  )
}
