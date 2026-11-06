// Seed database (PROJECT-CONTEXT.md bagian 7, Data: Seed).
// Prinsip keamanan & integritas:
// 1. Tidak ada kredensial (password) di dalam kode sumber; semua akun dibaca dari variabel environment.
// 2. Bersifat idempoten & non-destruktif: tidak pernah menghapus atau menimpa data yang sudah ada.
// 3. Master data contoh (kategori dasar, supplier fiktif, dan barang sampel dengan stok 0) HANYA dijalankan
//    di lingkungan non-produksi (NODE_ENV !== "production") dan bila SEED_DEV_MASTER_DATA !== "false".
// 4. Tidak membuat transaksi pembelian/penjualan palsu dan tidak mengubah stok tanpa stock_movements.
import "dotenv/config";
import { z } from "zod";
import { PASSWORD_MIN_LENGTH, USER_ROLES } from "../src/constants/auth.constants.js";
import { prisma } from "../src/lib/prisma.js";
import { hashPassword } from "../src/utils/password.js";

const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3)
  .max(50)
  .regex(/^[a-z0-9._-]+$/, "Hanya huruf kecil, angka, titik, garis bawah, dan tanda hubung.");

const seedEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  SEED_OWNER_USERNAME: usernameSchema,
  SEED_OWNER_NAME: z.string().trim().min(1).max(100),
  SEED_OWNER_PASSWORD: z.string().min(PASSWORD_MIN_LENGTH).max(128),
  SEED_STAFF_USERNAME: usernameSchema.optional().or(z.literal("")),
  SEED_STAFF_NAME: z.string().trim().min(1).max(100).optional().or(z.literal("")),
  SEED_STAFF_PASSWORD: z.string().min(PASSWORD_MIN_LENGTH).max(128).optional().or(z.literal("")),
  SEED_DEV_MASTER_DATA: z.enum(["true", "false"]).optional().default("true"),
});

const DEFAULT_CATEGORIES = ["Frame", "Lensa jadi", "Kacamata jadi"] as const;

// Supplier fiktif khusus pengembangan (bukan data pribadi/identitas dari faktur nyata).
const SAMPLE_SUPPLIERS = [
  {
    name: "PT Nusantara Optik Mandiri (Contoh Dev)",
    phone: "021-5550101",
    address: "Kawasan Niaga Terpadu Blok A1, Jakarta",
    notes: "Pemasok contoh pengembangan untuk kategori frame metal dan asetat.",
  },
  {
    name: "CV Sinar Lensa Presisi (Contoh Dev)",
    phone: "022-5550202",
    address: "Jl. Industri Optik No. 12, Bandung",
    notes: "Pemasok contoh pengembangan untuk lensa jadi single vision dan kacamata baca.",
  },
] as const;

// Barang contoh khusus pengembangan. Stok awal wajib 0 (hanya bertambah lewat pembelian resmi).
const SAMPLE_PRODUCTS = [
  {
    name: "Frame Metal Oval Klasik Hitam",
    categoryName: "Frame",
    sellPrice: "250000.00",
    costPrice: "95000.00",
    description: "Frame metal ringan model oval klasik warna hitam doff.",
  },
  {
    name: "Frame Acetate Kotak Tortoise",
    categoryName: "Frame",
    sellPrice: "320000.00",
    costPrice: "130000.00",
    description: "Frame asetat tebal motif tortoise untuk lensa minus maupun baca.",
  },
  {
    name: "Frame Half-Rim Titanium Abu-Abu",
    categoryName: "Frame",
    sellPrice: "450000.00",
    costPrice: "190000.00",
    description: "Frame half-rim ringan berbahan titanium warna abu-abu metalik.",
  },
  {
    name: "Lensa Jadi CRMC Minus -1.00",
    categoryName: "Lensa jadi",
    sellPrice: "120000.00",
    costPrice: "35000.00",
    description: "Lensa jadi single vision anti-refleksi standar ukuran -1.00 D.",
  },
  {
    name: "Lensa Jadi Bluecut Minus -1.50",
    categoryName: "Lensa jadi",
    sellPrice: "180000.00",
    costPrice: "60000.00",
    description: "Lensa jadi pelindung sinar biru layar digital ukuran -1.50 D.",
  },
  {
    name: "Kacamata Baca Siap Pakai +1.50",
    categoryName: "Kacamata jadi",
    sellPrice: "95000.00",
    costPrice: "30000.00",
    description: "Kacamata baca jadi ukuran dioptri +1.50 dengan bingkai ringan.",
  },
] as const;

const result = seedEnvSchema.safeParse(process.env);
if (!result.success) {
  throw new Error(`Variabel seed tidak valid:\n${z.prettifyError(result.error)}`);
}
const seedEnv = result.data;

let ownerUser = await prisma.user.findUnique({ where: { username: seedEnv.SEED_OWNER_USERNAME } });

if (ownerUser) {
  console.log(`User owner "${seedEnv.SEED_OWNER_USERNAME}" sudah ada. Pembuatan owner dilewati.`);
} else {
  ownerUser = await prisma.user.create({
    data: {
      username: seedEnv.SEED_OWNER_USERNAME,
      name: seedEnv.SEED_OWNER_NAME,
      passwordHash: await hashPassword(seedEnv.SEED_OWNER_PASSWORD),
      role: USER_ROLES.OWNER,
    },
  });
  console.log(`Owner awal "${seedEnv.SEED_OWNER_USERNAME}" dibuat.`);
}

const isDevEnvironment = seedEnv.NODE_ENV !== "production";

// Opsional: buat akun pegawai di lingkungan non-produksi bila variabel SEED_STAFF_* diisi lengkap.
if (
  isDevEnvironment &&
  seedEnv.SEED_STAFF_USERNAME &&
  seedEnv.SEED_STAFF_NAME &&
  seedEnv.SEED_STAFF_PASSWORD
) {
  const existingStaff = await prisma.user.findUnique({ where: { username: seedEnv.SEED_STAFF_USERNAME } });
  if (existingStaff) {
    console.log(`User pegawai "${seedEnv.SEED_STAFF_USERNAME}" sudah ada. Pembuatan pegawai dilewati.`);
  } else {
    await prisma.user.create({
      data: {
        username: seedEnv.SEED_STAFF_USERNAME,
        name: seedEnv.SEED_STAFF_NAME,
        passwordHash: await hashPassword(seedEnv.SEED_STAFF_PASSWORD),
        role: USER_ROLES.STAFF,
      },
    });
    console.log(`Pegawai awal "${seedEnv.SEED_STAFF_USERNAME}" dibuat.`);
  }
}

// Seed master data contoh hanya untuk development dan hanya bila belum ada di database.
if (isDevEnvironment && seedEnv.SEED_DEV_MASTER_DATA !== "false") {
  const categoryMap = new Map<string, number>();

  for (const name of DEFAULT_CATEGORIES) {
    const existingCategory = await prisma.category.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });
    if (existingCategory) {
      categoryMap.set(name, existingCategory.id);
    } else {
      const created = await prisma.category.create({ data: { name } });
      categoryMap.set(name, created.id);
      console.log(`Kategori dasar "${name}" dibuat.`);
    }
  }

  for (const supplierData of SAMPLE_SUPPLIERS) {
    const existingSupplier = await prisma.supplier.findFirst({
      where: { name: { equals: supplierData.name, mode: "insensitive" } },
    });
    if (!existingSupplier) {
      await prisma.supplier.create({ data: supplierData });
      console.log(`Supplier contoh "${supplierData.name}" dibuat.`);
    }
  }

  for (const productData of SAMPLE_PRODUCTS) {
    const categoryId = categoryMap.get(productData.categoryName);
    if (!categoryId) continue;

    const existingProduct = await prisma.product.findFirst({
      where: { name: { equals: productData.name, mode: "insensitive" } },
    });
    if (!existingProduct) {
      await prisma.product.create({
        data: {
          name: productData.name,
          categoryId,
          sellPrice: productData.sellPrice,
          costPrice: productData.costPrice,
          description: productData.description,
          createdById: ownerUser.id,
        },
      });
      console.log(`Barang contoh "${productData.name}" dibuat (stok awal 0).`);
    }
  }
}

await prisma.$disconnect();
