import { useState } from "react"
import { Plus, Search, SearchX, Tags } from "lucide-react"
import { ActionNotice, type Notice } from "@/components/shared/ActionNotice"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { EmptyState } from "@/components/shared/EmptyState"
import { ErrorState } from "@/components/shared/ErrorState"
import { TableSkeleton } from "@/components/shared/TableSkeleton"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { STATUS_FILTER_LABELS, STATUS_FILTERS, type StatusFilter } from "@/constants/status-filter.constants"
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
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(STATUS_FILTERS.ALL)
  const [formDialog, setFormDialog] = useState<FormDialogState>({ open: false, category: null })
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  // Hasil aksi terakhir; sukses hanya ditulis setelah BE membalas.
  const [notice, setNotice] = useState<Notice | null>(null)

  const allCategories = categoriesQuery.data ?? []
  const activeCount = allCategories.filter((c) => c.isActive).length
  const totalProducts = allCategories.reduce((sum, c) => sum + c.productCount, 0)

  const normalizedSearch = search.trim().toLowerCase()
  const filteredCategories = allCategories.filter((category) => {
    const matchesStatus =
      statusFilter === STATUS_FILTERS.ALL
        ? true
        : statusFilter === STATUS_FILTERS.ACTIVE
          ? category.isActive
          : !category.isActive
    const matchesSearch = !normalizedSearch || category.name.toLowerCase().includes(normalizedSearch)
    return matchesStatus && matchesSearch
  })
  const isFiltered = Boolean(normalizedSearch) || statusFilter !== STATUS_FILTERS.ALL

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
    if (allCategories.length === 0) {
      return (
        <EmptyState
          icon={Tags}
          title="Belum ada kategori"
          description="Tambahkan kategori seperti frame, lensa jadi, atau kacamata jadi sebelum menambah barang."
        />
      )
    }
    if (filteredCategories.length === 0 && isFiltered) {
      return (
        <EmptyState
          icon={SearchX}
          title="Tidak ada kategori yang cocok"
          description="Ubah kata kunci pencarian atau filter status untuk melihat kategori lain."
        />
      )
    }
    return (
      <CategoryTable
        categories={filteredCategories}
        pendingCategoryId={updateMutation.isPending ? updateMutation.variables.id : null}
        onEdit={openForm}
        onToggleActive={handleToggleActive}
        onDelete={openDeleteDialog}
      />
    )
  }

  return (
    <section className="flex flex-col gap-4" aria-label="Daftar kategori">
      {!categoriesQuery.isPending && !categoriesQuery.isError && allCategories.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border bg-card px-4 py-3">
            <p className="text-xs text-muted-foreground">Total Kategori</p>
            <p className="font-serif text-xl font-semibold tabular-nums">{allCategories.length}</p>
          </div>
          <div className="rounded-xl border bg-card px-4 py-3">
            <p className="text-xs text-muted-foreground">Status Kategori</p>
            <p className="text-sm font-medium tabular-nums">
              <span className="text-success">{activeCount} aktif</span>
              <span className="text-muted-foreground"> · {allCategories.length - activeCount} nonaktif</span>
            </p>
          </div>
          <div className="rounded-xl border bg-card px-4 py-3">
            <p className="text-xs text-muted-foreground">Total Barang Terhubung</p>
            <p className="font-serif text-xl font-semibold tabular-nums">{totalProducts} model</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <InputGroup className="sm:w-64">
            <InputGroupAddon>
              <Search aria-hidden />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama kategori"
              aria-label="Cari kategori"
              maxLength={100}
            />
          </InputGroup>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
            <SelectTrigger className="w-full sm:w-40" aria-label="Filter status kategori">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(STATUS_FILTERS).map((value) => (
                <SelectItem key={value} value={value}>
                  {STATUS_FILTER_LABELS[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Kategori yang sudah dipakai barang tidak bisa dihapus; nonaktifkan agar tidak dipilih lagi.
          </p>
        </div>
        <Button onClick={() => openForm(null)} className="self-start lg:self-auto">
          <Plus data-icon="inline-start" aria-hidden />
          Tambah kategori
        </Button>
      </div>

      <ActionNotice notice={notice} />

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
