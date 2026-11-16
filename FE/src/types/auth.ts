import type { UserRole } from "@/constants/auth.constants"

// DTO dari GET /api/auth/me dan POST /api/auth/login. Tidak memuat token.
export type AuthUser = {
  id: number
  username: string
  name: string
  role: UserRole
}

// "error": GET /api/auth/me gagal bukan karena 401 (server mati atau error), jadi status sesi tidak diketahui.
export type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "error"

// Isi AuthContext: hanya user dan status login, tanpa token (DEC-013).
export type AuthContextValue = {
  status: AuthStatus
  user: AuthUser | null
  retry: () => void
}
