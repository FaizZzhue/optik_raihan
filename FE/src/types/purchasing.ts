// DTO dari /api/suppliers, /api/purchases, dan /api/products/:id/stock-movements. Uang string desimal dari BE.
export type Supplier = {
  id: number
  name: string
  phone: string | null
  address: string | null
  notes: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Body POST /api/suppliers dan PATCH /api/suppliers/:id. String kosong menghapus isi field opsional.
export type SupplierPayload = {
  name: string
  phone: string
  address: string
  notes: string
}

type PurchaseHeader = {
  id: number
  supplier: { id: number; name: string }
  supplierInvoiceNo: string | null
  purchasedAt: string
  total: string
  notes: string | null
  createdBy: { id: number; name: string }
}

export type PurchaseSummary = PurchaseHeader & { itemCount: number }

export type PurchaseDetail = PurchaseHeader & {
  items: {
    id: number
    product: { id: number; sku: string; name: string }
    quantity: number
    unitCost: string
    lineTotal: string
  }[]
}

// Body POST /api/purchases. Total tidak dikirim: BE yang menghitung.
export type PurchasePayload = {
  supplierId: number
  supplierInvoiceNo: string
  notes: string
  items: { productId: number; quantity: number; unitCost: string }[]
}

export type StockMovement = {
  id: number
  movementType: string
  quantityChange: number
  stockAfter: number
  purchaseId: number | null
  note: string | null
  createdBy: { id: number; name: string }
  createdAt: string
}
