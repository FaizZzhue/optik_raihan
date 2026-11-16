import { z } from "zod"
import { MANAGED_USER_ROLES, PASSWORD_MIN_LENGTH } from "@/constants/auth.constants"

// Validasi untuk kenyamanan pengguna. Penentu tetap BE/src/validators/users.validator.ts.
// Minimal 8 karakter + kombinasi huruf besar, huruf kecil, dan angka. Password tidak di-trim.
const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Password minimal ${PASSWORD_MIN_LENGTH} karakter.`)
  .max(128, "Password maksimal 128 karakter.")
  .regex(/[A-Z]/, "Password harus mengandung minimal 1 huruf besar.")
  .regex(/[a-z]/, "Password harus mengandung minimal 1 huruf kecil.")
  .regex(/[0-9]/, "Password harus mengandung minimal 1 angka.")

const passwordConfirmation = <T extends { password: string; confirmPassword: string }>(values: T) =>
  values.password === values.confirmPassword

export const createAccountSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username minimal 3 karakter.")
      .max(50, "Username maksimal 50 karakter.")
      .regex(/^[A-Za-z0-9._-]+$/, "Hanya huruf, angka, titik, garis bawah, dan tanda hubung."),
    name: z.string().trim().min(1, "Nama wajib diisi.").max(100, "Nama maksimal 100 karakter."),
    role: z.enum(MANAGED_USER_ROLES, { error: "Pilih peran akun." }),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(passwordConfirmation, { path: ["confirmPassword"], message: "Konfirmasi password tidak sama." })

export type CreateAccountFormValues = z.infer<typeof createAccountSchema>

export const resetPasswordSchema = z
  .object({ password: passwordSchema, confirmPassword: z.string() })
  .refine(passwordConfirmation, { path: ["confirmPassword"], message: "Konfirmasi password tidak sama." })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
