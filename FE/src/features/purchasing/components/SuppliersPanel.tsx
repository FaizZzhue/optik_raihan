import { useState } from "react"
import { Plus, Truck } from "lucide-react"
import { ActionNotice, type Notice } from "@/components/shared/ActionNotice"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { EmptyState } from "@/components/shared/EmptyState"
import { ErrorState } from "@/components/shared/ErrorState"
import { TableSkeleton } from "@/components/shared/TableSkeleton"
import { Button } from "@/components/ui/button"
import type { Supplier } from "@/types/purchasing"
import { getApiErrorMessage } from "@/utils/api-error"
import { useDeleteSupplier, useSuppliers, useUpdateSupplier } from "../hooks/use-suppliers"
import { SupplierFormDialog } from "./SupplierFormDialog"
import { SupplierTable } from "./SupplierTable"

type FormDialogState = { open: boolean; supplier: Supplier | null }

export function SuppliersPanel() {
  const suppliersQuery = useSuppliers()
  const updateMutation = useUpdateSupplier()
  const deleteMutation = useDeleteSupplier()
  const [formDialog, setFormDialog] = useState<FormDialogState>({ open: false, supplier: null })
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null)
  const [notice, setNotice] = useState<Notice | null>(null)

  const openForm = (supplier: Supplier | null) => {
    setNotice(null)
    setFormDialog({ open: true, supplier })
  }

  const handleSaved = (supplier: Supplier) => {
    setNotice({ type: "success", message: `Supplier "${supplier.name}" disimpan.` })
    setFormDialog((current) => ({ ...current, open: false }))
  }

  const handleToggleActive = (supplier: Supplier) => {
    setNotice(null)
    updateMutation.mutate(
      { id: supplier.id, input: { isActive: !supplier.isActive } },
      {
        onSuccess: (updated) =>
          setNotice({
            type: "success",
            message: `Supplier "${updated.name}" ${updated.isActive ? "diaktifkan" : "dinonaktifkan"}.`,
          }),
        onError: (error) => setNotice({ type: "error", message: getApiErrorMessage(error) }),
      },
    )
  }

  const openDeleteDialog = (supplier: Supplier) => {
    setNotice(null)
    deleteMutation.reset()
    setDeleteTarget(supplier)
  }

  const confirmDelete = () => {
    if (!deleteTarget) {
      return
    }
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        setNotice({ type: "success", message: `Supplier "${deleteTarget.name}" dihapus.` })
        setDeleteTarget(null)
      },
    })
  }

  const renderContent = () => {
    if (suppliersQuery.isPending) {
      return <TableSkeleton label="Memuat supplier..." rows={3} />
    }
    if (suppliersQuery.isError) {
      return (
        <ErrorState
          title="Supplier tidak dapat dimuat"
          description={getApiErrorMessage(suppliersQuery.error)}
          onRetry={() => void suppliersQuery.refetch()}
        />
      )
    }
    if (suppliersQuery.data.length === 0) {
      return (
        <EmptyState
          icon={Truck}
          title="Belum ada supplier"
          description="Tambahkan supplier sebelum mencatat pembelian barang."
        />
      )
    }
    return (
      <SupplierTable
        suppliers={suppliersQuery.data}
        pendingSupplierId={updateMutation.isPending ? updateMutation.variables.id : null}
        onEdit={openForm}
        onToggleActive={handleToggleActive}
        onDelete={openDeleteDialog}
      />
    )
  }

  return (
    <section className="flex flex-col gap-4" aria-label="Daftar supplier">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Supplier yang sudah dipakai pembelian tidak bisa dihapus; nonaktifkan agar tidak bisa dipilih lagi.
        </p>
        <Button onClick={() => openForm(null)}>
          <Plus data-icon="inline-start" aria-hidden />
          Tambah supplier
        </Button>
      </div>

      <ActionNotice notice={notice} />
      {renderContent()}

      <SupplierFormDialog
        open={formDialog.open}
        onOpenChange={(open) => setFormDialog((current) => ({ ...current, open }))}
        supplier={formDialog.supplier}
        onSaved={handleSaved}
      />
      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Hapus supplier?"
        description={`Supplier "${deleteTarget?.name ?? ""}" akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.`}
        confirmLabel="Hapus"
        onConfirm={confirmDelete}
        isPending={deleteMutation.isPending}
        errorMessage={deleteMutation.isError ? getApiErrorMessage(deleteMutation.error) : null}
      />
    </section>
  )
}
