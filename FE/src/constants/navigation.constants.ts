import { History, LayoutDashboard, Package, ShoppingCart, Tags, Truck, Users, type LucideIcon } from "lucide-react"
import type { UserRole } from "./auth.constants"
import { CATALOG_PERMISSIONS } from "./catalog.constants"
import { OWNER_ONLY } from "./owner.constants"

export type NavigationGroup = "Ikhtisar" | "Katalog & Inventaris" | "Pengadaan" | "Administrasi"

export type NavigationItem = {
  label: string
  to: string
  icon: LucideIcon
  group: NavigationGroup
  // Tanpa roles: terlihat semua role. Hanya tampilan; route dijaga RoleRoute dan BE.
  roles?: readonly UserRole[]
  // false: menu tetap aktif di sub-halaman (mis. /pembelian/baru).
  end?: boolean
}

export const NAVIGATION_GROUP_ORDER: readonly NavigationGroup[] = [
  "Ikhtisar",
  "Katalog & Inventaris",
  "Pengadaan",
  "Administrasi",
]

// Hanya rute yang sudah ada. Menu modul lain ditambahkan bersama halamannya.
export const NAVIGATION_ITEMS: NavigationItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard, group: "Ikhtisar" },
  { label: "Barang", to: "/barang", icon: Package, group: "Katalog & Inventaris" },
  { label: "Kategori", to: "/kategori", icon: Tags, group: "Katalog & Inventaris", roles: CATALOG_PERMISSIONS.MANAGE_CATEGORIES },
  { label: "Pembelian", to: "/pembelian", icon: ShoppingCart, group: "Pengadaan", roles: OWNER_ONLY, end: false },
  { label: "Supplier", to: "/supplier", icon: Truck, group: "Pengadaan", roles: OWNER_ONLY },
  { label: "Akun pegawai", to: "/akun", icon: Users, group: "Administrasi", roles: OWNER_ONLY },
  { label: "Log aktivitas", to: "/log-aktivitas", icon: History, group: "Administrasi", roles: OWNER_ONLY },
]
