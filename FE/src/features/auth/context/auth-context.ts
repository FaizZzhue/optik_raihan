import { createContext } from "react"
import type { AuthContextValue } from "../types"

// Dipisah dari AuthContext.tsx agar file komponen hanya mengekspor komponen (react-refresh).
export const AuthContext = createContext<AuthContextValue | null>(null)
