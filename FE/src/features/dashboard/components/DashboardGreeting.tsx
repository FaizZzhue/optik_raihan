import { useState, type FormEvent } from "react"
import { Calendar, Package, Plus, Search } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { ToneBadge } from "@/components/shared/StatusBadge"
import { Button } from "@/components/ui/button"

type DashboardGreetingProps = {
  userName: string
  roleLabel: string
  isOwner: boolean
}

const todayFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
})

// Pencarian diteruskan ke halaman Barang (?q=), yang memakai pencarian server yang sudah ada.
function CatalogSearch() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const keyword = query.trim()
    navigate(keyword ? `/barang?q=${encodeURIComponent(keyword)}` : "/barang")
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="relative w-full sm:w-72">
      <label htmlFor="dashboard-search" className="sr-only">
        Cari barang di katalog
      </label>
      <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <input
        id="dashboard-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Cari barang atau SKU..."
        maxLength={100}
        className="h-11 w-full rounded-full border border-border bg-card pr-4 pl-10 text-sm text-foreground shadow-card transition-shadow duration-150 outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
      />
    </form>
  )
}

export function DashboardGreeting({ userName, roleLabel, isOwner }: DashboardGreetingProps) {
  return (
    <header className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1.5">
          <h1 className="text-[1.75rem] leading-tight font-semibold tracking-tight text-foreground sm:text-[2rem]">
            Selamat datang, {userName}
          </h1>
          <p className="text-sm text-muted-foreground">
            Pantau pengadaan, posisi stok, dan katalog kacamata toko hari ini.
          </p>
        </div>
        <CatalogSearch />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <ToneBadge tone="success" dot className="px-3 py-1 text-xs">
            Sistem Operasional Aktif
          </ToneBadge>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground">
            <Calendar className="size-3.5 text-muted-foreground" aria-hidden />
            {todayFormatter.format(new Date())}
          </span>
          <ToneBadge tone="neutral" className="px-3 py-1 text-xs">
            {roleLabel}
          </ToneBadge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isOwner && (
            <Button asChild className="h-10 rounded-full px-5">
              <Link to="/pembelian/baru">
                <Plus data-icon="inline-start" aria-hidden />
                Catat Pembelian
              </Link>
            </Button>
          )}
          <Button asChild variant="outline" className="h-10 rounded-full px-5">
            <Link to="/barang">
              <Package data-icon="inline-start" aria-hidden />
              Katalog
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
