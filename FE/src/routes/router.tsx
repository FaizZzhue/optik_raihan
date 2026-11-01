import { createBrowserRouter, Navigate } from "react-router-dom"
import { DashboardLayout } from "@/layouts/DashboardLayout"
import { ProtectedRoute } from "./ProtectedRoute"

// Route baru di dalam ProtectedRoute otomatis wajib login. RoleRoute ditambahkan saat ada route khusus role.
// Halaman dimuat lazy agar kode tiap halaman berada di chunk terpisah (bundle utama > 500 kB).
export const router = createBrowserRouter([
  {
    // Tampil sesaat selama chunk halaman pertama diunduh.
    hydrateFallbackElement: (
      <span role="status" className="sr-only">
        Memuat halaman...
      </span>
    ),
    children: [
      {
        path: "/login",
        lazy: async () => ({ Component: (await import("@/pages/LoginPage")).LoginPage }),
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: "/",
                lazy: async () => ({ Component: (await import("@/pages/DashboardPage")).DashboardPage }),
              },
            ],
          },
        ],
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
])
