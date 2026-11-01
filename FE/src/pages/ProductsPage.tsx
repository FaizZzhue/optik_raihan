import { PageHeader } from "@/components/shared/PageHeader"
import { useCurrentUser } from "@/features/auth/hooks/use-auth"
import { ProductsPanel } from "@/features/catalog/components/ProductsPanel"

export function ProductsPage() {
  const user = useCurrentUser()

  return (
    <>
      <PageHeader title="Barang" description="Kelola frame, lensa jadi, dan kacamata jadi beserta harga jualnya." />
      <ProductsPanel role={user.role} />
    </>
  )
}
