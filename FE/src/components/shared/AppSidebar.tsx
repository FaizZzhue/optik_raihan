import { Link, NavLink } from "react-router-dom"
import { Glasses, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ROLE_HOME_PATH } from "@/constants/auth.constants"
import { getVisibleNavigation, NAVIGATION_GROUP_ORDER, type NavigationItem } from "@/constants/navigation.constants"
import { cn } from "@/lib/utils"
import type { AuthUser } from "@/types/auth"

type AppSidebarProps = {
  user: AuthUser
  isCollapsed: boolean
  onToggleCollapse: () => void
}

function railItemClasses({ isActive }: { isActive: boolean }) {
  return cn(
    "focus-ring flex size-11 items-center justify-center rounded-full transition-colors duration-150",
    isActive ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground",
  )
}

function RailLink({ item }: { item: NavigationItem }) {
  return (
    <NavLink to={item.to} end={item.end ?? true} aria-label={item.label} className={railItemClasses}>
      <item.icon className="size-5" aria-hidden />
    </NavLink>
  )
}

export function AppSidebar({ user, isCollapsed, onToggleCollapse }: AppSidebarProps) {
  const items = getVisibleNavigation(user.role)

  return (
    <>
      {/* 1. SIDEBAR STANDAR (Desktop, Expanded) */}
      {!isCollapsed && (
        <aside
          aria-label="Sidebar utama"
          className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-card shadow-xs transition-transform duration-200 md:flex"
        >
          {/* Header Sidebar: Logo & Tombol Perkecil */}
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/70 px-4">
            <Link
              to={ROLE_HOME_PATH[user.role]}
              aria-label="Optik Raihan, ke beranda"
              className="focus-ring flex items-center gap-2.5 rounded-lg"
            >
              <span aria-hidden className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                <Glasses className="size-5 stroke-[2.2]" />
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold tracking-tight text-foreground">Optik Raihan</span>
                <span className="text-[11px] text-muted-foreground">Sistem Operasional</span>
              </div>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  aria-label="Perkecil sidebar"
                  className="focus-ring flex size-8 items-center justify-center rounded-lg border border-border/80 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <PanelLeftClose className="size-4" aria-hidden />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Perkecil sidebar</TooltipContent>
            </Tooltip>
          </div>

          {/* Navigasi Modular Berdasarkan Kelompok */}
          <nav aria-label="Navigasi modul" className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
            {NAVIGATION_GROUP_ORDER.map((group) => {
              const groupItems = items.filter((item) => item.group === group)
              if (groupItems.length === 0) return null
              return (
                <div key={group} className="flex flex-col gap-1">
                  <span className="px-3 text-[10px] font-bold tracking-wider text-muted-foreground/80 uppercase">
                    {group}
                  </span>
                  {groupItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end ?? true}
                      className={({ isActive }) =>
                        cn(
                          "focus-ring flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                          isActive
                            ? "bg-foreground text-background font-semibold shadow-xs"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )
                      }
                    >
                      <item.icon className="size-4.5 shrink-0" aria-hidden />
                      <span className="truncate">{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              )
            })}
          </nav>
        </aside>
      )}

      {/* 2. SIDEBAR DIRINGKAS / FLOATING RAIL (Desktop, saat di-minimize / pop-up) */}
      {isCollapsed && (
        <nav
          aria-label="Menu utama diringkas"
          className="fixed top-1/2 left-4 z-40 hidden -translate-y-1/2 flex-col items-center gap-1.5 rounded-full border border-border bg-card p-1.5 shadow-card transition-all duration-200 md:flex"
        >
          {/* Tombol Perbesar Sidebar */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label="Perbesar sidebar"
                className="focus-ring flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
              >
                <PanelLeftOpen className="size-5" aria-hidden />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10}>
              Perbesar sidebar
            </TooltipContent>
          </Tooltip>

          <div className="my-0.5 h-px w-6 bg-border/80" aria-hidden />

          {/* Item Navigasi Rail */}
          {items.map((item) => (
            <Tooltip key={item.to}>
              <TooltipTrigger asChild>
                <RailLink item={item} />
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10}>
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
      )}

      {/* 3. MENU MOBILE BOTTOM BAR (Layar di bawah 768px) */}
      <nav
        aria-label="Menu utama"
        className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-between gap-1 rounded-full border border-border bg-card/95 p-1.5 shadow-card-hover backdrop-blur-md md:hidden"
      >
        {items.map((item) => (
          <RailLink key={item.to} item={item} />
        ))}
      </nav>
    </>
  )
}

// Kerangka skeleton disesuaikan dengan status ringkas/lebar
export function AppSidebarSkeleton({ isCollapsed = false }: { isCollapsed?: boolean }) {
  if (isCollapsed) {
    return (
      <div
        aria-hidden
        className="fixed top-1/2 left-4 z-40 hidden h-72 w-14 -translate-y-1/2 rounded-full border border-border bg-card shadow-card md:block"
      />
    )
  }

  return (
    <div
      aria-hidden
      className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-card md:block"
    />
  )
}
