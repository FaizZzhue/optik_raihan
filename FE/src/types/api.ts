// Bentuk respons BE (PROJECT-CONTEXT.md bagian 6, Konvensi).
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
