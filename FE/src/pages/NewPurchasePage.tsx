import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { PurchaseForm } from "@/features/purchasing/components/PurchaseForm"

export function NewPurchasePage() {
  return (
    <>
      <div className="flex flex-col gap-3">
        <Button asChild variant="ghost" size="sm" className="self-start">
          <Link to="/pembelian">
            <ArrowLeft data-icon="inline-start" aria-hidden />
            Kembali ke daftar pembelian
          </Link>
        </Button>
        <PageHeader
          eyebrow="Input Faktur Supplier"
          title="Catat pembelian"
          description="Salin rincian faktur dari supplier. Stok barang bertambah otomatis saat pembelian disimpan, sedangkan harga beli acuan di master barang tidak berubah otomatis."
        />
      </div>
      <PurchaseForm />
    </>
  )
}
