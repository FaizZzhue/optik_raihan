// Alur autentikasi yang membutuhkan database test (SECURITY.md bagian 15, AC-01.1 sampai AC-01.5).
import cookieParser from "cookie-parser";
import express from "express";
import request from "supertest";
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../src/app.js";
import { env } from "../src/config/env.js";
import { AUTH_COOKIE_NAME, USER_ROLES } from "../src/constants/auth.constants.js";
import { prisma } from "../src/lib/prisma.js";
import { requireAuth } from "../src/middlewares/auth.middleware.js";
import { errorHandler } from "../src/middlewares/error.middleware.js";
import { requireRole } from "../src/middlewares/role.middleware.js";
import { TEST_PASSWORD, createTestUser, deleteAllUsers } from "./helpers.js";

const INVALID_CREDENTIALS = { error: { code: "UNAUTHENTICATED", message: "Username atau password salah." } };

function postLogin(body: object) {
  return request(app).post("/api/auth/login").set("Origin", env.APP_ORIGIN).send(body);
}

function getAuthCookie(res: request.Response): string {
  const setCookie: unknown = res.headers["set-cookie"];
  const cookie = Array.isArray(setCookie)
    ? setCookie.find((value): value is string => typeof value === "string" && value.startsWith(`${AUTH_COOKIE_NAME}=`))
    : undefined;
  if (!cookie) {
    throw new Error("Cookie sesi tidak ditemukan di respons login.");
  }
  return cookie;
}

beforeEach(async () => {
  await deleteAllUsers();
});

afterEach(() => {
  vi.useRealTimers();
});

afterAll(async () => {
  await deleteAllUsers();
  await prisma.$disconnect();
});

describe("POST /api/auth/login", () => {
  it("berhasil: body hanya data user, token hanya di cookie HttpOnly", async () => {
    const user = await createTestUser({ username: "owner.uji", role: USER_ROLES.OWNER });

    const res = await postLogin({ username: "owner.uji", password: TEST_PASSWORD });
    const cookie = getAuthCookie(res);
    const token = cookie.split(";")[0]!.split("=")[1]!;

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: { id: user.id, username: "owner.uji", name: user.name, role: "owner" },
    });
    expect(res.text).not.toContain(token);
    expect(res.text).not.toContain("passwordHash");
    expect(res.text).not.toContain("$argon2");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toContain("Path=/");
    expect(cookie).toContain("Max-Age=28800");
    // NODE_ENV=test: Secure hanya aktif di production.
    expect(cookie).not.toContain("Secure");
  });

  it("username dinormalisasi (spasi dan huruf besar)", async () => {
    await createTestUser({ username: "staff.uji", role: USER_ROLES.STAFF });

    const res = await postLogin({ username: "  STAFF.Uji ", password: TEST_PASSWORD });

    expect(res.status).toBe(200);
  });

  it("user tidak ada dan password salah menghasilkan respons identik", async () => {
    await createTestUser({ username: "owner.uji", role: USER_ROLES.OWNER });

    const unknownUser = await postLogin({ username: "tidak.ada", password: TEST_PASSWORD });
    const wrongPassword = await postLogin({ username: "owner.uji", password: "password-salah-sekali" });

    expect(unknownUser.status).toBe(401);
    expect(wrongPassword.status).toBe(401);
    expect(unknownUser.body).toEqual(INVALID_CREDENTIALS);
    expect(wrongPassword.body).toEqual(INVALID_CREDENTIALS);
  });

  it("user nonaktif tidak bisa login, dengan pesan yang sama", async () => {
    await createTestUser({ username: "nonaktif.uji", role: USER_ROLES.STAFF, isActive: false });

    const res = await postLogin({ username: "nonaktif.uji", password: TEST_PASSWORD });

    expect(res.status).toBe(401);
    expect(res.body).toEqual(INVALID_CREDENTIALS);
  });

  it("role dan userId palsu di body diabaikan", async () => {
    const staff = await createTestUser({ username: "staff.uji", role: USER_ROLES.STAFF });
    await createTestUser({ username: "owner.uji", role: USER_ROLES.OWNER });

    const res = await postLogin({ username: "staff.uji", password: TEST_PASSWORD, role: "owner", userId: 999 });

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(expect.objectContaining({ id: staff.id, role: "staff" }));
  });

  it("input injeksi pada username tidak menghasilkan error SQL", async () => {
    await createTestUser({ username: "owner.uji", role: USER_ROLES.OWNER });

    for (const username of ["' OR '1'='1' --", "owner.uji'; DROP TABLE users; --"]) {
      const res = await postLogin({ username, password: TEST_PASSWORD });
      expect(res.status).toBe(401);
      expect(res.body).toEqual(INVALID_CREDENTIALS);
    }
    expect(await prisma.user.count()).toBe(1);
  });

  it("rate limit: kegagalan ke-6 mengunci login 30 detik, lalu terbuka kembali", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-10-24T08:00:00Z"));
    await createTestUser({ username: "target.uji", role: USER_ROLES.OWNER });

    for (let attempt = 1; attempt <= 6; attempt += 1) {
      const res = await postLogin({ username: "target.uji", password: "password-salah-sekali" });
      expect(res.status).toBe(401);
    }

    // Saat terkunci, password benar pun ditolak.
    const locked = await postLogin({ username: "target.uji", password: TEST_PASSWORD });
    expect(locked.status).toBe(429);
    expect(locked.body.error.code).toBe("TOO_MANY_REQUESTS");

    vi.setSystemTime(new Date("2026-10-24T08:00:31Z"));
    const unlocked = await postLogin({ username: "target.uji", password: TEST_PASSWORD });
    expect(unlocked.status).toBe(200);
  });
});

describe("GET /api/auth/me dan sesi", () => {
  it("memulihkan user dari cookie", async () => {
    const user = await createTestUser({ username: "owner.uji", role: USER_ROLES.OWNER });
    const cookie = getAuthCookie(await postLogin({ username: "owner.uji", password: TEST_PASSWORD }));

    const res = await request(app).get("/api/auth/me").set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: { id: user.id, username: "owner.uji", name: user.name, role: "owner" } });
  });

  it("user yang dinonaktifkan ditolak pada request berikutnya", async () => {
    const user = await createTestUser({ username: "staff.uji", role: USER_ROLES.STAFF });
    const cookie = getAuthCookie(await postLogin({ username: "staff.uji", password: TEST_PASSWORD }));

    await prisma.user.update({ where: { id: user.id }, data: { isActive: false } });
    const res = await request(app).get("/api/auth/me").set("Cookie", cookie);

    expect(res.status).toBe(401);
  });

  it("role dibaca dari database, bukan dari token", async () => {
    const user = await createTestUser({ username: "staff.uji", role: USER_ROLES.STAFF });
    const cookie = getAuthCookie(await postLogin({ username: "staff.uji", password: TEST_PASSWORD }));

    await prisma.user.update({ where: { id: user.id }, data: { role: USER_ROLES.OWNER } });
    const res = await request(app).get("/api/auth/me").set("Cookie", cookie);

    expect(res.body.data.role).toBe("owner");
  });

  it("logout menghapus cookie (204)", async () => {
    const res = await request(app).post("/api/auth/logout").set("Origin", env.APP_ORIGIN);
    const cookie = getAuthCookie(res);

    expect(res.status).toBe(204);
    expect(cookie).toContain("Expires=Thu, 01 Jan 1970");
  });
});

describe("requireAuth + requireRole dengan user nyata (route khusus test)", () => {
  const roleTestApp = express()
    .use(cookieParser())
    .get("/khusus-owner", requireAuth, requireRole(USER_ROLES.OWNER), (_req, res) => {
      res.json({ data: "ok" });
    })
    .use(errorHandler);

  it("staff → 403, owner → 200", async () => {
    await createTestUser({ username: "staff.uji", role: USER_ROLES.STAFF });
    await createTestUser({ username: "owner.uji", role: USER_ROLES.OWNER });
    const staffCookie = getAuthCookie(await postLogin({ username: "staff.uji", password: TEST_PASSWORD }));
    const ownerCookie = getAuthCookie(await postLogin({ username: "owner.uji", password: TEST_PASSWORD }));

    expect((await request(roleTestApp).get("/khusus-owner").set("Cookie", staffCookie)).status).toBe(403);
    expect((await request(roleTestApp).get("/khusus-owner").set("Cookie", ownerCookie)).status).toBe(200);
  });
});
