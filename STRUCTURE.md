# STRUCTURE — KP Optik Raihan

> **Tujuan:** acuan struktur folder, penamaan, dan penempatan file.
> **Status:** DRAFT, menunggu review developer
> **Versi:** 0.1.0
> **Tanggal penyusunan:** 22 Oktober 2026
> **Ruang lingkup:** struktur FE dan BE. Alasan arsitektural ada di `ARCHITECTURE.md`, aturan kode di `CODING_STANDARDS.md`.
> **Referensi:** `ARCHITECTURE.md`, `CODING_STANDARDS.md`, `DECISIONS.md` (DEC-007)

> **Tree di dokumen ini adalah TARGET, bukan perintah membuat semua file.** Folder dan file dibuat hanya saat dibutuhkan task yang sedang dikerjakan. Jangan membuat folder atau file kosong "untuk nanti". Kondisi aktual repository belum bisa diverifikasi saat dokumen ini disusun (workspace kosong).

## 1. Root

```
optik_raihan/
├── CLAUDE.md
├── README.md
├── .gitignore
├── LICENSE
├── docs/          # dokumen ini
├── FE/
└── BE/
```

## 2. Target tree Frontend

```
FE/
├── public/
├── src/
│   ├── assets/                     # gambar, logo, font lokal
│   ├── components/
│   │   ├── ui/                     # hasil shadcn/ui
│   │   └── shared/                 # komponen reusable lintas fitur
│   ├── Container/                  # KHUSUS landing page publik
│   │   ├── components/             # Navbar, Hero, Features, About, CTA, Footer
│   │   └── LandingPage.tsx
│   ├── constants/                  # data statis reusable
│   ├── types/                      # tipe API reusable lintas fitur (satu file per domain)
│   ├── features/
│   │   ├── auth/                   # components/ context/ hooks/ services/ types.ts schemas.ts
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── suppliers/
│   │   ├── purchases/
│   │   ├── sales/
│   │   ├── inventory/
│   │   ├── stock-opname/
│   │   └── reports/
│   ├── hooks/                      # hook global non-fitur
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   │   └── api/axios.ts            # konfigurasi Axios saja
│   ├── lib/                        # konfigurasi library (queryClient, cn)
│   ├── utils/                      # fungsi murni reusable
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── components.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

Isi `features/<nama>/`: `components/`, `hooks/`, `services/`, `types.ts`, `schemas.ts`. Tidak semua fitur butuh semuanya.

`Container/` sengaja dipertahankan (DEC-007). Jangan menghapus atau mengganti tanpa alasan kuat dan persetujuan. Isinya hanya untuk landing page publik.

Modul yang berstatus `NEEDS_CONFIRMATION` (pemesanan lensa, pelanggan) **tidak** punya folder sampai dikonfirmasi.

## 3. Target tree Backend

```
BE/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── config/          # env, konfigurasi aplikasi
│   ├── constants/       # role, status, nilai statis
│   ├── routes/          # index.ts + <domain>.routes.ts
│   ├── middlewares/     # auth, role, validate, error
│   ├── validators/      # <domain>.validator.ts (Zod)
│   ├── controllers/     # <domain>.controller.ts
│   ├── services/        # <domain>.service.ts (atau subfolder <domain>/)
│   ├── lib/             # instance library (prisma.ts)
│   ├── utils/           # fungsi murni: password, jwt, api-response, app-error
│   ├── types/           # tipe bersama BE, augmentasi Express (req.user)
│   ├── generated/prisma/ # hasil `prisma generate`, tidak di-commit
│   ├── app.ts           # setup Express, middleware global, mount routes
│   └── server.ts        # listen saja
├── tests/               # integration test Vitest + Supertest (DEC-009), setup.ts memuat .env.test
├── .env
├── .env.example
├── .env.test            # database test terpisah, tidak di-commit
├── package.json
├── tsconfig.json        # typecheck seluruh BE (noEmit)
├── tsconfig.build.json  # build src/ ke dist/
├── vitest.config.ts
└── prisma7.config.ts    # konfigurasi Prisma 7 (nama dipertahankan, DEC-019 REJECTED)
```

`.env` dan `.env.test` tidak boleh disentuh AI atau dimasukkan ke git.

## 4. Tanggung jawab folder

| Folder | Menjawab pertanyaan |
|---|---|
| `constants/` | Data apa yang tersedia? |
| `types/` | Bentuk datanya seperti apa? |
| `schemas.ts` | Data yang valid seperti apa? |
| `hooks/` | Bagaimana state/query-nya? |
| `services/` | Bagaimana komunikasi API-nya? (FE) / Aturan bisnis apa yang berlaku? (BE) |
| `features/` | Fitur ini melakukan apa? |
| `components/` | Bagaimana tampilannya? |
| `utils/` | Fungsi murni reusable apa yang dibutuhkan? |
| `lib/` | Library apa yang dikonfigurasi? |
| `pages/` | Komponen apa yang disusun di halaman ini? |
| `layouts/` | Kerangka halaman apa (sidebar, header, wrapper login)? |
| `routes/` (FE) | Path mana ke halaman mana, dan siapa yang boleh masuk? |

`pages/` hanya menyusun komponen dan layout. Tidak ada fetch, mutation, atau validasi langsung di page.

## 5. Kapan sebuah file dipecah

Pecah jika **salah satu** berlaku dan pemecahan membuat kode lebih mudah dibaca:

- File memegang lebih dari satu tanggung jawab utama (tabel + form + mutation dalam satu komponen).
- Logic dipakai di dua tempat atau lebih.
- Bagian JSX berulang atau bisa diberi nama yang jelas (misalnya `SaleItemRow`).
- Schema validasi mulai panjang: pindah ke `schemas.ts`.
- Type dipakai lintas fitur: pindah ke `src/types/<domain>.ts`.
- Data statis dipakai lebih dari satu file: pindah ke `src/constants/`.
- `constants` atau `types` membengkak: pecah per domain.
- Service BE memuat beberapa sub-proses berbeda (hitung total, validasi stok, nomor transaksi): ubah menjadi subfolder `services/<domain>/` dengan service utama sebagai orkestrator.

Ukuran file adalah **sinyal untuk memeriksa**, bukan batas kaku. File 300 baris dengan satu tanggung jawab jelas boleh tetap utuh.

## 6. Kapan TIDAK perlu file baru

- Fungsi kecil yang hanya dipakai satu file tetap di file itu.
- Type yang hanya dipakai satu komponen dan sangat spesifik boleh lokal.
- Belum ada kebutuhan nyata (jangan membuat folder kosong).
- Pemisahan tidak membuat kode lebih mudah dibaca.
- Wrapper/abstraksi generik (base controller, generic repository) yang hanya dipakai sekali.
- Fitur kecil tidak perlu semua subfolder. Satu komponen dan satu hook cukup.
- Barrel file (`index.ts` yang mengekspor ulang) tidak dibuat kecuali ada alasan jelas.

## 7. Penamaan

| Jenis | Pola | Contoh |
|---|---|---|
| Komponen React | PascalCase.tsx | `ProductTable.tsx` |
| Hook | `use-<domain>.ts` | `use-products.ts` |
| Service FE dan BE | `<domain>.service.ts` (domain jamak) | `sales.service.ts` |
| Schema FE | `schemas.ts` per fitur | `features/products/schemas.ts` |
| Tipe lokal fitur | `types.ts` per fitur | `features/products/types.ts` |
| Tipe global FE | `<domain>.ts` tunggal | `types/product.ts` |
| Constants | `<domain>.constants.ts` | `status.constants.ts` |
| Route/controller/validator BE | `<domain>.<layer>.ts` (jamak) | `products.routes.ts` |
| Middleware | `<fungsi>.middleware.ts` | `role.middleware.ts` |
| Nilai konstanta | `UPPER_SNAKE_CASE` | `USER_ROLES` |
| Type/interface | PascalCase | `Product` |
| Folder | kebab-case (kecuali `Container/`) | `stock-opname/` |

Hindari nama ambigu: `helper.ts`, `misc.ts`, `common.ts`, `stuff.ts`, `data.ts`, kecuali isinya benar-benar jelas dan reusable.

## 8. Aturan import dan alias

- FE memakai alias `@/` yang menunjuk ke `FE/src` (dikonfigurasi di `vite.config.ts` dan `tsconfig`). Verifikasi konfigurasi aktual sebelum dipakai.
- Gunakan `import type` untuk type.
- Sebelum membuat type, constant, atau util baru, **cek dulu apakah sudah ada**. Jangan duplikasi definisi.
- BE memakai import relatif kecuali alias path sudah terkonfigurasi untuk build dan runtime.
- Arah dependensi: `pages` → `features`/`components` → `hooks` → `services` → `services/api`. Feature tidak mengimpor feature lain secara langsung. Jika dibutuhkan bersama, naikkan ke `components/shared`, `types/`, atau `utils/`.

## 9. Contoh: feature `products`

```
FE/src/features/products/
├── components/
│   ├── ProductTable.tsx      # tampilan tabel
│   ├── ProductForm.tsx       # RHF + Zod, form saja
│   ├── ProductDialog.tsx     # dialog pembungkus form
│   └── ProductActions.tsx    # aksi per baris
├── hooks/use-products.ts     # useQuery/useMutation, query key, invalidasi
├── services/products.service.ts
├── types.ts                  # tipe khusus fitur (misal filter)
└── schemas.ts                # productSchema (Zod)

FE/src/types/product.ts       # tipe API reusable
FE/src/pages/ProductsPage.tsx # hanya menyusun komponen

BE/src/routes/products.routes.ts
BE/src/validators/products.validator.ts
BE/src/controllers/products.controller.ts
BE/src/services/products.service.ts
```

Catatan: field produk belum final (Q-10). Ini contoh struktur, bukan desain data.

## 10. Contoh: transaksi `sales`

```
FE/src/features/sales/
├── components/
│   ├── SaleForm.tsx
│   ├── SaleItemsTable.tsx
│   ├── SaleItemRow.tsx
│   ├── SaleSummary.tsx       # pratinjau total, bukan sumber kebenaran
│   ├── SaleTable.tsx
│   └── SaleDetailDialog.tsx
├── hooks/use-sales.ts
├── services/sales.service.ts
├── types.ts
└── schemas.ts

BE/src/services/sales/        # dipecah setelah service membesar
├── sales.service.ts          # orkestrasi: createSale, getSales
├── sales-stock.service.ts    # validasi dan pengurangan stok
└── sales-number.service.ts   # penomoran transaksi
```

Pembuatan penjualan, item, pengurangan stok, dan mutasi stok terjadi dalam satu transaksi database di service BE (`DATABASE.md`). Struktur `sales/` ini hanya dibuat jika service tunggal sudah terlalu besar. Mulai dari satu file.

## 11. Contoh: authentication

```
FE/src/features/auth/
├── components/LoginForm.tsx
├── context/AuthContext.tsx   # AuthProvider: user, status login, login/logout
├── hooks/use-auth.ts
├── services/auth.service.ts
├── types.ts
└── schemas.ts
FE/src/routes/ProtectedRoute.tsx
FE/src/routes/RoleRoute.tsx
FE/src/constants/auth.constants.ts   # USER_ROLES
FE/src/types/auth.ts

BE/src/routes/auth.routes.ts
BE/src/validators/auth.validator.ts   # "auth" dipakai apa adanya (aturan jamak hanya untuk entitas)
BE/src/controllers/auth.controller.ts
BE/src/services/auth.service.ts
BE/src/middlewares/auth.middleware.ts
BE/src/middlewares/role.middleware.ts
BE/src/utils/password.ts
BE/src/utils/jwt.ts
```

`AuthContext` hanya memegang state auth global. Jika JWT cookie HttpOnly dipakai (DEC-013), `AuthContext` **tidak** menyimpan token. Tidak ada logic produk, penjualan, atau inventaris di sana.

**Kondisi aktual setelah Tahap 2 (24 Okt 2026), selisih terhadap contoh di atas:**

- FE `features/auth/context/auth-context.ts` berisi `createContext`, terpisah dari `AuthContext.tsx` (yang hanya mengekspor `AuthProvider`), agar aturan lint `react-refresh/only-export-components` terpenuhi.
- FE tambahan: `features/auth/components/LogoutButton.tsx`, `routes/router.tsx` (daftar route), `pages/LoginPage.tsx`, `pages/HomePage.tsx` (halaman sementara sampai dashboard Tahap 8), `types/api.ts`, `utils/api-error.ts`.
- `routes/RoleRoute.tsx` **ditunda** sampai ada route yang membutuhkan role tertentu.
- BE tambahan: `middlewares/validate.middleware.ts`, `middlewares/origin.middleware.ts`, `services/login-rate-limit.service.ts` (rate limit butuh hasil login, jadi berada di service, bukan middleware), `types/auth.ts`, `types/express.d.ts`, `prisma/seed.ts`, `tests/helpers.ts`.

## 12. Contoh page yang hanya menyusun komponen

```tsx
// pages/ProductsPage.tsx — contoh bentuk, bukan implementasi
export function ProductsPage() {
  return (
    <>
      <PageHeader title="Produk" />
      <ProductTable />
      <ProductDialog />
    </>
  );
}
```

Fetch, mutation, dan state form hidup di komponen fitur dan hook, bukan di page.

## 13. Perubahan struktur

Struktur ini baseline (DEC-007). Jika suatu kebutuhan tidak tertampung, **jangan langsung mengubah struktur**. Jelaskan: masalahnya, mengapa struktur saat ini tidak cukup, alternatif, dampak, dan rekomendasi. Ubah setelah developer menyetujui, lalu catat di `DECISIONS.md`.
