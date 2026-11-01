import { Navigate, Outlet, useLocation } from "react-router-dom"
import { ErrorState } from "@/components/shared/ErrorState"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { DashboardLayoutSkeleton } from "@/layouts/DashboardLayout"

// Hanya mengatur tampilan. Otorisasi sebenarnya tetap di BE (requireAuth).
export function ProtectedRoute() {
  const { status, retry } = useAuth()
  const location = useLocation()

  if (status === "loading") {
    return <DashboardLayoutSkeleton />
  }

  if (status === "error") {
    return (
      <main className="flex min-h-svh items-center justify-center p-4">
        <div className="w-full max-w-md">
          <ErrorState
            title="Sesi tidak dapat diperiksa"
            description="Server tidak dapat dihubungi atau sedang bermasalah. Periksa koneksi, lalu coba lagi."
            onRetry={retry}
          />
        </div>
      </main>
    )
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />
  }

  return <Outlet />
}
