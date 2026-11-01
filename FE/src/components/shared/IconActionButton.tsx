import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type IconActionButtonProps = {
  icon: LucideIcon
  // Teks tooltip yang terlihat, mis. "Ubah".
  label: string
  // Nama aksi lengkap untuk pembaca layar, mis. "Ubah Frame A".
  accessibleLabel: string
  onClick: () => void
  disabled?: boolean
  destructive?: boolean
}

// Tombol aksi per baris tabel: ikon saja agar kolom aksi tetap ringkas, dengan tooltip dan label aksesibel.
export function IconActionButton({
  icon: Icon,
  label,
  accessibleLabel,
  onClick,
  disabled = false,
  destructive = false,
}: IconActionButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={destructive ? "destructive" : "ghost"}
          size="icon-sm"
          onClick={onClick}
          disabled={disabled}
          aria-label={accessibleLabel}
        >
          <Icon aria-hidden />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
