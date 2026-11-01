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
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Waktu</TableHead>
                <TableHead>Pelaku</TableHead>
                <TableHead>Aksi</TableHead>
                <TableHead className="min-w-64 pr-4">Keterangan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="pl-4 tabular-nums">{formatDateTime(log.createdAt)}</TableCell>
                  <TableCell>{log.actor ? `${log.actor.name} (${log.actor.username})` : "—"}</TableCell>
                  <TableCell>{AUDIT_ACTION_LABELS[log.action] ?? log.action}</TableCell>
                  <TableCell className="min-w-64 pr-4 whitespace-normal">{describeAuditEntry(log)}</TableCell>
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
    <section className="flex flex-col gap-4" aria-label="Log aktivitas">
      <Select
        value={action}
        onValueChange={(value) => {
          setAction(value)
          setPage(1)
        }}
      >
        <SelectTrigger className="w-full sm:w-56" aria-label="Filter jenis aksi">
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
      {renderContent()}
    </section>
  )
}
