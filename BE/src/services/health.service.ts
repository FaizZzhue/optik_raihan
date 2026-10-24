import { prisma } from "../lib/prisma.js";

export async function getHealthStatus() {
  // Query paling ringan untuk membuktikan PostgreSQL terjangkau. Jika gagal, error
  // diteruskan ke error.middleware dan menjadi 500 INTERNAL_ERROR.
  await prisma.$queryRaw`SELECT 1`;
  return { status: "ok", database: "ok" } as const;
}
