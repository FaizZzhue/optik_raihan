import { STATUS_FILTERS } from "@/constants/status-filter.constants"
import { useCategories } from "@/hooks/catalog/use-categories"
import { useProducts } from "@/hooks/catalog/use-products"
import { usePurchases } from "@/hooks/purchasing/use-purchases"

// Jumlah barang aktif terbaru yang ditampilkan dan dipakai sebagai sampel peringatan stok kosong.
export const DASHBOARD_PRODUCT_SAMPLE_SIZE = 5

// Menyatukan query dashboard (sama dengan sebelumnya) dan turunan angkanya agar halaman tetap tipis.
export function useDashboardSummary() {
  const activeProductsQuery = useProducts({
    page: 1,
    pageSize: DASHBOARD_PRODUCT_SAMPLE_SIZE,
    status: STATUS_FILTERS.ACTIVE,
  })
  const categoriesQuery = useCategories()
  const purchasesQuery = usePurchases(1)

  const categories = categoriesQuery.data ?? []
  const recentProducts = activeProductsQuery.data?.data ?? []
  const purchases = purchasesQuery.data?.data ?? []

  return {
    activeProductsQuery,
    categoriesQuery,
    purchasesQuery,
    activeCategoryCount: categories.filter((category) => category.isActive).length,
    totalCatalogModels: categories.reduce((sum, category) => sum + category.productCount, 0),
    totalStock: categories.reduce((sum, category) => sum + (category.totalStock ?? 0), 0),
    activeModelCount: activeProductsQuery.data?.meta.totalItems ?? 0,
    recentProducts,
    zeroStockSampleCount: recentProducts.filter((product) => product.stockQty === 0).length,
    purchases,
    purchaseCount: purchasesQuery.data?.meta.totalItems ?? purchases.length,
    // Jumlah dari halaman pertama daftar pembelian (maks. DEFAULT_PAGE_SIZE faktur terbaru), sama seperti sebelumnya.
    totalPurchasesAmount: purchases.reduce((sum, purchase) => sum + Number(purchase.total), 0),
  }
}
