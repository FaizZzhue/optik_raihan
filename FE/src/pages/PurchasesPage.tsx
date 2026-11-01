import { PageHeader } from "@/components/shared/PageHeader"
import { PurchasesPanel } from "@/features/purchasing/components/PurchasesPanel"

export function PurchasesPage() {
  return (
    <>
      <PageHeader title="Pembelian" description="Riwayat pembelian barang dari supplier." />
      <PurchasesPanel />
    </>
  )
}
