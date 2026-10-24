import { z } from "zod"

// Validasi untuk kenyamanan pengguna. Penentu tetap BE/src/validators/auth.validator.ts.
export const loginSchema = z.object({
  username: z.string().trim().min(1, "Username wajib diisi.").max(50, "Username maksimal 50 karakter."),
  password: z.string().min(1, "Password wajib diisi.").max(128, "Password maksimal 128 karakter."),
})

export type LoginFormValues = z.infer<typeof loginSchema>
