import { USER_ROLE_LABELS } from "@/constants/auth.constants"
import { LogoutButton } from "@/features/auth/components/LogoutButton"
import { useAuth } from "@/features/auth/hooks/use-auth"

// Halaman sementara setelah login. Diganti dashboard pada Tahap 8.
export function HomePage() {
  const { user } = useAuth()

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold">Optik Raihan</h1>
      {user && (
        <p className="text-sm text-muted-foreground">
          Masuk sebagai {user.name} ({USER_ROLE_LABELS[user.role]})
        </p>
      )}
      <div>
        <LogoutButton />
      </div>
    </main>
  )
}
