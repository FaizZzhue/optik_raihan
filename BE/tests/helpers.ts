import request from "supertest";
import { app } from "../src/app.js";
import { env } from "../src/config/env.js";
import { AUTH_COOKIE_NAME, type UserRole } from "../src/constants/auth.constants.js";
import { prisma } from "../src/lib/prisma.js";
import { signAccessToken } from "../src/utils/jwt.js";
import { hashPassword } from "../src/utils/password.js";

export const TEST_PASSWORD = "password-uji-coba-123";

type TestUserOptions = {
  username: string;
  role: UserRole;
  isActive?: boolean;
};

export async function createTestUser({ username, role, isActive = true }: TestUserOptions) {
  return prisma.user.create({
    data: {
      username,
      name: `Pengguna Uji ${username}`,
      passwordHash: await hashPassword(TEST_PASSWORD),
      role,
      isActive,
    },
  });
}

// Semua data bisnis dihapus sebelum users. Urutan mengikuti FK ON DELETE RESTRICT: tabel yang menunjuk lebih dulu.
export async function deleteAllBusinessData(): Promise<void> {
  await prisma.stockMovement.deleteMany();
  await prisma.purchaseItem.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.supplier.deleteMany();
}

export async function deleteAllUsers(): Promise<void> {
  await deleteAllBusinessData();
  await prisma.user.deleteMany();
}

// Cookie sesi langsung dari token yang ditandatangani, tanpa lewat POST /api/auth/login (dan rate limit-nya).
export async function createSessionCookie(userId: number): Promise<string> {
  return `${AUTH_COOKIE_NAME}=${await signAccessToken(userId)}`;
}

// Request API atas nama satu sesi. Request yang mengubah data membawa Origin aplikasi seperti browser asli.
export function apiAs(cookie: string) {
  return {
    get: (path: string) => request(app).get(path).set("Cookie", cookie),
    post: (path: string, body: object) =>
      request(app).post(path).set("Cookie", cookie).set("Origin", env.APP_ORIGIN).send(body),
    patch: (path: string, body: object) =>
      request(app).patch(path).set("Cookie", cookie).set("Origin", env.APP_ORIGIN).send(body),
    delete: (path: string) => request(app).delete(path).set("Cookie", cookie).set("Origin", env.APP_ORIGIN),
  };
}
