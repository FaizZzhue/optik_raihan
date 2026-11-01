import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"
import { CATALOG_QUERY_KEYS } from "@/constants/catalog.constants"
import type { ProductListParams } from "@/types/catalog"
import {
  createProduct,
  deleteProduct,
  getProductStockMovements,
  getProducts,
  updateProduct,
  type ProductUpdate,
} from "../services/product.service"
import { useInvalidateCatalog } from "./use-invalidate-catalog"

export function useProducts(params: ProductListParams) {
  return useQuery({
    queryKey: CATALOG_QUERY_KEYS.productList(params),
    queryFn: () => getProducts(params),
    // Tabel tetap menampilkan halaman sebelumnya selama halaman atau filter baru dimuat (tanpa kedip kosong).
    placeholderData: keepPreviousData,
  })
}

export function useStockMovements(productId: number, page: number) {
  return useQuery({
    queryKey: CATALOG_QUERY_KEYS.stockMovements(productId, page),
    queryFn: () => getProductStockMovements(productId, page),
    placeholderData: keepPreviousData,
  })
}

export function useCreateProduct() {
  const invalidateCatalog = useInvalidateCatalog()
  return useMutation({ mutationFn: createProduct, onSuccess: invalidateCatalog })
}

export function useUpdateProduct() {
  const invalidateCatalog = useInvalidateCatalog()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: ProductUpdate }) => updateProduct(id, input),
    onSuccess: invalidateCatalog,
  })
}

export function useDeleteProduct() {
  const invalidateCatalog = useInvalidateCatalog()
  return useMutation({ mutationFn: deleteProduct, onSuccess: invalidateCatalog })
}
