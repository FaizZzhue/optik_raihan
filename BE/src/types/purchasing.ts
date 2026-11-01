// DTO supplier dan pembelian. Uang berupa string desimal (DEC-011), waktu ISO 8601 UTC.
export type SupplierDto = {
  id: number;
  name: string;
  phone: string | null;
  address: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type PurchaseHeaderDto = {
  id: number;
  supplier: { id: number; name: string };
  supplierInvoiceNo: string | null;
  purchasedAt: string;
  total: string;
  notes: string | null;
  createdBy: { id: number; name: string };
};

export type PurchaseSummaryDto = PurchaseHeaderDto & {
  itemCount: number;
};

export type PurchaseDetailDto = PurchaseHeaderDto & {
  items: {
    id: number;
    product: { id: number; sku: string; name: string };
    quantity: number;
    unitCost: string;
    lineTotal: string;
  }[];
};

export type StockMovementDto = {
  id: number;
  movementType: string;
  quantityChange: number;
  stockAfter: number;
  purchaseId: number | null;
  note: string | null;
  createdBy: { id: number; name: string };
  createdAt: string;
};
