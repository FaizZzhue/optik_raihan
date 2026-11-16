import { ArrowRight, Glasses, PackageOpen } from "lucide-react"
import { Link } from "react-router-dom"
import { EmptyState } from "@/components/shared/EmptyState"
import { SectionCard } from "@/components/shared/SectionCard"
import { ToneBadge } from "@/components/shared/StatusBadge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Product } from "@/types/catalog"
import { formatRupiah } from "@/utils/formatting/format-currency"

type InventoryCardProps = {
  products: readonly Product[]
  isPending: boolean
  totalCatalogModels: number
}

// Kode supplier disimpan di deskripsi hasil impor faktur, mis. "[Kode Supplier: ABC-01]".
function getSupplierRef(product: Product) {
  return product.description?.match(/\[Kode Supplier:\s*([^\]]+)\]/i)?.[1] ?? null
}

// Produk belum punya field gambar, jadi thumbnail memakai ikon kacamata.
function ProductThumb() {
  return (
    <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
      <Glasses className="size-5" />
    </span>
  )
}

function ProductIdentity({ product }: { product: Product }) {
  const supplierRef = getSupplierRef(product)
  return (
    <div className="flex min-w-0 items-center gap-3">
      <ProductThumb />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">{product.name}</p>
        <p className="truncate font-mono text-[11px] text-muted-foreground tabular-nums">
          {product.sku}
          {supplierRef && ` · Ref ${supplierRef}`}
        </p>
      </div>
    </div>
  )
}

function StockBadge({ qty }: { qty: number }) {
  return <ToneBadge tone={qty > 0 ? "neutral" : "warning"}>{qty} pcs</ToneBadge>
}

function SellPrice({ value }: { value: string }) {
  return Number(value) === 0 ? (
    <span className="text-xs font-normal text-muted-foreground italic">Belum diatur</span>
  ) : (
    <span className="font-semibold text-foreground tabular-nums">{formatRupiah(value)}</span>
  )
}

const HEAD_CLASSES = "h-9 text-[11px] font-medium tracking-wider text-muted-foreground uppercase"

export function InventoryCard({ products, isPending, totalCatalogModels }: InventoryCardProps) {
  return (
    <SectionCard
      title="Posisi Inventaris & Katalog Terbaru"
      description="Barang aktif terbaru beserta harga jual dan stok fisik."
      action={
        <Button asChild variant="ghost" size="sm" className="rounded-full">
          <Link to="/barang">
            Lihat semua ({totalCatalogModels})
            <ArrowRight data-icon="inline-end" aria-hidden />
          </Link>
        </Button>
      }
    >
      {isPending ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          variant="compact"
          icon={PackageOpen}
          title="Belum ada barang di katalog"
          description="Daftarkan barang baru di menu Barang untuk mulai mencatat stok."
          action={
            <Button asChild size="sm" variant="outline" className="rounded-full">
              <Link to="/barang">Buka menu Barang</Link>
            </Button>
          }
        />
      ) : (
        <>
          {/* Mobile: daftar kartu ringkas agar tidak perlu scroll horizontal. */}
          <ul className="flex flex-col gap-2 md:hidden">
            {products.map((product) => (
              <li key={product.id} className="flex items-center justify-between gap-3 rounded-2xl bg-muted/50 p-3">
                <ProductIdentity product={product} />
                <div className="flex shrink-0 flex-col items-end gap-1 text-xs">
                  <SellPrice value={product.sellPrice} />
                  <StockBadge qty={product.stockQty} />
                </div>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <Table>
              <TableHeader className="[&_tr]:border-border">
                <TableRow className="hover:bg-transparent">
                  <TableHead className={HEAD_CLASSES}>Barang</TableHead>
                  <TableHead className={HEAD_CLASSES}>Kategori</TableHead>
                  <TableHead className={`${HEAD_CLASSES} text-right`}>Harga Jual</TableHead>
                  <TableHead className={`${HEAD_CLASSES} text-right`}>Stok</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} className="border-0 transition-colors duration-150 hover:bg-muted/50">
                    <TableCell className="max-w-72 rounded-l-xl py-3">
                      <ProductIdentity product={product} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{product.category.name}</TableCell>
                    <TableCell className="text-right text-sm">
                      <SellPrice value={product.sellPrice} />
                    </TableCell>
                    <TableCell className="rounded-r-xl text-right">
                      <StockBadge qty={product.stockQty} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </SectionCard>
  )
}
