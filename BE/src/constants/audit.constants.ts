import { USER_ROLES, type UserRole } from "./auth.constants.js";

// Aksi yang diaudit (PRD FR-15.1, USULAN; daftar final dengan owner). Hanya aksi yang fiturnya sudah ada.
// Disimpan sebagai VARCHAR, bukan enum database, agar daftar bisa bertambah tanpa migrasi (ERD 4.1).
// Nilai sama dengan FE/src/constants/audit.constants.ts.
export const AUDIT_ACTIONS = {
  LOGIN: "login",
  PRICE_CHANGE: "price_change",
  USER_CREATE: "user_create",
  USER_DEACTIVATE: "user_deactivate",
  USER_ACTIVATE: "user_activate",
  PASSWORD_RESET: "password_reset",
} as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];

export const AUDIT_ENTITY_TYPES = {
  PRODUCT: "product",
  USER: "user",
} as const;

// Hanya owner yang dapat melihat audit log (FR-15.3, USULAN).
export const AUDIT_PERMISSIONS = {
  READ: [USER_ROLES.OWNER],
} as const satisfies Record<string, readonly UserRole[]>;
