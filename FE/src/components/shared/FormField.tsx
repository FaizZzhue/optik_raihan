import type { ReactNode } from "react"
import { Label } from "@/components/ui/label"

type FieldAriaProps = {
  "aria-invalid": true | undefined
  "aria-describedby": string | undefined
}

type FormFieldProps = {
  id: string
  label: string
  error?: string | undefined
  hint?: ReactNode
  // Kontrol menerima atribut aria agar pesan error dan petunjuk dibacakan pembaca layar.
  children: (aria: FieldAriaProps) => ReactNode
}

export function FormField({ id, label, error, hint, children }: FormFieldProps) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ")

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children({ "aria-invalid": error ? true : undefined, "aria-describedby": describedBy || undefined })}
      {hint && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
