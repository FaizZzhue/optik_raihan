import { useMemo, useState } from "react"
import { Plus, Search, SearchX, Truck } from "lucide-react"
import { ActionNotice, type Notice } from "@/components/shared/ActionNotice"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { EmptyState } from "@/components/shared/EmptyState"
import { ErrorState } from "@/components/shared/ErrorState"
import { TableSkeleton } from "@/components/shared/TableSkeleton"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { STATUS_FILTER_LABELS, STATUS_FILTERS, type StatusFilter } from "@/constants/status-filter.constants"
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
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(STATUS_FILTERS.ALL)

  const suppliers = useMemo(() => suppliersQuery.data ?? [], [suppliersQuery.data])
  const activeCount = useMemo(() => suppliers.filter((s) => s.isActive).length, [suppliers])
  const inactiveCount = suppliers.length - activeCount

  const filteredSuppliers = useMemo(() => {
    const q = search.trim().toLowerCase()
    return suppliers.filter((supplier) => {
      if (statusFilter === STATUS_FILTERS.ACTIVE && !supplier.isActive) return false
      if (statusFilter === STATUS_FILTERS.INACTIVE && supplier.isActive) return false
      if (!q) return true
      return (
        supplier.name.toLowerCase().includes(q) ||
        (supplier.phone ?? "").toLowerCase().includes(q) ||
        (supplier.address ?? "").toLowerCase().includes(q) ||
        (supplier.notes ?? "").toLowerCase().includes(q)
      )
    })
  }, [suppliers, search, statusFilter])

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
    if (suppliers.length === 0) {
      return (
        <EmptyState
          icon={Truck}
          title="Belum ada supplier"
          description="Tambahkan supplier sebelum mencatat pembelian barang."
        />
      )
    }
    if (filteredSuppliers.length === 0) {
      return (
        <EmptyState
          icon={SearchX}
          title="Tidak ada supplier yang cocok"
          description="Ubah kata kunci pencarian atau filter status."
        />
      )
    }
    return (
      <SupplierTable
        suppliers={filteredSuppliers}
        pendingSupplierId={updateMutation.isPending ? updateMutation.variables.id : null}
        onEdit={openForm}
        onToggleActive={handleToggleActive}
        onDelete={openDeleteDialog}
      />
    )
  }

  return (
    <section className="flex flex-col gap-5" aria-label="Daftar supplier">
      {!suppliersQuery.isPending && !suppliersQuery.isError && (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-4 shadow-xs">
            <p className="text-xs font-medium text-muted-foreground">Total Pemasok Terdaftar</p>
            <p className="mt-1 font-serif text-2xl font-semibold tabular-nums">{suppliers.length}</p>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-xs">
            <p className="text-xs font-medium text-muted-foreground">Supplier Aktif</p>
            <p className="mt-1 font-serif text-2xl font-semibold tabular-nums text-primary">{activeCount}</p>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-xs">
            <p className="text-xs font-medium text-muted-foreground">Supplier Nonaktif</p>
            <p className="mt-1 font-serif text-2xl font-semibold tabular-nums text-muted-foreground">
              {inactiveCount}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <InputGroup className="sm:w-72">
            <InputGroupAddon>
              <Search aria-hidden />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama, telepon, alamat, catatan..."
              aria-label="Cari supplier"
              maxLength={100}
            />
          </InputGroup>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
            <SelectTrigger className="w-full sm:w-44" aria-label="Filter status supplier">
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
        </div>

        <Button onClick={() => openForm(null)} className="self-start sm:self-auto">
          <Plus data-icon="inline-start" aria-hidden />
          Tambah supplier
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Supplier yang sudah dipakai dalam faktur pembelian tidak bisa dihapus untuk menjaga integritas arsip; gunakan{" "}
        <span className="font-medium text-foreground">Nonaktifkan</span> agar tidak dapat dipilih pada pembelian baru.
      </p>

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
