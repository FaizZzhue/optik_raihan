import { ArrowLeft } from "lucide-react"
import { Link, useLocation, useParams } from "react-router-dom"
import { ActionNotice } from "@/components/shared/ActionNotice"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { PurchaseDetailView } from "@/features/purchasing/components/PurchaseDetailView"

// state.created dikirim PurchaseForm setelah BE menyimpan pembelian.
function isJustCreated(state: unknown): boolean {
  return typeof state === "object" && state !== null && "created" in state && state.created === true
}

export function PurchaseDetailPage() {
  const { purchaseId } = useParams()
  const location = useLocation()
  const id = Number(purchaseId)

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
          eyebrow="Arsip Faktur Pengadaan"
          title={`Pembelian #${purchaseId ?? ""}`}
          description="Dokumen rincian barang, kuantitas masuk, dan harga beli aktual saat transaksi dicatat."
        />
      </div>
      <ActionNotice
        notice={isJustCreated(location.state) ? { type: "success", message: "Pembelian tersimpan dan stok sudah bertambah." } : null}
      />
      {Number.isInteger(id) && id > 0 ? (
        <PurchaseDetailView purchaseId={id} />
      ) : (
        <ActionNotice notice={{ type: "error", message: "Nomor pembelian tidak valid." }} />
      )}
    </>
  )
}
