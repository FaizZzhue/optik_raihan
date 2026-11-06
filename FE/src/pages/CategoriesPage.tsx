import { PageHeader } from "@/components/shared/PageHeader"
import { CategoriesPanel } from "@/features/catalog/components/CategoriesPanel"

export function CategoriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Katalog & Inventaris"
        title="Kategori"
        description="Kelompok barang utama (seperti Frame, Lensa jadi, dan Kacamata jadi) yang dipakai saat menambah dan mencari barang."
      />
      <CategoriesPanel />
    </>
  )
}
