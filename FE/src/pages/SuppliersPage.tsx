import { PageHeader } from "@/components/shared/PageHeader"
import { SuppliersPanel } from "@/features/purchasing/components/SuppliersPanel"

export function SuppliersPage() {
  return (
    <>
      <PageHeader title="Supplier" description="Pemasok barang yang dipilih saat mencatat pembelian." />
      <SuppliersPanel />
    </>
  )
}
