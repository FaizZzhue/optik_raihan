import { DEFAULT_PAGE_SIZE } from "@/constants/pagination.constants"
import { api } from "@/services/api/axios"
import type { StockMovement } from "@/types/purchasing"
import type { ApiList, ApiSuccess } from "@/types/api"
import type { Product, ProductListParams, ProductPayload } from "@/types/catalog"

export type ProductUpdate = Partial<ProductPayload> & { isActive?: boolean }

// Parameter undefined tidak dikirim Axios, jadi filter kosong tidak ikut ke query string.
export async function getProducts(params: ProductListParams): Promise<ApiList<Product>> {
  const response = await api.get<ApiList<Product>>("/products", { params })
  return response.data
}

export async function createProduct(input: ProductPayload): Promise<Product> {
  const response = await api.post<ApiSuccess<Product>>("/products", input)
  return response.data.data
}

export async function updateProduct(id: number, input: ProductUpdate): Promise<Product> {
  const response = await api.patch<ApiSuccess<Product>>(`/products/${id}`, input)
  return response.data.data
}

export async function getProductStockMovements(productId: number, page: number): Promise<ApiList<StockMovement>> {
  const response = await api.get<ApiList<StockMovement>>(`/products/${productId}/stock-movements`, {
    params: { page, pageSize: DEFAULT_PAGE_SIZE },
  })
  return response.data
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/products/${id}`)
}
