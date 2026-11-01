import type { AuthUser } from "./auth"

// DTO dari /api/users (hanya owner). Tidak pernah memuat password atau hash.
export type UserAccount = AuthUser & {
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type AuditLogEntry = {
  id: number
  action: string
  actor: { id: number; username: string; name: string } | null
  entityType: string | null
  entityId: number | null
  details: Record<string, unknown> | null
  createdAt: string
}
