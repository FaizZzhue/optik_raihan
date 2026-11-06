import { PageHeader } from "@/components/shared/PageHeader"
import { PurchasesPanel } from "@/features/purchasing/components/PurchasesPanel"

export function PurchasesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pengadaan Barang"
        title="Pembelian"
        description="Arsip faktur pembelian barang dari supplier beserta mutasi stok masuk ke inventaris."
      />
      <PurchasesPanel />
    </>
  )
}
