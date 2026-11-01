import { useEffect, useRef, type ReactNode } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { USER_ROLE_LABELS } from "@/constants/auth.constants"
import { useTheme } from "@/hooks/use-theme"
import type { AuthUser } from "@/types/auth"

type AppHeaderProps = {
  user: AuthUser
  // Aksi akun (logout) dari feature auth, dikirim lewat layout agar shared tidak mengimpor feature.
  children: ReactNode
}

export function AppHeader({ user, children }: AppHeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const themeLabel = theme === "dark" ? "Gunakan mode terang" : "Gunakan mode gelap"
  const { openMobile } = useSidebar()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const wasOpenMobileRef = useRef(false)

  // Sheet sidebar mobile dibuka lewat state (bukan Dialog.Trigger), jadi Radix tidak mengembalikan
  // fokus saat ditutup. Kembalikan ke tombol menu agar pengguna keyboard tidak kehilangan posisi.
  useEffect(() => {
    if (wasOpenMobileRef.current && !openMobile) {
      triggerRef.current?.focus()
    }
    wasOpenMobileRef.current = openMobile
  }, [openMobile])

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4 md:px-6">
      <SidebarTrigger ref={triggerRef} className="-ml-1" aria-label="Buka atau tutup menu" />
      <div className="ml-auto flex min-w-0 flex-col items-end leading-tight">
        <span className="max-w-full truncate text-sm font-medium">{user.name}</span>
        <span className="text-xs text-muted-foreground">{USER_ROLE_LABELS[user.role]}</span>
      </div>
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
