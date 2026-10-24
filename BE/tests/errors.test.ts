import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { env } from "../src/config/env.js";

describe("Format error terpusat", () => {
  it("path tidak dikenal di luar /api mengembalikan 404 NOT_FOUND", async () => {
    const res = await request(app).get("/tidak-ada");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: { code: "NOT_FOUND", message: "Route tidak ditemukan." } });
  });

  it("body JSON rusak mengembalikan 400 VALIDATION_ERROR", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .set("Origin", env.APP_ORIGIN)
      .set("Content-Type", "application/json")
      .send("{rusak");

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("body melebihi batas mengembalikan 413 PAYLOAD_TOO_LARGE", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .set("Origin", env.APP_ORIGIN)
      .send({ isi: "x".repeat(200 * 1024) });

    expect(res.status).toBe(413);
    expect(res.body.error.code).toBe("PAYLOAD_TOO_LARGE");
  });

  it("tidak mengirim header X-Powered-By", async () => {
    const res = await request(app).get("/tidak-ada");

    expect(res.headers["x-powered-by"]).toBeUndefined();
  });
});
