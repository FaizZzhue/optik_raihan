import { useState } from "react"
import { useForm } from "react-hook-form"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Supplier } from "@/types/purchasing"
import { getApiErrorMessage } from "@/utils/api-error"
import { applyApiFieldErrors } from "@/utils/form-errors"
import { useCreateSupplier, useUpdateSupplier } from "../hooks/use-suppliers"
import { supplierFormSchema, toSupplierFormValues, type SupplierFormValues } from "../schemas"

const FORM_FIELDS = ["name", "phone", "address", "notes"] as const

type SupplierFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  // null = tambah supplier baru.
  supplier: Supplier | null
  onSaved: (supplier: Supplier) => void
}

export function SupplierFormDialog({ open, onOpenChange, supplier, onSaved }: SupplierFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{supplier ? "Ubah supplier" : "Tambah supplier"}</DialogTitle>
          <DialogDescription>Supplier aktif dapat dipilih saat mencatat pembelian.</DialogDescription>
        </DialogHeader>
        {/* Form dipasang ulang setiap dialog dibuka (DialogContent dilepas saat tertutup), jadi isinya selalu segar. */}
        <SupplierForm supplier={supplier} onSaved={onSaved} />
      </DialogContent>
    </Dialog>
  )
}

function SupplierForm({ supplier, onSaved }: Pick<SupplierFormDialogProps, "supplier" | "onSaved">) {
  const createMutation = useCreateSupplier()
  const updateMutation = useUpdateSupplier()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: toSupplierFormValues(supplier),
  })
  const isPending = createMutation.isPending || updateMutation.isPending

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
    // Bentuk form sama dengan body API; string kosong menghapus isi field opsional di BE.
    if (supplier) {
      updateMutation.mutate({ id: supplier.id, input: values }, callbacks)
    } else {
      createMutation.mutate(values, callbacks)
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      {formError && (
        <Alert variant="destructive">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      <FormField
        id="supplier-name"
        label="Nama supplier"
        hint="Nama perusahaan atau grosir optik sesuai kop faktur."
        error={errors.name?.message}
      >
        {(aria) => <Input id="supplier-name" autoFocus maxLength={150} {...aria} {...register("name")} />}
      </FormField>
      <FormField id="supplier-phone" label="Telepon (opsional)" error={errors.phone?.message}>
        {(aria) => <Input id="supplier-phone" type="tel" maxLength={30} {...aria} {...register("phone")} />}
      </FormField>
      <FormField id="supplier-address" label="Alamat (opsional)" error={errors.address?.message}>
        {(aria) => <Input id="supplier-address" maxLength={255} {...aria} {...register("address")} />}
      </FormField>
      <FormField
        id="supplier-notes"
        label="Catatan (opsional)"
        hint="Nama kontak sales, jadwal pengiriman, atau keterangan produk unggulan."
        error={errors.notes?.message}
      >
        {(aria) => <Textarea id="supplier-notes" rows={3} maxLength={1000} {...aria} {...register("notes")} />}
      </FormField>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={isPending}>
            Batal
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Menyimpan..." : "Simpan"}
        </Button>
      </DialogFooter>
    </form>
  )
}
