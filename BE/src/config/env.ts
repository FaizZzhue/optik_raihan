import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
  // Minimal 32 karakter acak untuk HS256 (PROJECT-CONTEXT.md bagian 7, Sesi).
  JWT_SECRET: z.string().min(32),
  // Origin aplikasi di browser, dipakai cek Origin/Referer (PROJECT-CONTEXT.md bagian 7, CSRF).
  APP_ORIGIN: z.url({ protocol: /^https?$/ }).transform((value) => new URL(value).origin),
});

const result = envSchema.safeParse(process.env);

// Dilempar saat modul dimuat, sehingga aplikasi berhenti sebelum menerima request
// bila konfigurasi salah (PROJECT-CONTEXT.md bagian 4, Config). Pesan tidak memuat nilai env.
if (!result.success) {
  throw new Error(`Konfigurasi environment tidak valid:\n${z.prettifyError(result.error)}`);
}

export const env = result.data;
