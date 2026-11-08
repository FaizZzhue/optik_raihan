// Dataset 42 jenis barang dari referensi faktur supplier nomor 0019/JL/RBT/0525 (18 Mei 2025).
// Catatan integritas data:
// 1. Faktur bertuliskan "FAKTUR PENJUALAN" kepada "DUTA PRIMA - PALEMBANG". Duta Prima bukan supplier Optik Raihan.
// 2. Harga pada faktur adalah harga referensi pengadaan, bukan harga pokok aktual yang disahkan atau harga jual.
// 3. Selling price (harga jual) belum tersedia pada faktur; diisi "0.00" (belum ditentukan) tanpa markup buatan.
// 4. Kuantitas 940 pcs adalah referensi historis faktur, bukan jaminan stok fisik aktual saat ini.

export type SupplierInvoiceItem = {
  readonly supplierCode: string;
  readonly productName: string;
  readonly category: "Kacamata Baca" | "Kacamata Minus";
  readonly quantity: number;
  readonly referenceUnitPrice: number;
};

export const SUPPLIER_INVOICE_METADATA = {
  invoiceNumber: "0019/JL/RBT/0525",
  invoiceDate: "2025-05-18",
  dueDate: "2025-06-17",
  customerOnInvoice: "DUTA PRIMA - PALEMBANG",
  expectedRowCount: 42,
  expectedTotalQty: 940,
  expectedSubtotal: 9270000,
  categories: ["Kacamata Baca", "Kacamata Minus"] as const,
} as const;

export const SUPPLIER_INVOICE_ITEMS: readonly SupplierInvoiceItem[] = [
  // Kacamata Baca - Seri 80133 Black (10 varian dioptri @ Rp8.500)
  { supplierCode: "KB FL 100 80133 BK", productName: "KACAMATA BACA 100 80133 BLACK", category: "Kacamata Baca", quantity: 40, referenceUnitPrice: 8500 },
  { supplierCode: "KB FL 125 80133 BK", productName: "KACAMATA BACA 125 80133 BLACK", category: "Kacamata Baca", quantity: 40, referenceUnitPrice: 8500 },
  { supplierCode: "KB FL 150 80133 BK", productName: "KACAMATA BACA 150 80133 BLACK", category: "Kacamata Baca", quantity: 40, referenceUnitPrice: 8500 },
  { supplierCode: "KB FL 175 80133 BK", productName: "KACAMATA BACA 175 80133 BLACK", category: "Kacamata Baca", quantity: 40, referenceUnitPrice: 8500 },
  { supplierCode: "KB FL 200 80133 BK", productName: "KACAMATA BACA 200 80133 BLACK", category: "Kacamata Baca", quantity: 40, referenceUnitPrice: 8500 },
  { supplierCode: "KB FL 225 80133 BK", productName: "KACAMATA BACA 225 80133 BLACK", category: "Kacamata Baca", quantity: 20, referenceUnitPrice: 8500 },
  { supplierCode: "KB FL 250 80133 BK", productName: "KACAMATA BACA 250 80133 BLACK", category: "Kacamata Baca", quantity: 20, referenceUnitPrice: 8500 },
  { supplierCode: "KB FL 275 80133 BK", productName: "KACAMATA BACA 275 80133 BLACK", category: "Kacamata Baca", quantity: 20, referenceUnitPrice: 8500 },
  { supplierCode: "KB FL 300 80133 BK", productName: "KACAMATA BACA 300 80133 BLACK", category: "Kacamata Baca", quantity: 20, referenceUnitPrice: 8500 },
  { supplierCode: "KB FL 350 80133 BK", productName: "KACAMATA BACA 350 80133 BLACK", category: "Kacamata Baca", quantity: 20, referenceUnitPrice: 8500 },

  // Kacamata Baca - Seri FL1119 Grey (11 varian dioptri @ Rp10.000)
  { supplierCode: "KB FL 100 1119 GRY", productName: "KACAMATA BACA 100 FL1119 GREY", category: "Kacamata Baca", quantity: 20, referenceUnitPrice: 10000 },
  { supplierCode: "KB FL 125 1119 GRY", productName: "KACAMATA BACA 125 FL1119 GREY", category: "Kacamata Baca", quantity: 20, referenceUnitPrice: 10000 },
  { supplierCode: "KB FL 150 1119 GRY", productName: "KACAMATA BACA 150 FL1119 GREY", category: "Kacamata Baca", quantity: 20, referenceUnitPrice: 10000 },
  { supplierCode: "KB FL 175 1119 GRY", productName: "KACAMATA BACA 175 FL1119 GREY", category: "Kacamata Baca", quantity: 20, referenceUnitPrice: 10000 },
  { supplierCode: "KB FL 200 1119 GRY", productName: "KACAMATA BACA 200 FL1119 GREY", category: "Kacamata Baca", quantity: 20, referenceUnitPrice: 10000 },
  { supplierCode: "KB FL 225 1119 GRY", productName: "KACAMATA BACA 225 FL1119 GREY", category: "Kacamata Baca", quantity: 20, referenceUnitPrice: 10000 },
  { supplierCode: "KB FL 250 1119 GRY", productName: "KACAMATA BACA 250 FL1119 GREY", category: "Kacamata Baca", quantity: 20, referenceUnitPrice: 10000 },
  { supplierCode: "KB FL 275 1119 GRY", productName: "KACAMATA BACA 275 FL1119 GREY", category: "Kacamata Baca", quantity: 20, referenceUnitPrice: 10000 },
  { supplierCode: "KB FL 300 1119 GRY", productName: "KACAMATA BACA 300 FL1119 GREY", category: "Kacamata Baca", quantity: 20, referenceUnitPrice: 10000 },
  { supplierCode: "KB FL 350 1119 GRY", productName: "KACAMATA BACA 350 FL1119 GREY", category: "Kacamata Baca", quantity: 20, referenceUnitPrice: 10000 },
  { supplierCode: "KB FL 400 1119 GRY", productName: "KACAMATA BACA 400 FL1119 GREY", category: "Kacamata Baca", quantity: 20, referenceUnitPrice: 10000 },

  // Kacamata Baca - Seri FL1119 Red (5 varian dioptri @ Rp10.000)
  { supplierCode: "KB FL 100 1119 RED", productName: "KACAMATA BACA 100 FL1119 RED", category: "Kacamata Baca", quantity: 20, referenceUnitPrice: 10000 },
  { supplierCode: "KB FL 125 1119 RED", productName: "KACAMATA BACA 125 FL1119 RED", category: "Kacamata Baca", quantity: 20, referenceUnitPrice: 10000 },
  { supplierCode: "KB FL 150 1119 RED", productName: "KACAMATA BACA 150 FL1119 RED", category: "Kacamata Baca", quantity: 20, referenceUnitPrice: 10000 },
  { supplierCode: "KB FL 175 1119 RED", productName: "KACAMATA BACA 175 FL1119 RED", category: "Kacamata Baca", quantity: 20, referenceUnitPrice: 10000 },
  { supplierCode: "KB FL 200 1119 RED", productName: "KACAMATA BACA 200 FL1119 RED", category: "Kacamata Baca", quantity: 20, referenceUnitPrice: 10000 },

  // Kacamata Minus - Seri FL1893 Black (12 varian dioptri @ Rp11.000)
  { supplierCode: "KM FL 50 1893 BK", productName: "KACAMATA MIN 50 FL1893 BLACK", category: "Kacamata Minus", quantity: 20, referenceUnitPrice: 11000 },
  { supplierCode: "KM FL 100 1893 BK", productName: "KACAMATA MIN 100 FL1893 BLACK", category: "Kacamata Minus", quantity: 20, referenceUnitPrice: 11000 },
  { supplierCode: "KM FL 150 1893 BK", productName: "KACAMATA MIN 150 FL1893 BLACK", category: "Kacamata Minus", quantity: 20, referenceUnitPrice: 11000 },
  { supplierCode: "KM FL 200 1893 BK", productName: "KACAMATA MIN 200 FL1893 BLACK", category: "Kacamata Minus", quantity: 20, referenceUnitPrice: 11000 },
  { supplierCode: "KM FL 250 1893 BK", productName: "KACAMATA MIN 250 FL1893 BLACK", category: "Kacamata Minus", quantity: 20, referenceUnitPrice: 11000 },
  { supplierCode: "KM FL 300 1893 BK", productName: "KACAMATA MIN 300 FL1893 BLACK", category: "Kacamata Minus", quantity: 20, referenceUnitPrice: 11000 },
  { supplierCode: "KM FL 350 1893 BK", productName: "KACAMATA MIN 350 FL1893 BLACK", category: "Kacamata Minus", quantity: 20, referenceUnitPrice: 11000 },
  { supplierCode: "KM FL 400 1893 BK", productName: "KACAMATA MIN 400 FL1893 BLACK", category: "Kacamata Minus", quantity: 20, referenceUnitPrice: 11000 },
  { supplierCode: "KM FL 450 1893 BK", productName: "KACAMATA MIN 450 FL1893 BLACK", category: "Kacamata Minus", quantity: 20, referenceUnitPrice: 11000 },
  { supplierCode: "KM FL 500 1893 BK", productName: "KACAMATA MIN 500 FL1893 BLACK", category: "Kacamata Minus", quantity: 20, referenceUnitPrice: 11000 },
  { supplierCode: "KM FL 550 1893 BK", productName: "KACAMATA MIN 550 FL1893 BLACK", category: "Kacamata Minus", quantity: 20, referenceUnitPrice: 11000 },
  { supplierCode: "KM FL 600 1893 BK", productName: "KACAMATA MIN 600 FL1893 BLACK", category: "Kacamata Minus", quantity: 20, referenceUnitPrice: 11000 },

  // Kacamata Minus - Seri FL1893 Brown (4 varian dioptri @ Rp11.000)
  { supplierCode: "KM FL 50 1893 BR", productName: "KACAMATA MIN 50 FL1893 BROWN", category: "Kacamata Minus", quantity: 20, referenceUnitPrice: 11000 },
  { supplierCode: "KM FL 100 1893 BR", productName: "KACAMATA MIN 100 FL1893 BROWN", category: "Kacamata Minus", quantity: 20, referenceUnitPrice: 11000 },
  { supplierCode: "KM FL 150 1893 BR", productName: "KACAMATA MIN 150 FL1893 BROWN", category: "Kacamata Minus", quantity: 20, referenceUnitPrice: 11000 },
  { supplierCode: "KM FL 200 1893 BR", productName: "KACAMATA MIN 200 FL1893 BROWN", category: "Kacamata Minus", quantity: 20, referenceUnitPrice: 11000 },
] as const;

export type ReconciliationResult = {
  isValid: boolean;
  totalProducts: number;
  kacamataBacaCount: number;
  kacamataMinusCount: number;
  totalQuantity: number;
  subtotalReference: number;
  formulaCheck: {
    group1: { description: string; expected: number; actual: number; matches: boolean };
    group2: { description: string; expected: number; actual: number; matches: boolean };
    group3: { description: string; expected: number; actual: number; matches: boolean };
    group4: { description: string; expected: number; actual: number; matches: boolean };
    grandTotalMatches: boolean;
  };
  errors: string[];
};

/**
 * Melakukan validasi dan rekonsiliasi matematis ketat terhadap dataset faktur.
 * Memastikan memenuhi:
 * 1. Jumlah produk = 42
 * 2. Kacamata Baca = 26 produk
 * 3. Kacamata Minus = 16 produk
 * 4. Total kuantitas = 940 pcs
 * 5. Subtotal = Rp9.270.000
 * Serta rumus per kelompok:
 * - 5 produk × 40 × Rp8.500 = Rp1.700.000
 * - 5 produk × 20 × Rp8.500 = Rp850.000
 * - 16 produk × 20 × Rp10.000 = Rp3.200.000
 * - 16 produk × 20 × Rp11.000 = Rp3.520.000
 */
export function reconcileSupplierInvoiceDataset(
  items: readonly SupplierInvoiceItem[] = SUPPLIER_INVOICE_ITEMS,
): ReconciliationResult {
  const errors: string[] = [];

  const totalProducts = items.length;
  if (totalProducts !== SUPPLIER_INVOICE_METADATA.expectedRowCount) {
    errors.push(`Jumlah produk (${totalProducts}) tidak sesuai ekspektasi (${SUPPLIER_INVOICE_METADATA.expectedRowCount}).`);
  }

  const kacamataBacaItems = items.filter((item) => item.category === "Kacamata Baca");
  const kacamataMinusItems = items.filter((item) => item.category === "Kacamata Minus");

  if (kacamataBacaItems.length !== 26) {
    errors.push(`Jumlah Kacamata Baca (${kacamataBacaItems.length}) tidak sesuai ekspektasi (26).`);
  }
  if (kacamataMinusItems.length !== 16) {
    errors.push(`Jumlah Kacamata Minus (${kacamataMinusItems.length}) tidak sesuai ekspektasi (16).`);
  }

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  if (totalQuantity !== SUPPLIER_INVOICE_METADATA.expectedTotalQty) {
    errors.push(`Total kuantitas (${totalQuantity}) tidak sesuai ekspektasi (${SUPPLIER_INVOICE_METADATA.expectedTotalQty}).`);
  }

  const subtotalReference = items.reduce((sum, item) => sum + item.quantity * item.referenceUnitPrice, 0);
  if (subtotalReference !== SUPPLIER_INVOICE_METADATA.expectedSubtotal) {
    errors.push(`Subtotal harga referensi (Rp${subtotalReference}) tidak sesuai ekspektasi (Rp${SUPPLIER_INVOICE_METADATA.expectedSubtotal}).`);
  }

  // Verifikasi 4 kelompok rumus faktur:
  // Kelompok 1: 5 produk x 40 x Rp8.500 = Rp1.700.000
  const g1Items = items.filter((item) => item.quantity === 40 && item.referenceUnitPrice === 8500);
  const g1Actual = g1Items.reduce((sum, i) => sum + i.quantity * i.referenceUnitPrice, 0);
  const g1Matches = g1Items.length === 5 && g1Actual === 1700000;
  if (!g1Matches) {
    errors.push(`Kelompok 1 (5 x 40 x 8500) aktual ${g1Items.length} produk, total Rp${g1Actual}.`);
  }

  // Kelompok 2: 5 produk x 20 x Rp8.500 = Rp850.000
  const g2Items = items.filter((item) => item.quantity === 20 && item.referenceUnitPrice === 8500);
  const g2Actual = g2Items.reduce((sum, i) => sum + i.quantity * i.referenceUnitPrice, 0);
  const g2Matches = g2Items.length === 5 && g2Actual === 850000;
  if (!g2Matches) {
    errors.push(`Kelompok 2 (5 x 20 x 8500) aktual ${g2Items.length} produk, total Rp${g2Actual}.`);
  }

  // Kelompok 3: 16 produk x 20 x Rp10.000 = Rp3.200.000
  const g3Items = items.filter((item) => item.quantity === 20 && item.referenceUnitPrice === 10000);
  const g3Actual = g3Items.reduce((sum, i) => sum + i.quantity * i.referenceUnitPrice, 0);
  const g3Matches = g3Items.length === 16 && g3Actual === 3200000;
  if (!g3Matches) {
    errors.push(`Kelompok 3 (16 x 20 x 10000) aktual ${g3Items.length} produk, total Rp${g3Actual}.`);
  }

  // Kelompok 4: 16 produk x 20 x Rp11.000 = Rp3.520.000
  const g4Items = items.filter((item) => item.quantity === 20 && item.referenceUnitPrice === 11000);
  const g4Actual = g4Items.reduce((sum, i) => sum + i.quantity * i.referenceUnitPrice, 0);
  const g4Matches = g4Items.length === 16 && g4Actual === 3520000;
  if (!g4Matches) {
    errors.push(`Kelompok 4 (16 x 20 x 11000) aktual ${g4Items.length} produk, total Rp${g4Actual}.`);
  }

  const grandTotalCalculated = g1Actual + g2Actual + g3Actual + g4Actual;
  const grandTotalMatches = grandTotalCalculated === 9270000;

  return {
    isValid: errors.length === 0,
    totalProducts,
    kacamataBacaCount: kacamataBacaItems.length,
    kacamataMinusCount: kacamataMinusItems.length,
    totalQuantity,
    subtotalReference,
    formulaCheck: {
      group1: { description: "5 produk x 40 x Rp8.500", expected: 1700000, actual: g1Actual, matches: g1Matches },
      group2: { description: "5 produk x 20 x Rp8.500", expected: 850000, actual: g2Actual, matches: g2Matches },
      group3: { description: "16 produk x 20 x Rp10.000", expected: 3200000, actual: g3Actual, matches: g3Matches },
      group4: { description: "16 produk x 20 x Rp11.000", expected: 3520000, actual: g4Actual, matches: g4Matches },
      grandTotalMatches,
    },
    errors,
  };
}

