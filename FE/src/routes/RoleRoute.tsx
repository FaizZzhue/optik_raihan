import { Navigate, Outlet } from "react-router-dom"
import type { UserRole } from "@/constants/auth.constants"
import { useCurrentUser } from "@/features/auth/hooks/use-auth"

type RoleRouteProps = {
  allowedRoles: readonly UserRole[]
}

// Dipasang di dalam ProtectedRoute. Hanya mengatur tampilan; BE tetap menolak role tanpa izin dengan 403.
export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const user = useCurrentUser()

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
