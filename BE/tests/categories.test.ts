// Kategori (M-04, AC-03.1 sampai AC-03.3; PRD FR-04.1) terhadap database test.
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { USER_ROLES } from "../src/constants/auth.constants.js";
import { prisma } from "../src/lib/prisma.js";
import { apiAs, createSessionCookie, createTestUser, deleteAllBusinessData, deleteAllUsers } from "./helpers.js";

let owner: ReturnType<typeof apiAs>;
let staff: ReturnType<typeof apiAs>;
let ownerId: number;

beforeAll(async () => {
  await deleteAllUsers();
  const ownerUser = await createTestUser({ username: "owner.kategori", role: USER_ROLES.OWNER });
  const staffUser = await createTestUser({ username: "staff.kategori", role: USER_ROLES.STAFF });
  ownerId = ownerUser.id;
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

async function createCategory(name: string, isActive = true) {
  return prisma.category.create({ data: { name, isActive } });
}

describe("Akses kategori", () => {
  it("tanpa sesi → 401", async () => {
    const res = await request(app).get("/api/categories");

    expect(res.status).toBe(401);
  });

  it("pegawai boleh melihat daftar dan detail", async () => {
    const category = await createCategory("Frame");

    expect((await staff.get("/api/categories")).status).toBe(200);
    expect((await staff.get(`/api/categories/${category.id}`)).status).toBe(200);
  });

  it("pegawai tidak boleh menambah, mengubah, atau menghapus (403) dan data tidak berubah", async () => {
    const category = await createCategory("Frame");

    const created = await staff.post("/api/categories", { name: "Lensa jadi" });
    const updated = await staff.patch(`/api/categories/${category.id}`, { name: "Diubah" });
    const deleted = await staff.delete(`/api/categories/${category.id}`);

    expect([created.status, updated.status, deleted.status]).toEqual([403, 403, 403]);
    expect(await prisma.category.findMany({ select: { name: true } })).toEqual([{ name: "Frame" }]);
  });
});

describe("POST /api/categories", () => {
  it("owner menambah kategori: nama di-trim, aktif, belum punya barang", async () => {
    const res = await owner.post("/api/categories", { name: "  Kacamata jadi  " });

    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({ name: "Kacamata jadi", isActive: true, productCount: 0 });
    expect(typeof res.body.data.id).toBe("number");
    expect(new Date(res.body.data.createdAt).toISOString()).toBe(res.body.data.createdAt);
  });

  it("nama kosong atau terlalu panjang → 400 dengan details per field", async () => {
    const empty = await owner.post("/api/categories", { name: "   " });
    const tooLong = await owner.post("/api/categories", { name: "x".repeat(101) });

    expect(empty.status).toBe(400);
    expect(empty.body.error.details).toEqual([{ field: "name", message: "Nama kategori wajib diisi." }]);
    expect(tooLong.status).toBe(400);
    expect(tooLong.body.error.details[0].field).toBe("name");
  });

  it("nama kembar dengan huruf besar/kecil berbeda → 409 CONFLICT pada field name", async () => {
    await createCategory("Frame");

    const res = await owner.post("/api/categories", { name: " FRAME " });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("CONFLICT");
    expect(res.body.error.details).toEqual([{ field: "name", message: "Nama kategori sudah dipakai." }]);
    expect(await prisma.category.count()).toBe(1);
  });
});

describe("GET /api/categories", () => {
  it("urut nama, memuat jumlah barang, dan bisa difilter status", async () => {
    const frame = await createCategory("Frame");
    await createCategory("Aksesori lama", false);
    await prisma.product.create({ data: { name: "Frame A", categoryId: frame.id, sellPrice: "100000", createdById: ownerId } });

    const all = await owner.get("/api/categories");
    const active = await owner.get("/api/categories?status=active");
    const inactive = await owner.get("/api/categories?status=inactive");

    expect(all.body.data.map((c: { name: string }) => c.name)).toEqual(["Aksesori lama", "Frame"]);
    expect(all.body.data[1].productCount).toBe(1);
    expect(active.body.data.map((c: { name: string }) => c.name)).toEqual(["Frame"]);
    expect(inactive.body.data.map((c: { name: string }) => c.name)).toEqual(["Aksesori lama"]);
  });

  it("status tidak dikenal → 400", async () => {
    const res = await owner.get("/api/categories?status=semua");

    expect(res.status).toBe(400);
    expect(res.body.error.details[0].field).toBe("status");
  });

  it("detail: id tidak ada → 404, id bukan angka → 400", async () => {
    expect((await owner.get("/api/categories/999999")).status).toBe(404);
    expect((await owner.get("/api/categories/abc")).status).toBe(400);
  });
});

describe("PATCH /api/categories/:id", () => {
  it("owner mengubah nama dan menonaktifkan", async () => {
    const category = await createCategory("Frame");

    const res = await owner.patch(`/api/categories/${category.id}`, { name: "Frame kacamata", isActive: false });

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ name: "Frame kacamata", isActive: false });
  });

  it("mengubah kapitalisasi nama sendiri diperbolehkan", async () => {
    const category = await createCategory("frame");

    const res = await owner.patch(`/api/categories/${category.id}`, { name: "Frame" });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Frame");
  });

  it("memakai nama kategori lain → 409", async () => {
    await createCategory("Frame");
    const lens = await createCategory("Lensa jadi");

    const res = await owner.patch(`/api/categories/${lens.id}`, { name: "frame" });

    expect(res.status).toBe(409);
    expect(res.body.error.details[0].field).toBe("name");
  });

  it("body tanpa field yang dikenal → 400; id tidak ada → 404", async () => {
    const category = await createCategory("Frame");

    expect((await owner.patch(`/api/categories/${category.id}`, { productCount: 5 })).status).toBe(400);
    expect((await owner.patch("/api/categories/999999", { name: "X" })).status).toBe(404);
  });
});

describe("DELETE /api/categories/:id", () => {
  it("kategori tanpa barang dihapus permanen → 204, lalu 404", async () => {
    const category = await createCategory("Frame");

    expect((await owner.delete(`/api/categories/${category.id}`)).status).toBe(204);
    expect((await owner.delete(`/api/categories/${category.id}`)).status).toBe(404);
  });

  it("kategori yang dipakai barang → 409 dan tetap ada (AC-03.2)", async () => {
    const category = await createCategory("Frame");
    await prisma.product.create({ data: { name: "Frame A", categoryId: category.id, sellPrice: "100000", createdById: ownerId } });

    const res = await owner.delete(`/api/categories/${category.id}`);

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("CONFLICT");
    expect(await prisma.category.findUnique({ where: { id: category.id } })).not.toBeNull();
  });
});

describe("Constraint database kategori (lapis terakhir)", () => {
  it("insert langsung nama kembar beda huruf ditolak indeks unik lower(name)", async () => {
    await createCategory("Frame");

    await expect(createCategory("fRaMe")).rejects.toThrow();
  });
});
