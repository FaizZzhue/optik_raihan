import { USER_ROLES, type UserRole } from "./auth.constants.js";

// Izin modul kategori dan barang. Dasar: PRD bagian 3 (barang boleh ditambah/diubah owner dan pegawai).
// Kelola kategori dan hapus barang hanya owner: USULAN DEC-034, menunggu konfirmasi matriks izin (DEC-018).
export const CATALOG_PERMISSIONS = {
  READ: [USER_ROLES.OWNER, USER_ROLES.STAFF],
  MANAGE_CATEGORIES: [USER_ROLES.OWNER],
  WRITE_PRODUCTS: [USER_ROLES.OWNER, USER_ROLES.STAFF],
  DELETE_PRODUCTS: [USER_ROLES.OWNER],
} as const satisfies Record<string, readonly UserRole[]>;
