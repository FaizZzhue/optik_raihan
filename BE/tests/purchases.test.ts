// Pembelian dan ledger stok (M-06, M-08; PRD FR-06.x, FR-08.1 sampai FR-08.3; AC-06.x, AC-08.x) terhadap database test.
// Termasuk test integritas wajib PROJECT-CONTEXT.md bagian 7.
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { USER_ROLES } from "../src/constants/auth.constants.js";
import { prisma } from "../src/lib/prisma.js";
import { apiAs, createSessionCookie, createTestUser, deleteAllBusinessData, deleteAllUsers } from "./helpers.js";

let owner: ReturnType<typeof apiAs>;
let staff: ReturnType<typeof apiAs>;
let ownerId: number;
let supplierId: number;
let frameId: number;
let lensId: number;

beforeAll(async () => {
  await deleteAllUsers();
  const ownerUser = await createTestUser({ username: "owner.beli", role: USER_ROLES.OWNER });
  const staffUser = await createTestUser({ username: "staff.beli", role: USER_ROLES.STAFF });
  ownerId = ownerUser.id;
  owner = apiAs(await createSessionCookie(ownerUser.id));
  staff = apiAs(await createSessionCookie(staffUser.id));
});

beforeEach(async () => {
  await deleteAllBusinessData();
  const category = await prisma.category.create({ data: { name: "Frame" } });
  supplierId = (await prisma.supplier.create({ data: { name: "PT Lensa Jaya" } })).id;
  const product = (name: string) =>
    prisma.product.create({ data: { name, categoryId: category.id, sellPrice: "100000", createdById: ownerId } });
  frameId = (await product("Frame A")).id;
  lensId = (await product("Lensa B")).id;
});

afterAll(async () => {
  await deleteAllUsers();
  await prisma.$disconnect();
});

const purchaseBody = (items: { productId: number; quantity: number; unitCost: string }[]) => ({
  supplierId,
  supplierInvoiceNo: "FK-001",
  items,
});

async function stockOf(productId: number): Promise<number> {
  return (await prisma.product.findUniqueOrThrow({ where: { id: productId } })).stockQty;
}

// Invarian ledger (AC-08.2): stok saat ini = jumlah mutasi = stock_after mutasi terakhir.
async function expectLedgerReconciles(productId: number) {
  const stock = await stockOf(productId);
  const sum = await prisma.stockMovement.aggregate({ where: { productId }, _sum: { quantityChange: true } });
  const last = await prisma.stockMovement.findFirst({ where: { productId }, orderBy: { id: "desc" } });
  expect(sum._sum.quantityChange ?? 0).toBe(stock);
  expect(last?.stockAfter ?? 0).toBe(stock);
}

describe("Akses pembelian (hanya owner, PRD bagian 3)", () => {
  it("pegawai ditolak untuk daftar, detail, dan simpan; stok tidak berubah", async () => {
    const responses = await Promise.all([
      staff.get("/api/purchases"),
      staff.get("/api/purchases/1"),
      staff.post("/api/purchases", purchaseBody([{ productId: frameId, quantity: 1, unitCost: "1" }])),
    ]);

    expect(responses.map((res) => res.status)).toEqual([403, 403, 403]);
    expect(await stockOf(frameId)).toBe(0);
  });
});

describe("POST /api/purchases", () => {
  it("menyimpan pembelian: total dihitung BE, stok bertambah, mutasi tercatat (AC-06.1, AC-06.2, AC-08.1)", async () => {
    const res = await owner.post(
      "/api/purchases",
      purchaseBody([
        { productId: lensId, quantity: 2, unitCost: "50000.50" },
        { productId: frameId, quantity: 3, unitCost: "80000" },
      ]),
    );

    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({
      supplier: { id: supplierId, name: "PT Lensa Jaya" },
      supplierInvoiceNo: "FK-001",
      total: "340001.00",
      createdBy: { id: ownerId },
    });
    expect(res.body.data.items).toHaveLength(2);
    expect(await stockOf(frameId)).toBe(3);
    expect(await stockOf(lensId)).toBe(2);
    const movements = await prisma.stockMovement.findMany({ where: { purchaseId: res.body.data.id } });
    expect(movements.map((m) => ({ type: m.movementType, change: m.quantityChange, by: m.createdById })).sort((a, b) => a.change - b.change)).toEqual([
      { type: "purchase_in", change: 2, by: ownerId },
      { type: "purchase_in", change: 3, by: ownerId },
    ]);
    await expectLedgerReconciles(frameId);
    await expectLedgerReconciles(lensId);
  });

  it("harga beli item adalah snapshot; cost_price barang tidak diubah (AC-06.3, P-05)", async () => {
    const first = await owner.post("/api/purchases", purchaseBody([{ productId: frameId, quantity: 1, unitCost: "70000" }]));
    await owner.post("/api/purchases", purchaseBody([{ productId: frameId, quantity: 1, unitCost: "75000" }]));

    const detail = await owner.get(`/api/purchases/${first.body.data.id}`);

    expect(detail.body.data.items[0].unitCost).toBe("70000.00");
    expect((await prisma.product.findUniqueOrThrow({ where: { id: frameId } })).costPrice.toFixed(2)).toBe("0.00");
  });

  it("validasi: tanpa barang, jumlah 0, harga titik ribuan, barang ganda → 400 per field", async () => {
    const empty = await owner.post("/api/purchases", purchaseBody([]));
    const invalid = await owner.post(
      "/api/purchases",
      purchaseBody([
        { productId: frameId, quantity: 0, unitCost: "1.250.000" },
        { productId: frameId, quantity: 1, unitCost: "1" },
      ]),
    );

    expect(empty.status).toBe(400);
    expect(invalid.status).toBe(400);
    expect(invalid.body.error.details.map((d: { field: string }) => d.field).sort()).toEqual([
      "items.0.quantity",
      "items.0.unitCost",
      "items.1.productId",
    ]);
  });

  it("total melebihi NUMERIC(14,2) → 400, tidak menjadi error server", async () => {
    const res = await owner.post(
      "/api/purchases",
      purchaseBody([{ productId: frameId, quantity: 100_000, unitCost: "999999999999" }]),
    );

    expect(res.status).toBe(400);
  });

  it("satu barang nonaktif → 409 pada field barang itu, dan TIDAK ADA yang tersimpan (semua atau tidak sama sekali)", async () => {
    await prisma.product.update({ where: { id: lensId }, data: { isActive: false } });

    const res = await owner.post(
      "/api/purchases",
      purchaseBody([
        { productId: frameId, quantity: 5, unitCost: "1" },
        { productId: lensId, quantity: 5, unitCost: "1" },
      ]),
    );

    expect(res.status).toBe(409);
    expect(res.body.error.details[0].field).toBe("items.1.productId");
    expect(await prisma.purchase.count()).toBe(0);
    expect(await prisma.stockMovement.count()).toBe(0);
    expect(await stockOf(frameId)).toBe(0);
  });

  it("supplier nonaktif → 409 pada field supplierId", async () => {
    await prisma.supplier.update({ where: { id: supplierId }, data: { isActive: false } });

    const res = await owner.post("/api/purchases", purchaseBody([{ productId: frameId, quantity: 1, unitCost: "1" }]));

    expect(res.status).toBe(409);
    expect(res.body.error.details[0].field).toBe("supplierId");
  });

  it("pembelian serentak atas barang yang sama: stok = total semua pembelian, ledger tetap konsisten", async () => {
    const quantities = [1, 2, 3, 4, 5, 6, 7, 8];

    const results = await Promise.all(
      quantities.map((quantity) =>
        owner.post(
          "/api/purchases",
          purchaseBody([
            { productId: frameId, quantity, unitCost: "1" },
            { productId: lensId, quantity, unitCost: "1" },
          ]),
        ),
      ),
    );

    expect(results.every((res) => res.status === 201)).toBe(true);
    expect(await stockOf(frameId)).toBe(36);
    const stockAfterValues = (await prisma.stockMovement.findMany({ where: { productId: frameId } })).map((m) => m.stockAfter);
    expect(new Set(stockAfterValues).size).toBe(quantities.length);
    await expectLedgerReconciles(frameId);
    await expectLedgerReconciles(lensId);
  });
});

describe("Daftar, detail, dan kartu stok", () => {
  it("daftar terbaru lebih dulu dengan jumlah item; filter supplier; detail 404", async () => {
    await owner.post("/api/purchases", purchaseBody([{ productId: frameId, quantity: 1, unitCost: "1" }]));
    await owner.post(
      "/api/purchases",
      purchaseBody([
        { productId: frameId, quantity: 1, unitCost: "1" },
        { productId: lensId, quantity: 1, unitCost: "1" },
      ]),
    );

    const list = await owner.get(`/api/purchases?supplierId=${supplierId}`);

    expect(list.body.meta.totalItems).toBe(2);
    expect(list.body.data.map((p: { itemCount: number }) => p.itemCount)).toEqual([2, 1]);
    expect((await owner.get("/api/purchases/999999")).status).toBe(404);
  });

  it("kartu stok terlihat oleh pegawai (FR-08.3), mutasi terbaru lebih dulu", async () => {
    await owner.post("/api/purchases", purchaseBody([{ productId: frameId, quantity: 2, unitCost: "1" }]));
    await owner.post("/api/purchases", purchaseBody([{ productId: frameId, quantity: 5, unitCost: "1" }]));

    const res = await staff.get(`/api/products/${frameId}/stock-movements`);

    expect(res.status).toBe(200);
    expect(res.body.data.map((m: { quantityChange: number; stockAfter: number }) => [m.quantityChange, m.stockAfter])).toEqual([
      [5, 7],
      [2, 2],
    ]);
    expect((await staff.get("/api/products/999999/stock-movements")).status).toBe(404);
  });

  it("stok tetap tidak bisa diubah lewat PATCH barang setelah ada mutasi (AC-08.3)", async () => {
    await owner.post("/api/purchases", purchaseBody([{ productId: frameId, quantity: 4, unitCost: "1" }]));

    await owner.patch(`/api/products/${frameId}`, { stockQty: 100 });

    expect(await stockOf(frameId)).toBe(4);
    await expectLedgerReconciles(frameId);
  });
});

describe("Data yang sudah dipakai tidak dihapus permanen (AC-03.2)", () => {
  it("hapus barang dan supplier yang sudah dipakai pembelian → 409", async () => {
    await owner.post("/api/purchases", purchaseBody([{ productId: frameId, quantity: 1, unitCost: "1" }]));

    const product = await owner.delete(`/api/products/${frameId}`);
    const supplier = await owner.delete(`/api/suppliers/${supplierId}`);

    expect(product.status).toBe(409);
    expect(supplier.status).toBe(409);
    expect(await prisma.product.count({ where: { id: frameId } })).toBe(1);
  });
});

describe("Constraint ledger di database (lapis terakhir)", () => {
  it("mutasi tanpa sumber, bertanda salah, atau stock_after negatif ditolak", async () => {
    const base = { productId: frameId, movementType: "purchase_in" as const, createdById: ownerId };
    const purchase = await prisma.purchase.create({ data: { supplierId, total: "0", createdById: ownerId } });

    await expect(prisma.stockMovement.create({ data: { ...base, quantityChange: 1, stockAfter: 1 } })).rejects.toThrow();
    await expect(
      prisma.stockMovement.create({ data: { ...base, quantityChange: -1, stockAfter: 0, purchaseId: purchase.id } }),
    ).rejects.toThrow();
    await expect(
      prisma.stockMovement.create({ data: { ...base, quantityChange: 1, stockAfter: -1, purchaseId: purchase.id } }),
    ).rejects.toThrow();
  });

  it("line_total yang tidak sama dengan jumlah × harga ditolak", async () => {
    const purchase = await prisma.purchase.create({ data: { supplierId, total: "0", createdById: ownerId } });

    await expect(
      prisma.purchaseItem.create({
        data: { purchaseId: purchase.id, productId: frameId, quantity: 2, unitCost: "10", lineTotal: "25" },
      }),
    ).rejects.toThrow();
  });
});
