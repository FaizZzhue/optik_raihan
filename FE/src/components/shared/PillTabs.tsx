import { cn } from "@/lib/utils"

export type PillTabOption<T extends string> = {
  value: T
  label: string
}

type PillTabsProps<T extends string> = {
  options: readonly PillTabOption<T>[]
  value: T
  onChange: (value: T) => void
  ariaLabel: string
  // "onDark" untuk permukaan gelap (mis. kartu pendapatan); pilihan aktif memakai aksen lime.
  surface?: "default" | "onDark"
  size?: "sm" | "md"
  className?: string
}

const SURFACE_CLASSES = {
  default: {
    track: "bg-muted",
    active: "bg-card text-foreground shadow-card",
    idle: "text-muted-foreground hover:text-foreground",
  },
  onDark: {
    track: "bg-bank-foreground/10",
    active: "bg-primary text-primary-foreground",
    idle: "text-bank-foreground/75 hover:text-bank-foreground",
  },
}

// Segmented control berbentuk pill. Tiap tombol memakai aria-pressed agar status terbaca pembaca layar.
export function PillTabs<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  surface = "default",
  size = "md",
  className,
}: PillTabsProps<T>) {
  const styles = SURFACE_CLASSES[surface]

  return (
    <div role="group" aria-label={ariaLabel} className={cn("inline-flex items-center rounded-full p-1", styles.track, className)}>
      {options.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "focus-ring rounded-full font-semibold whitespace-nowrap transition-colors duration-150",
              size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3.5 py-1.5 text-xs",
              isActive ? styles.active : styles.idle,
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
