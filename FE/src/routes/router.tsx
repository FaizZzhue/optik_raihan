import { createBrowserRouter, Navigate } from "react-router-dom"
import { CATALOG_PERMISSIONS } from "@/constants/catalog.constants"
import { OWNER_ONLY } from "@/constants/owner.constants"
import { DashboardLayout } from "@/layouts/DashboardLayout"
import { ProtectedRoute } from "./ProtectedRoute"
import { RoleRoute } from "./RoleRoute"

// Route baru di dalam ProtectedRoute otomatis wajib login; route khusus role dibungkus RoleRoute.
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
              {
                path: "/barang",
                lazy: async () => ({ Component: (await import("@/pages/ProductsPage")).ProductsPage }),
              },
              {
                element: <RoleRoute allowedRoles={CATALOG_PERMISSIONS.MANAGE_CATEGORIES} />,
                children: [
                  {
                    path: "/kategori",
                    lazy: async () => ({ Component: (await import("@/pages/CategoriesPage")).CategoriesPage }),
                  },
                ],
              },
              {
                element: <RoleRoute allowedRoles={OWNER_ONLY} />,
                children: [
                  {
                    path: "/supplier",
                    lazy: async () => ({ Component: (await import("@/pages/SuppliersPage")).SuppliersPage }),
                  },
                  {
                    path: "/pembelian",
                    lazy: async () => ({ Component: (await import("@/pages/PurchasesPage")).PurchasesPage }),
                  },
                  {
                    path: "/pembelian/baru",
                    lazy: async () => ({ Component: (await import("@/pages/NewPurchasePage")).NewPurchasePage }),
                  },
                  {
                    path: "/pembelian/:purchaseId",
                    lazy: async () => ({ Component: (await import("@/pages/PurchaseDetailPage")).PurchaseDetailPage }),
                  },
                  {
                    path: "/akun",
                    lazy: async () => ({ Component: (await import("@/pages/AccountsPage")).AccountsPage }),
                  },
                  {
                    path: "/log-aktivitas",
                    lazy: async () => ({ Component: (await import("@/pages/AuditLogPage")).AuditLogPage }),
                  },
                ],
              },
            ],
          },
        ],
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
])
