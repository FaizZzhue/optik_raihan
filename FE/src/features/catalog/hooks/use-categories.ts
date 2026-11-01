import { useMutation, useQuery } from "@tanstack/react-query"
import { CATALOG_QUERY_KEYS } from "@/constants/catalog.constants"
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  type CategoryUpdate,
} from "../services/category.service"
import { useInvalidateCatalog } from "./use-invalidate-catalog"

// Semua kategori (aktif dan nonaktif) dalam satu query: dipakai halaman kategori, filter, dan form barang.
export function useCategories() {
  return useQuery({ queryKey: CATALOG_QUERY_KEYS.categories, queryFn: getCategories })
}

export function useCreateCategory() {
  const invalidateCatalog = useInvalidateCatalog()
  return useMutation({ mutationFn: createCategory, onSuccess: invalidateCatalog })
}

export function useUpdateCategory() {
  const invalidateCatalog = useInvalidateCatalog()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: CategoryUpdate }) => updateCategory(id, input),
    onSuccess: invalidateCatalog,
  })
}

export function useDeleteCategory() {
  const invalidateCatalog = useInvalidateCatalog()
  return useMutation({ mutationFn: deleteCategory, onSuccess: invalidateCatalog })
}
