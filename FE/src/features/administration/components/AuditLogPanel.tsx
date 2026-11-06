import { useState } from "react"
import { History } from "lucide-react"
import { EmptyState } from "@/components/shared/EmptyState"
import { ErrorState } from "@/components/shared/ErrorState"
import { ListPagination } from "@/components/shared/ListPagination"
import { TableSkeleton } from "@/components/shared/TableSkeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ALL_ACTIONS_VALUE, AUDIT_ACTION_LABELS } from "@/constants/owner.constants"
import { getApiErrorMessage } from "@/utils/api-error"
import { formatDateTime } from "@/utils/format-date"
import { describeAuditEntry } from "../audit-description"
import { useAuditLogs } from "../hooks/use-administration"

export function AuditLogPanel() {
  const [page, setPage] = useState(1)
  const [action, setAction] = useState(ALL_ACTIONS_VALUE)
  const logsQuery = useAuditLogs(page, action === ALL_ACTIONS_VALUE ? undefined : action)

  const renderContent = () => {
    if (logsQuery.isPending) {
      return <TableSkeleton label="Memuat log aktivitas..." />
    }
    if (logsQuery.isError) {
      return (
        <ErrorState
          title="Log aktivitas tidak dapat dimuat"
          description={getApiErrorMessage(logsQuery.error)}
          onRetry={() => void logsQuery.refetch()}
        />
      )
    }
    const { data: logs, meta } = logsQuery.data
    if (logs.length === 0) {
      return (
        <EmptyState
          icon={History}
          title="Belum ada aktivitas"
          description="Login, perubahan harga, dan perubahan akun akan tercatat di sini."
        />
      )
    }
    return (
      <div className="flex flex-col gap-3" aria-busy={logsQuery.isFetching}>
        <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="pl-4">Waktu</TableHead>
                <TableHead>Pelaku</TableHead>
                <TableHead>Jenis Aksi</TableHead>
                <TableHead className="min-w-64 pr-4">Keterangan Rinci</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="pl-4 tabular-nums text-muted-foreground">
                    {formatDateTime(log.createdAt)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {log.actor ? (
                      <span>
                        {log.actor.name}{" "}
                        <span className="font-mono text-xs text-muted-foreground">({log.actor.username})</span>
                      </span>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-md border border-border/80 bg-muted/60 px-2 py-0.5 text-xs font-medium text-foreground">
                      {AUDIT_ACTION_LABELS[log.action] ?? log.action}
                    </span>
                  </TableCell>
                  <TableCell className="min-w-64 pr-4 whitespace-normal text-foreground">
                    {describeAuditEntry(log)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <ListPagination meta={meta} itemLabel="aktivitas" onPageChange={setPage} isFetching={logsQuery.isFetching} />
      </div>
    )
  }

  return (
    <section className="flex flex-col gap-5" aria-label="Log aktivitas">
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <Select
          value={action}
          onValueChange={(value) => {
            setAction(value)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-60" aria-label="Filter jenis aksi">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_ACTIONS_VALUE}>Semua aksi</SelectItem>
            {Object.entries(AUDIT_ACTION_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Rekaman ini bersifat <span className="font-medium text-foreground">append-only</span> dan tidak dapat disunting
          maupun dihapus.
        </p>
      </div>
      {renderContent()}
    </section>
  )
}
