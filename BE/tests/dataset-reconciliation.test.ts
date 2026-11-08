import { describe, expect, it } from "vitest";
import {
  reconcileSupplierInvoiceDataset,
  SUPPLIER_INVOICE_ITEMS,
  SUPPLIER_INVOICE_METADATA,
} from "../src/data/supplier-invoice-dataset.js";

describe("Dataset Referensi Faktur 42 Barang Supplier", () => {
  it("memiliki tepat 42 baris produk", () => {
    expect(SUPPLIER_INVOICE_ITEMS.length).toBe(42);
    expect(SUPPLIER_INVOICE_METADATA.expectedRowCount).toBe(42);
  });

  it("terbagi menjadi 26 Kacamata Baca dan 16 Kacamata Minus", () => {
    const baca = SUPPLIER_INVOICE_ITEMS.filter((i) => i.category === "Kacamata Baca");
    const minus = SUPPLIER_INVOICE_ITEMS.filter((i) => i.category === "Kacamata Minus");

    expect(baca.length).toBe(26);
    expect(minus.length).toBe(16);
  });

  it("memiliki total kuantitas tepat 940 pcs", () => {
    const totalQty = SUPPLIER_INVOICE_ITEMS.reduce((sum, item) => sum + item.quantity, 0);
    expect(totalQty).toBe(940);
  });

  it("memiliki subtotal harga referensi tepat Rp9.270.000", () => {
    const subtotal = SUPPLIER_INVOICE_ITEMS.reduce(
      (sum, item) => sum + item.quantity * item.referenceUnitPrice,
      0,
    );
    expect(subtotal).toBe(9270000);
  });

  it("lolos validasi matematis 4 kelompok rumus faktur", () => {
    const result = reconcileSupplierInvoiceDataset();

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.totalProducts).toBe(42);
    expect(result.kacamataBacaCount).toBe(26);
    expect(result.kacamataMinusCount).toBe(16);
    expect(result.totalQuantity).toBe(940);
    expect(result.subtotalReference).toBe(9270000);

    // 5 produk x 40 x Rp8.500 = Rp1.700.000
    expect(result.formulaCheck.group1.matches).toBe(true);
    expect(result.formulaCheck.group1.actual).toBe(1700000);

    // 5 produk x 20 x Rp8.500 = Rp850.000
    expect(result.formulaCheck.group2.matches).toBe(true);
    expect(result.formulaCheck.group2.actual).toBe(850000);

    // 16 produk x 20 x Rp10.000 = Rp3.200.000
    expect(result.formulaCheck.group3.matches).toBe(true);
    expect(result.formulaCheck.group3.actual).toBe(3200000);

    // 16 produk x 20 x Rp11.000 = Rp3.520.000
    expect(result.formulaCheck.group4.matches).toBe(true);
    expect(result.formulaCheck.group4.actual).toBe(3520000);

    expect(result.formulaCheck.grandTotalMatches).toBe(true);
  });

  it("setiap produk memiliki kode supplier dan nama produk unik non-kosong", () => {
    const supplierCodes = new Set<string>();
    const productNames = new Set<string>();

    for (const item of SUPPLIER_INVOICE_ITEMS) {
      expect(item.supplierCode.trim().length).toBeGreaterThan(0);
      expect(item.productName.trim().length).toBeGreaterThan(0);
      expect(item.quantity).toBeGreaterThan(0);
      expect(item.referenceUnitPrice).toBeGreaterThan(0);

      expect(supplierCodes.has(item.supplierCode)).toBe(false);
      expect(productNames.has(item.productName)).toBe(false);

      supplierCodes.add(item.supplierCode);
      productNames.add(item.productName);
    }

    expect(supplierCodes.size).toBe(42);
    expect(productNames.size).toBe(42);
  });
});

