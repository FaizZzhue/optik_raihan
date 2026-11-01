import { useQueryClient } from "@tanstack/react-query"
import { CATALOG_QUERY_KEYS } from "@/constants/catalog.constants"

// Kategori dan barang saling bergantung di tampilan (nama kategori di daftar barang, jumlah barang per kategori),
// jadi setiap perubahan di salah satunya menyegarkan keduanya.
export function useInvalidateCatalog() {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: CATALOG_QUERY_KEYS.categories }),
      queryClient.invalidateQueries({ queryKey: CATALOG_QUERY_KEYS.products }),
    ])
}
