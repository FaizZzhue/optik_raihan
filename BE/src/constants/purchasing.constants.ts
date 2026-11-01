import { USER_ROLES, type UserRole } from "./auth.constants.js";

// Pembelian hanya owner (PRD bagian 3). Kelola supplier ikut pembelian karena supplier hanya dipakai di sana:
// USULAN DEC-037, menunggu konfirmasi matriks izin (DEC-018).
export const PURCHASING_PERMISSIONS = {
  MANAGE: [USER_ROLES.OWNER],
} as const satisfies Record<string, readonly UserRole[]>;
