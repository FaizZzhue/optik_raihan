import { useState } from "react"
import { Controller, useForm, useWatch, type Control, type UseFormRegister } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormField } from "@/components/shared/FormField"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Category, Product } from "@/types/catalog"
import { getApiErrorMessage } from "@/utils/api-error"
import { formatRupiah } from "@/utils/format-currency"
import { applyApiFieldErrors } from "@/utils/form-errors"
import { useCreateProduct, useUpdateProduct } from "../hooks/use-products"
import {
  EMPTY_PRODUCT_FORM,
  productFormSchema,
  toProductFormValues,
  toProductPayload,
  type ProductFormValues,
} from "../schemas"

const FORM_FIELDS = ["name", "categoryId", "sellPrice", "costPrice", "description"] as const

type ProductFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  // null = tambah barang baru.
  product: Product | null
  categories: Category[]
  onSaved: (product: Product) => void
}

export function ProductFormDialog({ open, onOpenChange, product, categories, onSaved }: ProductFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{product ? `Ubah barang ${product.sku}` : "Tambah barang"}</DialogTitle>
          <DialogDescription>
            {product
              ? "Stok tidak diubah di sini; stok hanya berubah lewat pembelian, penjualan, atau stock opname."
              : "SKU dibuat otomatis dan stok awal 0. Stok masuk lewat pembelian atau stock opname."}
          </DialogDescription>
        </DialogHeader>
        {/* Form dipasang ulang setiap dialog dibuka (DialogContent dilepas saat tertutup), jadi isinya selalu segar. */}
        <ProductForm product={product} categories={categories} onSaved={onSaved} />
      </DialogContent>
    </Dialog>
  )
}

type ProductFormProps = Pick<ProductFormDialogProps, "product" | "categories" | "onSaved">

function ProductForm({ product, categories, onSaved }: ProductFormProps) {
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product ? toProductFormValues(product) : EMPTY_PRODUCT_FORM,
  })
  const isPending = createMutation.isPending || updateMutation.isPending

  // Barang baru hanya boleh memakai kategori aktif; kategori nonaktif milik barang yang diedit tetap ditampilkan.
  const categoryOptions = categories.filter(
    (category) => category.isActive || category.id === product?.category.id,
  )
  const hasActiveCategory = categories.some((category) => category.isActive)

  const onSubmit = handleSubmit((values) => {
    setFormError(null)
    const callbacks = {
      onSuccess: onSaved,
      onError: (error: unknown) => {
        if (!applyApiFieldErrors(error, setError, FORM_FIELDS)) {
          setFormError(getApiErrorMessage(error))
        }
      },
    }
    const payload = toProductPayload(values)
    if (product) {
      updateMutation.mutate({ id: product.id, input: payload }, callbacks)
    } else {
      createMutation.mutate(payload, callbacks)
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <div className="grid grid-cols-2 gap-3 rounded-lg border border-border/80 bg-muted/30 p-3 text-xs">
        <div>
          <span className="text-muted-foreground">SKU Internal</span>
          <p className="mt-0.5 font-mono font-semibold text-foreground">
            {product ? product.sku : "Otomatis (P-XXXXXX)"}
          </p>
        </div>
        <div>
          <span className="text-muted-foreground">Saldo Stok Saat Ini</span>
          <p className="mt-0.5 font-semibold tabular-nums text-foreground">
            {product ? `${product.stockQty} pcs (hanya-baca)` : "0 pcs (stok awal)"}
          </p>
        </div>
      </div>

      {formError && (
        <Alert variant="destructive">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      {!product && !hasActiveCategory && (
        <Alert>
          <AlertDescription>Belum ada kategori aktif. Owner perlu menambah kategori terlebih dahulu.</AlertDescription>
        </Alert>
      )}

      <FormField
        id="product-name"
        label="Nama barang"
        hint="Contoh: Frame Metal Oval Hitam, Lensa Minus -1.50 CRMC, atau Kacamata Baca +1.50"
        error={errors.name?.message}
      >
        {(aria) => <Input id="product-name" autoFocus maxLength={150} {...aria} {...register("name")} />}
      </FormField>

      <FormField id="product-category" label="Kategori" error={errors.categoryId?.message}>
        {(aria) => (
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="product-category" className="w-full" onBlur={field.onBlur} {...aria}>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.isActive ? category.name : `${category.name} (nonaktif)`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <PriceField
          id="product-sell-price"
          label="Harga jual"
          name="sellPrice"
          control={control}
          register={register}
          error={errors.sellPrice?.message}
        />
        <PriceField
          id="product-cost-price"
          label="Harga beli"
          name="costPrice"
          control={control}
          register={register}
          error={errors.costPrice?.message}
        />
      </div>

      <FormField
        id="product-description"
        label="Deskripsi / Kode Referensi Supplier (opsional)"
        hint="Catat spesifikasi model, ukuran dioptri, atau kode barang dari faktur supplier sebagai referensi."
        error={errors.description?.message}
      >
        {(aria) => (
          <Textarea id="product-description" rows={3} maxLength={1000} {...aria} {...register("description")} />
        )}
      </FormField>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={isPending}>
            Batal
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isPending || (!product && !hasActiveCategory)}>
          {isPending ? "Menyimpan..." : "Simpan"}
        </Button>
      </DialogFooter>
    </form>
  )
}

type PriceFieldProps = {
  id: string
  label: string
  name: "sellPrice" | "costPrice"
  control: Control<ProductFormValues>
  register: UseFormRegister<ProductFormValues>
  error: string | undefined
}

// Input angka bulat dengan pratinjau format Rupiah, agar salah ketik digit terlihat sebelum disimpan.
function PriceField({ id, label, name, control, register, error }: PriceFieldProps) {
  const value = useWatch({ control, name })
  const preview = /^\d{1,12}$/.test(value) ? formatRupiah(value) : "Contoh: 1250000"

  return (
    <FormField id={id} label={label} error={error} hint={preview}>
      {(aria) => (
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>Rp</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput id={id} inputMode="numeric" autoComplete="off" {...aria} {...register(name)} />
        </InputGroup>
      )}
    </FormField>
  )
}
