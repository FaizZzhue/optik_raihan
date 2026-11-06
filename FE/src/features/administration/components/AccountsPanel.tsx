import { useMemo, useState } from "react"
import { KeyRound, Plus, Power, PowerOff, Search, SearchX, Users } from "lucide-react"
import { ActionNotice, type Notice } from "@/components/shared/ActionNotice"
import { EmptyState } from "@/components/shared/EmptyState"
import { ErrorState } from "@/components/shared/ErrorState"
import { IconActionButton } from "@/components/shared/IconActionButton"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { TableSkeleton } from "@/components/shared/TableSkeleton"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { USER_ROLE_LABELS, USER_ROLES } from "@/constants/auth.constants"
import type { UserAccount } from "@/types/administration"
import { getApiErrorMessage } from "@/utils/api-error"
import { formatDateShort } from "@/utils/format-date"
import { useAccounts, useUpdateAccount } from "../hooks/use-administration"
import { AccountFormDialog } from "./AccountFormDialog"
import { ResetPasswordDialog } from "./ResetPasswordDialog"

export function AccountsPanel() {
  const accountsQuery = useAccounts()
  const updateMutation = useUpdateAccount()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [resetTarget, setResetTarget] = useState<UserAccount | null>(null)
  const [notice, setNotice] = useState<Notice | null>(null)
  const [search, setSearch] = useState("")

  const accounts = useMemo(() => accountsQuery.data ?? [], [accountsQuery.data])
  const staffAccounts = useMemo(() => accounts.filter((a) => a.role === USER_ROLES.STAFF), [accounts])
  const activeStaffCount = useMemo(() => staffAccounts.filter((a) => a.isActive).length, [staffAccounts])

  const filteredAccounts = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return accounts
    return accounts.filter(
      (account) =>
        account.name.toLowerCase().includes(q) ||
        account.username.toLowerCase().includes(q) ||
        USER_ROLE_LABELS[account.role].toLowerCase().includes(q),
    )
  }, [accounts, search])

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
    if (accounts.length === 0) {
      return <EmptyState icon={Users} title="Belum ada akun" description="Tambahkan akun untuk pegawai toko." />
    }
    if (filteredAccounts.length === 0) {
      return (
        <EmptyState
          icon={SearchX}
          title="Tidak ada akun yang cocok"
          description="Coba kata kunci nama atau username yang berbeda."
        />
      )
    }
    return (
      <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="pl-4">Nama Lengkap</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Peran</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Terdaftar</TableHead>
              <TableHead className="pr-4 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAccounts.map((account) => {
              const isPending = updateMutation.isPending && updateMutation.variables.id === account.id
              const toggleLabel = account.isActive ? "Nonaktifkan" : "Aktifkan"
              return (
                <TableRow key={account.id}>
                  <TableCell className="pl-4 font-medium text-foreground">{account.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{account.username}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                        account.role === USER_ROLES.OWNER
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {USER_ROLE_LABELS[account.role]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge isActive={account.isActive} />
                  </TableCell>
                  <TableCell className="text-xs tabular-nums text-muted-foreground">
                    {formatDateShort(account.createdAt)}
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
                      <p className="text-right text-xs text-muted-foreground">Akun utama</p>
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
    <section className="flex flex-col gap-5" aria-label="Daftar akun">
      {!accountsQuery.isPending && !accountsQuery.isError && (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-4 shadow-xs">
            <p className="text-xs font-medium text-muted-foreground">Total Akun Pengguna</p>
            <p className="mt-1 font-serif text-2xl font-semibold tabular-nums">{accounts.length}</p>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-xs">
            <p className="text-xs font-medium text-muted-foreground">Pegawai Aktif</p>
            <p className="mt-1 font-serif text-2xl font-semibold tabular-nums text-primary">{activeStaffCount}</p>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-xs">
            <p className="text-xs font-medium text-muted-foreground">Pegawai Nonaktif</p>
            <p className="mt-1 font-serif text-2xl font-semibold tabular-nums text-muted-foreground">
              {staffAccounts.length - activeStaffCount}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <InputGroup className="sm:w-72">
          <InputGroupAddon>
            <Search aria-hidden />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari nama atau username..."
            aria-label="Cari akun"
            maxLength={100}
          />
        </InputGroup>

        <Button
          onClick={() => {
            setNotice(null)
            setIsFormOpen(true)
          }}
          className="self-start sm:self-auto"
        >
          <Plus data-icon="inline-start" aria-hidden />
          Tambah akun pegawai
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Akun tidak dapat dihapus agar jejak log aktivitas dan pencatatan stok tetap utuh. Nonaktifkan akun pegawai yang
        sudah tidak bekerja; aksesnya langsung diputus seketika.
      </p>

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
