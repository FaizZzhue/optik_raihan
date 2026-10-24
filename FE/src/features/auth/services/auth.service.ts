import { isAxiosError } from "axios"
import { api } from "@/services/api/axios"
import type { ApiSuccess } from "@/types/api"
import type { AuthUser } from "@/types/auth"
import type { LoginFormValues } from "../schemas"

export async function login(input: LoginFormValues): Promise<AuthUser> {
  const response = await api.post<ApiSuccess<AuthUser>>("/auth/login", input)
  return response.data.data
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout")
}

// null berarti belum login atau sesi berakhir; bukan error.
export async function getMe(): Promise<AuthUser | null> {
  try {
    const response = await api.get<ApiSuccess<AuthUser>>("/auth/me")
    return response.data.data
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return null
    }
    throw error
  }
}
