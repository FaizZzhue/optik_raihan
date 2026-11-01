import { Pencil, Power, PowerOff, Trash2 } from "lucide-react"
import { IconActionButton } from "@/components/shared/IconActionButton"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Category } from "@/types/catalog"

type CategoryTableProps = {
  categories: Category[]
  // Baris yang sedang diproses (ubah status); tombolnya dinonaktifkan sampai BE membalas.
  pendingCategoryId: number | null
  onEdit: (category: Category) => void
  onToggleActive: (category: Category) => void
  onDelete: (category: Category) => void
}

export function CategoryTable({ categories, pendingCategoryId, onEdit, onToggleActive, onDelete }: CategoryTableProps) {
  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Nama</TableHead>
            <TableHead className="text-right">Jumlah barang</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="pr-4 text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => {
            const isPending = pendingCategoryId === category.id
            return (
              <TableRow key={category.id}>
                <TableCell className="pl-4 font-medium">{category.name}</TableCell>
                <TableCell className="text-right tabular-nums">{category.productCount}</TableCell>
                <TableCell>
                  <StatusBadge isActive={category.isActive} />
                </TableCell>
                <TableCell className="pr-4">
                  <div className="flex justify-end gap-1">
                    <IconActionButton
                      icon={Pencil}
                      label="Ubah"
                      accessibleLabel={`Ubah ${category.name}`}
                      onClick={() => onEdit(category)}
                      disabled={isPending}
                    />
                    <IconActionButton
                      icon={category.isActive ? PowerOff : Power}
                      label={category.isActive ? "Nonaktifkan" : "Aktifkan"}
                      accessibleLabel={`${category.isActive ? "Nonaktifkan" : "Aktifkan"} ${category.name}`}
                      onClick={() => onToggleActive(category)}
                      disabled={isPending}
                    />
                    {/* Kategori yang dipakai barang tidak bisa dihapus (AC-03.2), jadi tombolnya tidak ditampilkan. */}
                    {category.productCount === 0 && (
                      <IconActionButton
                        icon={Trash2}
                        label="Hapus"
                        accessibleLabel={`Hapus ${category.name}`}
                        onClick={() => onDelete(category)}
                        disabled={isPending}
                        destructive
                      />
                    )}
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
