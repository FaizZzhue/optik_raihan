import { isAxiosError } from "axios"
import type { ApiErrorBody } from "@/types/api"

const GENERIC_MESSAGE = "Terjadi kesalahan. Silakan coba lagi."

// Pesan error untuk ditampilkan dekat konteksnya. 403 tidak mengeluarkan sesi (PROJECT-CONTEXT.md bagian 6, Axios).
export function getApiErrorMessage(error: unknown): string {
  if (!isAxiosError<ApiErrorBody>(error)) {
    return GENERIC_MESSAGE
  }
  if (!error.response) {
    return "Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi."
  }
  if (error.response.status === 403) {
    return "Anda tidak berhak melakukan aksi ini."
  }
  return error.response.data?.error?.message ?? GENERIC_MESSAGE
}
