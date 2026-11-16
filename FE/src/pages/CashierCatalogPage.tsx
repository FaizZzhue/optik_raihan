import { useMemo, useState } from "react"
import {
  AlertCircle,
  CheckCircle2,
  Package,
  Plus,
  Search,
  ShoppingBag,
  XCircle,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { STATUS_FILTERS } from "@/constants/status-filter.constants"
import { useCategories } from "@/hooks/catalog/use-categories"
import { useProducts } from "@/hooks/catalog/use-products"
import { formatRupiah } from "@/utils/formatting/format-currency"

type StockFilter = "all" | "in_stock" | "out_of_stock"

export function CashierCatalogPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined)
  const [stockFilter, setStockFilter] = useState<StockFilter>("all")

  const categoriesQuery = useCategories()
  const allProductsQuery = useProducts({
    page: 1,
    pageSize: 100,
    status: STATUS_FILTERS.ACTIVE,
  })
  const productsQuery = useProducts({
    page: 1,
    pageSize: 100,
    search: search.trim() || undefined,
    categoryId: selectedCategoryId,
    status: STATUS_FILTERS.ACTIVE,
  })

  const activeCategories = useMemo(
    () => (categoriesQuery.data ?? []).filter((category) => category.isActive),
    [categoriesQuery.data],
  )

  const summary = useMemo(() => {
    const all = allProductsQuery.data?.data ?? []
    const totalActive = allProductsQuery.data?.meta.totalItems ?? all.length
    const inStockCount = all.filter((item) => item.stockQty > 0).length
    const outOfStockCount = all.filter((item) => item.stockQty <= 0).length
    return { totalActive, inStockCount, outOfStockCount }
  }, [allProductsQuery.data])

  const filteredProducts = useMemo(() => {
    const list = productsQuery.data?.data ?? []
    if (stockFilter === "in_stock") {
      return list.filter((item) => item.stockQty > 0)
    }
    if (stockFilter === "out_of_stock") {
      return list.filter((item) => item.stockQty <= 0)
    }
    return list
  }, [productsQuery.data?.data, stockFilter])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Katalog Toko"
        title="Cek Stok & Harga Barang"
        description="Periksa ketersediaan stok dan harga jual resmi frame atau lensa di etalase toko sebelum menginput orderan pelanggan."
        actions={
          <Button
            type="button"
            onClick={() => navigate("/kasir/order")}
            className="rounded-full shadow-xs"
          >
            <ShoppingBag className="size-4" aria-hidden />
            Buka Input Orderan POS
          </Button>
        }
      />

      {/* Ringkasan Ketersediaan Etalase */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">Total Produk Aktif</span>
            <span className="text-2xl font-bold text-foreground tabular-nums">
              {summary.totalActive}
            </span>
          </div>
          <span className="flex size-11 items-center justify-center rounded-2xl bg-muted text-foreground">
            <Package className="size-5" aria-hidden />
          </span>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">Stok Tersedia</span>
            <span className="text-2xl font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
              {summary.inStockCount}
            </span>
          </div>
          <span className="flex size-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-5" aria-hidden />
          </span>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">Stok Habis</span>
            <span className="text-2xl font-bold text-amber-600 tabular-nums dark:text-amber-400">
              {summary.outOfStockCount}
            </span>
          </div>
          <span className="flex size-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <XCircle className="size-5" aria-hidden />
          </span>
        </div>
      </div>

      {/* Bar Pencarian & Filter */}
      <section className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-xs sm:p-6">
        <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama frame, jenis lensa, atau kode SKU..."
              aria-label="Cari barang di halaman cek stok dan harga"
              className="h-11 rounded-xl pl-11 text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { value: "all", label: "Semua Stok" },
                { value: "in_stock", label: "Stok Tersedia" },
                { value: "out_of_stock", label: "Stok Habis" },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStockFilter(option.value)}
                className={`focus-ring h-10 rounded-full px-4 text-xs font-semibold transition-colors sm:text-sm ${
                  stockFilter === option.value
                    ? "bg-foreground text-background shadow-xs"
                    : "border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Kategori */}
        <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-3.5">
          <button
            type="button"
            onClick={() => setSelectedCategoryId(undefined)}
            className={`focus-ring rounded-full px-4 py-2 text-xs font-semibold transition-colors sm:text-sm ${
              selectedCategoryId === undefined
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            Semua Kategori
          </button>
          {activeCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategoryId(category.id)}
              className={`focus-ring rounded-full px-4 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                selectedCategoryId === category.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Grid Kartu Katalog */}
      {productsQuery.isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-52 animate-pulse rounded-2xl border border-border bg-muted/40"
            />
          ))}
        </div>
      ) : productsQuery.isError ? (
        <div className="flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-5 text-sm text-destructive">
          <AlertCircle className="size-5 shrink-0" aria-hidden />
          <span>Gagal memuat daftar barang dari server. Silakan muat ulang halaman.</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-border bg-card py-16 text-center">
          <Package className="size-10 text-muted-foreground/50" aria-hidden />
          <p className="text-base font-bold text-foreground">Tidak ada barang yang cocok</p>
          <p className="max-w-sm text-xs text-muted-foreground">
            Ubah kata kunci pencarian, kategori, atau filter ketersediaan stok di atas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => {
            const isOutOfStock = product.stockQty <= 0

            return (
              <article
                key={product.id}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-xs transition-colors hover:border-border/80"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded-md bg-muted px-2.5 py-1 font-mono text-xs font-semibold text-muted-foreground">
                        {product.sku}
                      </span>
                      <span className="rounded-full bg-muted/80 px-2.5 py-1 text-xs font-medium text-foreground">
                        {product.category.name}
                      </span>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold tabular-nums ${
                        isOutOfStock
                          ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                          : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                      }`}
                    >
                      {isOutOfStock ? "Stok Habis (0)" : `Stok: ${product.stockQty} pcs`}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-base font-bold leading-snug text-foreground">
                      {product.name}
                    </h2>
                    {product.description && (
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {product.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-border/70 pt-3.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Harga Jual</span>
                    <span className="text-xl font-bold text-foreground tabular-nums">
                      {formatRupiah(product.sellPrice)}
                    </span>
                  </div>

                  <Button
                    type="button"
                    onClick={() => navigate(`/kasir/order?productId=${product.id}`)}
                    className="h-10 w-full rounded-xl text-sm font-semibold"
                  >
                    <Plus className="size-4" aria-hidden />
                    Masukkan ke Order POS
                  </Button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
