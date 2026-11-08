import {
  ArrowRight,
  Boxes,
  ChartColumn,
  ClipboardList,
  History,
  Package,
  Plus,
  ShoppingCart,
  Tags,
  TriangleAlert,
  Truck,
  Users,
} from "lucide-react"
import { Link } from "react-router-dom"
import { PageHeader } from "@/components/shared/PageHeader"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { USER_ROLE_LABELS, USER_ROLES } from "@/constants/auth.constants"
import { STATUS_FILTERS } from "@/constants/status-filter.constants"
import { useCurrentUser } from "@/features/auth/hooks/use-auth"
import { useCategories } from "@/features/catalog/hooks/use-categories"
import { useProducts } from "@/features/catalog/hooks/use-products"
import { usePurchases } from "@/features/purchasing/hooks/use-purchases"
import { formatRupiah } from "@/utils/format-currency"
import { formatDateShort, formatDateTime } from "@/utils/format-date"

export function DashboardPage() {
  const user = useCurrentUser()
  const isOwner = user.role === USER_ROLES.OWNER

  const activeProductsQuery = useProducts({ page: 1, pageSize: 6, status: STATUS_FILTERS.ACTIVE })
  const categoriesQuery = useCategories()

  const activeCategories = (categoriesQuery.data ?? []).filter((category) => category.isActive)
  const totalCatalogModels = (categoriesQuery.data ?? []).reduce((sum, category) => sum + category.productCount, 0)
  const totalStock = (categoriesQuery.data ?? []).reduce((sum, category) => sum + (category.totalStock ?? 0), 0)
  const recentProducts = activeProductsQuery.data?.data ?? []
  const zeroStockSampleCount = recentProducts.filter((product) => product.stockQty === 0).length

  const kacamataBacaCategory = (categoriesQuery.data ?? []).find((c) => c.name.toLowerCase() === "kacamata baca")
  const kacamataMinusCategory = (categoriesQuery.data ?? []).find((c) => c.name.toLowerCase() === "kacamata minus")

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={`Ikhtisar Operasional · ${USER_ROLE_LABELS[user.role]}`}
        title="Dashboard"
        description={`Selamat datang, ${user.name}. Pantau kesiapan katalog barang, posisi stok, dan aktivitas pengadaan toko.`}
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <Link to="/barang">
                <Package data-icon="inline-start" aria-hidden />
                Katalog &amp; Kartu Stok
              </Link>
            </Button>
            {isOwner && (
              <Button asChild size="sm">
                <Link to="/pembelian/baru">
                  <Plus data-icon="inline-start" aria-hidden />
                  Catat Pembelian
                </Link>
              </Button>
            )}
          </>
        }
      />

      {/* Indikator metrik langsung dari data katalog dan kategori aktual di database. */}
      <section aria-label="Metrik kesiapan operasional" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="flex flex-col justify-between gap-2 rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Model Barang Aktif</span>
            <Package className="size-4 text-primary-text" aria-hidden />
          </div>
          {activeProductsQuery.isPending ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <p className="font-serif text-2xl font-semibold tabular-nums">
              {activeProductsQuery.data?.meta.totalItems ?? 0}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Dari total <span className="font-medium text-foreground tabular-nums">{totalCatalogModels}</span> model
            terdaftar
          </p>
        </div>

        <div className="flex flex-col justify-between gap-2 rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Stok Barang</span>
            <Boxes className="size-4 text-primary-text" aria-hidden />
          </div>
          {categoriesQuery.isPending ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <p className="font-serif text-2xl font-semibold tabular-nums">
              {totalStock} <span className="text-sm font-normal text-muted-foreground">pcs</span>
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Akumulasi stok fisik dari seluruh kategori
          </p>
        </div>

        <div className="flex flex-col justify-between gap-2 rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Kategori Katalog</span>
            <Tags className="size-4 text-primary-text" aria-hidden />
          </div>
          {categoriesQuery.isPending ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <p className="font-serif text-2xl font-semibold tabular-nums">{activeCategories.length}</p>
          )}
          <p className="truncate text-xs text-muted-foreground">
            {kacamataBacaCategory && kacamataMinusCategory
              ? `Baca: ${kacamataBacaCategory.productCount} · Minus: ${kacamataMinusCategory.productCount}`
              : activeCategories.map((c) => c.name).slice(0, 2).join(" · ")}
          </p>
        </div>

        <div className="flex flex-col justify-between gap-2 rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Stok Kosong (Terbaru)</span>
            <TriangleAlert className="size-4 text-warning" aria-hidden />
          </div>
          {activeProductsQuery.isPending ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <p className="font-serif text-2xl font-semibold tabular-nums">{zeroStockSampleCount}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Model aktif dengan stok 0 pcs pada daftar terbaru
          </p>
        </div>

        <div className="flex flex-col justify-between gap-2 rounded-xl border bg-secondary/40 p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Ringkasan Penjualan</span>
            <ChartColumn className="size-4 text-primary-text" aria-hidden />
          </div>
          <p className="text-sm font-semibold text-foreground">Belum ada transaksi</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Ringkasan omzet &amp; laba kotor akan tampil setelah transaksi POS penjualan dicatat.
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Panel Kiri: Daftar barang terbaru & pemeriksaan stok cepat */}
        <section
          aria-labelledby="dashboard-catalog-heading"
          className="flex flex-col gap-3 rounded-xl border bg-card p-4 md:p-5 lg:col-span-7"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
            <div>
              <h2 id="dashboard-catalog-heading" className="font-serif text-base font-semibold">
                Posisi Stok &amp; Katalog Terbaru
              </h2>
              <p className="text-xs text-muted-foreground">
                Daftar barang aktif terbaru beserta harga jual standar dan saldo stok saat ini.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/barang">
                Lihat semua
                <ArrowRight data-icon="inline-end" aria-hidden />
              </Link>
            </Button>
          </div>

          {activeProductsQuery.isPending ? (
            <div className="flex flex-col gap-2 py-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ) : recentProducts.length === 0 ? (
            <div className="flex flex-col items-start gap-2 rounded-lg border border-dashed p-5 text-sm">
              <p className="font-medium">Belum ada barang di katalog</p>
              <p className="text-xs text-muted-foreground">
                Mulai operasional toko dengan menambahkan kategori (Frame, Lensa Jadi, Kacamata Jadi) lalu mendaftarkan
                barang.
              </p>
              <Button asChild size="sm" variant="outline" className="mt-1">
                <Link to="/barang">Buka menu Barang</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Nama Barang</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead className="text-right">Harga Jual</TableHead>
                    <TableHead className="text-right">Stok</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentProducts.map((product) => {
                    const supplierCodeMatch = product.description?.match(/\[Kode Supplier:\s*([^\]]+)\]/i)
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-mono text-xs tabular-nums text-muted-foreground">
                          {product.sku}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div>{product.name}</div>
                          {supplierCodeMatch && (
                            <span className="font-mono text-[11px] text-muted-foreground">
                              Ref: {supplierCodeMatch[1]}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{product.category.name}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {Number(product.sellPrice) === 0 ? (
                            <span className="text-xs text-muted-foreground italic">Belum diatur</span>
                          ) : (
                            formatRupiah(product.sellPrice)
                          )}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          <Badge variant={product.stockQty > 0 ? "secondary" : "outline"} className="tabular-nums">
                            {product.stockQty} pcs
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </section>

        {/* Panel Kanan: Pintasan operasional & riwayat pembelian terbaru (untuk Owner) */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          <section
            aria-labelledby="dashboard-shortcuts-heading"
            className="flex flex-col gap-3 rounded-xl border bg-card p-4 md:p-5"
          >
            <div className="border-b pb-3">
              <h2 id="dashboard-shortcuts-heading" className="font-serif text-base font-semibold">
                Pintasan Kerja Operasional
              </h2>
              <p className="text-xs text-muted-foreground">
                Akses langsung ke modul sesuai hak akses {USER_ROLE_LABELS[user.role]}.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <Link
                to="/barang"
                className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-secondary/50"
              >
                <Boxes className="mt-0.5 size-4 shrink-0 text-primary-text" aria-hidden />
                <div className="min-w-0">
                  <p className="text-sm font-medium">Master Barang &amp; Stok</p>
                  <p className="text-xs text-muted-foreground">Cek harga, tambah model, dan lihat kartu stok</p>
                </div>
              </Link>

              {isOwner ? (
                <>
                  <Link
                    to="/pembelian/baru"
                    className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-secondary/50"
                  >
                    <ShoppingCart className="mt-0.5 size-4 shrink-0 text-primary-text" aria-hidden />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Input Faktur Pembelian</p>
                      <p className="text-xs text-muted-foreground">Catat barang masuk dari faktur supplier</p>
                    </div>
                  </Link>
                  <Link
                    to="/supplier"
                    className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-secondary/50"
                  >
                    <Truck className="mt-0.5 size-4 shrink-0 text-primary-text" aria-hidden />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Direktori Supplier</p>
                      <p className="text-xs text-muted-foreground">Kelola kontak dan alamat pemasok</p>
                    </div>
                  </Link>
                  <Link
                    to="/kategori"
                    className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-secondary/50"
                  >
                    <Tags className="mt-0.5 size-4 shrink-0 text-primary-text" aria-hidden />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Klasifikasi Kategori</p>
                      <p className="text-xs text-muted-foreground">Kelola kelompok frame &amp; lensa</p>
                    </div>
                  </Link>
                  <Link
                    to="/akun"
                    className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-secondary/50"
                  >
                    <Users className="mt-0.5 size-4 shrink-0 text-primary-text" aria-hidden />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Akun Pegawai</p>
                      <p className="text-xs text-muted-foreground">Kelola akses dan reset password</p>
                    </div>
                  </Link>
                  <Link
                    to="/log-aktivitas"
                    className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-secondary/50"
                  >
                    <History className="mt-0.5 size-4 shrink-0 text-primary-text" aria-hidden />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Log Aktivitas</p>
                      <p className="text-xs text-muted-foreground">Audit perubahan harga dan akun</p>
                    </div>
                  </Link>
                </>
              ) : (
                <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3">
                  <ClipboardList className="mt-0.5 size-4 shrink-0 text-primary-text" aria-hidden />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">Panduan Operasional Pegawai</p>
                    <p className="text-xs text-muted-foreground">
                      Pegawai dapat menambah/mengubah data barang, memperbarui harga jual, dan memeriksa kartu stok.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {isOwner && <OwnerRecentPurchasesCard />}
        </div>
      </div>

      {/* Ringkasan distribusi barang per kategori */}
      {categoriesQuery.data && categoriesQuery.data.length > 0 && (
        <section
          aria-labelledby="dashboard-categories-heading"
          className="flex flex-col gap-3 rounded-xl border bg-card p-4 md:p-5"
        >
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 id="dashboard-categories-heading" className="font-serif text-base font-semibold">
                Struktur Kategori &amp; Distribusi Stok Optik
              </h2>
              <p className="text-xs text-muted-foreground">
                Distribusi jumlah model barang terdaftar dan posisi stok fisik pada setiap kategori.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {categoriesQuery.data.map((category) => (
              <div key={category.id} className="flex flex-col justify-between gap-2 rounded-lg border bg-background/60 p-3">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-medium">{category.name}</p>
                  <StatusBadge isActive={category.isActive} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs font-semibold tabular-nums text-foreground">{category.productCount} model barang</p>
                  <p className="text-xs tabular-nums text-muted-foreground">Stok: {category.totalStock ?? 0} pcs</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function OwnerRecentPurchasesCard() {
  const purchasesQuery = usePurchases(1)
  const recentPurchases = (purchasesQuery.data?.data ?? []).slice(0, 4)

  return (
    <section
      aria-labelledby="dashboard-purchases-heading"
      className="flex flex-col gap-3 rounded-xl border bg-card p-4 md:p-5"
    >
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h2 id="dashboard-purchases-heading" className="font-serif text-base font-semibold">
            Pembelian Supplier Terbaru
          </h2>
          <p className="text-xs text-muted-foreground">
            Total {purchasesQuery.data?.meta.totalItems ?? 0} dokumen pembelian tercatat.
          </p>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link to="/pembelian">
            Riwayat
            <ArrowRight data-icon="inline-end" aria-hidden />
          </Link>
        </Button>
      </div>

      {purchasesQuery.isPending ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : recentPurchases.length === 0 ? (
        <p className="py-3 text-xs text-muted-foreground">
          Belum ada pencatatan faktur pembelian dari supplier. Gunakan menu{" "}
          <Link to="/pembelian/baru" className="font-medium text-primary-text underline underline-offset-4">
            Catat pembelian
          </Link>{" "}
          saat barang masuk.
        </p>
      ) : (
        <ul className="divide-y text-sm">
          {recentPurchases.map((purchase) => (
            <li key={purchase.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <Link
                  to={`/pembelian/${purchase.id}`}
                  className="truncate font-medium hover:text-primary-text hover:underline"
                >
                  {purchase.supplier.name}
                </Link>
                <p className="truncate text-xs text-muted-foreground tabular-nums">
                  {purchase.supplierInvoiceNo ? `Faktur: ${purchase.supplierInvoiceNo} · ` : ""}
                  {formatDateShort(purchase.purchasedAt)} ({purchase.itemCount} baris)
                </p>
              </div>
              <span className="shrink-0 font-medium tabular-nums" title={formatDateTime(purchase.purchasedAt)}>
                {formatRupiah(purchase.total)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
