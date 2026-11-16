import { useState, type ComponentProps } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type PasswordInputProps = Omit<ComponentProps<"input">, "type">

/** Input password dengan tombol toggle lihat/sembunyikan isi password. */
export function PasswordInput({ className, disabled, ...props }: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative w-full">
      <Input
        type={isVisible ? "text" : "password"}
        disabled={disabled}
        className={cn("pr-10 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden", className)}
        {...props}
      />
      <button
        type="button"
        disabled={disabled}
        aria-label={isVisible ? "Sembunyikan password" : "Lihat password"}
        aria-pressed={isVisible}
        onClick={() => setIsVisible((v) => !v)}
        className="focus-ring absolute top-1/2 right-1.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
      >
        {isVisible ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
      </button>
    </div>
  )
}
