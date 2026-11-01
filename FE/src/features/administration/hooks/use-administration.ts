import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { OWNER_QUERY_KEYS } from "@/constants/owner.constants"
import {
  createAccount,
  getAccounts,
  getAuditLogs,
  resetAccountPassword,
  updateAccount,
  type AccountUpdate,
} from "../services/administration.service"

export function useAccounts() {
  return useQuery({ queryKey: OWNER_QUERY_KEYS.accounts, queryFn: getAccounts })
}

// Setiap perubahan akun menulis audit log, jadi log ikut disegarkan.
function useInvalidateAccounts() {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: OWNER_QUERY_KEYS.accounts }),
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] }),
    ])
}

export function useCreateAccount() {
  const invalidate = useInvalidateAccounts()
  return useMutation({ mutationFn: createAccount, onSuccess: invalidate })
}

export function useUpdateAccount() {
  const invalidate = useInvalidateAccounts()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: AccountUpdate }) => updateAccount(id, input),
    onSuccess: invalidate,
  })
}

export function useResetAccountPassword() {
  const invalidate = useInvalidateAccounts()
  return useMutation({
    mutationFn: ({ id, password }: { id: number; password: string }) => resetAccountPassword(id, password),
    onSuccess: invalidate,
  })
}

export function useAuditLogs(page: number, action: string | undefined) {
  return useQuery({
    queryKey: OWNER_QUERY_KEYS.auditLogs(page, action ?? ""),
    queryFn: () => getAuditLogs(page, action),
    placeholderData: keepPreviousData,
  })
}
