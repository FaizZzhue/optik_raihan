import { History, Pencil, Power, PowerOff, Trash2 } from "lucide-react"
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
  onShowStock: (product: Product) => void
}

// Teks rata kiri, angka dan harga rata kanan (PROJECT-CONTEXT.md bagian 4, Aturan UI).
export function ProductTable({
  products,
  pendingProductId,
  canDelete,
  onEdit,
  onToggleActive,
  onDelete,
  onShowStock,
}: ProductTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="pl-4">SKU</TableHead>
            <TableHead>Nama & Spesifikasi Barang</TableHead>
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
                <TableCell className="pl-4 align-top">
                  <span className="inline-block rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-medium tabular-nums text-foreground">
                    {product.sku}
                  </span>
                </TableCell>
                <TableCell className="max-w-xs align-top">
                  <div className="font-medium text-foreground">{product.name}</div>
                  {product.description && (
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground" title={product.description}>
                      {product.description}
                    </p>
                  )}
                </TableCell>
                <TableCell className="align-top">
                  <span className="inline-flex items-center rounded-md border border-border/80 bg-background px-2 py-0.5 text-xs font-medium">
                    {product.category.name}
                  </span>
                  {!product.category.isActive && <span className="ml-1 text-xs text-muted-foreground">(nonaktif)</span>}
                </TableCell>
                <TableCell className="align-top text-right font-medium tabular-nums">
                  {formatRupiah(product.sellPrice)}
                </TableCell>
                <TableCell className="align-top text-right tabular-nums text-muted-foreground">
                  {formatRupiah(product.costPrice)}
                </TableCell>
                <TableCell className="align-top text-right tabular-nums">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums ${
                      product.stockQty > 0
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {product.stockQty} pcs
                  </span>
                </TableCell>
                <TableCell className="align-top">
                  <StatusBadge isActive={product.isActive} />
                </TableCell>
                <TableCell className="pr-4 align-top">
                  <div className="flex justify-end gap-1">
                    <IconActionButton
                      icon={History}
                      label="Riwayat stok"
                      accessibleLabel={`Riwayat stok ${product.name}`}
                      onClick={() => onShowStock(product)}
                    />
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
