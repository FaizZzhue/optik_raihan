import { useMemo, type ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import { AUTH_ME_QUERY_KEY } from "@/constants/auth.constants"
import { getMe } from "../services/auth.service"
import type { AuthContextValue } from "../types"
import { AuthContext } from "./auth-context"

// Memulihkan sesi lewat GET /api/auth/me saat aplikasi dimuat (termasuk setelah reload).
export function AuthProvider({ children }: { children: ReactNode }) {
  const meQuery = useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: getMe,
    retry: false,
    staleTime: Infinity,
  })

  const value = useMemo<AuthContextValue>(() => {
    if (meQuery.isPending) {
      return { status: "loading", user: null }
    }
    if (meQuery.data) {
      return { status: "authenticated", user: meQuery.data }
    }
    // Termasuk saat BE tidak terjangkau: pengguna diarahkan ke login dan melihat pesan error di sana.
    return { status: "unauthenticated", user: null }
  }, [meQuery.isPending, meQuery.data])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
