import { useState, type ReactNode } from "react"
import { Outlet } from "react-router-dom"
import { AppHeader, AppHeaderSkeleton } from "@/components/shared/AppHeader"
import { AppSidebar, AppSidebarSkeleton } from "@/components/shared/AppSidebar"
import { LoadingState } from "@/components/shared/LoadingState"
import { TooltipProvider } from "@/components/ui/tooltip"
import { LogoutButton } from "@/features/auth/components/LogoutButton"
import { useCurrentUser } from "@/hooks/auth/use-auth"
import { cn } from "@/lib/utils"

const MAIN_CONTENT_ID = "konten-utama"
const SIDEBAR_COLLAPSED_KEY = "optik-raihan-sidebar-collapsed"

function readStoredSidebarCollapsed(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true"
  } catch {
    return false
  }
}

type DashboardShellProps = {
  isCollapsed: boolean
  sidebar: ReactNode
  header: ReactNode
  children: ReactNode
}

function DashboardShell({ isCollapsed, sidebar, header, children }: DashboardShellProps) {
  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex min-h-svh flex-col bg-background">
        <a
          href={`#${MAIN_CONTENT_ID}`}
          className="sr-only z-50 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Lewati ke konten utama
        </a>
        {sidebar}
        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col transition-[padding] duration-200",
            isCollapsed ? "md:pl-24" : "md:pl-64",
          )}
        >
          {header}
          <main
            id={MAIN_CONTENT_ID}
            className="mx-auto flex w-full max-w-[1600px] min-w-0 flex-1 flex-col gap-6 px-4 pt-4 pb-28 md:px-8 md:pt-6 md:pb-10"
          >
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}

export function DashboardLayout() {
  const user = useCurrentUser()
  const [isCollapsed, setIsCollapsed] = useState(readStoredSidebarCollapsed)

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next))
      } catch {
        // Abaikan jika localStorage tidak tersedia
      }
      return next
    })
  }

  return (
    <DashboardShell
      isCollapsed={isCollapsed}
      sidebar={
        <AppSidebar
          user={user}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />
      }
      header={
        <AppHeader user={user} isCollapsed={isCollapsed}>
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
  const isCollapsed = readStoredSidebarCollapsed()

  return (
    <DashboardShell
      isCollapsed={isCollapsed}
      sidebar={<AppSidebarSkeleton isCollapsed={isCollapsed} />}
      header={<AppHeaderSkeleton />}
    >
      <LoadingState label="Memeriksa sesi..." />
    </DashboardShell>
  )
}
