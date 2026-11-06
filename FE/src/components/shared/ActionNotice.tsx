import { CheckCircle2, CircleAlert } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export type Notice = { type: "success" | "error"; message: string }

// Hasil aksi terakhir di halaman. Sukses hanya ditulis setelah BE membalas; error tidak hanya di toast (PROJECT-CONTEXT.md bagian 4).
export function ActionNotice({ notice }: { notice: Notice | null }) {
  if (!notice) {
    return null
  }
  const isError = notice.type === "error"
  return (
    <Alert
      variant={isError ? "destructive" : "default"}
      role={isError ? "alert" : "status"}
      className={isError ? undefined : "border-success/40 bg-secondary/40"}
    >
      {isError ? (
        <CircleAlert className="size-4 text-destructive" aria-hidden />
      ) : (
        <CheckCircle2 className="size-4 text-success" aria-hidden />
      )}
      <AlertDescription>{notice.message}</AlertDescription>
    </Alert>
  )
}
