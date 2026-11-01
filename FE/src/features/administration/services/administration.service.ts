import { api } from "@/services/api/axios"
import type { ApiList, ApiSuccess } from "@/types/api"
import type { AuditLogEntry, UserAccount } from "@/types/administration"
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination.constants"

export type CreateAccountPayload = { username: string; name: string; password: string }
export type AccountUpdate = { name?: string; isActive?: boolean }

export async function getAccounts(): Promise<UserAccount[]> {
  const response = await api.get<ApiSuccess<UserAccount[]>>("/users")
  return response.data.data
}

export async function createAccount(input: CreateAccountPayload): Promise<UserAccount> {
  const response = await api.post<ApiSuccess<UserAccount>>("/users", input)
  return response.data.data
}

export async function updateAccount(id: number, input: AccountUpdate): Promise<UserAccount> {
  const response = await api.patch<ApiSuccess<UserAccount>>(`/users/${id}`, input)
  return response.data.data
}

export async function resetAccountPassword(id: number, password: string): Promise<void> {
  await api.post(`/users/${id}/reset-password`, { password })
}

// action undefined = semua aksi.
export async function getAuditLogs(page: number, action: string | undefined): Promise<ApiList<AuditLogEntry>> {
  const response = await api.get<ApiList<AuditLogEntry>>("/audit-logs", {
    params: { page, pageSize: DEFAULT_PAGE_SIZE, action },
  })
  return response.data
}
