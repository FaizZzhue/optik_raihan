import { Skeleton } from "@/components/ui/skeleton"

type TableSkeletonProps = {
  label: string
  rows?: number
}

// Placeholder setinggi tabel asli agar isi yang muncul tidak menggeser layout.
export function TableSkeleton({ label, rows = 5 }: TableSkeletonProps) {
  return (
    <div role="status" className="flex flex-col gap-2 rounded-xl border bg-card p-4">
      <span className="sr-only">{label}</span>
      <Skeleton className="h-6 w-full" aria-hidden />
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className="h-9 w-full" aria-hidden />
      ))}
    </div>
  )
}
