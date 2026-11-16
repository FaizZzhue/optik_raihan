import type { ReactNode } from "react"
import { Bell, BellOff, ChevronDown, Glasses, Moon, Sun } from "lucide-react"
import { Link } from "react-router-dom"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { USER_ROLE_LABELS } from "@/constants/auth.constants"
import { useTheme } from "@/hooks/common/use-theme"
import { cn } from "@/lib/utils"
import type { AuthUser } from "@/types/auth"
import { getInitials } from "@/utils/common/format-user"
import { ToneBadge } from "./StatusBadge"

type AppHeaderProps = {
  user: AuthUser
  isCollapsed?: boolean
  // Aksi akun (logout) dari feature auth, dikirim lewat layout agar shared tidak mengimpor feature.
  children: ReactNode
}

const ICON_BUTTON_CLASSES =
  "focus-ring flex size-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-card transition-colors duration-150 hover:text-foreground"

// Belum ada modul notifikasi; popover menjelaskan hal itu alih-alih menampilkan notifikasi palsu.
export function NotificationButton({ className }: { className?: string }) {
  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <button type="button" aria-label="Notifikasi" className={cn(ICON_BUTTON_CLASSES, className)}>
              <Bell className="size-4.5" aria-hidden />
            </button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Notifikasi</TooltipContent>
      </Tooltip>
      <PopoverContent align="end" className="w-72 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground" aria-hidden>
            <BellOff className="size-4" />
          </span>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold text-foreground">Belum ada notifikasi</p>
            <p className="text-xs text-muted-foreground">Fitur notifikasi belum tersedia di sistem ini.</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const themeLabel = theme === "dark" ? "Gunakan mode terang" : "Gunakan mode gelap"

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" onClick={toggleTheme} aria-label={themeLabel} className={cn(ICON_BUTTON_CLASSES, className)}>
          {theme === "dark" ? <Sun className="size-4.5" aria-hidden /> : <Moon className="size-4.5" aria-hidden />}
        </button>
      </TooltipTrigger>
      <TooltipContent>{themeLabel}</TooltipContent>
    </Tooltip>
  )
}

export function AccountMenu({ user, children, className }: AppHeaderProps & { className?: string }) {
  const initials = getInitials(user.name)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Menu akun ${user.name}`}
          className={cn(
            "focus-ring flex items-center gap-2 rounded-full border border-border bg-card p-1 shadow-card transition-colors duration-150 hover:bg-muted sm:pr-3",
            className,
          )}
        >
          <span aria-hidden className="flex size-8 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
            {initials}
          </span>
          <span className="hidden max-w-36 flex-col items-start leading-tight sm:flex">
            <span className="max-w-full truncate text-xs font-semibold text-foreground">{user.name}</span>
            <span className="text-[11px] text-muted-foreground">{USER_ROLE_LABELS[user.role]}</span>
          </span>
          <ChevronDown className="hidden size-3.5 text-muted-foreground sm:block" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">@{user.username}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
          <ToneBadge tone="lime">{USER_ROLE_LABELS[user.role]}</ToneBadge>
          {children}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Navbar atas yang bersih: hanya memuat identitas toko di kiri (bila diperlukan)
// dan kontrol preferensi/akun di pojok kanan, tanpa duplikasi tab navigasi.
export function AppHeader({ user, isCollapsed = false, children }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-border/50 bg-background/85 px-4 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-2.5">
        <Link
          to="/"
          aria-label="Optik Raihan, ke dashboard"
          className={cn(
            "focus-ring flex items-center gap-2.5 rounded-full transition-opacity",
            !isCollapsed && "md:invisible md:pointer-events-none",
          )}
        >
          <span aria-hidden className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
            <Glasses className="size-5 stroke-[2.2]" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-tight text-foreground">Optik Raihan</span>
            <span className="text-[11px] text-muted-foreground">Sistem Operasional</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center justify-end gap-2">
        <NotificationButton />
        <ThemeToggle />
        <AccountMenu user={user}>{children}</AccountMenu>
      </div>
    </header>
  )
}

export function AppHeaderSkeleton() {
  return <div aria-hidden className="h-16 shrink-0 border-b border-border/50" />
}
