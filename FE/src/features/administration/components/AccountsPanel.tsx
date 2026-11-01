import { useState } from "react"
import { KeyRound, Plus, Power, PowerOff, Users } from "lucide-react"
import { ActionNotice, type Notice } from "@/components/shared/ActionNotice"
import { EmptyState } from "@/components/shared/EmptyState"
import { ErrorState } from "@/components/shared/ErrorState"
import { IconActionButton } from "@/components/shared/IconActionButton"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { TableSkeleton } from "@/components/shared/TableSkeleton"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { USER_ROLE_LABELS, USER_ROLES } from "@/constants/auth.constants"
import type { UserAccount } from "@/types/administration"
import { getApiErrorMessage } from "@/utils/api-error"
import { useAccounts, useUpdateAccount } from "../hooks/use-administration"
import { AccountFormDialog } from "./AccountFormDialog"
import { ResetPasswordDialog } from "./ResetPasswordDialog"

export function AccountsPanel() {
  const accountsQuery = useAccounts()
  const updateMutation = useUpdateAccount()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [resetTarget, setResetTarget] = useState<UserAccount | null>(null)
  const [notice, setNotice] = useState<Notice | null>(null)

  const handleToggleActive = (account: UserAccount) => {
    setNotice(null)
    updateMutation.mutate(
      { id: account.id, input: { isActive: !account.isActive } },
      {
        onSuccess: (updated) =>
          setNotice({
            type: "success",
            message: updated.isActive
              ? `Akun ${updated.username} diaktifkan.`
              : `Akun ${updated.username} dinonaktifkan dan langsung tidak bisa dipakai.`,
          }),
        onError: (error) => setNotice({ type: "error", message: getApiErrorMessage(error) }),
      },
    )
  }

  const renderContent = () => {
    if (accountsQuery.isPending) {
      return <TableSkeleton label="Memuat akun..." rows={3} />
    }
    if (accountsQuery.isError) {
      return (
        <ErrorState
          title="Akun tidak dapat dimuat"
          description={getApiErrorMessage(accountsQuery.error)}
          onRetry={() => void accountsQuery.refetch()}
        />
      )
    }
    if (accountsQuery.data.length === 0) {
      return <EmptyState icon={Users} title="Belum ada akun" description="Tambahkan akun untuk pegawai toko." />
    }
    return (
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Nama</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Peran</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-4 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accountsQuery.data.map((account) => {
              const isPending = updateMutation.isPending && updateMutation.variables.id === account.id
              const toggleLabel = account.isActive ? "Nonaktifkan" : "Aktifkan"
              return (
                <TableRow key={account.id}>
                  <TableCell className="pl-4 font-medium">{account.name}</TableCell>
                  <TableCell className="text-muted-foreground">{account.username}</TableCell>
                  <TableCell>{USER_ROLE_LABELS[account.role]}</TableCell>
                  <TableCell>
                    <StatusBadge isActive={account.isActive} />
                  </TableCell>
                  <TableCell className="pr-4">
                    {/* Akun owner tidak dikelola dari sini (BE menolak dengan 403), jadi aksinya tidak ditampilkan. */}
                    {account.role === USER_ROLES.STAFF ? (
                      <div className="flex justify-end gap-1">
                        <IconActionButton
                          icon={KeyRound}
                          label="Reset password"
                          accessibleLabel={`Reset password ${account.username}`}
                          onClick={() => {
                            setNotice(null)
                            setResetTarget(account)
                          }}
                          disabled={isPending}
                        />
                        <IconActionButton
                          icon={account.isActive ? PowerOff : Power}
                          label={toggleLabel}
                          accessibleLabel={`${toggleLabel} ${account.username}`}
                          onClick={() => handleToggleActive(account)}
                          disabled={isPending}
                        />
                      </div>
                    ) : (
                      <p className="text-right text-xs text-muted-foreground">—</p>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <section className="flex flex-col gap-4" aria-label="Daftar akun">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Akun tidak dihapus. Nonaktifkan akun pegawai yang sudah tidak bekerja; aksesnya langsung terputus.
        </p>
        <Button
          onClick={() => {
            setNotice(null)
            setIsFormOpen(true)
          }}
        >
          <Plus data-icon="inline-start" aria-hidden />
          Tambah akun pegawai
        </Button>
      </div>

      <ActionNotice notice={notice} />
      {renderContent()}

      <AccountFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSaved={(account) => {
          setNotice({ type: "success", message: `Akun ${account.username} dibuat.` })
          setIsFormOpen(false)
        }}
      />
      <ResetPasswordDialog
        account={resetTarget}
        onOpenChange={(open) => !open && setResetTarget(null)}
        onDone={(account) => {
          setNotice({ type: "success", message: `Password ${account.username} diganti.` })
          setResetTarget(null)
        }}
      />
    </section>
  )
}
