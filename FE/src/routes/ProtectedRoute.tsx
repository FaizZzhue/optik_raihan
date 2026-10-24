import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "@/features/auth/hooks/use-auth"

// Hanya mengatur tampilan. Otorisasi sebenarnya tetap di BE (requireAuth).
export function ProtectedRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === "loading") {
    return (
      <p role="status" className="p-6 text-sm text-muted-foreground">
        Memeriksa sesi...
      </p>
    )
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />
  }

  return <Outlet />
}
