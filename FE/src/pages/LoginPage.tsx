import { Glasses, Moon, Sun } from "lucide-react"
import { Navigate } from "react-router-dom"
import { ROLE_HOME_PATH } from "@/constants/auth.constants"
import { LoginForm } from "@/features/auth/components/LoginForm"
import { useAuth } from "@/hooks/auth/use-auth"
import { useTheme } from "@/hooks/common/use-theme"

export function LoginPage() {
  const { status, user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  if (status === "authenticated" && user) {
    return <Navigate to={ROLE_HOME_PATH[user.role]} replace />
  }

  return (
    <main className="flex min-h-svh flex-col justify-between bg-background p-4 sm:p-6">
      {/* Bar atas: identitas toko & toggle tema */}
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs"
          >
            <Glasses className="size-4.5 stroke-[2.2]" />
          </span>
          <span className="text-base font-bold tracking-tight text-foreground">Optik Raihan</span>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
          className="focus-ring flex size-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-card transition-colors duration-150 hover:text-foreground"
        >
          {theme === "dark" ? (
            <Sun className="size-4.5" aria-hidden />
          ) : (
            <Moon className="size-4.5" aria-hidden />
          )}
        </button>
      </header>

      {/* Kartu login utama */}
      <div className="mx-auto my-auto w-full max-w-[400px] py-8">
        <section
          aria-label="Form masuk akun Optik Raihan"
          className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8"
        >
          <div>
            <h1 className="font-sans text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Masuk ke Akun
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Masukkan username dan password akun kerja Anda.
            </p>
          </div>

          <div className="mt-6">
            <LoginForm />
          </div>
        </section>
      </div>

      {/* Catatan kaki ringkas */}
      <footer className="text-center text-xs text-muted-foreground">
        Lupa password atau butuh akun baru? Hubungi Owner toko.
      </footer>
    </main>
  )
}
