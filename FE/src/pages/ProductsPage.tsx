import { PageHeader } from "@/components/shared/PageHeader"
import { useCurrentUser } from "@/features/auth/hooks/use-auth"
import { ProductsPanel } from "@/features/catalog/components/ProductsPanel"

export function ProductsPage() {
  const user = useCurrentUser()

  return (
    <>
      <PageHeader
        eyebrow="Katalog & Inventaris"
        title="Barang"
        description="Kelola master frame, lensa jadi, dan kacamata jadi beserta harga acuan dan kartu stok inventaris."
      />
      <ProductsPanel role={user.role} />
    </>
  )
}
