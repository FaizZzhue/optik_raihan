import { USER_ROLES, type UserRole } from "./auth.constants"
import type { ProductListParams } from "@/types/catalog"

// Sama dengan BE/src/constants/catalog.constants.ts. Di FE hanya untuk tampilan; BE tetap menolak dengan 403.
export const CATALOG_PERMISSIONS: Record<"MANAGE_CATEGORIES" | "WRITE_PRODUCTS" | "DELETE_PRODUCTS", readonly UserRole[]> = {
  MANAGE_CATEGORIES: [USER_ROLES.OWNER],
  WRITE_PRODUCTS: [USER_ROLES.OWNER, USER_ROLES.STAFF],
  DELETE_PRODUCTS: [USER_ROLES.OWNER],
}

export const CATALOG_QUERY_KEYS = {
  categories: ["categories"] as const,
  products: ["products"] as const,
  productList: (params: ProductListParams) => ["products", "list", params] as const,
  stockMovements: (productId: number, page: number) => ["products", "stock-movements", productId, page] as const,
}

// Nilai Select tidak boleh string kosong (Radix), jadi filter "semua kategori" memakai nilai ini.
export const ALL_CATEGORIES_VALUE = "all"
