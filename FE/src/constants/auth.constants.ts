// Nilai sama dengan BE/src/constants/auth.constants.ts.
export const USER_ROLES = {
  OWNER: "owner",
  STAFF: "staff",
  CASHIER: "cashier",
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  owner: "Owner",
  staff: "Pegawai",
  cashier: "Kasir",
}

// Role yang bisa dibuat dan dikelola owner di menu akun (BE: MANAGED_USER_ROLES, DEC-043).
export const MANAGED_USER_ROLES = [USER_ROLES.STAFF, USER_ROLES.CASHIER] as const
export type ManagedUserRole = (typeof MANAGED_USER_ROLES)[number]

// Halaman awal setelah login per role. Kasir punya ruang kerja sendiri di /kasir (DEC-043).
export const ROLE_HOME_PATH: Record<UserRole, string> = {
  owner: "/",
  staff: "/",
  cashier: "/kasir",
}

// Role dashboard back-office. Kasir tidak masuk ke sini dan hanya memakai /kasir (DEC-043).
export const BACK_OFFICE_ROLES: readonly UserRole[] = [USER_ROLES.OWNER, USER_ROLES.STAFF]

export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_HINT = "Minimal 8 karakter, wajib ada huruf besar, huruf kecil, dan angka."

// Query key user yang sedang login. Data ini sumber state auth di AuthProvider.
export const AUTH_ME_QUERY_KEY = ["auth", "me"] as const
