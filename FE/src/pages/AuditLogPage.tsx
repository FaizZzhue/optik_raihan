import { PageHeader } from "@/components/shared/PageHeader"
import { AuditLogPanel } from "@/features/administration/components/AuditLogPanel"

export function AuditLogPage() {
  return (
    <>
      <PageHeader
        eyebrow="Administrasi & Keamanan"
        title="Log aktivitas"
        description="Jejak audit permanen atas autentikasi, perubahan harga acuan barang, dan manajemen akun pengguna."
      />
      <AuditLogPanel />
    </>
  )
}
