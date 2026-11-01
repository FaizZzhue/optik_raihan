import { ChartColumn } from "lucide-react"
import { EmptyState } from "@/components/shared/EmptyState"
import { PageHeader } from "@/components/shared/PageHeader"
import { useCurrentUser } from "@/features/auth/hooks/use-auth"

// Belum ada KPI: datanya baru tersedia setelah modul penjualan dan stok selesai (Tahap 8).
export function DashboardPage() {
  const user = useCurrentUser()

  return (
    <>
      <PageHeader title="Dashboard" description={`Selamat datang, ${user.name}.`} />
      <EmptyState
        icon={ChartColumn}
        title="Ringkasan belum tersedia"
        description="Ringkasan akan tampil setelah modul penjualan dan stok tersedia."
      />
    </>
  )
}
