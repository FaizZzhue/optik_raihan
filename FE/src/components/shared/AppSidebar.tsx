import { Glasses } from "lucide-react"
import { matchPath, NavLink, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { NAVIGATION_ITEMS } from "@/constants/navigation.constants"

export function AppSidebar() {
  const { pathname } = useLocation()
  const { isMobile, setOpenMobile } = useSidebar()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 flex-row items-center gap-3 border-b border-sidebar-border px-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
        {/* Ikon generik, bukan logo toko. */}
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
        >
          <Glasses className="size-4" />
        </span>
        <span className="truncate font-heading text-base font-semibold group-data-[collapsible=icon]:hidden">
          Optik Raihan
        </span>
      </SidebarHeader>
      <SidebarContent>
        <nav aria-label="Menu utama">
          <SidebarGroup>
            <SidebarMenu className="gap-1 group-data-[collapsible=icon]:items-center">
              {NAVIGATION_ITEMS.map((item) => (
                <SidebarMenuItem key={item.to}>
                  {/* Menu aktif: latar, tebal huruf, garis aksen, dan aria-current (tidak hanya warna). */}
                  <SidebarMenuButton
                    asChild
                    isActive={matchPath({ path: item.to, end: true }, pathname) !== null}
                    tooltip={item.label}
                    className="data-active:before:absolute data-active:before:inset-y-1.5 data-active:before:left-0 data-active:before:w-1 data-active:before:rounded-full data-active:before:bg-brand-accent"
                  >
                    <NavLink to={item.to} end onClick={() => isMobile && setOpenMobile(false)}>
                      <item.icon aria-hidden />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </nav>
      </SidebarContent>
    </Sidebar>
  )
}
