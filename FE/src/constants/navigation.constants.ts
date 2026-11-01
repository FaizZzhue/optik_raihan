import { History, LayoutDashboard, Package, ShoppingCart, Tags, Truck, Users, type LucideIcon } from "lucide-react"
import type { UserRole } from "./auth.constants"
import { CATALOG_PERMISSIONS } from "./catalog.constants"
import { OWNER_ONLY } from "./owner.constants"

export type NavigationItem = {
  label: string
  to: string
  icon: LucideIcon
  // Tanpa roles: terlihat semua role. Hanya tampilan; route dijaga RoleRoute dan BE.
  roles?: readonly UserRole[]
  // false: menu tetap aktif di sub-halaman (mis. /pembelian/baru).
  end?: boolean
}

// Hanya rute yang sudah ada. Menu modul lain ditambahkan bersama halamannya.
export const NAVIGATION_ITEMS: NavigationItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Barang", to: "/barang", icon: Package },
  { label: "Kategori", to: "/kategori", icon: Tags, roles: CATALOG_PERMISSIONS.MANAGE_CATEGORIES },
  { label: "Pembelian", to: "/pembelian", icon: ShoppingCart, roles: OWNER_ONLY, end: false },
  { label: "Supplier", to: "/supplier", icon: Truck, roles: OWNER_ONLY },
  { label: "Akun pegawai", to: "/akun", icon: Users, roles: OWNER_ONLY },
  { label: "Log aktivitas", to: "/log-aktivitas", icon: History, roles: OWNER_ONLY },
]
