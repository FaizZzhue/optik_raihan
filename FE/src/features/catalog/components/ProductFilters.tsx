import { Search } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ALL_CATEGORIES_VALUE } from "@/constants/catalog.constants"
import { STATUS_FILTER_LABELS, STATUS_FILTERS, type StatusFilter } from "@/constants/status-filter.constants"
import type { Category } from "@/types/catalog"

type ProductFiltersProps = {
  search: string
  onSearchChange: (value: string) => void
  categoryValue: string
  onCategoryChange: (value: string) => void
  status: StatusFilter
  onStatusChange: (value: StatusFilter) => void
  categories: Category[]
}

export function ProductFilters({
  search,
  onSearchChange,
  categoryValue,
  onCategoryChange,
  status,
  onStatusChange,
  categories,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <InputGroup className="sm:w-72">
        <InputGroupAddon>
          <Search aria-hidden />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cari nama atau SKU"
          aria-label="Cari barang berdasarkan nama atau SKU"
          maxLength={100}
        />
      </InputGroup>
      <Select value={categoryValue} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full sm:w-48" aria-label="Filter kategori">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_CATEGORIES_VALUE}>Semua kategori</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={String(category.id)}>
              {category.isActive ? category.name : `${category.name} (nonaktif)`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={status} onValueChange={(value) => onStatusChange(value as StatusFilter)}>
        <SelectTrigger className="w-full sm:w-40" aria-label="Filter status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.values(STATUS_FILTERS).map((value) => (
            <SelectItem key={value} value={value}>
              {STATUS_FILTER_LABELS[value]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
