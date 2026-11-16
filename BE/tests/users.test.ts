// Pengelolaan akun pegawai (M-01, PRD FR-01.6 sampai FR-01.9) terhadap database test.
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { USER_ROLES } from "../src/constants/auth.constants.js";
import { prisma } from "../src/lib/prisma.js";
import { verifyPassword } from "../src/utils/password.js";
import { TEST_PASSWORD, apiAs, createSessionCookie, createTestUser, deleteAllUsers } from "./helpers.js";

const NEW_PASSWORD = "Password-baru-pegawai-1";

let owner: ReturnType<typeof apiAs>;
let ownerId: number;
let staff: ReturnType<typeof apiAs>;
let staffId: number;

beforeEach(async () => {
  await deleteAllUsers();
  const ownerUser = await createTestUser({ username: "owner.akun", role: USER_ROLES.OWNER });
  const staffUser = await createTestUser({ username: "staff.akun", role: USER_ROLES.STAFF });
  ownerId = ownerUser.id;
  staffId = staffUser.id;
  owner = apiAs(await createSessionCookie(ownerUser.id));
  staff = apiAs(await createSessionCookie(staffUser.id));
});

afterAll(async () => {
  await deleteAllUsers();
  await prisma.$disconnect();
});

describe("Akses kelola akun (FR-01.7)", () => {
  it("pegawai tidak boleh melihat, membuat, mengubah, atau mereset akun (403)", async () => {
    const responses = await Promise.all([
      staff.get("/api/users"),
      staff.post("/api/users", { username: "baru", name: "Baru", password: NEW_PASSWORD }),
      staff.patch(`/api/users/${staffId}`, { isActive: false }),
      staff.post(`/api/users/${staffId}/reset-password`, { password: NEW_PASSWORD }),
    ]);

    expect(responses.map((res) => res.status)).toEqual([403, 403, 403, 403]);
    expect(await prisma.user.count()).toBe(2);
  });
});

describe("Owner mengelola akun pegawai (FR-01.6)", () => {
  it("daftar akun tanpa password hash", async () => {
    const res = await owner.get("/api/users");

    expect(res.status).toBe(200);
    expect(res.body.data.map((u: { username: string }) => u.username)).toEqual(["owner.akun", "staff.akun"]);
    expect(res.text).not.toContain("passwordHash");
    expect(res.text).not.toContain("$argon2");
  });

  it("membuat akun: default role pegawai, username dinormalisasi, password tersimpan sebagai hash", async () => {
    const res = await owner.post("/api/users", {
      username: "  Pegawai.Baru ",
      name: "Pegawai Baru",
      password: NEW_PASSWORD,
    });

    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({ username: "pegawai.baru", role: "staff", isActive: true });
    expect(res.text).not.toContain(NEW_PASSWORD);
    const stored = await prisma.user.findUniqueOrThrow({ where: { username: "pegawai.baru" } });
    expect(await verifyPassword(stored.passwordHash, NEW_PASSWORD)).toBe(true);
  });

  // DEC-043: role dari body diterima, tetapi hanya pegawai atau kasir. Owner tidak pernah bisa dibuat lewat API.
  it("membuat akun kasir; role owner ditolak 400 tanpa membuat akun", async () => {
    const cashier = await owner.post("/api/users", {
      username: "kasir.baru",
      name: "Kasir Baru",
      password: NEW_PASSWORD,
      role: "cashier",
    });
    const asOwner = await owner.post("/api/users", {
      username: "owner.palsu",
      name: "Owner Palsu",
      password: NEW_PASSWORD,
      role: "owner",
    });

    expect(cashier.status).toBe(201);
    expect(cashier.body.data).toMatchObject({ username: "kasir.baru", role: "cashier", isActive: true });
    expect(asOwner.status).toBe(400);
    expect(asOwner.body.error.details.map((d: { field: string }) => d.field)).toEqual(["role"]);
    expect(await prisma.user.findUnique({ where: { username: "owner.palsu" } })).toBeNull();
  });

  it("username kembar → 409 field username; password tidak valid (< 8 karakter / tanpa huruf besar / tanpa angka) dan username tidak valid → 400", async () => {
    const duplicate = await owner.post("/api/users", { username: "STAFF.akun", name: "X", password: NEW_PASSWORD });
    const invalid = await owner.post("/api/users", { username: "a b", name: "X", password: "Ab1" });
    const missingUpper = await owner.post("/api/users", { username: "valid.user", name: "X", password: "password123" });
    const missingNumber = await owner.post("/api/users", { username: "valid.user2", name: "X", password: "PasswordSaja" });

    expect(duplicate.status).toBe(409);
    expect(duplicate.body.error.details).toEqual([{ field: "username", message: "Username sudah dipakai." }]);
    expect(invalid.status).toBe(400);
    expect(invalid.body.error.details.map((d: { field: string }) => d.field).sort()).toEqual(["password", "username"]);
    for (const res of [missingUpper, missingNumber]) {
      expect(res.status).toBe(400);
      expect(res.body.error.details.map((d: { field: string }) => d.field)).toEqual(["password"]);
    }
  });

  it("menonaktifkan pegawai langsung memutus sesinya (AC-01.4), lalu mengaktifkan kembali", async () => {
    const off = await owner.patch(`/api/users/${staffId}`, { isActive: false });
    const blocked = await staff.get("/api/products");
    const on = await owner.patch(`/api/users/${staffId}`, { isActive: true });

    expect(off.body.data.isActive).toBe(false);
    expect(blocked.status).toBe(401);
    expect(on.body.data.isActive).toBe(true);
    expect((await staff.get("/api/products")).status).toBe(200);
  });

  it("akun owner tidak bisa diubah atau direset lewat API ini (mencegah owner terkunci)", async () => {
    const deactivateSelf = await owner.patch(`/api/users/${ownerId}`, { isActive: false });
    const resetOwner = await owner.post(`/api/users/${ownerId}/reset-password`, { password: NEW_PASSWORD });

    expect(deactivateSelf.status).toBe(403);
    expect(resetOwner.status).toBe(403);
    expect((await prisma.user.findUniqueOrThrow({ where: { id: ownerId } })).isActive).toBe(true);
  });

  it("reset password: password lama tidak berlaku, password baru berlaku (FR-01.9)", async () => {
    const res = await owner.post(`/api/users/${staffId}/reset-password`, { password: NEW_PASSWORD });

    expect(res.status).toBe(204);
    const stored = await prisma.user.findUniqueOrThrow({ where: { id: staffId } });
    expect(await verifyPassword(stored.passwordHash, NEW_PASSWORD)).toBe(true);
    expect(await verifyPassword(stored.passwordHash, TEST_PASSWORD)).toBe(false);
  });

  it("id tidak ada → 404; body kosong → 400", async () => {
    expect((await owner.patch("/api/users/999999", { isActive: false })).status).toBe(404);
    expect((await owner.patch(`/api/users/${staffId}`, {})).status).toBe(400);
  });
});

describe("Akses akun kasir (DEC-043)", () => {
  it("kasir hanya membaca katalog; tulis barang, kategori, pembelian, supplier, akun, dan log ditolak 403", async () => {
    const cashierUser = await createTestUser({ username: "kasir.akses", role: USER_ROLES.CASHIER });
    const cashier = apiAs(await createSessionCookie(cashierUser.id));

    const reads = await Promise.all([cashier.get("/api/products"), cashier.get("/api/categories")]);
    const denied = await Promise.all([
      cashier.post("/api/products", { name: "X", categoryId: 1, sellPrice: "1000", costPrice: "500" }),
      cashier.post("/api/categories", { name: "X" }),
      cashier.get("/api/purchases"),
      cashier.get("/api/suppliers"),
      cashier.get("/api/users"),
      cashier.get("/api/audit-logs"),
    ]);

    expect(reads.map((res) => res.status)).toEqual([200, 200]);
    expect(denied.map((res) => res.status)).toEqual([403, 403, 403, 403, 403, 403]);
  });

  it("owner bisa menonaktifkan dan mereset akun kasir", async () => {
    const cashierUser = await createTestUser({ username: "kasir.kelola", role: USER_ROLES.CASHIER });

    const off = await owner.patch(`/api/users/${cashierUser.id}`, { isActive: false });
    const reset = await owner.post(`/api/users/${cashierUser.id}/reset-password`, { password: NEW_PASSWORD });

    expect(off.status).toBe(200);
    expect(off.body.data).toMatchObject({ role: "cashier", isActive: false });
    expect(reset.status).toBe(204);
  });
});

describe("Audit kelola akun (FR-15.1)", () => {
  it("pembuatan, penonaktifan, aktivasi, dan reset akun tercatat tanpa password", async () => {
    const created = await owner.post("/api/users", { username: "audit.akun", name: "Audit", password: NEW_PASSWORD });
    const id = created.body.data.id;
    await owner.patch(`/api/users/${id}`, { isActive: false });
    await owner.patch(`/api/users/${id}`, { isActive: false });
    await owner.patch(`/api/users/${id}`, { isActive: true });
    await owner.post(`/api/users/${id}/reset-password`, { password: NEW_PASSWORD });

    const logs = await prisma.auditLog.findMany({ where: { entityId: id, entityType: "user" }, orderBy: { id: "asc" } });

    // Menonaktifkan akun yang sudah nonaktif tidak menghasilkan entri kedua.
    expect(logs.map((log) => log.action)).toEqual(["user_create", "user_deactivate", "user_activate", "password_reset"]);
    expect(logs.every((log) => log.actorId === ownerId)).toBe(true);
    expect(JSON.stringify(logs)).not.toContain(NEW_PASSWORD);
  });
});
