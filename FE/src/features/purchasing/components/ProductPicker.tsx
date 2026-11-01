import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SEARCH_DEBOUNCE_MS } from "@/constants/pagination.constants"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import type { Product } from "@/types/catalog"
import { getApiErrorMessage } from "@/utils/api-error"
import { useActiveProductSearch } from "../hooks/use-purchases"

type ProductPickerProps = {
  // Barang yang sudah ada di daftar tidak bisa dipilih lagi (satu barang satu baris).
  selectedProductIds: number[]
  onSelect: (product: Product) => void
  disabled?: boolean
}

export function ProductPicker({ selectedProductIds, onSelect, disabled = false }: ProductPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DEBOUNCE_MS)
  const productsQuery = useActiveProductSearch(debouncedSearch, open)

  const handleSelect = (product: Product) => {
    onSelect(product)
    setOpen(false)
    setSearch("")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" disabled={disabled}>
          <Plus data-icon="inline-start" aria-hidden />
          Tambah barang
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(24rem,calc(100vw-2rem))] p-0" align="start">
        {/* Pencarian di server, jadi penyaringan bawaan cmdk dimatikan. */}
        <Command shouldFilter={false}>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder="Cari nama atau SKU barang aktif"
            aria-label="Cari barang"
          />
          <CommandList>
            {productsQuery.isPending ? (
              <p role="status" className="py-6 text-center text-sm text-muted-foreground">
                Memuat barang...
              </p>
            ) : productsQuery.isError ? (
              <p role="alert" className="px-3 py-6 text-center text-sm text-destructive">
                {getApiErrorMessage(productsQuery.error)}
              </p>
            ) : (
              <>
                <CommandEmpty>Tidak ada barang aktif yang cocok.</CommandEmpty>
                {productsQuery.data.map((product) => {
                  const isSelected = selectedProductIds.includes(product.id)
                  return (
                    <CommandItem
                      key={product.id}
                      value={String(product.id)}
                      disabled={isSelected}
                      onSelect={() => handleSelect(product)}
                    >
                      <span className="tabular-nums text-muted-foreground">{product.sku}</span>
                      <span className="truncate">{product.name}</span>
                      {isSelected && <span className="ml-auto text-xs text-muted-foreground">Sudah dipilih</span>}
                    </CommandItem>
                  )
                })}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
