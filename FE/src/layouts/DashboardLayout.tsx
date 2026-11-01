import type { CSSProperties, ReactNode } from "react"
import { Outlet } from "react-router-dom"
import { AppHeader } from "@/components/shared/AppHeader"
import { AppSidebar } from "@/components/shared/AppSidebar"
import { LoadingState } from "@/components/shared/LoadingState"
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { LogoutButton } from "@/features/auth/components/LogoutButton"
import { useCurrentUser } from "@/features/auth/hooks/use-auth"

// Lebar sidebar DESIGN_SYSTEM bagian 7: 240 px terbuka, 72 px ringkas (DEC-033).
const SIDEBAR_WIDTHS = {
  "--sidebar-width": "15rem",
  "--sidebar-width-icon": "4.5rem",
} as CSSProperties

// Komponen sidebar shadcn menyimpan status buka/ringkas di cookie ini; dibaca agar bertahan setelah reload.
function readSidebarOpen() {
  return !document.cookie.split("; ").includes("sidebar_state=false")
}

type DashboardShellProps = {
  sidebar: ReactNode
  header: ReactNode
  children: ReactNode
}

function DashboardShell({ sidebar, header, children }: DashboardShellProps) {
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={readSidebarOpen()} style={SIDEBAR_WIDTHS}>
        {sidebar}
        <SidebarInset className="min-w-0">
          {header}
          <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}

export function DashboardLayout() {
  const user = useCurrentUser()

  return (
    <DashboardShell
      sidebar={<AppSidebar role={user.role} />}
      header={
        <AppHeader user={user}>
          <LogoutButton />
        </AppHeader>
      }
    >
      <Outlet />
    </DashboardShell>
  )
}

// Dipakai ProtectedRoute selama sesi diperiksa: kerangka sama tanpa data user dan menu,
// sehingga tidak ada pergeseran layout saat dashboard asli muncul.
export function DashboardLayoutSkeleton() {
  return (
    <DashboardShell sidebar={<Sidebar collapsible="icon" />} header={<div className="h-14 shrink-0 border-b" />}>
      <LoadingState label="Memeriksa sesi..." />
    </DashboardShell>
  )
}
