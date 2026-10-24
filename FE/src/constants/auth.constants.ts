// Nilai sama dengan BE/src/constants/auth.constants.ts.
export const USER_ROLES = {
  OWNER: "owner",
  STAFF: "staff",
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  owner: "Owner",
  staff: "Pegawai",
}

// Query key user yang sedang login. Data ini sumber state auth di AuthProvider.
export const AUTH_ME_QUERY_KEY = ["auth", "me"] as const
