import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  isPending: boolean
  // Error dari BE ditampilkan di dalam dialog agar pengguna tahu aksi gagal tanpa menutupnya.
  errorMessage: string | null
}

// Konfirmasi aksi destruktif (hapus permanen). Aksi yang bisa dibatalkan, seperti nonaktifkan, tidak memakai ini.
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  isPending,
  errorMessage,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !isPending && onOpenChange(nextOpen)}>
      <DialogContent role="alertdialog" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Batal
            </Button>
          </DialogClose>
          <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
            {isPending ? "Memproses..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
