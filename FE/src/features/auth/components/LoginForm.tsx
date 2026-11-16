import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLocation, useNavigate } from "react-router-dom"
import { ROLE_HOME_PATH, USER_ROLES, type UserRole } from "@/constants/auth.constants"
import { PasswordInput } from "@/components/shared/PasswordInput"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getApiErrorMessage } from "@/utils/common/api-error"
import { useLogin } from "@/hooks/auth/use-auth"
import { loginSchema, type LoginFormValues } from "../schemas"

// Hanya path internal yang diterima sebagai tujuan setelah login (mencegah open redirect).
// Kasir langsung menuju /kasir tanpa memantul lewat rute back-office.
function getRedirectPath(state: unknown, role: UserRole): string {
  if (typeof state === "object" && state !== null && "from" in state && typeof state.from === "string") {
    const isInternalPath = state.from.startsWith("/") && !state.from.startsWith("//")
    if (isInternalPath && (role !== USER_ROLES.CASHIER || state.from.startsWith("/kasir"))) {
      return state.from
    }
  }
  return ROLE_HOME_PATH[role]
}

export function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const loginMutation = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  })

  const onSubmit = handleSubmit((values) => {
    loginMutation.mutate(values, {
      // Navigasi hanya setelah BE membalas sukses dan sesi tersimpan di cookie.
      onSuccess: (user) => navigate(getRedirectPath(location.state, user.role), { replace: true }),
    })
  })

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      {loginMutation.isError && (
        <Alert variant="destructive">
          <AlertDescription>{getApiErrorMessage(loginMutation.error)}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          autoComplete="username"
          autoFocus
          placeholder="Masukkan username"
          className="h-11"
          aria-invalid={errors.username ? true : undefined}
          aria-describedby={errors.username ? "username-error" : undefined}
          {...register("username")}
        />
        {errors.username && (
          <p id="username-error" className="text-xs font-medium text-destructive">
            {errors.username.message}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder="Masukkan password"
          className="h-11"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
        />
        {errors.password && (
          <p id="password-error" className="text-xs font-medium text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="mt-1 h-11 w-full rounded-xl font-semibold"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Memproses..." : "Masuk"}
      </Button>
    </form>
  )
}
