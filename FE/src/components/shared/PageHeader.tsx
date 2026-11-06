import type { ReactNode } from "react"

type PageHeaderProps = {
  title: string
  description: string
  eyebrow?: string
  actions?: ReactNode
}

export function PageHeader({ title, description, eyebrow, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1">
        {eyebrow && (
          <span className="text-[11px] font-semibold tracking-widest text-primary-text uppercase">{eyebrow}</span>
        )}
        <h1 className="font-serif text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
