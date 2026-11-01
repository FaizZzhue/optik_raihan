import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PaginationMeta } from "@/types/api"

type ListPaginationProps = {
  meta: PaginationMeta
  itemLabel: string
  onPageChange: (page: number) => void
  isFetching: boolean
}

export function ListPagination({ meta, itemLabel, onPageChange, isFetching }: ListPaginationProps) {
  const firstItem = (meta.page - 1) * meta.pageSize + 1
  const lastItem = Math.min(meta.page * meta.pageSize, meta.totalItems)

  return (
    <nav aria-label="Navigasi halaman" className="flex flex-wrap items-center justify-between gap-2">
      <p className="text-sm text-muted-foreground tabular-nums" aria-live="polite">
        {meta.totalItems === 0
          ? `0 ${itemLabel}`
          : `Menampilkan ${firstItem}–${lastItem} dari ${meta.totalItems} ${itemLabel}`}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(meta.page - 1)}
          disabled={meta.page <= 1 || isFetching}
        >
          <ChevronLeft data-icon="inline-start" aria-hidden />
          Sebelumnya
        </Button>
        <span className="text-sm tabular-nums">
          {meta.page} / {Math.max(meta.totalPages, 1)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(meta.page + 1)}
          disabled={meta.page >= meta.totalPages || isFetching}
        >
          Berikutnya
          <ChevronRight data-icon="inline-end" aria-hidden />
        </Button>
      </div>
    </nav>
  )
}
