// Layanan penyiapan, preview, dan import dataset faktur supplier 42 barang.
// Mematuhi aturan isolasi stok:
// 1. Data development dapat di-seed secara idempoten.
// 2. Data produksi tidak langsung memasukkan 940 pcs sebagai stok fisik aktual
//    sebelum ada konfirmasi fisik dari owner.
// 3. Harga jual belum tersedia pada faktur; diisi "0.00" (belum ditentukan).
// 4. Harga referensi dicatat pada deskripsi produk dan tidak dijadikan harga jual atau modal otomatis.
import {
  reconcileSupplierInvoiceDataset,
  SUPPLIER_INVOICE_ITEMS,
  SUPPLIER_INVOICE_METADATA,
  type SupplierInvoiceItem,
} from "../data/supplier-invoice-dataset.js";
import { prisma } from "../lib/prisma.js";

export type InvoicePreviewItem = SupplierInvoiceItem & {
  alreadyExistsInDb: boolean;
  matchedSku: string | null;
  currentStockInDb: number | null;
};

export type InvoiceImportPreview = {
  invoiceMetadata: typeof SUPPLIER_INVOICE_METADATA;
  reconciliation: ReturnType<typeof reconcileSupplierInvoiceDataset>;
  summary: {
    totalItems: number;
    totalQuantity: number;
    totalReferenceSubtotal: number;
    kacamataBacaCount: number;
    kacamataMinusCount: number;
    existingInDbCount: number;
    pendingCreationCount: number;
    categoriesReady: boolean;
  };
  items: InvoicePreviewItem[];
};

/**
 * Menyediakan preview status dataset faktur terhadap database aktual.
 * Menghitung kecocokan item yang sudah ada vs yang baru, tanpa mengubah data apa pun (read-only).
 */
export async function getInvoiceDatasetPreview(): Promise<InvoiceImportPreview> {
  const reconciliation = reconcileSupplierInvoiceDataset();

  // Periksa kategori yang sudah ada
  const existingCategories = await prisma.category.findMany({
    where: {
      name: { in: [...SUPPLIER_INVOICE_METADATA.categories], mode: "insensitive" },
    },
    select: { id: true, name: true, isActive: true },
  });

  const categoryNamesInDb = new Set(existingCategories.map((c) => c.name.toLowerCase()));
  const categoriesReady = SUPPLIER_INVOICE_METADATA.categories.every((c) =>
    categoryNamesInDb.has(c.toLowerCase()),
  );

  // Periksa produk yang sudah ada berdasarkan nama produk
  const productNames = SUPPLIER_INVOICE_ITEMS.map((item) => item.productName);
  const existingProducts = await prisma.product.findMany({
    where: {
      name: { in: productNames, mode: "insensitive" },
    },
    select: { id: true, sku: true, name: true, stockQty: true },
  });

  const existingProductMap = new Map<string, { sku: string; stockQty: number }>();
  for (const product of existingProducts) {
    existingProductMap.set(product.name.toLowerCase(), {
      sku: product.sku,
      stockQty: product.stockQty,
    });
  }

  const items: InvoicePreviewItem[] = SUPPLIER_INVOICE_ITEMS.map((item) => {
    const existing = existingProductMap.get(item.productName.toLowerCase());
    return {
      ...item,
      alreadyExistsInDb: Boolean(existing),
      matchedSku: existing?.sku ?? null,
      currentStockInDb: existing?.stockQty ?? null,
    };
  });

  const existingInDbCount = items.filter((i) => i.alreadyExistsInDb).length;
  const pendingCreationCount = items.length - existingInDbCount;

  return {
    invoiceMetadata: SUPPLIER_INVOICE_METADATA,
    reconciliation,
    summary: {
      totalItems: SUPPLIER_INVOICE_METADATA.expectedRowCount,
      totalQuantity: SUPPLIER_INVOICE_METADATA.expectedTotalQty,
      totalReferenceSubtotal: SUPPLIER_INVOICE_METADATA.expectedSubtotal,
      kacamataBacaCount: reconciliation.kacamataBacaCount,
      kacamataMinusCount: reconciliation.kacamataMinusCount,
      existingInDbCount,
      pendingCreationCount,
      categoriesReady,
    },
    items,
  };
}

/**
 * Mengimpor dataset faktur ke katalog database secara idempoten.
 * - Memastikan kategori "Kacamata Baca" dan "Kacamata Minus" aktif tersedia.
 * - Membuat produk yang belum ada dengan SKU otomatis dari database sequence.
 * - Harga jual diisi "0.00" (belum ditentukan oleh owner, tanpa markup palsu).
 * - Harga modal diisi "0.00" (harga referensi faktur disimpan pada deskripsi).
 * - Stok awal tetap 0 pcs (pencegahan stok fiktif tanpa konfirmasi fisik).
 * - Tidak menduplikasi bila dijalankan ulang.
 */
export async function seedInvoiceDatasetToDatabase(createdById: number): Promise<{
  createdProductsCount: number;
  existingProductsCount: number;
  categoriesCreated: string[];
}> {
  // 1. Validasi integritas dataset sebelum menyentuh database
  const reconciliation = reconcileSupplierInvoiceDataset();
  if (!reconciliation.isValid) {
    throw new Error(`Dataset faktur tidak valid: ${reconciliation.errors.join("; ")}`);
  }

  const categoriesCreated: string[] = [];
  const categoryMap = new Map<string, number>();

  // 2. Pastikan kategori tersedia
  for (const catName of SUPPLIER_INVOICE_METADATA.categories) {
    let category = await prisma.category.findFirst({
      where: { name: { equals: catName, mode: "insensitive" } },
    });
    if (!category) {
      category = await prisma.category.create({
        data: { name: catName, isActive: true },
      });
      categoriesCreated.push(catName);
    }
    categoryMap.set(catName, category.id);
  }

  let createdProductsCount = 0;
  let existingProductsCount = 0;

  // 3. Idempotent import per barang
  for (const item of SUPPLIER_INVOICE_ITEMS) {
    const categoryId = categoryMap.get(item.category);
    if (!categoryId) {
      throw new Error(`Kategori "${item.category}" tidak ditemukan.`);
    }

    const existing = await prisma.product.findFirst({
      where: { name: { equals: item.productName, mode: "insensitive" } },
    });

    if (existing) {
      existingProductsCount += 1;
      continue;
    }

    // Deskripsi mempertahankan kode supplier & referensi faktur secara terpisah dan eksplisit
    const description = `[Kode Supplier: ${item.supplierCode}] Ref Faktur: ${SUPPLIER_INVOICE_METADATA.invoiceNumber} (Ref Qty: ${item.quantity} pcs, Ref Harga: Rp${item.referenceUnitPrice.toLocaleString("id-ID")})`;

    await prisma.product.create({
      data: {
        name: item.productName,
        categoryId,
        sellPrice: "0.00", // Belum ditentukan oleh owner; dilarang mengarang markup
        costPrice: "0.00", // Belum disahkan sebagai modal aktual Optik Raihan
        stockQty: 0, // Tetap 0; stok fisik memerlukan konfirmasi fisik owner
        description,
        createdById,
      },
    });

    createdProductsCount += 1;
  }

  return {
    createdProductsCount,
    existingProductsCount,
    categoriesCreated,
  };
}

