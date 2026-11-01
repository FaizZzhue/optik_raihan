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
import { useResetAccountPassword } from "../hooks/use-administration"
import { resetPasswordSchema, type ResetPasswordFormValues } from "../schemas"

type ResetPasswordDialogProps = {
  account: UserAccount | null
  onOpenChange: (open: boolean) => void
  onDone: (account: UserAccount) => void
}

export function ResetPasswordDialog({ account, onOpenChange, onDone }: ResetPasswordDialogProps) {
  return (
    <Dialog open={account !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset password {account?.name ?? ""}</DialogTitle>
          <DialogDescription>
            Sesi yang sedang aktif tetap berlaku sampai berakhir (maks. 8 jam). Nonaktifkan akun bila akses harus langsung
            diputus.
          </DialogDescription>
        </DialogHeader>
        {account && <ResetPasswordForm account={account} onDone={onDone} />}
      </DialogContent>
    </Dialog>
  )
}

function ResetPasswordForm({ account, onDone }: { account: UserAccount; onDone: (account: UserAccount) => void }) {
  const resetMutation = useResetAccountPassword()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  const onSubmit = handleSubmit(({ password }) => {
    setFormError(null)
    resetMutation.mutate(
      { id: account.id, password },
      {
        onSuccess: () => onDone(account),
        onError: (error) => {
          if (!applyApiFieldErrors(error, setError, ["password"])) {
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
      <FormField id="reset-password" label="Password baru" error={errors.password?.message} hint="Minimal 12 karakter.">
        {(aria) => (
          <Input id="reset-password" type="password" autoFocus autoComplete="new-password" {...aria} {...register("password")} />
        )}
      </FormField>
      <FormField id="reset-confirm-password" label="Ulangi password baru" error={errors.confirmPassword?.message}>
        {(aria) => (
          <Input
            id="reset-confirm-password"
            type="password"
            autoComplete="new-password"
            {...aria}
            {...register("confirmPassword")}
          />
        )}
      </FormField>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={resetMutation.isPending}>
            Batal
          </Button>
        </DialogClose>
        <Button type="submit" disabled={resetMutation.isPending}>
          {resetMutation.isPending ? "Menyimpan..." : "Simpan password"}
        </Button>
      </DialogFooter>
    </form>
  )
}
