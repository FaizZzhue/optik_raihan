import { isAxiosError } from "axios"
import type { ApiErrorBody, ApiErrorDetail } from "@/types/api"

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

// Error per field dari BE (400 validasi atau 409 konflik, mis. nama kategori kembar) untuk ditampilkan di bawah field form.
export function getApiFieldErrors(error: unknown): Required<ApiErrorDetail>[] {
  if (!isAxiosError<ApiErrorBody>(error)) {
    return []
  }
  const details = error.response?.data?.error?.details ?? []
  return details.filter((detail): detail is Required<ApiErrorDetail> => typeof detail.field === "string")
}
