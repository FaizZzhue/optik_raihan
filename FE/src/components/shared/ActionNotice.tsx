import { Alert, AlertDescription } from "@/components/ui/alert"

export type Notice = { type: "success" | "error"; message: string }

// Hasil aksi terakhir di halaman. Sukses hanya ditulis setelah BE membalas; error tidak hanya di toast (PROJECT-CONTEXT.md bagian 4).
export function ActionNotice({ notice }: { notice: Notice | null }) {
  if (!notice) {
    return null
  }
  const isError = notice.type === "error"
  return (
    <Alert variant={isError ? "destructive" : "default"} role={isError ? "alert" : "status"}>
      <AlertDescription>{notice.message}</AlertDescription>
    </Alert>
  )
}
