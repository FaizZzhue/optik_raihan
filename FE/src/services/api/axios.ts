import axios, { isAxiosError } from "axios"
import { AUTH_ME_QUERY_KEY } from "@/constants/auth.constants"
import { queryClient } from "@/lib/queryClient"

// Satu-satunya instance Axios (API_CONTRACT.md bagian 10). Sesi berada di cookie HttpOnly,
// jadi tidak ada header Authorization: Bearer dan token tidak pernah disentuh JavaScript.
export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

// 401 dari /auth/login (kredensial salah) dan /auth/me (cek sesi) ditangani pemanggilnya.
// Mengecualikan keduanya mencegah loop redirect di halaman login.
const AUTH_ENDPOINTS_HANDLED_BY_CALLER = ["/auth/login", "/auth/me"]

api.interceptors.response.use(undefined, (error: unknown) => {
  if (
    isAxiosError(error) &&
    error.response?.status === 401 &&
    !AUTH_ENDPOINTS_HANDLED_BY_CALLER.includes(error.config?.url ?? "")
  ) {
    // Mengosongkan state auth; ProtectedRoute lalu mengarahkan ke /login sambil menyimpan tujuan semula.
    queryClient.setQueryData(AUTH_ME_QUERY_KEY, null)
  }
  return Promise.reject(error)
})
