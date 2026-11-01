import { LayoutDashboard, Package, Tags, type LucideIcon } from "lucide-react"
import type { UserRole } from "./auth.constants"
import { CATALOG_PERMISSIONS } from "./catalog.constants"

export type NavigationItem = {
  label: string
  to: string
  icon: LucideIcon
  // Tanpa roles: terlihat semua role. Hanya tampilan; route dijaga RoleRoute dan BE.
  roles?: readonly UserRole[]
}

// Hanya rute yang sudah ada. Menu modul lain ditambahkan bersama halamannya.
export const NAVIGATION_ITEMS: NavigationItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Barang", to: "/barang", icon: Package },
  { label: "Kategori", to: "/kategori", icon: Tags, roles: CATALOG_PERMISSIONS.MANAGE_CATEGORIES },
]
