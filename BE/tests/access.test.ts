// Pengujian akses tidak sah yang tidak membutuhkan database (SECURITY.md bagian 15).
import express from "express";
import { SignJWT } from "jose";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { env } from "../src/config/env.js";
import { AUTH_COOKIE_NAME, USER_ROLES, type UserRole } from "../src/constants/auth.constants.js";
import { errorHandler } from "../src/middlewares/error.middleware.js";
import { requireRole } from "../src/middlewares/role.middleware.js";

function signToken(secret: string, expiresAt: number): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("1")
    .setExpirationTime(expiresAt)
    .sign(new TextEncoder().encode(secret));
}

const nowInSeconds = () => Math.floor(Date.now() / 1000);

describe("Route non-publik tanpa kredensial yang valid", () => {
  it("GET /api/auth/me tanpa cookie → 401 UNAUTHENTICATED", async () => {
    const res = await request(app).get("/api/auth/me");

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHENTICATED");
  });

  it("route /api lain tanpa cookie → 401 (deny by default, tidak membocorkan 404)", async () => {
    const res = await request(app).get("/api/products");

    expect(res.status).toBe(401);
  });

  it("cookie rusak → 401", async () => {
    const res = await request(app).get("/api/auth/me").set("Cookie", `${AUTH_COOKIE_NAME}=bukan.jwt.valid`);

    expect(res.status).toBe(401);
  });

  it("token kedaluwarsa → 401", async () => {
    const token = await signToken(env.JWT_SECRET, nowInSeconds() - 60);
    const res = await request(app).get("/api/auth/me").set("Cookie", `${AUTH_COOKIE_NAME}=${token}`);

    expect(res.status).toBe(401);
  });

  it("token ditandatangani rahasia lain → 401", async () => {
    const token = await signToken("rahasia-lain-yang-juga-panjangnya-32-karakter", nowInSeconds() + 3600);
    const res = await request(app).get("/api/auth/me").set("Cookie", `${AUTH_COOKIE_NAME}=${token}`);

    expect(res.status).toBe(401);
  });
});

describe("Proteksi CSRF: Origin dan Content-Type", () => {
  it("POST dengan Origin asing → 403 FORBIDDEN", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .set("Origin", "https://situs-asing.example")
      .send({ username: "siapa", password: "apa" });

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe("FORBIDDEN");
  });

  it("POST tanpa Origin dan Referer → 403", async () => {
    const res = await request(app).post("/api/auth/logout");

    expect(res.status).toBe(403);
  });

  it("POST dengan Referer dari origin aplikasi (tanpa Origin) diterima", async () => {
    const res = await request(app).post("/api/auth/logout").set("Referer", `${env.APP_ORIGIN}/login`);

    expect(res.status).toBe(204);
  });

  it("POST dengan Content-Type bukan JSON → 415 UNSUPPORTED_MEDIA_TYPE", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .set("Origin", env.APP_ORIGIN)
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send("username=a&password=b");

    expect(res.status).toBe(415);
    expect(res.body.error.code).toBe("UNSUPPORTED_MEDIA_TYPE");
  });

  it("login tanpa field wajib → 400 VALIDATION_ERROR dengan details per field", async () => {
    const res = await request(app).post("/api/auth/login").set("Origin", env.APP_ORIGIN).send({});

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(res.body.error.details.map((detail: { field: string }) => detail.field).sort()).toEqual([
      "password",
      "username",
    ]);
  });
});

describe("Role middleware (route khusus test, tidak dipasang di aplikasi production)", () => {
  function createRoleTestApp(role: UserRole, ...allowedRoles: UserRole[]) {
    return express()
      .use((req, _res, next) => {
        req.user = { id: 1, username: "uji", name: "Uji", role };
        next();
      })
      .get("/rahasia", requireRole(...allowedRoles), (_req, res) => {
        res.json({ data: "ok" });
      })
      .use(errorHandler);
  }

  it("role tanpa izin → 403 FORBIDDEN", async () => {
    const res = await request(createRoleTestApp(USER_ROLES.STAFF, USER_ROLES.OWNER)).get("/rahasia");

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe("FORBIDDEN");
  });

  it("role yang diizinkan → 200", async () => {
    const res = await request(createRoleTestApp(USER_ROLES.OWNER, USER_ROLES.OWNER)).get("/rahasia");

    expect(res.status).toBe(200);
  });

  it("tanpa daftar role → semua ditolak (deny by default)", async () => {
    const res = await request(createRoleTestApp(USER_ROLES.OWNER)).get("/rahasia");

    expect(res.status).toBe(403);
  });
});
