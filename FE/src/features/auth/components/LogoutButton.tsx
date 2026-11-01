import { CircleAlert, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getApiErrorMessage } from "@/utils/api-error"
import { useLogout } from "../hooks/use-auth"

const LOGOUT_ERROR_ID = "logout-error"

export function LogoutButton() {
  const logoutMutation = useLogout()

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
        aria-describedby={logoutMutation.isError ? LOGOUT_ERROR_ID : undefined}
      >
        <LogOut data-icon="inline-start" aria-hidden />
        {logoutMutation.isPending ? "Keluar..." : "Keluar"}
      </Button>
      {/* Melayang di bawah tombol agar header tidak bergeser. Sesi masih aktif selama logout gagal. */}
      {logoutMutation.isError && (
        <p
          id={LOGOUT_ERROR_ID}
          role="alert"
          className="absolute top-full right-0 z-20 mt-2 flex w-72 max-w-[calc(100vw-2rem)] items-start gap-2 rounded-lg border border-input bg-popover p-3 text-sm text-destructive shadow-md"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>Gagal keluar. {getApiErrorMessage(logoutMutation.error)}</span>
        </p>
      )}
    </div>
  )
}
