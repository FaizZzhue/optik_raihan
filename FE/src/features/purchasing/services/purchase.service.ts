import { DEFAULT_PAGE_SIZE } from "@/constants/pagination.constants"
import { STATUS_FILTERS } from "@/constants/status-filter.constants"
import { api } from "@/services/api/axios"
import type { ApiList, ApiSuccess } from "@/types/api"
import type { Product } from "@/types/catalog"
import type { PurchaseDetail, PurchasePayload, PurchaseSummary } from "@/types/purchasing"

export async function getPurchases(page: number): Promise<ApiList<PurchaseSummary>> {
  const response = await api.get<ApiList<PurchaseSummary>>("/purchases", {
    params: { page, pageSize: DEFAULT_PAGE_SIZE },
  })
  return response.data
}

export async function getPurchase(id: number): Promise<PurchaseDetail> {
  const response = await api.get<ApiSuccess<PurchaseDetail>>(`/purchases/${id}`)
  return response.data.data
}

export async function createPurchase(input: PurchasePayload): Promise<PurchaseDetail> {
  const response = await api.post<ApiSuccess<PurchaseDetail>>("/purchases", input)
  return response.data.data
}

// Pilihan barang di form pembelian: hanya barang aktif, dicari di server dengan batas hasil.
export async function searchActiveProducts(search: string): Promise<Product[]> {
  const response = await api.get<ApiList<Product>>("/products", {
    params: { status: STATUS_FILTERS.ACTIVE, search: search || undefined, page: 1, pageSize: DEFAULT_PAGE_SIZE },
  })
  return response.data.data
}
