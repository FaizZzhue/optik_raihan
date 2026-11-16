import { useState } from "react"
import { Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { CashierFilters } from "@/features/sales/components/CashierFilters"
import { CashierMainPanel } from "@/features/sales/components/CashierMainPanel"
import { CashierOverviewCards } from "@/features/sales/components/CashierOverviewCards"
import { ReceiptDialog } from "@/features/sales/components/ReceiptDialog"
import { calculateCashierKPI, useSales } from "@/hooks/sales/use-sales"
import type { PaymentMethod, Sale, SaleStatus } from "@/types/sales"

export function CashierPage() {
  const navigate = useNavigate()
  const salesQuery = useSales()

  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<SaleStatus | "all">("all")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "all">("all")
  const [receiptSale, setReceiptSale] = useState<Sale | null>(null)

  const sales = salesQuery.data ?? []

  // Hitung KPI ringkasan kasir
  const kpi = calculateCashierKPI(sales)

  // Filter daftar transaksi
  const filteredSales = sales.filter((item) => {
    if (status !== "all" && item.status !== status) return false
    if (paymentMethod !== "all" && item.paymentMethod !== paymentMethod) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      const matchInv = item.invoiceNumber.toLowerCase().includes(q)
      const matchCustomer = item.customerName.toLowerCase().includes(q)
      const matchItem = item.items.some((i) => i.productName.toLowerCase().includes(q) || i.productSku.toLowerCase().includes(q))
      if (!matchInv && !matchCustomer && !matchItem) return false
    }
    return true
  })

  const handleResetFilters = () => {
    setSearch("")
    setStatus("all")
    setPaymentMethod("all")
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Operasional Toko"
        title="Riwayat Order & Ringkasan Kasir"
        description="Pantau ringkasan omzet kasir, riwayat transaksi dan draft order, serta cetak ulang struk pelanggan."
        actions={
          <Button onClick={() => navigate("/kasir/order")} className="rounded-full shadow-xs">
            <Plus data-icon="inline-start" aria-hidden />
            Input Orderan Baru (POS)
          </Button>
        }
      />

      {/* 1. Baris Kartu Overview & Pembayaran (Sesuai Layout Gambar Atas) */}
      <CashierOverviewCards kpi={kpi} onNewTransaction={() => navigate("/kasir/order")} />

      {/* 2. Baris Filter Aktif (Sesuai Referensi Gambar) */}
      <CashierFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        onResetFilters={handleResetFilters}
      />

      {/* 3. Panel Utama Kontras Hitam Split View (Sesuai Layout Kotak Hitam Gambar) */}
      <CashierMainPanel sales={filteredSales} onPrintReceipt={(sale) => setReceiptSale(sale)} />

      {/* Dialog Cetak Struk Termal Nota */}
      <ReceiptDialog
        open={receiptSale !== null}
        sale={receiptSale}
        onOpenChange={(open) => !open && setReceiptSale(null)}
      />
    </div>
  )
}
