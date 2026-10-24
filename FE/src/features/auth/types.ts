import type { AuthUser } from "@/types/auth"

export type AuthStatus = "loading" | "authenticated" | "unauthenticated"

// Isi AuthContext: hanya user dan status login, tanpa token (DEC-013).
export type AuthContextValue = {
  status: AuthStatus
  user: AuthUser | null
}
