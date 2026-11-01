import { useState } from "react"
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Trash2 } from "lucide-react"
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
import { applyApiFieldErrors } from "@/utils/form-errors"
import { useCreatePurchase } from "../hooks/use-purchases"
import { useSuppliers } from "../hooks/use-suppliers"
import { EMPTY_PURCHASE_FORM, purchaseFormSchema, toPurchasePayload, type PurchaseFormValues } from "../schemas"
import { ProductPicker } from "./ProductPicker"

// Pratinjau saja; total resmi dihitung BE (BR-04). BigInt agar perkalian Rupiah bulat tidak kehilangan presisi.
function previewLineTotal(quantity: string, unitCost: string): bigint | null {
  return /^\d+$/.test(quantity) && /^\d+$/.test(unitCost) ? BigInt(quantity) * BigInt(unitCost) : null
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
  const activeSuppliers = (suppliersQuery.data ?? []).filter((supplier) => supplier.isActive)
  const previewTotal = items.reduce((sum, item) => sum + (previewLineTotal(item.quantity, item.unitCost) ?? 0n), 0n)

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

      <div className="grid gap-4 rounded-xl border bg-card p-4 md:grid-cols-2">
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
        <FormField id="purchase-invoice" label="Nomor faktur supplier (opsional)" error={errors.supplierInvoiceNo?.message}>
          {(aria) => <Input id="purchase-invoice" maxLength={50} {...aria} {...register("supplierInvoiceNo")} />}
        </FormField>
        <div className="md:col-span-2">
          <FormField id="purchase-notes" label="Catatan (opsional)" error={errors.notes?.message}>
            {(aria) => <Textarea id="purchase-notes" rows={2} maxLength={1000} {...aria} {...register("notes")} />}
          </FormField>
        </div>
      </div>

      <section className="flex flex-col gap-3" aria-labelledby="purchase-items-title">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="purchase-items-title" className="text-base font-semibold">
            Barang dibeli
          </h2>
          <ProductPicker
            selectedProductIds={items.map((item) => item.productId)}
            onSelect={(product) =>
              append({ productId: product.id, productLabel: `${product.sku} · ${product.name}`, quantity: "1", unitCost: "" })
            }
          />
        </div>
        {errors.items?.root?.message || errors.items?.message ? (
          <p role="alert" className="text-sm text-destructive">
            {errors.items.root?.message ?? errors.items.message}
          </p>
        ) : null}

        {fields.length > 0 && (
          <div className="rounded-xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Barang</TableHead>
                  <TableHead className="w-28">Jumlah</TableHead>
                  <TableHead className="w-48">Harga beli satuan</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="pr-4 text-right">
                    <span className="sr-only">Aksi</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => {
                  const itemErrors = errors.items?.[index]
                  const lineTotal = previewLineTotal(items[index]?.quantity ?? "", items[index]?.unitCost ?? "")
                  return (
                    <TableRow key={field.id} className="align-top">
                      <TableCell className="min-w-48 pl-4 pt-3 font-medium whitespace-normal">
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
                          <p className="mt-1 text-sm whitespace-normal text-destructive">{itemErrors.quantity.message}</p>
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
                        {itemErrors?.unitCost?.message && (
                          <p className="mt-1 text-sm whitespace-normal text-destructive">{itemErrors.unitCost.message}</p>
                        )}
                      </TableCell>
                      <TableCell className="pt-3 text-right tabular-nums">
                        {lineTotal === null ? "—" : formatRupiah(lineTotal.toString())}
                      </TableCell>
                      <TableCell className="pr-4">
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

      <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm">
          <span className="text-muted-foreground">Perkiraan total: </span>
          <span className="font-semibold tabular-nums">{formatRupiah(previewTotal.toString())}</span>
          <span className="block text-xs text-muted-foreground">Total resmi dihitung sistem saat disimpan.</span>
        </p>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => navigate("/pembelian")} disabled={createMutation.isPending}>
            Batal
          </Button>
          <Button type="submit" disabled={createMutation.isPending || activeSuppliers.length === 0}>
            {createMutation.isPending ? "Menyimpan..." : "Simpan pembelian"}
          </Button>
        </div>
      </div>
    </form>
  )
}
