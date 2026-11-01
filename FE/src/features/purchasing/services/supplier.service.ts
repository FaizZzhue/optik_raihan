import { api } from "@/services/api/axios"
import type { ApiSuccess } from "@/types/api"
import type { Supplier, SupplierPayload } from "@/types/purchasing"

export type SupplierUpdate = Partial<SupplierPayload> & { isActive?: boolean }

export async function getSuppliers(): Promise<Supplier[]> {
  const response = await api.get<ApiSuccess<Supplier[]>>("/suppliers")
  return response.data.data
}

export async function createSupplier(input: SupplierPayload): Promise<Supplier> {
  const response = await api.post<ApiSuccess<Supplier>>("/suppliers", input)
  return response.data.data
}

export async function updateSupplier(id: number, input: SupplierUpdate): Promise<Supplier> {
  const response = await api.patch<ApiSuccess<Supplier>>(`/suppliers/${id}`, input)
  return response.data.data
}

export async function deleteSupplier(id: number): Promise<void> {
  await api.delete(`/suppliers/${id}`)
}
