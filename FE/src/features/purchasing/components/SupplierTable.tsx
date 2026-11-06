import { Pencil, Power, PowerOff, Trash2 } from "lucide-react"
import { IconActionButton } from "@/components/shared/IconActionButton"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Supplier } from "@/types/purchasing"

type SupplierTableProps = {
  suppliers: Supplier[]
  pendingSupplierId: number | null
  onEdit: (supplier: Supplier) => void
  onToggleActive: (supplier: Supplier) => void
  onDelete: (supplier: Supplier) => void
}

export function SupplierTable({ suppliers, pendingSupplierId, onEdit, onToggleActive, onDelete }: SupplierTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="pl-4">Nama Supplier</TableHead>
            <TableHead>Telepon</TableHead>
            <TableHead>Alamat</TableHead>
            <TableHead>Catatan / Kontak</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="pr-4 text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier) => {
            const isPending = pendingSupplierId === supplier.id
            const toggleLabel = supplier.isActive ? "Nonaktifkan" : "Aktifkan"
            return (
              <TableRow key={supplier.id}>
                <TableCell className="pl-4 font-medium text-foreground">{supplier.name}</TableCell>
                <TableCell className="tabular-nums text-muted-foreground">{supplier.phone ?? "—"}</TableCell>
                <TableCell className="max-w-56 truncate text-muted-foreground" title={supplier.address ?? undefined}>
                  {supplier.address ?? "—"}
                </TableCell>
                <TableCell className="max-w-56 truncate text-xs text-muted-foreground" title={supplier.notes ?? undefined}>
                  {supplier.notes ?? "—"}
                </TableCell>
                <TableCell>
                  <StatusBadge isActive={supplier.isActive} />
                </TableCell>
                <TableCell className="pr-4">
                  <div className="flex justify-end gap-1">
                    <IconActionButton
                      icon={Pencil}
                      label="Ubah"
                      accessibleLabel={`Ubah ${supplier.name}`}
                      onClick={() => onEdit(supplier)}
                      disabled={isPending}
                    />
                    <IconActionButton
                      icon={supplier.isActive ? PowerOff : Power}
                      label={toggleLabel}
                      accessibleLabel={`${toggleLabel} ${supplier.name}`}
                      onClick={() => onToggleActive(supplier)}
                      disabled={isPending}
                    />
                    <IconActionButton
                      icon={Trash2}
                      label="Hapus"
                      accessibleLabel={`Hapus ${supplier.name}`}
                      onClick={() => onDelete(supplier)}
                      disabled={isPending}
                      destructive
                    />
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
