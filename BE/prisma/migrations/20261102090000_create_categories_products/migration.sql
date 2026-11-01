-- Manual (ERD D-05): sequence untuk SKU "P-" + 6 digit. Harus ada sebelum tabel products karena dipakai default kolom sku.
-- MAXVALUE 999999 agar sequence berhenti dengan error, bukan menghasilkan SKU terpotong oleh lpad dan bentrok.
CREATE SEQUENCE "products_sku_seq" AS INTEGER START WITH 1 MAXVALUE 999999;

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "sku" VARCHAR(20) NOT NULL DEFAULT ('P-'::text || lpad((nextval('products_sku_seq'::regclass))::text, 6, '0'::text)),
    "name" VARCHAR(150) NOT NULL,
    "category_id" INTEGER NOT NULL,
    "sell_price" DECIMAL(14,2) NOT NULL,
    "cost_price" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "stock_qty" INTEGER NOT NULL DEFAULT 0,
    "photo_path" VARCHAR(255),
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- CreateIndex
CREATE INDEX "products_category_id_idx" ON "products"("category_id");

-- CreateIndex
CREATE INDEX "products_is_active_idx" ON "products"("is_active");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Manual: sequence ikut terhapus bila kolom sku dihapus.
ALTER SEQUENCE "products_sku_seq" OWNED BY "products"."sku";

-- Manual (ERD 4.3): nama kategori unik tanpa membedakan huruf besar/kecil ("Frame" dan "frame" dianggap sama).
CREATE UNIQUE INDEX "categories_name_lower_key" ON "categories" (lower("name"));

-- Manual (ERD 5, BR-01): lapis terakhir harga dan stok tidak negatif.
ALTER TABLE "products" ADD CONSTRAINT "products_sell_price_non_negative" CHECK ("sell_price" >= 0);
ALTER TABLE "products" ADD CONSTRAINT "products_cost_price_non_negative" CHECK ("cost_price" >= 0);
ALTER TABLE "products" ADD CONSTRAINT "products_stock_qty_non_negative" CHECK ("stock_qty" >= 0);
