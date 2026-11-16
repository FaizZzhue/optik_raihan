import { Boxes, Package, ShoppingCart, TriangleAlert } from "lucide-react"
import { StatCard } from "@/components/shared/StatCard"
import { formatRupiah } from "@/utils/formatting/format-currency"

type DashboardStatsProps = {
  isOwner: boolean
  totalPurchasesAmount: number
  purchaseCount: number
  loadedPurchaseCount: number
  totalStock: number
  activeCategoryCount: number
  activeModelCount: number
  totalCatalogModels: number
  zeroStockSampleCount: number
  productSampleSize: number
}

const numberFormatter = new Intl.NumberFormat("id-ID")

export function DashboardStats({
  isOwner,
  totalPurchasesAmount,
  purchaseCount,
  loadedPurchaseCount,
  totalStock,
  activeCategoryCount,
  activeModelCount,
  totalCatalogModels,
  zeroStockSampleCount,
  productSampleSize,
}: DashboardStatsProps) {
  const activeShare = totalCatalogModels > 0 ? Math.round((activeModelCount / totalCatalogModels) * 100) : null
  // Total dihitung dari faktur yang dimuat; beri tahu bila belum mencakup semua faktur.
  const purchaseHint =
    loadedPurchaseCount < purchaseCount
      ? `Dari ${loadedPurchaseCount} faktur terbaru (total ${purchaseCount})`
      : `${purchaseCount} faktur supplier tercatat`

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {isOwner ? (
        <StatCard
          to="/pembelian"
          label="Total Pengadaan"
          value={formatRupiah(String(totalPurchasesAmount))}
          icon={ShoppingCart}
          tone="info"
          badge={{ text: "HPP", tone: "info" }}
          hint={purchaseHint}
        />
      ) : (
        <StatCard
          label="Total Pengadaan"
          value="—"
          icon={ShoppingCart}
          tone="neutral"
          badge={{ text: "Khusus owner", tone: "neutral" }}
          hint="Data pembelian hanya untuk owner"
        />
      )}
      <StatCard
        to="/barang"
        label="Total Stok Fisik"
        value={numberFormatter.format(totalStock)}
        unit="pcs"
        icon={Boxes}
        tone="lime"
        hint={`Di ${activeCategoryCount} kategori aktif`}
      />
      <StatCard
        to="/barang"
        label="Model Terdaftar"
        value={numberFormatter.format(activeModelCount)}
        unit="aktif"
        icon={Package}
        tone="neutral"
        badge={activeShare === null ? undefined : { text: `${activeShare}% aktif`, tone: "success" }}
        hint={`Dari ${totalCatalogModels} model katalog`}
      />
      <StatCard
        to="/barang"
        label="Stok Kosong"
        value={numberFormatter.format(zeroStockSampleCount)}
        unit="model"
        icon={TriangleAlert}
        tone="warning"
        badge={
          productSampleSize === 0
            ? undefined
            : zeroStockSampleCount > 0
              ? { text: "Perlu restok", tone: "warning" }
              : { text: "Aman", tone: "success" }
        }
        hint={`Dari ${productSampleSize} barang aktif terbaru`}
      />
    </div>
  )
}
