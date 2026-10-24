import { Navigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/features/auth/components/LoginForm"
import { useAuth } from "@/features/auth/hooks/use-auth"

export function LoginPage() {
  const { status } = useAuth()

  if (status === "authenticated") {
    return <Navigate to="/" replace />
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            <h1>Masuk</h1>
          </CardTitle>
          <CardDescription>Gunakan akun yang diberikan owner toko.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  )
}
