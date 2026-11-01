// Audit log (M-15, PRD FR-15.1 sampai FR-15.3) terhadap database test.
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { env } from "../src/config/env.js";
import { USER_ROLES } from "../src/constants/auth.constants.js";
import { prisma } from "../src/lib/prisma.js";
import {
  TEST_PASSWORD,
  apiAs,
  createSessionCookie,
  createTestUser,
  deleteAllBusinessData,
  deleteAllUsers,
} from "./helpers.js";

let owner: ReturnType<typeof apiAs>;
let staff: ReturnType<typeof apiAs>;
let ownerId: number;
let staffId: number;

beforeAll(async () => {
  await deleteAllUsers();
  const ownerUser = await createTestUser({ username: "owner.audit", role: USER_ROLES.OWNER });
  const staffUser = await createTestUser({ username: "staff.audit", role: USER_ROLES.STAFF });
  ownerId = ownerUser.id;
  staffId = staffUser.id;
  owner = apiAs(await createSessionCookie(ownerUser.id));
  staff = apiAs(await createSessionCookie(staffUser.id));
});

beforeEach(async () => {
  await deleteAllBusinessData();
});

afterAll(async () => {
  await deleteAllUsers();
  await prisma.$disconnect();
});

async function createProduct() {
  const category = await prisma.category.create({ data: { name: "Frame" } });
  return prisma.product.create({
    data: { name: "Frame A", categoryId: category.id, sellPrice: "100000", costPrice: "60000", createdById: ownerId },
  });
}

describe("Pencatatan audit", () => {
  it("login berhasil tercatat; login gagal tidak", async () => {
    const login = (password: string) =>
      request(app).post("/api/auth/login").set("Origin", env.APP_ORIGIN).send({ username: "staff.audit", password });

    expect((await login("password-salah-sekali")).status).toBe(401);
    expect((await login(TEST_PASSWORD)).status).toBe(200);

    const logs = await prisma.auditLog.findMany();
    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({ action: "login", actorId: staffId, entityType: "user", entityId: staffId });
  });

  it("perubahan harga jual/beli oleh pegawai tercatat dengan harga lama dan baru", async () => {
    const product = await createProduct();

    const res = await staff.patch(`/api/products/${product.id}`, { sellPrice: "125000", costPrice: "60000" });

    expect(res.status).toBe(200);
    const logs = await prisma.auditLog.findMany();
    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({
      action: "price_change",
      actorId: staffId,
      entityType: "product",
      entityId: product.id,
      details: { sku: product.sku, name: "Frame A", sellPrice: { from: "100000.00", to: "125000.00" } },
    });
  });

  it("mengubah selain harga, atau mengirim harga yang sama, tidak membuat entri", async () => {
    const product = await createProduct();

    await owner.patch(`/api/products/${product.id}`, { name: "Frame B", sellPrice: "100000.00" });

    expect(await prisma.auditLog.count()).toBe(0);
  });
});

describe("GET /api/audit-logs (FR-15.3)", () => {
  it("pegawai ditolak (403); owner melihat entri terbaru lebih dulu dengan nama pelaku", async () => {
    const product = await createProduct();
    await staff.patch(`/api/products/${product.id}`, { sellPrice: "110000" });
    await owner.patch(`/api/products/${product.id}`, { sellPrice: "120000" });

    expect((await staff.get("/api/audit-logs")).status).toBe(403);
    const res = await owner.get("/api/audit-logs?pageSize=1");

    expect(res.status).toBe(200);
    expect(res.body.meta).toEqual({ page: 1, pageSize: 1, totalItems: 2, totalPages: 2 });
    expect(res.body.data[0]).toMatchObject({
      action: "price_change",
      actor: { id: ownerId, username: "owner.audit" },
      details: { sellPrice: { from: "110000.00", to: "120000.00" } },
    });
  });

  it("filter aksi; aksi tidak dikenal → 400", async () => {
    await prisma.auditLog.create({ data: { actorId: ownerId, action: "login" } });
    await prisma.auditLog.create({ data: { actorId: ownerId, action: "user_create" } });

    const res = await owner.get("/api/audit-logs?action=login");

    expect(res.body.data.map((log: { action: string }) => log.action)).toEqual(["login"]);
    expect((await owner.get("/api/audit-logs?action=hapus")).status).toBe(400);
  });

  it("tidak ada route untuk mengubah atau menghapus audit log", async () => {
    const log = await prisma.auditLog.create({ data: { actorId: ownerId, action: "login" } });

    expect((await owner.delete(`/api/audit-logs/${log.id}`)).status).toBe(404);
    expect((await owner.patch(`/api/audit-logs/${log.id}`, { action: "x" })).status).toBe(404);
    expect(await prisma.auditLog.count()).toBe(1);
  });
});
