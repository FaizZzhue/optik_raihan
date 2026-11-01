import { useCallback, useSyncExternalStore } from "react"

export type Theme = "light" | "dark"

// Harus sama dengan public/theme-init.js, yang memasang tema sebelum React dimuat.
const THEME_STORAGE_KEY = "optik-raihan-theme"
const DARK_QUERY = "(prefers-color-scheme: dark)"

const listeners = new Set<() => void>()

function readStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY)
    return value === "light" || value === "dark" ? value : null
  } catch {
    return null
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark")
  listeners.forEach((listener) => listener())
}

function subscribe(onChange: () => void) {
  listeners.add(onChange)

  // Selama pengguna belum memilih sendiri, tema mengikuti perubahan preferensi sistem.
  const mql = window.matchMedia(DARK_QUERY)
  const onSystemChange = (event: MediaQueryListEvent) => {
    if (!readStoredTheme()) {
      applyTheme(event.matches ? "dark" : "light")
    }
  }
  mql.addEventListener("change", onSystemChange)

  return () => {
    listeners.delete(onChange)
    mql.removeEventListener("change", onSystemChange)
  }
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

// Tanpa Context (DEC-005): sumber kebenaran tema adalah class "dark" di <html>.
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot)

  const toggleTheme = useCallback(() => {
    const nextTheme: Theme = getSnapshot() === "dark" ? "light" : "dark"
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    } catch {
      // Penyimpanan diblokir (misalnya mode privat): pilihan hanya berlaku sampai halaman dimuat ulang.
    }
    applyTheme(nextTheme)
  }, [])

  return { theme, toggleTheme }
}
