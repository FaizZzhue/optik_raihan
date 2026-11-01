import { CircleAlert, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"

type ErrorStateProps = {
  title: string
  description: string
  onRetry: () => void
}

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-xl border bg-card px-6 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <CircleAlert className="size-6" aria-hidden />
      </span>
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      <Button onClick={onRetry} className="mt-2">
        <RotateCw data-icon="inline-start" aria-hidden />
        Coba lagi
      </Button>
    </div>
  )
}
