import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { OWNER_QUERY_KEYS } from "@/constants/owner.constants"
import {
  createSupplier,
  deleteSupplier,
  getSuppliers,
  updateSupplier,
  type SupplierUpdate,
} from "../services/supplier.service"

// Semua supplier (aktif dan nonaktif) dalam satu query: dipakai halaman supplier dan form pembelian.
export function useSuppliers() {
  return useQuery({ queryKey: OWNER_QUERY_KEYS.suppliers, queryFn: getSuppliers })
}

// Nama supplier ikut tampil di daftar pembelian, jadi keduanya disegarkan setelah perubahan.
function useInvalidateSuppliers() {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: OWNER_QUERY_KEYS.suppliers }),
      queryClient.invalidateQueries({ queryKey: OWNER_QUERY_KEYS.purchases }),
    ])
}

export function useCreateSupplier() {
  const invalidate = useInvalidateSuppliers()
  return useMutation({ mutationFn: createSupplier, onSuccess: invalidate })
}

export function useUpdateSupplier() {
  const invalidate = useInvalidateSuppliers()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: SupplierUpdate }) => updateSupplier(id, input),
    onSuccess: invalidate,
  })
}

export function useDeleteSupplier() {
  const invalidate = useInvalidateSuppliers()
  return useMutation({ mutationFn: deleteSupplier, onSuccess: invalidate })
}
