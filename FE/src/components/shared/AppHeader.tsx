import { useEffect, useRef, type ReactNode } from "react"
import { Moon, Sun } from "lucide-react"
import { matchPath, useLocation } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { USER_ROLE_LABELS } from "@/constants/auth.constants"
import { NAVIGATION_ITEMS } from "@/constants/navigation.constants"
import { useTheme } from "@/hooks/use-theme"
import type { AuthUser } from "@/types/auth"

type AppHeaderProps = {
  user: AuthUser
  // Aksi akun (logout) dari feature auth, dikirim lewat layout agar shared tidak mengimpor feature.
  children: ReactNode
}

export function AppHeader({ user, children }: AppHeaderProps) {
  const { pathname } = useLocation()
  const { theme, toggleTheme } = useTheme()
  const themeLabel = theme === "dark" ? "Gunakan mode terang" : "Gunakan mode gelap"
  const { openMobile } = useSidebar()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const wasOpenMobileRef = useRef(false)

  const activeNav = NAVIGATION_ITEMS.find(
    (item) => matchPath({ path: item.to, end: item.end ?? true }, pathname) !== null,
  )

  // Sheet sidebar mobile dibuka lewat state (bukan Dialog.Trigger), jadi Radix tidak mengembalikan
  // fokus saat ditutup. Kembalikan ke tombol menu agar pengguna keyboard tidak kehilangan posisi.
  useEffect(() => {
    if (wasOpenMobileRef.current && !openMobile) {
      triggerRef.current?.focus()
    }
    wasOpenMobileRef.current = openMobile
  }, [openMobile])

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-card/95 px-4 backdrop-blur-xs md:px-6">
      <SidebarTrigger ref={triggerRef} className="-ml-1" aria-label="Buka atau tutup menu" />
      {activeNav && (
        <>
          <Separator orientation="vertical" className="hidden h-4 sm:block" />
          <div className="hidden min-w-0 items-center gap-2 text-xs text-muted-foreground sm:flex">
            <span>{activeNav.group}</span>
            <span aria-hidden>/</span>
            <span className="truncate font-medium text-foreground">{activeNav.label}</span>
          </div>
        </>
      )}
      <div className="ml-auto flex min-w-0 items-center gap-2.5">
        <div className="flex min-w-0 flex-col items-end leading-tight">
          <span className="max-w-full truncate text-sm font-medium">{user.name}</span>
          <span className="text-xs text-muted-foreground">{USER_ROLE_LABELS[user.role]}</span>
        </div>
        <Badge variant="secondary" className="hidden sm:inline-flex">
          {user.username}
        </Badge>
      </div>
      <Separator orientation="vertical" className="mx-0.5 h-5" />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={themeLabel}>
            {theme === "dark" ? <Sun aria-hidden /> : <Moon aria-hidden />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{themeLabel}</TooltipContent>
      </Tooltip>
      {children}
    </header>
  )
}
