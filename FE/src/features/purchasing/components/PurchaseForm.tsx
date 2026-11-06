import { useState } from "react"
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileSpreadsheet, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { FormField } from "@/components/shared/FormField"
import { IconActionButton } from "@/components/shared/IconActionButton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { getApiErrorMessage } from "@/utils/api-error"
import { formatRupiah } from "@/utils/format-currency"
import { formatDateShort } from "@/utils/format-date"
import { applyApiFieldErrors } from "@/utils/form-errors"
import { useCreatePurchase } from "../hooks/use-purchases"
import { useSuppliers } from "../hooks/use-suppliers"
import { EMPTY_PURCHASE_FORM, purchaseFormSchema, toPurchasePayload, type PurchaseFormValues } from "../schemas"
import { ProductPicker } from "./ProductPicker"

// Pratinjau saja; total resmi dihitung BE (BR-04). BigInt agar perkalian Rupiah bulat tidak kehilangan presisi.
function previewLineTotal(quantity: string, unitCost: string): bigint | null {
  return /^\d+$/.test(quantity) && /^\d+$/.test(unitCost) ? BigInt(quantity) * BigInt(unitCost) : null
}

function parsePositiveInt(value: string): number {
  return /^\d+$/.test(value) ? Number(value) : 0
}

export function PurchaseForm() {
  const navigate = useNavigate()
  const suppliersQuery = useSuppliers()
  const createMutation = useCreatePurchase()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<PurchaseFormValues>({ resolver: zodResolver(purchaseFormSchema), defaultValues: EMPTY_PURCHASE_FORM })
  const { fields, append, remove } = useFieldArray({ control, name: "items" })
  const items = useWatch({ control, name: "items" })
  const selectedSupplierId = useWatch({ control, name: "supplierId" })
  const activeSuppliers = (suppliersQuery.data ?? []).filter((supplier) => supplier.isActive)
  const selectedSupplier = activeSuppliers.find((s) => String(s.id) === selectedSupplierId) ?? null

  const previewTotal = items.reduce((sum, item) => sum + (previewLineTotal(item.quantity, item.unitCost) ?? 0n), 0n)
  const totalQuantity = items.reduce((sum, item) => sum + parsePositiveInt(item.quantity ?? ""), 0)
  const todayLabel = formatDateShort(new Date().toISOString())

  const onSubmit = handleSubmit((values) => {
    setFormError(null)
    createMutation.mutate(toPurchasePayload(values), {
      // Detail ditampilkan setelah BE menyimpan; total di sana adalah hasil hitung BE.
      onSuccess: (purchase) => navigate(`/pembelian/${purchase.id}`, { state: { created: true } }),
      onError: (error) => {
        const fieldNames = ["supplierId", ...values.items.flatMap((_, index) => [
          `items.${index}.productId`,
          `items.${index}.quantity`,
          `items.${index}.unitCost`,
        ] as const)] as const
        if (!applyApiFieldErrors(error, setError, fieldNames)) {
          setFormError(getApiErrorMessage(error))
        }
      },
    })
  })

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      {formError && (
        <Alert variant="destructive">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      {suppliersQuery.isSuccess && activeSuppliers.length === 0 && (
        <Alert>
          <AlertDescription>Belum ada supplier aktif. Tambahkan supplier di menu Supplier terlebih dahulu.</AlertDescription>
        </Alert>
      )}

      {/* Bagian Header Faktur Pembelian */}
      <div className="rounded-xl border bg-card p-5 shadow-xs">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3">
          <div>
            <h2 className="font-serif text-lg font-medium">Header Faktur Pembelian</h2>
            <p className="text-xs text-muted-foreground">
              Gunakan informasi pada bagian atas faktur dari supplier sebagai referensi pencatatan.
            </p>
          </div>
          <div className="rounded-lg border border-border/80 bg-muted/40 px-3 py-1.5 text-right text-xs">
            <span className="text-muted-foreground">Tanggal Pembelian: </span>
            <span className="font-medium tabular-nums text-foreground">{todayLabel} (Otomatis)</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <FormField id="purchase-supplier" label="Supplier" error={errors.supplierId?.message}>
              {(aria) => (
                <Controller
                  control={control}
                  name="supplierId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange} disabled={suppliersQuery.isPending}>
                      <SelectTrigger id="purchase-supplier" className="w-full" onBlur={field.onBlur} {...aria}>
                        <SelectValue placeholder={suppliersQuery.isPending ? "Memuat supplier..." : "Pilih supplier"} />
                      </SelectTrigger>
                      <SelectContent>
                        {activeSuppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={String(supplier.id)}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              )}
            </FormField>
            {selectedSupplier && (
              <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{selectedSupplier.name}</span>
                {selectedSupplier.phone && <span className="ml-2 tabular-nums">· Telp: {selectedSupplier.phone}</span>}
                {selectedSupplier.address && <p className="mt-0.5 truncate">{selectedSupplier.address}</p>}
              </div>
            )}
          </div>

          <FormField
            id="purchase-invoice"
            label="Nomor faktur supplier (opsional)"
            hint="Salin nomor transaksi/faktur dari nota fisik supplier (contoh: 0019/JL/RBT/0525)."
            error={errors.supplierInvoiceNo?.message}
          >
            {(aria) => (
              <Input
                id="purchase-invoice"
                placeholder="Contoh: 0019/JL/RBT/0525"
                maxLength={50}
                {...aria}
                {...register("supplierInvoiceNo")}
              />
            )}
          </FormField>

          <div className="md:col-span-2">
            <FormField
              id="purchase-notes"
              label="Catatan (opsional)"
              hint="Catat keterangan pengiriman, kondisi barang, atau kode item supplier bila diperlukan."
              error={errors.notes?.message}
            >
              {(aria) => <Textarea id="purchase-notes" rows={2} maxLength={1000} {...aria} {...register("notes")} />}
            </FormField>
          </div>
        </div>
      </div>

      {/* Bagian Detail Item Faktur */}
      <section className="flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-xs" aria-labelledby="purchase-items-title">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3">
          <div>
            <h2 id="purchase-items-title" className="font-serif text-lg font-medium">
              Barang dibeli
            </h2>
            <p className="text-xs text-muted-foreground">
              Pilih produk internal Optik Raihan, lalu masukkan kuantitas (pcs) dan harga beli satuan sesuai faktur.
            </p>
          </div>
          <ProductPicker
            selectedProductIds={items.map((item) => item.productId)}
            onSelect={(product) =>
              append({
                productId: product.id,
                productLabel: `${product.sku} · ${product.name}`,
                quantity: "1",
                unitCost: "",
              })
            }
          />
        </div>

        {errors.items?.root?.message || errors.items?.message ? (
          <p role="alert" className="text-sm text-destructive">
            {errors.items.root?.message ?? errors.items.message}
          </p>
        ) : null}

        {fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/80 bg-muted/20 py-10 text-center">
            <FileSpreadsheet className="size-7 text-muted-foreground" aria-hidden />
            <p className="text-sm font-medium">Belum ada baris barang pada faktur ini</p>
            <p className="max-w-md text-xs text-muted-foreground">
              Klik tombol <span className="font-medium text-foreground">Tambah barang</span> di kanan atas untuk mencari
              dan memasukkan barang yang tercantum pada faktur supplier.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border bg-background">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-12 pl-4">No.</TableHead>
                  <TableHead>Barang (SKU Internal · Nama Produk)</TableHead>
                  <TableHead className="w-32">Jumlah (pcs)</TableHead>
                  <TableHead className="w-52">Harga beli satuan (Rp)</TableHead>
                  <TableHead className="text-right">Total Item</TableHead>
                  <TableHead className="w-14 pr-4 text-right">
                    <span className="sr-only">Aksi</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => {
                  const itemErrors = errors.items?.[index]
                  const currentQty = items[index]?.quantity ?? ""
                  const currentUnitCost = items[index]?.unitCost ?? ""
                  const lineTotal = previewLineTotal(currentQty, currentUnitCost)
                  const unitCostPreview = /^\d{1,12}$/.test(currentUnitCost) ? formatRupiah(currentUnitCost) : null

                  return (
                    <TableRow key={field.id} className="align-top">
                      <TableCell className="pl-4 pt-3.5 font-mono text-xs tabular-nums text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="min-w-48 pt-3 font-medium whitespace-normal">
                        {field.productLabel}
                        {itemErrors?.productId?.message && (
                          <p className="text-sm font-normal text-destructive">{itemErrors.productId.message}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Input
                          inputMode="numeric"
                          aria-label={`Jumlah ${field.productLabel}`}
                          aria-invalid={itemErrors?.quantity ? true : undefined}
                          {...register(`items.${index}.quantity`)}
                        />
                        {itemErrors?.quantity?.message && (
                          <p className="mt-1 text-xs whitespace-normal text-destructive">{itemErrors.quantity.message}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Input
                          inputMode="numeric"
                          placeholder="Contoh: 750000"
                          aria-label={`Harga beli satuan ${field.productLabel}`}
                          aria-invalid={itemErrors?.unitCost ? true : undefined}
                          {...register(`items.${index}.unitCost`)}
                        />
                        {unitCostPreview && !itemErrors?.unitCost && (
                          <p className="mt-1 text-[11px] tabular-nums text-muted-foreground">{unitCostPreview}</p>
                        )}
                        {itemErrors?.unitCost?.message && (
                          <p className="mt-1 text-xs whitespace-normal text-destructive">{itemErrors.unitCost.message}</p>
                        )}
                      </TableCell>
                      <TableCell className="pt-3.5 text-right font-semibold tabular-nums">
                        {lineTotal === null ? "—" : formatRupiah(lineTotal.toString())}
                      </TableCell>
                      <TableCell className="pr-4 pt-2">
                        <div className="flex justify-end">
                          <IconActionButton
                            icon={Trash2}
                            label="Hapus baris"
                            accessibleLabel={`Hapus ${field.productLabel} dari daftar`}
                            onClick={() => remove(index)}
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
        )}
      </section>

      {/* Bagian Ringkasan (Summary) Faktur Pembelian */}
      <div className="rounded-xl border bg-card p-5 shadow-xs">
        <div className="grid gap-4 border-b border-border/70 pb-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="text-xs text-muted-foreground">Jumlah Baris Barang</span>
            <p className="mt-0.5 font-serif text-xl font-semibold tabular-nums">{fields.length} baris</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Total Kuantitas</span>
            <p className="mt-0.5 font-serif text-xl font-semibold tabular-nums">{totalQuantity} pcs</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Subtotal Barang</span>
            <p className="mt-0.5 font-serif text-xl font-semibold tabular-nums">{formatRupiah(previewTotal.toString())}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Perkiraan Total Pembelian</span>
            <p className="mt-0.5 font-serif text-xl font-semibold tabular-nums text-primary">
              {formatRupiah(previewTotal.toString())}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Perkiraan total: {formatRupiah(previewTotal.toString())}</span>
            {" · "}Total resmi dihitung ulang oleh server saat transaksi disimpan (BR-04).
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/pembelian")}
              disabled={createMutation.isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={createMutation.isPending || activeSuppliers.length === 0}>
              {createMutation.isPending ? "Menyimpan..." : "Simpan pembelian"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
