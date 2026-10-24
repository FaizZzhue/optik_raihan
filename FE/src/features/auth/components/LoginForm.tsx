import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLocation, useNavigate } from "react-router-dom"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getApiErrorMessage } from "@/utils/api-error"
import { useLogin } from "../hooks/use-auth"
import { loginSchema, type LoginFormValues } from "../schemas"

// Hanya path internal yang diterima sebagai tujuan setelah login (mencegah open redirect).
function getRedirectPath(state: unknown): string {
  if (typeof state === "object" && state !== null && "from" in state && typeof state.from === "string") {
    const isInternalPath = state.from.startsWith("/") && !state.from.startsWith("//")
    if (isInternalPath) {
      return state.from
    }
  }
  return "/"
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
      onSuccess: () => navigate(getRedirectPath(location.state), { replace: true }),
    })
  })

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
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
          aria-invalid={errors.username ? true : undefined}
          aria-describedby={errors.username ? "username-error" : undefined}
          {...register("username")}
        />
        {errors.username && (
          <p id="username-error" className="text-sm text-destructive">
            {errors.username.message}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
        />
        {errors.password && (
          <p id="password-error" className="text-sm text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Memproses..." : "Masuk"}
      </Button>
    </form>
  )
}
