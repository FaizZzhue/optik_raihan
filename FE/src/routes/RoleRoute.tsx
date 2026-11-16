import { Navigate, Outlet } from "react-router-dom"
import { ROLE_HOME_PATH, type UserRole } from "@/constants/auth.constants"
import { useCurrentUser } from "@/hooks/auth/use-auth"

type RoleRouteProps = {
  allowedRoles: readonly UserRole[]
}

// Dipasang di dalam ProtectedRoute. Hanya mengatur tampilan; BE tetap menolak role tanpa izin dengan 403.
// Role tanpa izin diarahkan ke halaman awal role-nya (kasir → /kasir), bukan selalu ke "/".
export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const user = useCurrentUser()

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={ROLE_HOME_PATH[user.role]} replace />
  }

  return <Outlet />
}
