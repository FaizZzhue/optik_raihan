import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createSale, getSales } from "@/services/sales/sales.service"
import type { CashierKPI, CreateSaleInput, Sale } from "@/types/sales"

export const SALES_QUERY_KEYS = {
  all: ["sales"] as const,
  list: () => ["sales", "list"] as const,
}

export function useSales() {
  return useQuery({
    queryKey: SALES_QUERY_KEYS.list(),
    queryFn: getSales,
  })
}

export function useCreateSale(cashierName: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateSaleInput) => createSale(input, cashierName),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: SALES_QUERY_KEYS.all })
    },
  })
}

export function calculateCashierKPI(sales: Sale[]): CashierKPI {
  const today = new Date().toISOString().slice(0, 10)

  let todaySalesAmount = 0
  let monthSalesAmount = 0
  let todayTransactionCount = 0
  let cashAmount = 0
  let qrisAmount = 0
  let transferAmount = 0
  let debitAmount = 0

  for (const s of sales) {
    if (s.status === "void") continue

    monthSalesAmount += s.totalAmount

    const isToday = s.saleDate.slice(0, 10) === today
    if (isToday) {
      todaySalesAmount += s.totalAmount
      todayTransactionCount += 1

      if (s.paymentMethod === "cash") cashAmount += s.totalAmount
      else if (s.paymentMethod === "qris") qrisAmount += s.totalAmount
      else if (s.paymentMethod === "transfer") transferAmount += s.totalAmount
      else if (s.paymentMethod === "debit") debitAmount += s.totalAmount
    }
  }

  return {
    todaySalesAmount,
    monthSalesAmount,
    todayTransactionCount,
    cashDrawerAmount: cashAmount,
    cashAmount,
    qrisAmount,
    transferAmount,
    debitAmount,
  }
}
