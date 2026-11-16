// DTO & Contracts untuk Penjualan / Kasir (M-07).
// Mengikuti keputusan bisnis Owner (DEC-010, P-01, P-09, P-14, BR-12 di PROJECT-CONTEXT.md).

export type PaymentMethod = "cash" | "qris" | "transfer" | "debit"

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Tunai",
  qris: "QRIS",
  transfer: "Transfer Bank",
  debit: "Kartu Debit",
}

export type SaleStatus = "completed" | "draft" | "void"

export const SALE_STATUS_LABELS: Record<SaleStatus, string> = {
  completed: "Lunas",
  draft: "Draft",
  void: "Dibatalkan (Void)",
}

export type SaleItem = {
  id: number
  productId: number
  productSku: string
  productName: string
  quantity: number
  unitPrice: number
  standardPrice: number
  lineTotal: number
}

export type Sale = {
  id: number
  invoiceNumber: string
  customerName: string
  customerPhone?: string
  saleDate: string
  subtotal: number
  discountAmount: number
  totalAmount: number
  paymentMethod: PaymentMethod
  cashReceived?: number
  changeAmount?: number
  status: SaleStatus
  notes?: string
  cashierName: string
  items: SaleItem[]
}

export type CreateSaleItemInput = {
  productId: number
  productSku: string
  productName: string
  quantity: number
  unitPrice: number
  standardPrice: number
}

export type CreateSaleInput = {
  customerName?: string
  customerPhone?: string
  items: CreateSaleItemInput[]
  discountAmount?: number
  paymentMethod: PaymentMethod
  cashReceived?: number
  status?: "completed" | "draft"
  notes?: string
}

export type SalesFilter = {
  search?: string
  status?: SaleStatus | "all"
  paymentMethod?: PaymentMethod | "all"
  dateRange?: string
}

export type CashierKPI = {
  todaySalesAmount: number
  monthSalesAmount: number
  todayTransactionCount: number
  cashDrawerAmount: number
  cashAmount: number
  qrisAmount: number
  transferAmount: number
  debitAmount: number
}
