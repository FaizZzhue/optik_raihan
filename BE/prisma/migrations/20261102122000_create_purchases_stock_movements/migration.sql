-- CreateEnum
CREATE TYPE "movement_type" AS ENUM ('purchase_in');

-- CreateTable
CREATE TABLE "purchases" (
    "id" SERIAL NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "supplier_invoice_no" VARCHAR(50),
    "purchased_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DECIMAL(14,2) NOT NULL,
    "notes" TEXT,
    "created_by_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_items" (
    "id" SERIAL NOT NULL,
    "purchase_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_cost" DECIMAL(14,2) NOT NULL,
    "line_total" DECIMAL(14,2) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "purchase_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_movements" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "movement_type" "movement_type" NOT NULL,
    "quantity_change" INTEGER NOT NULL,
    "stock_after" INTEGER NOT NULL,
    "purchase_id" INTEGER,
    "note" TEXT,
    "created_by_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "purchases_supplier_id_idx" ON "purchases"("supplier_id");

-- CreateIndex
CREATE INDEX "purchases_purchased_at_idx" ON "purchases"("purchased_at");

-- CreateIndex
CREATE INDEX "purchase_items_product_id_idx" ON "purchase_items"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_items_purchase_id_product_id_key" ON "purchase_items"("purchase_id", "product_id");

-- CreateIndex
CREATE INDEX "stock_movements_product_id_created_at_idx" ON "stock_movements"("product_id", "created_at");

-- CreateIndex
CREATE INDEX "stock_movements_purchase_id_idx" ON "stock_movements"("purchase_id");

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_items" ADD CONSTRAINT "purchase_items_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_items" ADD CONSTRAINT "purchase_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- Manual (ERD 5): lapis terakhir nilai pembelian.
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_total_non_negative" CHECK ("total" >= 0);
ALTER TABLE "purchase_items" ADD CONSTRAINT "purchase_items_quantity_positive" CHECK ("quantity" > 0);
ALTER TABLE "purchase_items" ADD CONSTRAINT "purchase_items_unit_cost_non_negative" CHECK ("unit_cost" >= 0);
ALTER TABLE "purchase_items" ADD CONSTRAINT "purchase_items_line_total_formula" CHECK ("line_total" = "quantity" * "unit_cost");

-- Manual (ERD 4.9): integritas ledger. Saat ini satu-satunya sumber adalah pembelian; CHECK ini diganti
-- di migrasi yang menambah kolom sumber dan jenis mutasi baru (penjualan, retur, opname).
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_quantity_change_non_zero" CHECK ("quantity_change" <> 0);
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_stock_after_non_negative" CHECK ("stock_after" >= 0);
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_type_source_sign" CHECK (
    "movement_type" = 'purchase_in' AND "purchase_id" IS NOT NULL AND "quantity_change" > 0
);
-- Satu barang hanya sekali per pembelian, jadi mutasi ganda dari pembelian yang sama ditolak.
CREATE UNIQUE INDEX "stock_movements_purchase_product_key" ON "stock_movements" ("purchase_id", "product_id") WHERE "purchase_id" IS NOT NULL;
