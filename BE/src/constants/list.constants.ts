// Filter status untuk daftar data master (kategori, barang, supplier, akun).
// Nilai sama dengan FE/src/constants/status-filter.constants.ts.
export const STATUS_FILTERS = {
  ALL: "all",
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type StatusFilter = (typeof STATUS_FILTERS)[keyof typeof STATUS_FILTERS];

// Default dan batas pagination daftar (BE-004). Nilai sama dengan FE/src/constants/pagination.constants.ts.
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;
