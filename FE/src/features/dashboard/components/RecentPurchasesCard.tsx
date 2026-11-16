import { ArrowRight, Plus, Receipt, Truck } from "lucide-react"
import { Link } from "react-router-dom"
import { EmptyState } from "@/components/shared/EmptyState"
import { SectionCard } from "@/components/shared/SectionCard"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { PurchaseSummary } from "@/types/purchasing"
import { formatRupiah } from "@/utils/formatting/format-currency"
import { formatDateShort, formatDateTime } from "@/utils/formatting/format-date"

type RecentPurchasesCardProps = {
  purchases: readonly PurchaseSummary[]
  isPending: boolean
}

const VISIBLE_COUNT = 3

export function RecentPurchasesCard({ purchases, isPending }: RecentPurchasesCardProps) {
  const recentPurchases = purchases.slice(0, VISIBLE_COUNT)

  return (
    <SectionCard
      title="Pengadaan Terbaru"
      action={
        <Button asChild variant="ghost" size="sm" className="rounded-full">
          <Link to="/pembelian">
            Riwayat
            <ArrowRight data-icon="inline-end" aria-hidden />
          </Link>
        </Button>
      }
    >
      {isPending ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      ) : recentPurchases.length === 0 ? (
        <EmptyState
          variant="compact"
          icon={Receipt}
          title="Belum ada pengadaan"
          description="Faktur pembelian dari supplier akan muncul di sini."
          action={
            <Button asChild size="sm" className="h-9 rounded-full px-4">
              <Link to="/pembelian/baru">
                <Plus data-icon="inline-start" aria-hidden />
                Catat Pembelian
              </Link>
            </Button>
          }
        />
      ) : (
        <ul className="flex flex-col gap-1">
          {recentPurchases.map((purchase) => (
            <li key={purchase.id}>
              <Link
                to={`/pembelian/${purchase.id}`}
                className="focus-ring flex items-center gap-3 rounded-2xl p-2 transition-colors duration-150 hover:bg-muted/60"
              >
                <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Truck className="size-4.5" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-semibold text-foreground">{purchase.supplier.name}</span>
                  <span className="truncate text-[11px] text-muted-foreground tabular-nums">
                    <time dateTime={purchase.purchasedAt} title={formatDateTime(purchase.purchasedAt)}>
                      {formatDateShort(purchase.purchasedAt)}
                    </time>
                    {` · ${purchase.itemCount} baris`}
                    {purchase.supplierInvoiceNo && ` · ${purchase.supplierInvoiceNo}`}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-bold text-foreground tabular-nums">{formatRupiah(purchase.total)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  )
}
