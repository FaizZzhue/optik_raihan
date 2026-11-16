import {
  History,
  LayoutDashboard,
  Package,
  ReceiptText,
  ShoppingBag,
  ShoppingCart,
  Tags,
  Truck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react"
import { BACK_OFFICE_ROLES, type UserRole } from "./auth.constants"
import { CATALOG_PERMISSIONS } from "./catalog.constants"
import { OWNER_ONLY } from "./owner.constants"

export type NavigationGroup = "Ikhtisar" | "Penjualan" | "Katalog & Inventaris" | "Pengadaan" | "Administrasi"

export type NavigationItem = {
  label: string
  to: string
  icon: LucideIcon
  group: NavigationGroup
  // Tanpa roles: terlihat semua role. Hanya tampilan; route dijaga RoleRoute dan BE.
  roles?: readonly UserRole[]
  // false: menu tetap aktif di sub-halaman (mis. /pembelian/baru).
  end?: boolean
  // Ditampilkan juga sebagai tab pill di header atas; shortLabel dipakai bila label terlalu panjang.
  inHeader?: boolean
  shortLabel?: string
}

export const NAVIGATION_GROUP_ORDER: readonly NavigationGroup[] = [
  "Ikhtisar",
  "Penjualan",
  "Katalog & Inventaris",
  "Pengadaan",
  "Administrasi",
]

// Hanya rute yang sudah ada. Menu modul lain ditambahkan bersama halamannya.
// Kasir hanya melihat menu Kasir; menu lain dibatasi BACK_OFFICE_ROLES (DEC-043).
export const NAVIGATION_ITEMS: NavigationItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard, group: "Ikhtisar", roles: BACK_OFFICE_ROLES, inHeader: true },
  { label: "Input Orderan", to: "/kasir/order", icon: ShoppingBag, group: "Penjualan", inHeader: true },
  { label: "Riwayat Order", to: "/kasir", icon: ReceiptText, group: "Penjualan", end: true, inHeader: true },
  { label: "Cek Stok & Harga", to: "/kasir/katalog", icon: Package, group: "Penjualan", inHeader: true, shortLabel: "Cek Stok" },
  { label: "Rekap Shift & Kas", to: "/kasir/shift", icon: Wallet, group: "Penjualan", inHeader: true, shortLabel: "Shift Kas" },
  { label: "Barang", to: "/barang", icon: Package, group: "Katalog & Inventaris", roles: BACK_OFFICE_ROLES, inHeader: true },
  { label: "Kategori", to: "/kategori", icon: Tags, group: "Katalog & Inventaris", roles: CATALOG_PERMISSIONS.MANAGE_CATEGORIES },
  { label: "Pembelian", to: "/pembelian", icon: ShoppingCart, group: "Pengadaan", roles: OWNER_ONLY, end: false, inHeader: true },
  { label: "Supplier", to: "/supplier", icon: Truck, group: "Pengadaan", roles: OWNER_ONLY, inHeader: true },
  { label: "Akun pegawai", to: "/akun", icon: Users, group: "Administrasi", roles: OWNER_ONLY, inHeader: true, shortLabel: "Pegawai" },
  { label: "Log aktivitas", to: "/log-aktivitas", icon: History, group: "Administrasi", roles: OWNER_ONLY },
]

export function getVisibleNavigation(role: UserRole): NavigationItem[] {
  return NAVIGATION_ITEMS.filter((item) => !item.roles || item.roles.includes(role))
}
