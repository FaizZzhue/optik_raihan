import { Boxes, History, ShoppingCart, Tags, Truck, Users, type LucideIcon } from "lucide-react"
import { QuickActionTile } from "@/components/shared/QuickActionTile"
import { SectionCard } from "@/components/shared/SectionCard"
import type { UserRole } from "@/constants/auth.constants"
import { CATALOG_PERMISSIONS } from "@/constants/catalog.constants"
import { OWNER_ONLY } from "@/constants/owner.constants"

type QuickAction = {
  label: string
  to: string
  icon: LucideIcon
  // Tanpa roles: semua role. Hanya tampilan; route tetap dijaga RoleRoute dan BE.
  roles?: readonly UserRole[]
}

const QUICK_ACTIONS: readonly QuickAction[] = [
  { label: "Master Barang", to: "/barang", icon: Boxes },
  { label: "Input Pembelian", to: "/pembelian/baru", icon: ShoppingCart, roles: OWNER_ONLY },
  { label: "Supplier", to: "/supplier", icon: Truck, roles: OWNER_ONLY },
  { label: "Akun Pegawai", to: "/akun", icon: Users, roles: OWNER_ONLY },
  { label: "Kategori", to: "/kategori", icon: Tags, roles: CATALOG_PERMISSIONS.MANAGE_CATEGORIES },
  { label: "Log Aktivitas", to: "/log-aktivitas", icon: History, roles: OWNER_ONLY },
]

export function QuickActionsCard({ role }: { role: UserRole }) {
  const actions = QUICK_ACTIONS.filter((action) => !action.roles || action.roles.includes(role))

  return (
    <SectionCard title="Aksi Cepat">
      <div className="grid grid-cols-3 gap-2.5">
        {actions.map((action) => (
          <QuickActionTile key={action.to} to={action.to} label={action.label} icon={action.icon} />
        ))}
      </div>
      {actions.length < 3 && (
        <p className="text-xs text-muted-foreground">
          Pegawai dapat menambah atau mengubah data barang, memperbarui harga jual, dan memeriksa kartu stok.
        </p>
      )}
    </SectionCard>
  )
}
