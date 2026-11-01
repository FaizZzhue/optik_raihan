import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CATALOG_QUERY_KEYS } from "@/constants/catalog.constants"
import { OWNER_QUERY_KEYS } from "@/constants/owner.constants"
import { createPurchase, getPurchase, getPurchases, searchActiveProducts } from "../services/purchase.service"

export function usePurchases(page: number) {
  return useQuery({
    queryKey: OWNER_QUERY_KEYS.purchaseList(page),
    queryFn: () => getPurchases(page),
    placeholderData: keepPreviousData,
  })
}

export function usePurchase(id: number) {
  return useQuery({ queryKey: OWNER_QUERY_KEYS.purchaseDetail(id), queryFn: () => getPurchase(id) })
}

// Pembelian menambah stok, jadi daftar barang dan kartu stok ikut disegarkan.
export function useCreatePurchase() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createPurchase,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: OWNER_QUERY_KEYS.purchases }),
        queryClient.invalidateQueries({ queryKey: CATALOG_QUERY_KEYS.products }),
      ]),
  })
}

export function useActiveProductSearch(search: string, enabled: boolean) {
  return useQuery({
    queryKey: OWNER_QUERY_KEYS.productOptions(search),
    queryFn: () => searchActiveProducts(search),
    enabled,
    placeholderData: keepPreviousData,
  })
}
