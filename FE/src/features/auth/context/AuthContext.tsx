import { useMemo, type ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import { AUTH_ME_QUERY_KEY } from "@/constants/auth.constants"
import { getMe } from "../services/auth.service"
import type { AuthContextValue } from "../types"
import { AuthContext } from "./auth-context"

// Memulihkan sesi lewat GET /api/auth/me saat aplikasi dimuat (termasuk setelah reload).
export function AuthProvider({ children }: { children: ReactNode }) {
  const { isPending, isError, isFetching, data, refetch } = useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: getMe,
    retry: false,
    staleTime: Infinity,
  })

  const value = useMemo<AuthContextValue>(() => {
    const retry = () => void refetch()

    // Saat mencoba ulang setelah error, tampilkan loading lagi sebagai umpan balik.
    if (isPending || (isError && isFetching)) {
      return { status: "loading", user: null, retry }
    }
    if (data) {
      return { status: "authenticated", user: data, retry }
    }
    if (isError) {
      return { status: "error", user: null, retry }
    }
    return { status: "unauthenticated", user: null, retry }
  }, [isPending, isError, isFetching, data, refetch])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
