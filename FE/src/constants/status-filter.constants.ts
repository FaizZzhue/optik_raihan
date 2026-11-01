// Filter status daftar data master. Nilai sama dengan BE/src/constants/list.constants.ts.
export const STATUS_FILTERS = {
  ALL: "all",
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const

export type StatusFilter = (typeof STATUS_FILTERS)[keyof typeof STATUS_FILTERS]

export const STATUS_FILTER_LABELS: Record<StatusFilter, string> = {
  all: "Semua status",
  active: "Aktif",
  inactive: "Nonaktif",
}
