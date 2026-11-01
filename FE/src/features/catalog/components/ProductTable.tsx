import { Pencil, Power, PowerOff, Trash2 } from "lucide-react"
import { IconActionButton } from "@/components/shared/IconActionButton"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Product } from "@/types/catalog"
import { formatRupiah } from "@/utils/format-currency"

type ProductTableProps = {
  products: Product[]
  pendingProductId: number | null
  canDelete: boolean
  onEdit: (product: Product) => void
  onToggleActive: (product: Product) => void
  onDelete: (product: Product) => void
}

// Teks rata kiri, angka dan harga rata kanan (PROJECT-CONTEXT.md bagian 4, Aturan UI).
export function ProductTable({
  products,
  pendingProductId,
  canDelete,
  onEdit,
  onToggleActive,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">SKU</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead className="text-right">Harga jual</TableHead>
            <TableHead className="text-right">Harga beli</TableHead>
            <TableHead className="text-right">Stok</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="pr-4 text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const isPending = pendingProductId === product.id
            const toggleLabel = product.isActive ? "Nonaktifkan" : "Aktifkan"
            return (
              <TableRow key={product.id}>
                <TableCell className="pl-4 tabular-nums text-muted-foreground">{product.sku}</TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  {product.category.name}
                  {!product.category.isActive && <span className="text-muted-foreground"> (nonaktif)</span>}
                </TableCell>
                <TableCell className="text-right tabular-nums">{formatRupiah(product.sellPrice)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatRupiah(product.costPrice)}</TableCell>
                <TableCell className="text-right tabular-nums">{product.stockQty}</TableCell>
                <TableCell>
                  <StatusBadge isActive={product.isActive} />
                </TableCell>
                <TableCell className="pr-4">
                  <div className="flex justify-end gap-1">
                    <IconActionButton
                      icon={Pencil}
                      label="Ubah"
                      accessibleLabel={`Ubah ${product.name}`}
                      onClick={() => onEdit(product)}
                      disabled={isPending}
                    />
                    <IconActionButton
                      icon={product.isActive ? PowerOff : Power}
                      label={toggleLabel}
                      accessibleLabel={`${toggleLabel} ${product.name}`}
                      onClick={() => onToggleActive(product)}
                      disabled={isPending}
                    />
                    {canDelete && (
                      <IconActionButton
                        icon={Trash2}
                        label="Hapus"
                        accessibleLabel={`Hapus ${product.name}`}
                        onClick={() => onDelete(product)}
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
