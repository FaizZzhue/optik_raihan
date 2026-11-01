import { z } from "zod"

// Validasi untuk kenyamanan pengguna. Penentu tetap BE/src/validators/users.validator.ts.
// Minimal 12 karakter sama dengan PASSWORD_MIN_LENGTH di BE (DEC-031). Password tidak di-trim.
const passwordSchema = z.string().min(12, "Password minimal 12 karakter.").max(128, "Password maksimal 128 karakter.")

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
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(passwordConfirmation, { path: ["confirmPassword"], message: "Konfirmasi password tidak sama." })

export type CreateAccountFormValues = z.infer<typeof createAccountSchema>

export const resetPasswordSchema = z
  .object({ password: passwordSchema, confirmPassword: z.string() })
  .refine(passwordConfirmation, { path: ["confirmPassword"], message: "Konfirmasi password tidak sama." })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
