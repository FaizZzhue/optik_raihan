import { PageHeader } from "@/components/shared/PageHeader"
import { SuppliersPanel } from "@/features/purchasing/components/SuppliersPanel"

export function SuppliersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pengadaan Barang"
        title="Supplier"
        description="Direktori pemasok frame, lensa, dan kacamata yang menjadi rujukan saat mencatat faktur pembelian."
      />
      <SuppliersPanel />
    </>
  )
}
