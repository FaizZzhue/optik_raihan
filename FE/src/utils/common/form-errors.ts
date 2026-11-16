import type { FieldValues, Path, UseFormSetError } from "react-hook-form"
import { getApiFieldErrors } from "./api-error"

// Menaruh error per field dari BE (mis. 409 nama kategori kembar) di bawah field form yang sesuai.
// Mengembalikan false bila tidak ada field yang cocok, sehingga pemanggil menampilkan pesan umum.
export function applyApiFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fieldNames: readonly Path<T>[],
): boolean {
  const fieldErrors = getApiFieldErrors(error).filter((detail) => fieldNames.includes(detail.field as Path<T>))
  for (const detail of fieldErrors) {
    setError(detail.field as Path<T>, { type: "server", message: detail.message })
  }
  return fieldErrors.length > 0
}
