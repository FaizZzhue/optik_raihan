import { LayoutDashboard, type LucideIcon } from "lucide-react"

export type NavigationItem = {
  label: string
  to: string
  icon: LucideIcon
}

// Hanya rute yang sudah ada. Menu modul lain ditambahkan bersama halamannya.
export const NAVIGATION_ITEMS: NavigationItem[] = [{ label: "Dashboard", to: "/", icon: LayoutDashboard }]
