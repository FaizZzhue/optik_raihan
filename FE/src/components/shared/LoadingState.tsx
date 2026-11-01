import { Skeleton } from "@/components/ui/skeleton"

type LoadingStateProps = {
  label: string
}

// Ukuran mengikuti PageHeader + satu panel konten agar isi asli tidak menggeser layout saat muncul.
export function LoadingState({ label }: LoadingStateProps) {
  return (
    <div role="status" className="flex flex-col gap-6">
      <span className="sr-only">{label}</span>
      <div className="flex flex-col gap-1" aria-hidden>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-5 w-72 max-w-full" />
      </div>
      <Skeleton className="h-54 w-full rounded-xl" aria-hidden />
    </div>
  )
}
