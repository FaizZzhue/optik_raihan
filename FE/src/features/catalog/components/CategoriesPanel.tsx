import { useState } from "react"
import { Plus, Tags } from "lucide-react"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { EmptyState } from "@/components/shared/EmptyState"
import { ErrorState } from "@/components/shared/ErrorState"
import { TableSkeleton } from "@/components/shared/TableSkeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import type { Category } from "@/types/catalog"
import { getApiErrorMessage } from "@/utils/api-error"
import { useCategories, useDeleteCategory, useUpdateCategory } from "../hooks/use-categories"
import { CategoryFormDialog } from "./CategoryFormDialog"
import { CategoryTable } from "./CategoryTable"

type FormDialogState = { open: boolean; category: Category | null }

export function CategoriesPanel() {
  const categoriesQuery = useCategories()
  const updateMutation = useUpdateCategory()
  const deleteMutation = useDeleteCategory()
  const [formDialog, setFormDialog] = useState<FormDialogState>({ open: false, category: null })
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  // Hasil aksi terakhir; sukses hanya ditulis setelah BE membalas.
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const openForm = (category: Category | null) => {
    setNotice(null)
    setFormDialog({ open: true, category })
  }

  const handleSaved = (category: Category) => {
    setNotice({ type: "success", message: `Kategori "${category.name}" disimpan.` })
    setFormDialog((current) => ({ ...current, open: false }))
  }

  const handleToggleActive = (category: Category) => {
    setNotice(null)
    updateMutation.mutate(
      { id: category.id, input: { isActive: !category.isActive } },
      {
        onSuccess: (updated) =>
          setNotice({
            type: "success",
            message: `Kategori "${updated.name}" ${updated.isActive ? "diaktifkan" : "dinonaktifkan"}.`,
          }),
        onError: (error) => setNotice({ type: "error", message: getApiErrorMessage(error) }),
      },
    )
  }

  const openDeleteDialog = (category: Category) => {
    setNotice(null)
    deleteMutation.reset()
    setDeleteTarget(category)
  }

  const confirmDelete = () => {
    if (!deleteTarget) {
      return
    }
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        setNotice({ type: "success", message: `Kategori "${deleteTarget.name}" dihapus.` })
        setDeleteTarget(null)
      },
    })
  }

  const renderContent = () => {
    if (categoriesQuery.isPending) {
      return <TableSkeleton label="Memuat kategori..." rows={3} />
    }
    if (categoriesQuery.isError) {
      return (
        <ErrorState
          title="Kategori tidak dapat dimuat"
          description={getApiErrorMessage(categoriesQuery.error)}
          onRetry={() => void categoriesQuery.refetch()}
        />
      )
    }
    if (categoriesQuery.data.length === 0) {
      return (
        <EmptyState
          icon={Tags}
          title="Belum ada kategori"
          description="Tambahkan kategori seperti frame, lensa jadi, atau kacamata jadi sebelum menambah barang."
        />
      )
    }
    return (
      <CategoryTable
        categories={categoriesQuery.data}
        pendingCategoryId={updateMutation.isPending ? updateMutation.variables.id : null}
        onEdit={openForm}
        onToggleActive={handleToggleActive}
        onDelete={openDeleteDialog}
      />
    )
  }

  return (
    <section className="flex flex-col gap-4" aria-label="Daftar kategori">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Kategori yang sudah dipakai barang tidak bisa dihapus; nonaktifkan agar tidak bisa dipilih untuk barang baru.
        </p>
        <Button onClick={() => openForm(null)}>
          <Plus data-icon="inline-start" aria-hidden />
          Tambah kategori
        </Button>
      </div>

      {notice && (
        <Alert variant={notice.type === "error" ? "destructive" : "default"} role={notice.type === "error" ? "alert" : "status"}>
          <AlertDescription>{notice.message}</AlertDescription>
        </Alert>
      )}

      {renderContent()}

      <CategoryFormDialog
        open={formDialog.open}
        onOpenChange={(open) => setFormDialog((current) => ({ ...current, open }))}
        category={formDialog.category}
        onSaved={handleSaved}
      />
      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Hapus kategori?"
        description={`Kategori "${deleteTarget?.name ?? ""}" akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.`}
        confirmLabel="Hapus"
        onConfirm={confirmDelete}
        isPending={deleteMutation.isPending}
        errorMessage={deleteMutation.isError ? getApiErrorMessage(deleteMutation.error) : null}
      />
    </section>
  )
}
