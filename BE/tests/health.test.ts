import request from "supertest";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { app } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";

afterEach(() => {
  vi.restoreAllMocks();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("GET /api/health", () => {
  it("mengembalikan status ok saat database terjangkau (butuh database test)", async () => {
    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: { status: "ok", database: "ok" } });
  });

  it("mengembalikan 500 INTERNAL_ERROR generik saat query database gagal", async () => {
    vi.spyOn(prisma, "$queryRaw").mockRejectedValueOnce(new Error("detail internal rahasia"));
    const logSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await request(app).get("/api/health");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan pada server." },
    });
    expect(res.text).not.toContain("detail internal rahasia");
    expect(res.text).not.toContain("at ");
    expect(logSpy).toHaveBeenCalled();
  });
});
