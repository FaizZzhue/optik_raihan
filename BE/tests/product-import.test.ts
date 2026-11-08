// Pengujian integrasi Import Dataset Faktur 42 Produk & Preview (M-04, FR-03.1, FR-03.3).
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { USER_ROLES } from "../src/constants/auth.constants.js";
import { prisma } from "../src/lib/prisma.js";
import {
  getInvoiceDatasetPreview,
  seedInvoiceDatasetToDatabase,
} from "../src/services/product-import.service.js";
import { listProducts } from "../src/services/products.service.js";
import { apiAs, createSessionCookie, createTestUser, deleteAllBusinessData, deleteAllUsers } from "./helpers.js";

let owner: ReturnType<typeof apiAs>;
let staff: ReturnType<typeof apiAs>;
let ownerId: number;

beforeAll(async () => {
  await deleteAllUsers();
  const ownerUser = await createTestUser({ username: "owner.import", role: USER_ROLES.OWNER });
  const staffUser = await createTestUser({ username: "staff.import", role: USER_ROLES.STAFF });
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

describe("Layanan Import Dataset Faktur Supplier", () => {
  it("getInvoiceDatasetPreview menyediakan pratinjau matematis sebelum import", async () => {
    const preview = await getInvoiceDatasetPreview();

    expect(preview.summary.totalItems).toBe(42);
    expect(preview.summary.totalQuantity).toBe(940);
    expect(preview.summary.totalReferenceSubtotal).toBe(9270000);
    expect(preview.summary.kacamataBacaCount).toBe(26);
    expect(preview.summary.kacamataMinusCount).toBe(16);
    expect(preview.summary.existingInDbCount).toBe(0);
    expect(preview.summary.pendingCreationCount).toBe(42);
    expect(preview.items.length).toBe(42);
    expect(preview.reconciliation.isValid).toBe(true);
  });

  it("seedInvoiceDatasetToDatabase membuat 42 produk dan 2 kategori secara aman", async () => {
    const result = await seedInvoiceDatasetToDatabase(ownerId);

    expect(result.createdProductsCount).toBe(42);
    expect(result.existingProductsCount).toBe(0);
    expect(result.categoriesCreated).toEqual(expect.arrayContaining(["Kacamata Baca", "Kacamata Minus"]));

    // Pastikan di database benar-benar ada 42 produk
    const totalProducts = await prisma.product.count();
    expect(totalProducts).toBe(42);

    // Kacamata Baca = 26 produk, Kacamata Minus = 16 produk
    const bacaCategory = await prisma.category.findFirst({
      where: { name: { equals: "Kacamata Baca", mode: "insensitive" } },
      include: { _count: { select: { products: true } } },
    });
    const minusCategory = await prisma.category.findFirst({
      where: { name: { equals: "Kacamata Minus", mode: "insensitive" } },
      include: { _count: { select: { products: true } } },
    });

    expect(bacaCategory?._count.products).toBe(26);
    expect(minusCategory?._count.products).toBe(16);

    // Semua produk memiliki SKU internal otomatis (P-XXXXXX), sellPrice = 0.00, costPrice = 0.00, stockQty = 0
    const products = await prisma.product.findMany();
    for (const p of products) {
      expect(p.sku).toMatch(/^P-\d{6}$/);
      expect(p.sellPrice.toString()).toBe("0");
      expect(p.costPrice.toString()).toBe("0");
      expect(p.stockQty).toBe(0);
      expect(p.description).toContain("[Kode Supplier:");
      expect(p.description).toContain("Ref Faktur: 0019/JL/RBT/0525");
    }
  });

  it("seedInvoiceDatasetToDatabase bersifat idempoten dan tidak menduplikasi jika diulang", async () => {
    const firstRun = await seedInvoiceDatasetToDatabase(ownerId);
    expect(firstRun.createdProductsCount).toBe(42);

    const secondRun = await seedInvoiceDatasetToDatabase(ownerId);
    expect(secondRun.createdProductsCount).toBe(0);
    expect(secondRun.existingProductsCount).toBe(42);

    const totalProducts = await prisma.product.count();
    expect(totalProducts).toBe(42);
  });

  it("pencarian produk dapat menemukan barang berdasarkan kode supplier di deskripsi", async () => {
    await seedInvoiceDatasetToDatabase(ownerId);

    // Cari dengan potongan kode supplier "80133 BK"
    const searchResult1 = await listProducts({
      page: 1,
      pageSize: 50,
      search: "80133 BK",
      status: "all" as any,
    });
    expect(searchResult1.items.length).toBe(10); // 10 varian 80133 Black

    // Cari dengan potongan kode supplier "1893 BR"
    const searchResult2 = await listProducts({
      page: 1,
      pageSize: 50,
      search: "1893 BR",
      status: "all" as any,
    });
    expect(searchResult2.items.length).toBe(4); // 4 varian 1893 Brown
  });

  it("GET /api/products/import-preview dapat diakses oleh owner dan staff", async () => {
    const ownerRes = await owner.get("/api/products/import-preview");
    expect(ownerRes.status).toBe(200);
    expect(ownerRes.body.data.summary.totalItems).toBe(42);

    const staffRes = await staff.get("/api/products/import-preview");
    expect(staffRes.status).toBe(200);
    expect(staffRes.body.data.summary.totalQuantity).toBe(940);
  });

  it("kategori mengembalikan totalStock secara dinamis", async () => {
    await seedInvoiceDatasetToDatabase(ownerId);

    const res = await owner.get("/api/categories");
    expect(res.status).toBe(200);

    const kacamataBaca = res.body.data.find((c: any) => c.name === "Kacamata Baca");
    expect(kacamataBaca).toBeDefined();
    expect(kacamataBaca.productCount).toBe(26);
    expect(kacamataBaca.totalStock).toBe(0); // Stok awal 0 sebelum ada mutasi/pembelian
  });
});

