import type { AuthUser } from "@/types/auth"

// "error": GET /api/auth/me gagal bukan karena 401 (server mati atau error), jadi status sesi tidak diketahui.
export type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "error"

// Isi AuthContext: hanya user dan status login, tanpa token (DEC-013).
export type AuthContextValue = {
  status: AuthStatus
  user: AuthUser | null
  retry: () => void
}
