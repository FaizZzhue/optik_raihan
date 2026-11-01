import type { StatusFilter } from "@/constants/status-filter.constants"

// DTO dari /api/categories dan /api/products. Uang berupa string desimal dari BE dan tidak dihitung ulang di FE.
export type Category = {
  id: number
  name: string
  isActive: boolean
  productCount: number
  createdAt: string
  updatedAt: string
}

export type Product = {
  id: number
  sku: string
  name: string
  description: string | null
  category: {
    id: number
    name: string
    isActive: boolean
  }
  sellPrice: string
  costPrice: string
  stockQty: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type ProductListParams = {
  page: number
  pageSize: number
  search?: string
  categoryId?: number
  status: StatusFilter
}

// Body POST/PATCH /api/products. SKU dan stok tidak pernah dikirim (dibuat dan dijaga BE).
export type ProductPayload = {
  name: string
  categoryId: number
  sellPrice: string
  costPrice: string
  description: string
}
