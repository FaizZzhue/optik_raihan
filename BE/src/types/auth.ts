import type { UserRole } from "../constants/auth.constants.js";

// Bentuk user yang boleh keluar dari BE (DTO). Tidak pernah memuat passwordHash.
export type AuthUser = {
  id: number;
  username: string;
  name: string;
  role: UserRole;
};

// DTO daftar akun untuk owner (/api/users). Tidak pernah memuat passwordHash.
export type UserAccountDto = AuthUser & {
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
