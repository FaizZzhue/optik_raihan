import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormField } from "@/components/shared/FormField"
import { PasswordInput } from "@/components/shared/PasswordInput"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MANAGED_USER_ROLES, PASSWORD_HINT, USER_ROLE_LABELS, USER_ROLES } from "@/constants/auth.constants"
import type { UserAccount } from "@/types/administration"
import { getApiErrorMessage } from "@/utils/common/api-error"
import { applyApiFieldErrors } from "@/utils/common/form-errors"
import { useCreateAccount } from "@/hooks/administration/use-administration"
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
          <DialogTitle>Tambah akun</DialogTitle>
          <DialogDescription>
            Pilih peran Pegawai (dashboard back-office) atau Kasir (hanya halaman kasir). Sampaikan password langsung
            kepada pemilik akun; sistem tidak menampilkannya lagi.
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
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateAccountFormValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: { username: "", name: "", role: USER_ROLES.STAFF, password: "", confirmPassword: "" },
  })

  const onSubmit = handleSubmit(({ username, name, role, password }) => {
    setFormError(null)
    createMutation.mutate(
      { username, name, role, password },
      {
        onSuccess: onSaved,
        onError: (error) => {
          if (!applyApiFieldErrors(error, setError, ["username", "name", "role", "password"])) {
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
      <FormField id="account-role" label="Peran" error={errors.role?.message}>
        {(aria) => (
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="account-role" className="w-full" onBlur={field.onBlur} {...aria}>
                  <SelectValue placeholder="Pilih peran" />
                </SelectTrigger>
                <SelectContent>
                  {MANAGED_USER_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {USER_ROLE_LABELS[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}
      </FormField>
      <FormField id="account-password" label="Password" error={errors.password?.message} hint={PASSWORD_HINT}>
        {(aria) => (
          <PasswordInput id="account-password" autoComplete="new-password" {...aria} {...register("password")} />
        )}
      </FormField>
      <FormField id="account-confirm-password" label="Ulangi password" error={errors.confirmPassword?.message}>
        {(aria) => (
          <PasswordInput
            id="account-confirm-password"
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
