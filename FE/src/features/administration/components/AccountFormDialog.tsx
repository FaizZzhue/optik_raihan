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
import type { UserAccount } from "@/types/administration"
import { getApiErrorMessage } from "@/utils/api-error"
import { applyApiFieldErrors } from "@/utils/form-errors"
import { useCreateAccount } from "../hooks/use-administration"
import { createAccountSchema, type CreateAccountFormValues } from "../schemas"

type AccountFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: (account: UserAccount) => void
}

export function AccountFormDialog({ open, onOpenChange, onSaved }: AccountFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah akun pegawai</DialogTitle>
          <DialogDescription>
            Akun baru selalu berperan pegawai. Sampaikan password langsung kepada pegawai; sistem tidak menampilkannya lagi.
          </DialogDescription>
        </DialogHeader>
        <AccountForm onSaved={onSaved} />
      </DialogContent>
    </Dialog>
  )
}

function AccountForm({ onSaved }: Pick<AccountFormDialogProps, "onSaved">) {
  const createMutation = useCreateAccount()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateAccountFormValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: { username: "", name: "", password: "", confirmPassword: "" },
  })

  const onSubmit = handleSubmit(({ username, name, password }) => {
    setFormError(null)
    createMutation.mutate(
      { username, name, password },
      {
        onSuccess: onSaved,
        onError: (error) => {
          if (!applyApiFieldErrors(error, setError, ["username", "name", "password"])) {
            setFormError(getApiErrorMessage(error))
          }
        },
      },
    )
  })

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      {formError && (
        <Alert variant="destructive">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      <FormField id="account-username" label="Username" error={errors.username?.message} hint="Disimpan dalam huruf kecil.">
        {(aria) => (
          <Input id="account-username" autoFocus autoComplete="off" maxLength={50} {...aria} {...register("username")} />
        )}
      </FormField>
      <FormField id="account-name" label="Nama" error={errors.name?.message}>
        {(aria) => <Input id="account-name" maxLength={100} {...aria} {...register("name")} />}
      </FormField>
      <FormField id="account-password" label="Password" error={errors.password?.message} hint="Minimal 12 karakter.">
        {(aria) => (
          <Input id="account-password" type="password" autoComplete="new-password" {...aria} {...register("password")} />
        )}
      </FormField>
      <FormField id="account-confirm-password" label="Ulangi password" error={errors.confirmPassword?.message}>
        {(aria) => (
          <Input
            id="account-confirm-password"
            type="password"
            autoComplete="new-password"
            {...aria}
            {...register("confirmPassword")}
          />
        )}
      </FormField>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={createMutation.isPending}>
            Batal
          </Button>
        </DialogClose>
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Menyimpan..." : "Simpan"}
        </Button>
      </DialogFooter>
    </form>
  )
}
