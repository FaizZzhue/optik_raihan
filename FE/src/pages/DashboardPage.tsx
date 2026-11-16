import { USER_ROLE_LABELS, USER_ROLES } from "@/constants/auth.constants"
import { useCurrentUser } from "@/hooks/auth/use-auth"
import { CashFlowCard } from "@/features/dashboard/components/CashFlowCard"
import { DashboardGreeting } from "@/features/dashboard/components/DashboardGreeting"
import { DashboardStats } from "@/features/dashboard/components/DashboardStats"
import { DatabaseStatusCard } from "@/features/dashboard/components/DatabaseStatusCard"
import { FinancialRevenueCard } from "@/features/dashboard/components/FinancialRevenueCard"
import { InventoryCard } from "@/features/dashboard/components/InventoryCard"
import { QuickActionsCard } from "@/features/dashboard/components/QuickActionsCard"
import { RecentPurchasesCard } from "@/features/dashboard/components/RecentPurchasesCard"
import { StockAlertCard } from "@/features/dashboard/components/StockAlertCard"
import { useDashboardSummary } from "@/hooks/dashboard/use-dashboard-summary"
import { formatMonthYear } from "@/utils/formatting/format-date"

// Penjualan (POS) belum ada sampai modul penjualan dibuka di Tahap 6, jadi pendapatan masih 0.
const SALES_MODULE_AVAILABLE = false
const GROSS_SALES_REVENUE = 0
const NET_SALES_REVENUE = 0

export function DashboardPage() {
  const user = useCurrentUser()
  const isOwner = user.role === USER_ROLES.OWNER
  const summary = useDashboardSummary()

  return (
    <div className="flex flex-col gap-6">
      <DashboardGreeting userName={user.name} roleLabel={USER_ROLE_LABELS[user.role]} isOwner={isOwner} />

      {/* Desktop (xl): kolom utama ~70% dan kolom kanan ~30%; di bawahnya kolom kanan turun ke bawah. */}
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
        <div className="flex min-w-0 flex-col gap-5">
          <DashboardStats
            isOwner={isOwner}
            totalPurchasesAmount={summary.totalPurchasesAmount}
            purchaseCount={summary.purchaseCount}
            loadedPurchaseCount={summary.purchases.length}
            totalStock={summary.totalStock}
            activeCategoryCount={summary.activeCategoryCount}
            activeModelCount={summary.activeModelCount}
            totalCatalogModels={summary.totalCatalogModels}
            zeroStockSampleCount={summary.zeroStockSampleCount}
            productSampleSize={summary.recentProducts.length}
          />
          <CashFlowCard
            purchases={summary.purchases}
            purchaseCount={summary.purchaseCount}
            isPending={summary.purchasesQuery.isPending}
            canViewProcurement={isOwner}
          />
          <InventoryCard
            products={summary.recentProducts}
            isPending={summary.activeProductsQuery.isPending}
            totalCatalogModels={summary.totalCatalogModels}
          />
        </div>

        <div className="grid min-w-0 grid-cols-1 items-start gap-5 md:grid-cols-2 xl:grid-cols-1">
          <FinancialRevenueCard
            grossRevenue={GROSS_SALES_REVENUE}
            netRevenue={NET_SALES_REVENUE}
            periodLabel={formatMonthYear(new Date())}
            salesAvailable={SALES_MODULE_AVAILABLE}
          />
          <QuickActionsCard role={user.role} />
          {!summary.activeProductsQuery.isPending && summary.recentProducts.length > 0 && (
            <StockAlertCard zeroStockCount={summary.zeroStockSampleCount} sampleSize={summary.recentProducts.length} />
          )}
          {isOwner && <RecentPurchasesCard purchases={summary.purchases} isPending={summary.purchasesQuery.isPending} />}
          <DatabaseStatusCard status={summary.categoriesQuery.status} />
        </div>
      </div>
    </div>
  )
}
