import { z } from "zod";

// z.object membuang field yang tidak dikenal, jadi role/userId palsu di body diabaikan.
export const loginSchema = z.object({
  username: z
    .string({ error: "Username wajib diisi." })
    .trim()
    .toLowerCase()
    .min(1, "Username wajib diisi.")
    .max(50, "Username maksimal 50 karakter."),
  password: z
    .string({ error: "Password wajib diisi." })
    .min(1, "Password wajib diisi.")
    .max(128, "Password maksimal 128 karakter."),
});

export type LoginInput = z.infer<typeof loginSchema>;
