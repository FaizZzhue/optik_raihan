// Supplier (M-05, PRD FR-05.1; Tahap 4) terhadap database test.
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { USER_ROLES } from "../src/constants/auth.constants.js";
import { prisma } from "../src/lib/prisma.js";
import { apiAs, createSessionCookie, createTestUser, deleteAllBusinessData, deleteAllUsers } from "./helpers.js";

let owner: ReturnType<typeof apiAs>;
let staff: ReturnType<typeof apiAs>;

beforeAll(async () => {
  await deleteAllUsers();
  const ownerUser = await createTestUser({ username: "owner.supplier", role: USER_ROLES.OWNER });
  const staffUser = await createTestUser({ username: "staff.supplier", role: USER_ROLES.STAFF });
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

function createSupplier(name: string, isActive = true) {
  return prisma.supplier.create({ data: { name, isActive } });
}

describe("Akses supplier (hanya owner, DEC-037)", () => {
  it("tanpa sesi → 401", async () => {
    expect((await request(app).get("/api/suppliers")).status).toBe(401);
  });

  it("pegawai ditolak untuk semua aksi (403) dan data tidak berubah", async () => {
    const supplier = await createSupplier("PT Lensa Jaya");

    const responses = await Promise.all([
      staff.get("/api/suppliers"),
      staff.get(`/api/suppliers/${supplier.id}`),
      staff.post("/api/suppliers", { name: "Baru" }),
      staff.patch(`/api/suppliers/${supplier.id}`, { name: "Diubah" }),
      staff.delete(`/api/suppliers/${supplier.id}`),
    ]);

    expect(responses.map((res) => res.status)).toEqual([403, 403, 403, 403, 403]);
    expect(await prisma.supplier.findMany({ select: { name: true } })).toEqual([{ name: "PT Lensa Jaya" }]);
  });
});

describe("CRUD supplier oleh owner", () => {
  it("tambah: field di-trim, teks opsional kosong menjadi null", async () => {
    const res = await owner.post("/api/suppliers", {
      name: "  PT Lensa Jaya ",
      phone: " 0812-3456-7890 ",
      address: "",
      notes: "Kirim tiap Senin",
    });

    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({
      name: "PT Lensa Jaya",
      phone: "0812-3456-7890",
      address: null,
      notes: "Kirim tiap Senin",
      isActive: true,
    });
  });

  it("nama kosong atau terlalu panjang dan telepon terlalu panjang → 400 per field", async () => {
    const res = await owner.post("/api/suppliers", { name: " ", phone: "1".repeat(31) });

    expect(res.status).toBe(400);
    expect(res.body.error.details.map((d: { field: string }) => d.field).sort()).toEqual(["name", "phone"]);
  });

  it("daftar urut nama dan filter status", async () => {
    await createSupplier("Zeta Optik");
    await createSupplier("Alfa Lensa", false);

    const all = await owner.get("/api/suppliers");
    const active = await owner.get("/api/suppliers?status=active");

    expect(all.body.data.map((s: { name: string }) => s.name)).toEqual(["Alfa Lensa", "Zeta Optik"]);
    expect(active.body.data.map((s: { name: string }) => s.name)).toEqual(["Zeta Optik"]);
    expect((await owner.get("/api/suppliers?status=x")).status).toBe(400);
  });

  it("ubah data, kosongkan telepon, nonaktifkan", async () => {
    const supplier = await prisma.supplier.create({ data: { name: "PT A", phone: "0811" } });

    const res = await owner.patch(`/api/suppliers/${supplier.id}`, { name: "PT A Baru", phone: "", isActive: false });

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ name: "PT A Baru", phone: null, isActive: false });
  });

  it("body kosong → 400; id tidak ada → 404; id bukan angka → 400", async () => {
    const supplier = await createSupplier("PT A");

    expect((await owner.patch(`/api/suppliers/${supplier.id}`, {})).status).toBe(400);
    expect((await owner.patch("/api/suppliers/999999", { name: "X" })).status).toBe(404);
    expect((await owner.get("/api/suppliers/999999")).status).toBe(404);
    expect((await owner.get("/api/suppliers/abc")).status).toBe(400);
  });

  it("hapus supplier yang belum dipakai → 204, lalu 404", async () => {
    const supplier = await createSupplier("PT A");

    expect((await owner.delete(`/api/suppliers/${supplier.id}`)).status).toBe(204);
    expect((await owner.delete(`/api/suppliers/${supplier.id}`)).status).toBe(404);
  });
});
