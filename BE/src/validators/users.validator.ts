import { z } from "zod";
import { MANAGED_USER_ROLES, PASSWORD_MIN_LENGTH, USER_ROLES } from "../constants/auth.constants.js";
import { statusFilterSchema } from "./common.validator.js";

// Aturan username sama dengan seed owner (prisma/seed.ts) dan CHECK huruf kecil di database (DEC-031).
const usernameSchema = z
  .string({ error: "Username wajib diisi." })
  .trim()
  .toLowerCase()
  .min(3, "Username minimal 3 karakter.")
  .max(50, "Username maksimal 50 karakter.")
  .regex(/^[a-z0-9._-]+$/, "Username hanya boleh huruf, angka, titik, garis bawah, dan tanda hubung.");

const nameSchema = z
  .string({ error: "Nama wajib diisi." })
  .trim()
  .min(1, "Nama wajib diisi.")
  .max(100, "Nama maksimal 100 karakter.");

// Tidak di-trim: spasi adalah bagian sah dari password.
const passwordSchema = z
  .string({ error: "Password wajib diisi." })
  .min(PASSWORD_MIN_LENGTH, `Password minimal ${PASSWORD_MIN_LENGTH} karakter.`)
  .max(128, "Password maksimal 128 karakter.")
  .regex(/[A-Z]/, "Password harus mengandung minimal 1 huruf besar.")
  .regex(/[a-z]/, "Password harus mengandung minimal 1 huruf kecil.")
  .regex(/[0-9]/, "Password harus mengandung minimal 1 angka.");

export const userListQuerySchema = z.object({
  status: statusFilterSchema,
});

// Role hanya pegawai atau kasir; owner tidak bisa dibuat lewat API (PRD FR-01.6, DEC-043). Default pegawai.
export const createUserSchema = z.object({
  username: usernameSchema,
  name: nameSchema,
  password: passwordSchema,
  role: z.enum(MANAGED_USER_ROLES, { error: "Role harus pegawai atau kasir." }).default(USER_ROLES.STAFF),
});

export const updateUserSchema = z
  .object({
    name: nameSchema.optional(),
    isActive: z.boolean({ error: "Status aktif harus true atau false." }).optional(),
  })
  .refine((input) => input.name !== undefined || input.isActive !== undefined, "Tidak ada data yang diubah.");

export const resetPasswordSchema = z.object({
  password: passwordSchema,
});

export type UserListQuery = z.infer<typeof userListQuerySchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
