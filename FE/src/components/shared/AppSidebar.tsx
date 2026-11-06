import { Glasses, ShieldCheck } from "lucide-react"
import { matchPath, NavLink, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { USER_ROLE_LABELS, type UserRole } from "@/constants/auth.constants"
import { NAVIGATION_GROUP_ORDER, NAVIGATION_ITEMS } from "@/constants/navigation.constants"

type AppSidebarProps = {
  role: UserRole
}

export function AppSidebar({ role }: AppSidebarProps) {
  const { pathname } = useLocation()
  const { isMobile, setOpenMobile } = useSidebar()
  const visibleItems = NAVIGATION_ITEMS.filter((item) => !item.roles || item.roles.includes(role))
  const groups = NAVIGATION_GROUP_ORDER.map((group) => ({
    group,
    items: visibleItems.filter((item) => item.group === group),
  })).filter((entry) => entry.items.length > 0)

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 flex-row items-center gap-3 border-b border-sidebar-border px-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
        {/* Simbol identitas optik dengan aksen garis tipis. */}
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-2xs ring-1 ring-brand-accent/40"
        >
          <Glasses className="size-4" />
        </span>
        <div className="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden">
          <span className="truncate font-serif text-base font-semibold tracking-tight">Optik Raihan</span>
          <span className="truncate text-[11px] text-muted-foreground">Sistem Operasional Toko</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-2">
        <nav aria-label="Menu utama" className="flex flex-col gap-1">
          {groups.map(({ group, items }) => (
            <SidebarGroup key={group} className="py-1.5">
              <SidebarGroupLabel className="px-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                {group}
              </SidebarGroupLabel>
              <SidebarMenu className="gap-1 group-data-[collapsible=icon]:items-center">
                {items.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    {/* Menu aktif: latar, tebal huruf, garis aksen, dan aria-current (tidak hanya warna). */}
                    <SidebarMenuButton
                      asChild
                      isActive={matchPath({ path: item.to, end: item.end ?? true }, pathname) !== null}
                      tooltip={item.label}
                      className="data-active:before:absolute data-active:before:inset-y-1.5 data-active:before:left-0 data-active:before:w-1 data-active:before:rounded-full data-active:before:bg-brand-accent"
                    >
                      <NavLink to={item.to} end={item.end ?? true} onClick={() => isMobile && setOpenMobile(false)}>
                        <item.icon aria-hidden />
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </nav>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border px-4 py-3 group-data-[collapsible=icon]:hidden">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 shrink-0 text-primary-text" aria-hidden />
          <span className="truncate">
            Hak akses: <strong className="font-medium text-foreground">{USER_ROLE_LABELS[role]}</strong>
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
