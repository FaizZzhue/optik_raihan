import { createBrowserRouter, Navigate } from "react-router-dom"
import { HomePage } from "@/pages/HomePage"
import { LoginPage } from "@/pages/LoginPage"
import { ProtectedRoute } from "./ProtectedRoute"

// Route baru di dalam ProtectedRoute otomatis wajib login. RoleRoute ditambahkan saat ada route khusus role.
export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [{ path: "/", element: <HomePage /> }],
  },
  { path: "*", element: <Navigate to="/" replace /> },
])
