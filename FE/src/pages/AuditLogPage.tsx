import { PageHeader } from "@/components/shared/PageHeader"
import { AuditLogPanel } from "@/features/administration/components/AuditLogPanel"

export function AuditLogPage() {
  return (
    <>
      <PageHeader title="Log aktivitas" description="Catatan aksi penting yang tidak bisa diubah atau dihapus." />
      <AuditLogPanel />
    </>
  )
}
