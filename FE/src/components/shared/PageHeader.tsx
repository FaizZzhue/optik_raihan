import type { ReactNode } from "react"

type PageHeaderProps = {
  title: string
  description: string
  eyebrow?: string
  actions?: ReactNode
}

export function PageHeader({ title, description, eyebrow, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border/70 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1.5">
        {eyebrow && (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-primary-text uppercase">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden />
            {eyebrow}
          </span>
        )}
        <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        <p className="max-w-2xl text-xs text-muted-foreground sm:text-sm leading-relaxed">{description}</p>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2 pt-1 sm:pt-0">{actions}</div>}
    </div>
  )
}
