import { PageHeader } from "@/components/shared/PageHeader"
import { PurchaseForm } from "@/features/purchasing/components/PurchaseForm"

export function NewPurchasePage() {
  return (
    <>
      <PageHeader
        title="Catat pembelian"
        description="Stok barang bertambah saat pembelian disimpan. Harga beli di data barang tidak berubah otomatis."
      />
      <PurchaseForm />
    </>
  )
}
