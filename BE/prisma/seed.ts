// Membuat akun owner awal dari environment (PROJECT-CONTEXT.md bagian 7, Data: Seed). Tidak ada kredensial di kode.
// Jika username sudah ada, seed tidak mengubah apa pun (password lama tidak ditimpa).
import "dotenv/config";
import { z } from "zod";
import { PASSWORD_MIN_LENGTH, USER_ROLES } from "../src/constants/auth.constants.js";
import { prisma } from "../src/lib/prisma.js";
import { hashPassword } from "../src/utils/password.js";

const seedEnvSchema = z.object({
  SEED_OWNER_USERNAME: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9._-]+$/, "Hanya huruf kecil, angka, titik, garis bawah, dan tanda hubung."),
  SEED_OWNER_NAME: z.string().trim().min(1).max(100),
  SEED_OWNER_PASSWORD: z.string().min(PASSWORD_MIN_LENGTH).max(128),
});

const result = seedEnvSchema.safeParse(process.env);
if (!result.success) {
  throw new Error(`Variabel seed tidak valid:\n${z.prettifyError(result.error)}`);
}
const seedEnv = result.data;

const existingOwner = await prisma.user.findUnique({ where: { username: seedEnv.SEED_OWNER_USERNAME } });

if (existingOwner) {
  console.log(`User "${seedEnv.SEED_OWNER_USERNAME}" sudah ada. Seed dilewati.`);
} else {
  await prisma.user.create({
    data: {
      username: seedEnv.SEED_OWNER_USERNAME,
      name: seedEnv.SEED_OWNER_NAME,
      passwordHash: await hashPassword(seedEnv.SEED_OWNER_PASSWORD),
      role: USER_ROLES.OWNER,
    },
  });
  console.log(`Owner awal "${seedEnv.SEED_OWNER_USERNAME}" dibuat.`);
}

await prisma.$disconnect();
