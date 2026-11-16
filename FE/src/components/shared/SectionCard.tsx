import { useId, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type SectionCardProps = {
  title?: string
  description?: string
  // Kontrol di kanan judul (tombol, dropdown, tautan).
  action?: ReactNode
  children: ReactNode
  className?: string
}

// Kartu putih membulat standar dashboard. Judul otomatis menjadi label aksesibel section.
export function SectionCard({ title, description, action, children, className }: SectionCardProps) {
  const headingId = useId()

  return (
    <section
      aria-labelledby={title ? headingId : undefined}
      className={cn("flex min-w-0 flex-col gap-4 rounded-card border border-border bg-card p-5 shadow-card sm:p-6", className)}
    >
      {(title || action) && (
        <div className="flex flex-wrap items-start justify-between gap-3">
          {title && (
            <div className="min-w-0">
              <h2 id={headingId} className="text-base font-semibold tracking-tight text-foreground">
                {title}
              </h2>
              {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
            </div>
          )}
          {action && <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div>}
        </div>
      )}
      {children}
    </section>
  )
}
