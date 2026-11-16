import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns"

export type CashFlowPeriod = "daily" | "weekly" | "monthly" | "yearly"

export type CashFlowBucket = {
  key: string
  label: string
  fullLabel: string
  total: number
  isCurrent: boolean
}

type PeriodConfig = {
  count: number
  rangeLabel: string
  startOf: (date: Date) => Date
  add: (date: Date, amount: number) => Date
  label: (start: Date) => string
  fullLabel: (start: Date) => string
}

const weekdayShort = new Intl.DateTimeFormat("id-ID", { weekday: "short" })
const dayLong = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "short", year: "numeric" })
const dayMonthShort = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" })
const monthShort = new Intl.DateTimeFormat("id-ID", { month: "short" })
const monthLong = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" })

const startOfIsoWeek = (date: Date) => startOfWeek(date, { weekStartsOn: 1 })

export const CASH_FLOW_PERIODS: Record<CashFlowPeriod, PeriodConfig> = {
  daily: {
    count: 7,
    rangeLabel: "7 hari terakhir",
    startOf: startOfDay,
    add: addDays,
    label: (start) => weekdayShort.format(start),
    fullLabel: (start) => dayLong.format(start),
  },
  weekly: {
    count: 8,
    rangeLabel: "8 minggu terakhir",
    startOf: startOfIsoWeek,
    add: addWeeks,
    label: (start) => dayMonthShort.format(start),
    fullLabel: (start) => `Minggu ${dayMonthShort.format(start)}–${dayMonthShort.format(addDays(start, 6))}`,
  },
  monthly: {
    count: 12,
    rangeLabel: "12 bulan terakhir",
    startOf: startOfMonth,
    add: addMonths,
    label: (start) => monthShort.format(start),
    fullLabel: (start) => monthLong.format(start),
  },
  yearly: {
    count: 5,
    rangeLabel: "5 tahun terakhir",
    startOf: startOfYear,
    add: addYears,
    label: (start) => String(start.getFullYear()),
    fullLabel: (start) => `Tahun ${start.getFullYear()}`,
  },
}

type DatedAmount = {
  purchasedAt: string
  total: string
}

// Mengelompokkan transaksi ke rentang periode berjalan berdasarkan tanggal aslinya (zona waktu perangkat).
// Hanya untuk tampilan; nilai resmi tetap string dari BE. Transaksi di luar rentang diabaikan.
export function buildCashFlowBuckets(items: readonly DatedAmount[], period: CashFlowPeriod, now = new Date()): CashFlowBucket[] {
  const config = CASH_FLOW_PERIODS[period]
  const currentStart = config.startOf(now)

  const buckets = Array.from({ length: config.count }, (_, index) => {
    const start = config.add(currentStart, index - (config.count - 1))
    return {
      key: start.toISOString(),
      label: config.label(start),
      fullLabel: config.fullLabel(start),
      total: 0,
      isCurrent: index === config.count - 1,
    }
  })

  const indexByKey = new Map(buckets.map((bucket, index) => [bucket.key, index]))
  for (const item of items) {
    const index = indexByKey.get(config.startOf(new Date(item.purchasedAt)).toISOString())
    if (index !== undefined) {
      buckets[index].total += Number(item.total)
    }
  }

  return buckets
}
