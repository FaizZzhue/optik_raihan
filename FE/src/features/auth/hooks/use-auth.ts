import { useContext } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AUTH_ME_QUERY_KEY } from "@/constants/auth.constants"
import { AuthContext } from "../context/auth-context"
import { login, logout } from "../services/auth.service"

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth harus dipakai di dalam AuthProvider.")
  }
  return context
}

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, user)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Buang data milik sesi sebelumnya agar tidak terlihat oleh pengguna berikutnya.
      queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== AUTH_ME_QUERY_KEY[0] })
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, null)
    },
  })
}
