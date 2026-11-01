// Barang (M-03, AC-03.1 sampai AC-03.4; PRD FR-03.2, FR-03.3, FR-03.6 sampai FR-03.9) terhadap database test.
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { env } from "../src/config/env.js";
import { USER_ROLES } from "../src/constants/auth.constants.js";
import { prisma } from "../src/lib/prisma.js";
import { apiAs, createSessionCookie, createTestUser, deleteAllCatalogData, deleteAllUsers } from "./helpers.js";

const SKU_PATTERN = /^P-\d{6}$/;

let owner: ReturnType<typeof apiAs>;
let staff: ReturnType<typeof apiAs>;
let ownerId: number;
let frameCategoryId: number;
let lensCategoryId: number;

beforeAll(async () => {
  await deleteAllUsers();
  const ownerUser = await createTestUser({ username: "owner.barang", role: USER_ROLES.OWNER });
  const staffUser = await createTestUser({ username: "staff.barang", role: USER_ROLES.STAFF });
  ownerId = ownerUser.id;
  owner = apiAs(await createSessionCookie(ownerUser.id));
  staff = apiAs(await createSessionCookie(staffUser.id));
});

beforeEach(async () => {
  await deleteAllCatalogData();
  frameCategoryId = (await prisma.category.create({ data: { name: "Frame" } })).id;
  lensCategoryId = (await prisma.category.create({ data: { name: "Lensa jadi" } })).id;
});

afterAll(async () => {
  await deleteAllUsers();
  await prisma.$disconnect();
});

function createProduct(name: string, overrides: { categoryId?: number; isActive?: boolean } = {}) {
  return prisma.product.create({
    data: {
      name,
      categoryId: overrides.categoryId ?? frameCategoryId,
      sellPrice: "100000",
      isActive: overrides.isActive ?? true,
      createdById: ownerId,
    },
  });
}

describe("POST /api/products", () => {
  it("owner menambah barang: SKU otomatis, stok 0, harga string 2 desimal", async () => {
    const res = await owner.post("/api/products", {
      name: "  Frame Titanium A  ",
      categoryId: frameCategoryId,
      sellPrice: "1250000",
      costPrice: "800000.5",
      description: "Warna hitam",
    });

    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({
      name: "Frame Titanium A",
      category: { id: frameCategoryId, name: "Frame", isActive: true },
      sellPrice: "1250000.00",
      costPrice: "800000.50",
      stockQty: 0,
      isActive: true,
      description: "Warna hitam",
    });
    expect(res.body.data.sku).toMatch(SKU_PATTERN);
    expect(res.body.data).not.toHaveProperty("createdById");
  });

  it("pegawai boleh menambah barang (PRD bagian 3); pelaku tercatat dari sesi", async () => {
    const res = await staff.post("/api/products", { name: "Lensa A", categoryId: lensCategoryId, sellPrice: "50000" });

    expect(res.status).toBe(201);
    expect(res.body.data.costPrice).toBe("0.00");
    const stored = await prisma.product.findUniqueOrThrow({ where: { id: res.body.data.id }, include: { createdBy: true } });
    expect(stored.createdBy.username).toBe("staff.barang");
  });

  it("sku, stockQty, dan createdById dari body diabaikan (FR-03.3, FR-03.9)", async () => {
    const res = await owner.post("/api/products", {
      name: "Frame B",
      categoryId: frameCategoryId,
      sellPrice: "100000",
      sku: "HACK-1",
      stockQty: 99,
      createdById: 123456,
    });

    expect(res.status).toBe(201);
    expect(res.body.data.sku).toMatch(SKU_PATTERN);
    expect(res.body.data.stockQty).toBe(0);
  });

  it("SKU unik untuk setiap barang (AC-03.4)", async () => {
    const skus: string[] = [];
    for (const name of ["A", "B", "C"]) {
      const res = await owner.post("/api/products", { name, categoryId: frameCategoryId, sellPrice: "1" });
      skus.push(res.body.data.sku);
    }

    expect(new Set(skus).size).toBe(3);
  });

  it.each([
    ["titik ribuan", "1.250.000"],
    ["negatif", "-1"],
    ["bukan angka", "abc"],
    ["3 desimal", "10.123"],
    ["13 digit", "1234567890123"],
  ])("harga jual %s ditolak → 400 pada field sellPrice", async (_label, sellPrice) => {
    const res = await owner.post("/api/products", { name: "X", categoryId: frameCategoryId, sellPrice });

    expect(res.status).toBe(400);
    expect(res.body.error.details.map((d: { field: string }) => d.field)).toEqual(["sellPrice"]);
  });

  it("harga sebagai number (bukan string) dan field wajib kosong → 400", async () => {
    const asNumber = await owner.post("/api/products", { name: "X", categoryId: frameCategoryId, sellPrice: 1000 });
    const empty = await owner.post("/api/products", {});

    expect(asNumber.status).toBe(400);
    expect(empty.status).toBe(400);
    expect(empty.body.error.details.map((d: { field: string }) => d.field).sort()).toEqual([
      "categoryId",
      "name",
      "sellPrice",
    ]);
  });

  it("kategori nonaktif atau tidak ada → 409 pada field categoryId", async () => {
    await prisma.category.update({ where: { id: lensCategoryId }, data: { isActive: false } });

    const inactive = await owner.post("/api/products", { name: "X", categoryId: lensCategoryId, sellPrice: "1" });
    const missing = await owner.post("/api/products", { name: "X", categoryId: 999999, sellPrice: "1" });

    expect(inactive.status).toBe(409);
    expect(inactive.body.error.details[0].field).toBe("categoryId");
    expect(missing.status).toBe(409);
    expect(await prisma.product.count()).toBe(0);
  });
});

describe("GET /api/products", () => {
  it("pagination server-side dengan meta (AC-03.3)", async () => {
    for (const name of ["A", "B", "C", "D", "E"]) {
      await createProduct(name);
    }

    const res = await staff.get("/api/products?page=2&pageSize=2");

    expect(res.status).toBe(200);
    expect(res.body.meta).toEqual({ page: 2, pageSize: 2, totalItems: 5, totalPages: 3 });
    expect(res.body.data).toHaveLength(2);
  });

  it("default pageSize 20; pageSize > 100 atau page 0 → 400", async () => {
    await createProduct("A");

    const res = await owner.get("/api/products");

    expect(res.body.meta).toEqual({ page: 1, pageSize: 20, totalItems: 1, totalPages: 1 });
    expect((await owner.get("/api/products?pageSize=101")).status).toBe(400);
    expect((await owner.get("/api/products?page=0")).status).toBe(400);
  });

  it("pencarian nama tanpa membedakan huruf besar/kecil dan pencarian SKU", async () => {
    const titanium = await createProduct("Frame Titanium");
    await createProduct("Lensa Minus", { categoryId: lensCategoryId });

    const byName = await owner.get("/api/products?search=TITAN");
    const bySku = await owner.get(`/api/products?search=${titanium.sku.toLowerCase()}`);

    expect(byName.body.data.map((p: { name: string }) => p.name)).toEqual(["Frame Titanium"]);
    expect(bySku.body.data.map((p: { name: string }) => p.name)).toEqual(["Frame Titanium"]);
  });

  it("karakter wildcard di pencarian diperlakukan sebagai teks biasa", async () => {
    await createProduct("Frame Titanium");

    const percent = await owner.get(`/api/products?search=${encodeURIComponent("%")}`);
    const underscore = await owner.get("/api/products?search=_");

    expect(percent.body.data).toHaveLength(0);
    expect(underscore.body.data).toHaveLength(0);
  });

  it("filter kategori dan status", async () => {
    await createProduct("Frame Aktif");
    await createProduct("Frame Nonaktif", { isActive: false });
    await createProduct("Lensa Aktif", { categoryId: lensCategoryId });

    const byCategory = await owner.get(`/api/products?categoryId=${frameCategoryId}`);
    const inactive = await owner.get("/api/products?status=inactive");
    const activeFrames = await owner.get(`/api/products?categoryId=${frameCategoryId}&status=active`);

    expect(byCategory.body.meta.totalItems).toBe(2);
    expect(inactive.body.data.map((p: { name: string }) => p.name)).toEqual(["Frame Nonaktif"]);
    expect(activeFrames.body.data.map((p: { name: string }) => p.name)).toEqual(["Frame Aktif"]);
  });

  it("parameter tidak valid → 400; parameter tidak dikenal diabaikan", async () => {
    expect((await owner.get("/api/products?categoryId=abc")).status).toBe(400);
    expect((await owner.get("/api/products?status=aktif")).status).toBe(400);
    expect((await owner.get("/api/products?sort=password")).status).toBe(200);
  });

  it("detail: 404 untuk id tidak ada", async () => {
    const product = await createProduct("Frame A");

    expect((await owner.get(`/api/products/${product.id}`)).body.data.name).toBe("Frame A");
    expect((await owner.get("/api/products/999999")).status).toBe(404);
  });
});

describe("PATCH /api/products/:id", () => {
  it("pegawai boleh mengubah harga jual dan data barang (PRD bagian 3)", async () => {
    const product = await createProduct("Frame A");

    const res = await staff.patch(`/api/products/${product.id}`, {
      name: "Frame A2",
      sellPrice: "150000",
      costPrice: "90000",
      description: "",
      categoryId: lensCategoryId,
    });

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({
      name: "Frame A2",
      sellPrice: "150000.00",
      costPrice: "90000.00",
      description: null,
      category: { id: lensCategoryId },
    });
  });

  it("stok dan SKU tidak bisa diubah lewat API (AC-08.3)", async () => {
    const product = await createProduct("Frame A");

    const res = await owner.patch(`/api/products/${product.id}`, { name: "Frame A", stockQty: 50, sku: "P-999999" });

    expect(res.status).toBe(200);
    expect(res.body.data.stockQty).toBe(0);
    expect(res.body.data.sku).toBe(product.sku);
  });

  it("nonaktifkan lalu aktifkan kembali", async () => {
    const product = await createProduct("Frame A");

    const off = await owner.patch(`/api/products/${product.id}`, { isActive: false });
    const on = await owner.patch(`/api/products/${product.id}`, { isActive: true });

    expect(off.body.data.isActive).toBe(false);
    expect(on.body.data.isActive).toBe(true);
  });

  it("pindah ke kategori nonaktif → 409; tetap di kategori nonaktif yang sama boleh", async () => {
    const product = await createProduct("Frame A");
    await prisma.category.update({ where: { id: frameCategoryId }, data: { isActive: false } });
    await prisma.category.update({ where: { id: lensCategoryId }, data: { isActive: false } });

    const moved = await owner.patch(`/api/products/${product.id}`, { categoryId: lensCategoryId });
    const unchanged = await owner.patch(`/api/products/${product.id}`, { categoryId: frameCategoryId, sellPrice: "2" });

    expect(moved.status).toBe(409);
    expect(unchanged.status).toBe(200);
  });

  it("body kosong → 400; id tidak ada → 404", async () => {
    const product = await createProduct("Frame A");

    expect((await owner.patch(`/api/products/${product.id}`, {})).status).toBe(400);
    expect((await owner.patch("/api/products/999999", { name: "X" })).status).toBe(404);
  });
});

describe("DELETE /api/products/:id", () => {
  it("pegawai tidak boleh menghapus → 403, barang tetap ada", async () => {
    const product = await createProduct("Frame A");

    const res = await staff.delete(`/api/products/${product.id}`);

    expect(res.status).toBe(403);
    expect(await prisma.product.count()).toBe(1);
  });

  it("owner menghapus barang yang belum bertransaksi → 204, lalu 404", async () => {
    const product = await createProduct("Frame A");

    expect((await owner.delete(`/api/products/${product.id}`)).status).toBe(204);
    expect((await owner.delete(`/api/products/${product.id}`)).status).toBe(404);
  });
});

describe("Akses barang tanpa sesi", () => {
  it("POST tanpa cookie → 401 dan tidak ada data tersimpan", async () => {
    const res = await request(app).post("/api/products").set("Origin", env.APP_ORIGIN).send({ name: "X" });

    expect(res.status).toBe(401);
    expect(await prisma.product.count()).toBe(0);
  });
});

describe("Constraint database barang (lapis terakhir)", () => {
  it("SKU dari sequence database saat insert langsung", async () => {
    const product = await createProduct("Frame A");

    expect(product.sku).toMatch(SKU_PATTERN);
  });

  it("stok negatif ditolak CHECK products_stock_qty_non_negative", async () => {
    const product = await createProduct("Frame A");

    await expect(prisma.product.update({ where: { id: product.id }, data: { stockQty: -1 } })).rejects.toThrow();
  });

  it("harga negatif ditolak CHECK", async () => {
    await expect(
      prisma.product.create({
        data: { name: "X", categoryId: frameCategoryId, sellPrice: "-1", createdById: ownerId },
      }),
    ).rejects.toThrow();
  });

  it("hapus kategori yang dipakai barang ditolak FK RESTRICT", async () => {
    await createProduct("Frame A");

    await expect(prisma.category.delete({ where: { id: frameCategoryId } })).rejects.toThrow();
  });
});
