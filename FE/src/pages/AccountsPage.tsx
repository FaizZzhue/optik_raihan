import { PageHeader } from "@/components/shared/PageHeader"
import { AccountsPanel } from "@/features/administration/components/AccountsPanel"

export function AccountsPage() {
  return (
    <>
      <PageHeader title="Akun pegawai" description="Buat akun pegawai, reset password, dan nonaktifkan akses." />
      <AccountsPanel />
    </>
  )
}
