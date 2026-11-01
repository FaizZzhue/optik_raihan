import { USER_ROLES, type UserRole } from "./auth.constants"

// Menu khusus owner: supplier dan pembelian (PRD bagian 3; DEC-037 USULAN), akun pegawai (FR-01.6),
// dan log aktivitas (FR-15.3). Di FE hanya untuk tampilan; BE tetap menolak dengan 403.
export const OWNER_ONLY: readonly UserRole[] = [USER_ROLES.OWNER]

export const OWNER_QUERY_KEYS = {
  suppliers: ["suppliers"] as const,
  purchases: ["purchases"] as const,
  purchaseList: (page: number) => ["purchases", "list", page] as const,
  purchaseDetail: (id: number) => ["purchases", "detail", id] as const,
  productOptions: (search: string) => ["purchases", "product-options", search] as const,
  accounts: ["accounts"] as const,
  auditLogs: (page: number, action: string) => ["audit-logs", page, action] as const,
}

// Nilai sama dengan BE/src/constants/audit.constants.ts.
export const AUDIT_ACTION_LABELS: Record<string, string> = {
  login: "Login",
  price_change: "Ubah harga",
  user_create: "Buat akun",
  user_deactivate: "Nonaktifkan akun",
  user_activate: "Aktifkan akun",
  password_reset: "Reset password",
}

// Nilai Select tidak boleh string kosong (Radix), jadi filter "semua aksi" memakai nilai ini.
export const ALL_ACTIONS_VALUE = "all"
