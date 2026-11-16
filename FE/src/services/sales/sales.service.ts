import type { CreateSaleInput, Sale } from "@/types/sales"

// Data awal faktur/transaksi penjualan kasir untuk preview dan demonstrasi operasional.
// TODO(BE): Sambungkan ke endpoint nyata GET /api/sales dan POST /api/sales saat Tahap 6 (TASK-008) dibuka.
const STORAGE_KEY = "optik_raihan_sales_data"

const INITIAL_SALES: Sale[] = [
  {
    id: 1,
    invoiceNumber: "INV-2611-001",
    customerName: "Budi Santoso",
    customerPhone: "081234567890",
    saleDate: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    subtotal: 850000,
    discountAmount: 50000,
    totalAmount: 800000,
    paymentMethod: "qris",
    status: "completed",
    cashierName: "Ahmad Staff",
    items: [
      {
        id: 101,
        productId: 1,
        productSku: "P-000001",
        productName: "Frame Aviator Klasik Hitam",
        quantity: 1,
        unitPrice: 450000,
        standardPrice: 450000,
        lineTotal: 450000,
      },
      {
        id: 102,
        productId: 2,
        productSku: "P-000002",
        productName: "Lensa Blueray Antiradiasi Plano",
        quantity: 1,
        unitPrice: 350000,
        standardPrice: 350000,
        lineTotal: 350000,
      },
      {
        id: 103,
        productId: 3,
        productSku: "P-000003",
        productName: "Cairan Pembersih & Lap Mikrofiber",
        quantity: 1,
        unitPrice: 50000,
        standardPrice: 50000,
        lineTotal: 50000,
      },
    ],
  },
  {
    id: 2,
    invoiceNumber: "INV-2611-002",
    customerName: "Siti Rahma",
    customerPhone: "085678901234",
    saleDate: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    subtotal: 620000,
    discountAmount: 0,
    totalAmount: 620000,
    paymentMethod: "cash",
    cashReceived: 700000,
    changeAmount: 80000,
    status: "completed",
    cashierName: "Owner Optik Raihan",
    items: [
      {
        id: 201,
        productId: 4,
        productSku: "P-000004",
        productName: "Frame Cat-Eye Rose Gold",
        quantity: 1,
        unitPrice: 520000,
        standardPrice: 520000,
        lineTotal: 520000,
      },
      {
        id: 202,
        productId: 3,
        productSku: "P-000003",
        productName: "Cairan Pembersih Lensa 60ml",
        quantity: 2,
        unitPrice: 50000,
        standardPrice: 50000,
        lineTotal: 100000,
      },
    ],
  },
  {
    id: 3,
    invoiceNumber: "INV-2611-003",
    customerName: "Hendro Wijaya",
    customerPhone: "087812345678",
    saleDate: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    subtotal: 1250000,
    discountAmount: 100000,
    totalAmount: 1150000,
    paymentMethod: "transfer",
    status: "completed",
    cashierName: "Ahmad Staff",
    items: [
      {
        id: 301,
        productId: 5,
        productSku: "P-000005",
        productName: "Frame Titanium Rimless Premium",
        quantity: 1,
        unitPrice: 850000,
        standardPrice: 850000,
        lineTotal: 850000,
      },
      {
        id: 302,
        productId: 6,
        productSku: "P-000006",
        productName: "Lensa Photochromic Grey 1.56",
        quantity: 1,
        unitPrice: 400000,
        standardPrice: 400000,
        lineTotal: 400000,
      },
    ],
  },
  {
    id: 4,
    invoiceNumber: "INV-2611-004",
    customerName: "Pelanggan Umum",
    saleDate: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    subtotal: 350000,
    discountAmount: 0,
    totalAmount: 350000,
    paymentMethod: "debit",
    status: "draft",
    notes: "Menunggu konfirmasi resep dokter",
    cashierName: "Ahmad Staff",
    items: [
      {
        id: 401,
        productId: 7,
        productSku: "P-000007",
        productName: "Kacamata Baca Foldable +1.50",
        quantity: 1,
        unitPrice: 350000,
        standardPrice: 350000,
        lineTotal: 350000,
      },
    ],
  },
]

function getStoredSales(): Sale[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw) as Sale[]
    }
  } catch {
    // Abaikan error parse
  }
  return INITIAL_SALES
}

function saveStoredSales(sales: Sale[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sales))
  } catch {
    // Abaikan bila storage penuh
  }
}

export async function getSales(): Promise<Sale[]> {
  // TODO(BE): ganti dengan `const res = await axiosInstance.get('/api/sales'); return res.data.data;`
  await new Promise((resolve) => setTimeout(resolve, 100))
  return getStoredSales()
}

export async function createSale(input: CreateSaleInput, cashierName: string): Promise<Sale> {
  // TODO(BE): ganti dengan `const res = await axiosInstance.post('/api/sales', input); return res.data.data;`
  await new Promise((resolve) => setTimeout(resolve, 150))
  const currentSales = getStoredSales()

  const subtotal = input.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const discountAmount = Math.min(input.discountAmount ?? 0, subtotal)
  const totalAmount = subtotal - discountAmount

  const changeAmount =
    input.paymentMethod === "cash" && input.cashReceived
      ? Math.max(0, input.cashReceived - totalAmount)
      : 0

  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  const dateStr = `${String(now.getFullYear()).slice(-2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
  const seq = String(currentSales.length + 1).padStart(3, "0")
  const invoiceNumber = `INV-${dateStr}-${seq}`

  const newSale: Sale = {
    id: Date.now(),
    invoiceNumber,
    customerName: input.customerName?.trim() || "Pelanggan Umum",
    customerPhone: input.customerPhone?.trim() || undefined,
    saleDate: now.toISOString(),
    subtotal,
    discountAmount,
    totalAmount,
    paymentMethod: input.paymentMethod,
    cashReceived: input.cashReceived,
    changeAmount,
    status: input.status ?? "completed",
    notes: input.notes?.trim() || undefined,
    cashierName,
    items: input.items.map((item, index) => ({
      id: Date.now() + index,
      productId: item.productId,
      productSku: item.productSku,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      standardPrice: item.standardPrice,
      lineTotal: item.quantity * item.unitPrice,
    })),
  }

  const updated = [newSale, ...currentSales]
  saveStoredSales(updated)
  return newSale
}
