import { PageHeader } from "@/components/shared/PageHeader"
import { CategoriesPanel } from "@/features/catalog/components/CategoriesPanel"

export function CategoriesPage() {
  return (
    <>
      <PageHeader title="Kategori" description="Kelompok barang yang dipakai saat menambah dan mencari barang." />
      <CategoriesPanel />
    </>
  )
}
