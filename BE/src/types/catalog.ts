// DTO kategori dan barang yang boleh keluar dari BE. Uang berupa string desimal (DEC-011), waktu ISO 8601 UTC.
export type CategoryDto = {
  id: number;
  name: string;
  isActive: boolean;
  productCount: number;
  totalStock: number;
  createdAt: string;
  updatedAt: string;
};

export type ProductDto = {
  id: number;
  sku: string;
  name: string;
  description: string | null;
  category: {
    id: number;
    name: string;
    isActive: boolean;
  };
  sellPrice: string;
  costPrice: string;
  stockQty: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
