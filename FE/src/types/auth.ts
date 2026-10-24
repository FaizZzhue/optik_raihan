import type { UserRole } from "@/constants/auth.constants"

// DTO dari GET /api/auth/me dan POST /api/auth/login. Tidak memuat token.
export type AuthUser = {
  id: number
  username: string
  name: string
  role: UserRole
}
