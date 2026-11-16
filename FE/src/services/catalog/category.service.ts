import { api } from "@/services/api/axios"
import type { ApiSuccess } from "@/types/api"
import type { Category } from "@/types/catalog"

export type CategoryUpdate = Partial<Pick<Category, "name" | "isActive">>

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<ApiSuccess<Category[]>>("/categories")
  return response.data.data
}

export async function createCategory(name: string): Promise<Category> {
  const response = await api.post<ApiSuccess<Category>>("/categories", { name })
  return response.data.data
}

export async function updateCategory(id: number, input: CategoryUpdate): Promise<Category> {
  const response = await api.patch<ApiSuccess<Category>>(`/categories/${id}`, input)
  return response.data.data
}

export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`/categories/${id}`)
}
