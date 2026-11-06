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
import type { Category } from "@/types/catalog"
import { getApiErrorMessage } from "@/utils/api-error"
import { applyApiFieldErrors } from "@/utils/form-errors"
import { useCreateCategory, useUpdateCategory } from "../hooks/use-categories"
import { categoryFormSchema, type CategoryFormValues } from "../schemas"

type CategoryFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  // null = tambah kategori baru.
  category: Category | null
  onSaved: (category: Category) => void
}

export function CategoryFormDialog({ open, onOpenChange, category, onSaved }: CategoryFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? "Ubah kategori" : "Tambah kategori"}</DialogTitle>
          <DialogDescription>Nama kategori harus unik, tanpa membedakan huruf besar dan kecil.</DialogDescription>
        </DialogHeader>
        {/* Form dipasang ulang setiap dialog dibuka (DialogContent dilepas saat tertutup), jadi isinya selalu segar. */}
        <CategoryForm category={category} onSaved={onSaved} />
      </DialogContent>
    </Dialog>
  )
}

type CategoryFormProps = Pick<CategoryFormDialogProps, "category" | "onSaved">

const SUGGESTED_CATEGORIES = ["Frame", "Lensa jadi", "Kacamata jadi"] as const

function CategoryForm({ category, onSaved }: CategoryFormProps) {
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: category?.name ?? "" },
  })
  const isPending = createMutation.isPending || updateMutation.isPending

  const onSubmit = handleSubmit((values) => {
    setFormError(null)
    const callbacks = {
      onSuccess: onSaved,
      onError: (error: unknown) => {
        if (!applyApiFieldErrors(error, setError, ["name"])) {
          setFormError(getApiErrorMessage(error))
        }
      },
    }
    if (category) {
      updateMutation.mutate({ id: category.id, input: { name: values.name } }, callbacks)
    } else {
      createMutation.mutate(values.name, callbacks)
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
        id="category-name"
        label="Nama kategori"
        error={errors.name?.message}
        hint="Kategori standar optik: Frame, Lensa jadi, atau Kacamata jadi."
      >
        {(aria) => <Input id="category-name" autoFocus maxLength={100} {...aria} {...register("name")} />}
      </FormField>
      {!category && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Isi cepat:</span>
          {SUGGESTED_CATEGORIES.map((preset) => (
            <Button
              key={preset}
              type="button"
              variant="outline"
              size="xs"
              onClick={() => setValue("name", preset, { shouldValidate: true, shouldDirty: true })}
            >
              {preset}
            </Button>
          ))}
        </div>
      )}
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
