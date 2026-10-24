// Bentuk respons BE (API_CONTRACT.md bagian 2 dan 3).
export type ApiSuccess<T> = {
  data: T
}

export type ApiErrorDetail = {
  field?: string
  message: string
}

export type ApiErrorBody = {
  error: {
    code: string
    message: string
    details?: ApiErrorDetail[]
  }
}
