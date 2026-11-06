import { PageHeader } from "@/components/shared/PageHeader"
import { AccountsPanel } from "@/features/administration/components/AccountsPanel"

export function AccountsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Administrasi Sistem"
        title="Akun pegawai"
        description="Kelola akses operasional pegawai toko, atur ulang password, dan nonaktifkan akun yang sudah tidak bertugas."
      />
      <AccountsPanel />
    </>
  )
}
