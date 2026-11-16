import { useMemo, useState } from "react"
import {
  AlertCircle,
  ArrowLeftRight,
  Banknote,
  CheckCircle2,
  CreditCard,
  Minus,
  Package,
  Plus,
  QrCode,
  ReceiptText,
  Save,
  Search,
  ShoppingBag,
  Trash2,
} from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { USER_ROLES } from "@/constants/auth.constants"
import { STATUS_FILTERS } from "@/constants/status-filter.constants"
import { ReceiptDialog } from "@/features/sales/components/ReceiptDialog"
import { useCurrentUser } from "@/hooks/auth/use-auth"
import { useCategories } from "@/hooks/catalog/use-categories"
import { useProducts } from "@/hooks/catalog/use-products"
import { useCreateSale } from "@/hooks/sales/use-sales"
import type { Product } from "@/types/catalog"
import {
  PAYMENT_METHOD_LABELS,
  type CreateSaleItemInput,
  type PaymentMethod,
  type Sale,
} from "@/types/sales"
import { formatRupiah } from "@/utils/formatting/format-currency"

const QUICK_CASH_AMOUNTS = [50000, 100000, 200000, 500000]

const PAYMENT_OPTIONS: Array<{
  method: PaymentMethod
  label: string
  description: string
  icon: typeof Banknote
}> = [
  { method: "cash", label: "Tunai", description: "Kas laci", icon: Banknote },
  { method: "qris", label: "QRIS", description: "Scan instan", icon: QrCode },
  { method: "transfer", label: "Transfer", description: "Rekening toko", icon: ArrowLeftRight },
  { method: "debit", label: "Debit", description: "Mesin EDC", icon: CreditCard },
]

function toCartItem(product: Product): CreateSaleItemInput {
  const sellPrice = Number(product.sellPrice)
  return {
    productId: product.id,
    productSku: product.sku,
    productName: product.name,
    quantity: 1,
    unitPrice: sellPrice,
    standardPrice: sellPrice,
  }
}

export function PosOrderPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const preselectedProductId = Number(searchParams.get("productId")) || null

  const user = useCurrentUser()
  const isOwner = user.role === USER_ROLES.OWNER
  const createSaleMutation = useCreateSale(user.name)

  const [productSearch, setProductSearch] = useState("")
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined)

  // null menandakan keranjang belum dimodifikasi manual sehingga dapat mewarisi ?productId= secara murni.
  const [manualCart, setManualCart] = useState<CreateSaleItemInput[] | null>(null)
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [discountAmount, setDiscountAmount] = useState<number>(0)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("qris")
  const [cashReceived, setCashReceived] = useState<number>(0)
  const [notes, setNotes] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [savedDraftSale, setSavedDraftSale] = useState<Sale | null>(null)
  const [receiptSale, setReceiptSale] = useState<Sale | null>(null)

  const categoriesQuery = useCategories()
  const productsQuery = useProducts({
    page: 1,
    pageSize: 100,
    search: productSearch.trim() || undefined,
    categoryId: selectedCategoryId,
    status: STATUS_FILTERS.ACTIVE,
  })
  const lookupProductsQuery = useProducts({
    page: 1,
    pageSize: 100,
    status: STATUS_FILTERS.ACTIVE,
  })

  const activeCategories = useMemo(
    () => (categoriesQuery.data ?? []).filter((category) => category.isActive),
    [categoriesQuery.data],
  )
  const availableProducts = productsQuery.data?.data ?? []

  const preselectedProduct = useMemo(() => {
    if (!preselectedProductId) return undefined
    const pool = lookupProductsQuery.data?.data ?? []
    return pool.find((item) => item.id === preselectedProductId)
  }, [lookupProductsQuery.data?.data, preselectedProductId])

  const cart = useMemo(() => {
    if (manualCart !== null) return manualCart
    return preselectedProduct ? [toCartItem(preselectedProduct)] : []
  }, [manualCart, preselectedProduct])

  const cartQuantityMap = useMemo(() => {
    const map = new Map<number, number>()
    for (const item of cart) {
      map.set(item.productId, item.quantity)
    }
    return map
  }, [cart])

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    [cart],
  )
  const appliedDiscount = isOwner ? Math.min(Math.max(0, discountAmount), subtotal) : 0
  const totalAmount = Math.max(0, subtotal - appliedDiscount)
  const changeAmount = paymentMethod === "cash" ? Math.max(0, cashReceived - totalAmount) : 0

  const handleAddToCart = (product: Product) => {
    setErrorMessage(null)
    setSavedDraftSale(null)
    setManualCart((prev) => {
      const base = prev ?? cart
      const existing = base.find((item) => item.productId === product.id)
      if (existing) {
        return base.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...base, toCartItem(product)]
    })
  }

  const handleUpdateQty = (productId: number, delta: number) => {
    setErrorMessage(null)
    setManualCart((prev) => {
      const base = prev ?? cart
      return base
        .map((item) => {
          if (item.productId !== productId) return item
          const nextQty = item.quantity + delta
          return nextQty > 0 ? { ...item, quantity: nextQty } : null
        })
        .filter((item): item is CreateSaleItemInput => item !== null)
    })
  }

  const handleUpdatePrice = (productId: number, rawValue: string) => {
    setErrorMessage(null)
    const parsed = Math.max(0, Number(rawValue) || 0)
    setManualCart((prev) => {
      const base = prev ?? cart
      return base.map((item) => (item.productId === productId ? { ...item, unitPrice: parsed } : item))
    })
  }

  const handleRemoveItem = (productId: number) => {
    setErrorMessage(null)
    setManualCart((prev) => {
      const base = prev ?? cart
      return base.filter((item) => item.productId !== productId)
    })
  }

  const handleClearCart = () => {
    setErrorMessage(null)
    setManualCart([])
  }

  const resetOrderForm = () => {
    setManualCart([])
    setCustomerName("")
    setCustomerPhone("")
    setDiscountAmount(0)
    setCashReceived(0)
    setNotes("")
    setErrorMessage(null)
    if (preselectedProductId) {
      setSearchParams({}, { replace: true })
    }
  }

  const submitOrder = async (targetStatus: "completed" | "draft") => {
    setErrorMessage(null)
    setSavedDraftSale(null)

    if (cart.length === 0) {
      setErrorMessage("Pilih minimal satu frame atau lensa ke keranjang terlebih dahulu.")
      return
    }

    if (targetStatus === "completed" && paymentMethod === "cash" && cashReceived < totalAmount) {
      setErrorMessage(
        `Uang tunai yang diterima (${formatRupiah(cashReceived)}) masih kurang dari total bayar (${formatRupiah(totalAmount)}).`,
      )
      return
    }

    try {
      const createdSale = await createSaleMutation.mutateAsync({
        customerName: customerName.trim() || undefined,
        customerPhone: customerPhone.trim() || undefined,
        items: cart,
        discountAmount: appliedDiscount,
        paymentMethod,
        cashReceived: paymentMethod === "cash" ? cashReceived : undefined,
        status: targetStatus,
        notes: notes.trim() || undefined,
      })

      resetOrderForm()
      if (targetStatus === "completed") {
        setReceiptSale(createdSale)
      } else {
        setSavedDraftSale(createdSale)
      }
    } catch {
      setErrorMessage("Gagal menyimpan orderan. Periksa kembali isian lalu coba lagi.")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Kasir POS"
        title="Input Orderan (POS)"
        description="Pilih produk dari katalog aktif, atur kuantitas dan harga jual, lalu simpan sebagai draft atau selesaikan pembayaran dan cetak nota."
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/kasir/katalog")}
              className="rounded-full"
            >
              <Package className="size-4" aria-hidden />
              Cek Stok & Harga
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/kasir")}
              className="rounded-full"
            >
              <ReceiptText className="size-4" aria-hidden />
              Riwayat Order
            </Button>
          </>
        }
      />

      {savedDraftSale && (
        <div className="flex flex-col gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold text-foreground">
                Draft order <span className="font-mono">{savedDraftSale.invoiceNumber}</span> tersimpan!
              </p>
              <p className="text-xs text-muted-foreground">
                Pelanggan: {savedDraftSale.customerName} • Total {formatRupiah(savedDraftSale.totalAmount)} •{" "}
                {PAYMENT_METHOD_LABELS[savedDraftSale.paymentMethod]}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setReceiptSale(savedDraftSale)}
              className="h-9 rounded-full px-3.5"
            >
              Lihat Ringkasan
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => navigate("/kasir")}
              className="h-9 rounded-full px-4"
            >
              Buka Riwayat Order
            </Button>
          </div>
        </div>
      )}

      {/* Tata letak penuh 2 kolom: Katalog di kiri, Keranjang & Pembayaran di kanan */}
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1.15fr_1fr]">
        {/* Kolom Kiri: Katalog Produk Aktif */}
        <section className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 shadow-xs sm:p-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground sm:text-lg">Katalog Barang Aktif</h2>
              <p className="text-xs text-muted-foreground">
                Klik tombol tambah pada kartu barang untuk memasukkan ke keranjang order.
              </p>
            </div>
            <span className="inline-flex w-fit items-center rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground tabular-nums">
              {availableProducts.length} item tampil
            </span>
          </div>

          {/* Search bar besar */}
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Cari nama frame, lensa, atau kode SKU..."
              aria-label="Cari produk di katalog POS"
              className="h-11 rounded-xl pl-11 text-sm"
            />
          </div>

          {/* Filter pills kategori */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategoryId(undefined)}
              className={`focus-ring rounded-full px-4 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                selectedCategoryId === undefined
                  ? "bg-foreground text-background shadow-xs"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              Semua Kategori
            </button>
            {activeCategories.map((category) => {
              const isSelected = selectedCategoryId === category.id
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`focus-ring rounded-full px-4 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {category.name}
                </button>
              )
            })}
          </div>

          {/* Grid Daftar Produk */}
          {productsQuery.isLoading ? (
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-36 animate-pulse rounded-2xl border border-border bg-muted/40"
                />
              ))}
            </div>
          ) : productsQuery.isError ? (
            <div className="flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertCircle className="size-5 shrink-0" aria-hidden />
              <span>Gagal memuat katalog barang. Coba muat ulang halaman.</span>
            </div>
          ) : availableProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-12 text-center">
              <Package className="size-9 text-muted-foreground/60" aria-hidden />
              <p className="text-sm font-semibold text-foreground">Barang tidak ditemukan</p>
              <p className="text-xs text-muted-foreground">
                Coba ubah kata kunci pencarian atau pilih filter kategori lain.
              </p>
            </div>
          ) : (
            <div className="grid max-h-[640px] grid-cols-1 gap-3.5 overflow-y-auto pr-1 sm:grid-cols-2">
              {availableProducts.map((product) => {
                const inCartQty = cartQuantityMap.get(product.id) ?? 0
                const isOutOfStock = product.stockQty <= 0

                return (
                  <div
                    key={product.id}
                    className={`flex flex-col justify-between gap-4 rounded-2xl border p-4 transition-colors ${
                      inCartQty > 0
                        ? "border-primary/60 bg-primary/5"
                        : "border-border bg-background/60 hover:border-border/80 hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] font-medium text-muted-foreground">
                          {product.sku}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold tabular-nums ${
                            isOutOfStock
                              ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                              : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          }`}
                        >
                          Stok: {product.stockQty} pcs
                        </span>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          {product.category.name}
                        </p>
                        <h3 className="mt-0.5 text-sm font-bold leading-snug text-foreground">
                          {product.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-3">
                      <span className="text-base font-bold text-foreground tabular-nums">
                        {formatRupiah(product.sellPrice)}
                      </span>
                      <Button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="h-9 rounded-xl px-3.5 text-xs font-semibold"
                      >
                        <Plus className="size-3.5" aria-hidden />
                        {inCartQty > 0 ? `Tambah (${inCartQty})` : "Tambah"}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Kolom Kanan: Keranjang Order & Pembayaran */}
        <section className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 shadow-xs sm:p-6">
          <div className="flex items-center justify-between gap-2 border-b border-border/70 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/15 text-primary-text">
                <ShoppingBag className="size-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-base font-bold text-foreground sm:text-lg">
                  Keranjang Order ({cart.reduce((sum, item) => sum + item.quantity, 0)} item)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Kasir aktif: <span className="font-semibold text-foreground">{user.name}</span>
                </p>
              </div>
            </div>

            {cart.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearCart}
                className="h-9 rounded-full px-3 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                Kosongkan
              </Button>
            )}
          </div>

          {/* Daftar Item Keranjang */}
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center">
              <ShoppingBag className="size-9 text-muted-foreground/50" aria-hidden />
              <p className="text-sm font-semibold text-foreground">Keranjang masih kosong</p>
              <p className="max-w-xs text-xs text-muted-foreground">
                Pilih frame atau lensa dari katalog di sebelah kiri untuk mulai membuat orderan.
              </p>
            </div>
          ) : (
            <div className="flex max-h-[340px] flex-col gap-3 overflow-y-auto pr-1">
              {cart.map((item) => {
                const lineTotal = item.quantity * item.unitPrice
                const isPriceOverridden = item.unitPrice !== item.standardPrice

                return (
                  <div
                    key={item.productId}
                    className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/30 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {item.productSku}
                        </span>
                        <p className="text-sm font-bold leading-snug text-foreground">
                          {item.productName}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.productId)}
                        aria-label={`Hapus ${item.productName} dari keranjang`}
                        className="size-9 shrink-0 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </Button>
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-3 border-t border-border/60 pt-3">
                      <div className="flex flex-col gap-1">
                        <label
                          htmlFor={`price-${item.productId}`}
                          className="text-xs font-medium text-muted-foreground"
                        >
                          Harga Satuan (Rp)
                        </label>
                        <Input
                          id={`price-${item.productId}`}
                          type="number"
                          min={0}
                          value={item.unitPrice}
                          onChange={(e) => handleUpdatePrice(item.productId, e.target.value)}
                          className="h-10 w-40 rounded-xl bg-background text-sm font-semibold tabular-nums"
                        />
                        {isPriceOverridden && (
                          <span className="text-[11px] text-amber-600 dark:text-amber-400">
                            Standar: {formatRupiah(item.standardPrice)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 rounded-xl border border-border bg-background p-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUpdateQty(item.productId, -1)}
                            aria-label={`Kurangi jumlah ${item.productName}`}
                            className="size-9 rounded-lg"
                          >
                            <Minus className="size-4" aria-hidden />
                          </Button>
                          <span className="min-w-8 text-center text-sm font-bold text-foreground tabular-nums">
                            {item.quantity}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUpdateQty(item.productId, 1)}
                            aria-label={`Tambah jumlah ${item.productName}`}
                            className="size-9 rounded-lg"
                          >
                            <Plus className="size-4" aria-hidden />
                          </Button>
                        </div>

                        <div className="min-w-24 text-right">
                          <span className="block text-[11px] text-muted-foreground">Subtotal</span>
                          <span className="text-base font-bold text-foreground tabular-nums">
                            {formatRupiah(lineTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Identitas Pelanggan & Catatan Order */}
          <div className="flex flex-col gap-3.5 border-t border-border/70 pt-4">
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="pos-customer-name" className="text-xs font-semibold text-foreground">
                  Nama Pelanggan <span className="font-normal text-muted-foreground">(opsional)</span>
                </label>
                <Input
                  id="pos-customer-name"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: Bpk. Ahmad"
                  className="h-11 rounded-xl text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="pos-customer-phone" className="text-xs font-semibold text-foreground">
                  No. HP / WhatsApp{" "}
                  <span className="font-normal text-muted-foreground">(opsional)</span>
                </label>
                <Input
                  id="pos-customer-phone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  className="h-11 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="pos-order-notes" className="text-xs font-semibold text-foreground">
                Catatan Order / Resep Singkat{" "}
                <span className="font-normal text-muted-foreground">(opsional)</span>
              </label>
              <Input
                id="pos-order-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Misal: Lensa minus -1.50 R/L, ambil besok sore"
                className="h-11 rounded-xl text-sm"
              />
            </div>

            {isOwner && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="pos-owner-discount" className="text-xs font-semibold text-foreground">
                  Diskon Khusus Owner (Rp)
                </label>
                <Input
                  id="pos-owner-discount"
                  type="number"
                  min={0}
                  max={subtotal}
                  value={discountAmount || ""}
                  onChange={(e) => setDiscountAmount(Math.max(0, Number(e.target.value) || 0))}
                  placeholder="0"
                  className="h-11 rounded-xl text-sm font-semibold tabular-nums"
                />
              </div>
            )}
          </div>

          {/* Metode Pembayaran */}
          <div className="flex flex-col gap-3 border-t border-border/70 pt-4">
            <span className="text-xs font-bold tracking-wide text-foreground uppercase">
              Metode Pembayaran
            </span>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {PAYMENT_OPTIONS.map(({ method, label, description, icon: Icon }) => {
                const isActive = paymentMethod === method
                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() => {
                      setPaymentMethod(method)
                      setErrorMessage(null)
                    }}
                    className={`focus-ring flex h-16 flex-col items-center justify-center gap-1 rounded-2xl border px-2 transition-all ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="size-4.5" aria-hidden />
                    <span className="text-xs font-bold leading-none">{label}</span>
                    <span
                      className={`text-[10px] leading-none ${
                        isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                      }`}
                    >
                      {description}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Area Uang Tunai & Nominal Cepat */}
            {paymentMethod === "cash" && (
              <div className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/30 p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1.2fr_1fr] sm:items-end">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="pos-cash-received" className="text-xs font-semibold text-foreground">
                      Uang Diterima (Rp)
                    </label>
                    <Input
                      id="pos-cash-received"
                      type="number"
                      min={0}
                      value={cashReceived || ""}
                      onChange={(e) => {
                        setCashReceived(Math.max(0, Number(e.target.value) || 0))
                        setErrorMessage(null)
                      }}
                      placeholder="Contoh: 150000"
                      className="h-11 rounded-xl bg-background text-base font-bold tabular-nums"
                    />
                  </div>
                  <div className="flex flex-col justify-center rounded-xl border border-border bg-background px-4 py-2.5">
                    <span className="text-[11px] font-medium text-muted-foreground">Kembalian</span>
                    <span
                      className={`text-lg font-bold tabular-nums ${
                        cashReceived > 0 && cashReceived < totalAmount
                          ? "text-destructive"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {formatRupiah(changeAmount)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCashReceived(totalAmount)
                      setErrorMessage(null)
                    }}
                    className="focus-ring h-9 rounded-full border border-primary/50 bg-primary/15 px-3.5 text-xs font-bold text-primary-text transition-colors hover:bg-primary/25"
                  >
                    Uang Pas ({formatRupiah(totalAmount)})
                  </button>
                  {QUICK_CASH_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => {
                        setCashReceived(amount)
                        setErrorMessage(null)
                      }}
                      className="focus-ring h-9 rounded-full border border-border bg-background px-3.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                      {formatRupiah(amount)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ringkasan Nominal & Tombol Aksi */}
          <div className="flex flex-col gap-4 border-t border-border pt-4">
            <div className="flex flex-col gap-1.5 rounded-2xl bg-muted/40 p-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Subtotal Barang</span>
                <span className="font-semibold text-foreground tabular-nums">
                  {formatRupiah(subtotal)}
                </span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex items-center justify-between text-xs font-semibold text-primary-text">
                  <span>Diskon Khusus Owner</span>
                  <span className="tabular-nums">-{formatRupiah(appliedDiscount)}</span>
                </div>
              )}
              <div className="mt-1 flex items-baseline justify-between border-t border-border/70 pt-2">
                <span className="text-sm font-bold text-foreground">TOTAL AKHIR</span>
                <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                  {formatRupiah(totalAmount)}
                </span>
              </div>
            </div>

            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-destructive/40 bg-destructive/10 p-3.5 text-xs font-medium text-destructive">
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[auto_1fr]">
              <Button
                type="button"
                variant="outline"
                disabled={createSaleMutation.isPending}
                onClick={() => void submitOrder("draft")}
                className="h-12 rounded-2xl px-5 text-sm font-semibold"
              >
                <Save className="size-4" aria-hidden />
                Simpan Draft
              </Button>
              <Button
                type="button"
                disabled={createSaleMutation.isPending}
                onClick={() => void submitOrder("completed")}
                className="h-12 rounded-2xl px-6 text-sm font-bold shadow-sm"
              >
                <ReceiptText className="size-4.5" aria-hidden />
                {createSaleMutation.isPending
                  ? "Menyimpan Transaksi..."
                  : "Proses Pembayaran & Buat Nota"}
              </Button>
            </div>
          </div>
        </section>
      </div>

      <ReceiptDialog
        open={receiptSale !== null}
        sale={receiptSale}
        onOpenChange={(open) => !open && setReceiptSale(null)}
      />
    </div>
  )
}
