# Project Context — KP Optik Raihan

> Fakta proyek ini saja. Dokumen ini menggantikan dokumen lama `PROJECT_CONTEXT`, `REQUIREMENTS`, `DECISIONS`, `ARCHITECTURE`, `STRUCTURE`, `DATABASE`, `API_CONTRACT`, `SECURITY`, `DESIGN_SYSTEM`, `CODING_STANDARDS`, dan `IMPLEMENTATION_PLAN` (versi 0.1.0, dihapus dari working tree; isi lengkap: `git show 1b26217:<NAMA>.md`). Aturan kerja AI ada di `AGENTS.md` dan `.agents/skills/core/`, `.agents/skills/workflows/`, `.agents/skills/standards/`. Requirement di `.agents/docs/PRD.md`, rancangan data di `.agents/docs/ERD.md` (bagian 2). Tugas dan status ada di `todo-list.md`.
>
> **Label:** `FAKTA` terverifikasi di repo · `KEPUTUSAN` diputuskan developer (`ACCEPTED`) · `USULAN` belum disetujui (`PROPOSED`) · `MENUNGGU` butuh konfirmasi owner/dosen (`NEEDS_CONFIRMATION`). ID keputusan (`DEC-xxx`), pertanyaan (`Q-xx`), dan acceptance criteria (`AC-xx.x`) dipertahankan karena dirujuk dari kode dan test.

## 1. Project identity

- **Project name:** KP Optik Raihan.
- **Judul KP (DEC-010):** "Rancang Bangun Aplikasi Penjualan Kacamata Berbasis Web pada Toko Kacamata Raihan". Konflik: judul awal memuat "Penjualan, Pembelian, dan Pemesanan"; judul final hanya "Penjualan" sementara scope kerja tetap mencakup pembelian dan inventaris. Keselarasan menunggu dosen (Q-12, PRD P-15).
- **Purpose:** aplikasi web untuk operasional toko (penjualan, pembelian, inventaris) yang akan benar-benar dipakai toko, bukan prototype. Prioritas: akurasi data, keterlacakan transaksi, konsistensi stok. Masalah awal: pencatatan manual, stok fisik tidak sesuai catatan, perubahan stok tidak terlacak.
- **Users / actors:** Owner dan Pegawai (role `owner`, `staff`); jawaban owner tentang hak akses ada di PRD bagian 3, keputusan matriks izin (DEC-018) tetap MENUNGGU. Pelanggan sebagai pengguna sistem: tidak ada bukti. Pengunjung publik hanya untuk landing page (M-13).
- **Developer:** satu mahasiswa KP. Kuat di React/TS/Tailwind; masih belajar Express, Prisma, PostgreSQL, transaksi database (lihat `TECH-STACK-PROFILE.md`). Backend dijaga sederhana dan eksplisit; beri penjelasan alasan pada bagian penting Prisma/PostgreSQL.
- **Project status:** implementation (Tahap 2 selesai ditulis, menunggu persetujuan developer; shell dashboard terimplementasi).
- **Repository root:** `optik_raihan/` dengan `FE/` dan `BE/` dalam satu repo, tanpa workspace root `package.json`.
- **Last context review:** 2 November 2026: fakta diverifikasi ulang terhadap repo (package.json, struktur, schema, migrasi, kode error, route, token, `.env.example`) dan dibandingkan dengan dokumen lama di commit 1b26217. Hasil pemeriksaan di bagian 11.

## 2. Requirements and scope

**Prioritas sumber kebenaran:** hasil bimbingan dosen terbaru → hasil wawancara owner/pegawai → baseline requirement final → dokumen discovery lama → analisis/asumsi. Hasil bimbingan dosen dan baseline requirement final **belum tersedia tertulis**; jangan mengarang isinya, tandai MENUNGGU dan tanyakan. Jawaban owner atas kuesioner (disampaikan developer lewat chat, 1 Nov 2026) tercatat di PRD Lampiran A; tangkapan aslinya tidak diarsipkan di repo.

**Dokumen requirement dan data:**
- `.agents/docs/PRD.md`: sumber requirement (FR-xx, BR-xx, NFR-xx, pertanyaan P-xx). Status DRAFT 0.1.0, menunggu review developer. Bagian ini merangkum status modul dan merujuk ke PRD; isi requirement tidak disalin ke sini.
- `.agents/docs/ERD.md`: rancangan data untuk PRD. Status **USULAN**, bukan schema yang berlaku (schema aktual: bagian 7). Setiap tabel baru tetap butuh persetujuan schema dan migrasi.
- Catatan: `.agents/` saat ini masuk `.gitignore`, sehingga PRD, ERD, dan PADS tidak ter-commit (bagian 10).

**Status requirement:** `CONFIRMED` hanya untuk yang tertulis di judul/tujuan proyek atau dikonfirmasi tertulis oleh developer; `USULAN` = prasyarat teknis atau kebutuhan awal tanpa bukti persetujuan; `MENUNGGU` tidak boleh diimplementasikan sebelum dikonfirmasi; `OUT_OF_SCOPE` sengaja dikeluarkan. `OWNER` dan `DITUNDA` mengikuti arti di PRD bagian 2 (dijawab owner pada kuesioner; sengaja belum dikerjakan). Rincian per requirement mengikuti label FR di PRD bagian 6; requirement berlabel `PERLU KEPUTUSAN` tidak diimplementasikan sebelum P-xx terkait diputuskan.

### Modul

Mengikuti PRD bagian 4.1. Requirement rinci per modul: PRD bagian 6. Pertanyaan yang memblokir: P-xx (PRD bagian 9, `todo-list.md`).

| ID | Modul | Status | Catatan |
|---|---|---|---|
| M-01 | Autentikasi, otorisasi, dan pengelolaan akun pegawai | CONFIRMED (auth); OWNER (akun pegawai) | Auth dikonfirmasi developer 24 Okt 2026 bersama DEC-013 dan sudah ada (Tahap 2). Pengelolaan akun pegawai baru (FR-01.6 sampai FR-01.9). Jawaban owner tentang hak akses: PRD bagian 3; DEC-018 tetap MENUNGGU |
| M-02 | Dashboard owner | USULAN | Shell dashboard ada; isi data belum (FR-02.1) |
| M-03 | Barang: frame, lensa jadi, kacamata jadi, foto | OWNER | Stok per model, SKU otomatis. Lensa jadi: P-02. Penyimpanan foto: P-12 |
| M-04 | Kategori | USULAN | |
| M-05 | Supplier | USULAN | Prasyarat pembelian |
| M-06 | Pembelian dari supplier | CONFIRMED | Dasar: tujuan proyek; dijawab owner (hanya owner, tanpa tempo). Aturan rinci USULAN (FR-06.x). Harga pokok: P-05 |
| M-14 | Retur pembelian ke supplier | OWNER | Baru. Penyelesaian retur: P-10 |
| M-07 | Penjualan, diskon, pembayaran, nota, void | CONFIRMED | Dasar: judul KP; dijawab owner. Rinci: P-01, P-08, P-09, P-14. Perubahan kontrak harga MENUNGGU persetujuan developer (bagian 6) |
| M-08 | Inventaris: mutasi stok dan peringatan stok menipis | CONFIRMED | Dasar: tujuan proyek. Ambang stok menipis: P-04 |
| M-09 | Stock opname harian | OWNER | Harian, oleh owner. Stok awal: P-11 |
| M-10 | Laporan di layar | OWNER | Lima laporan, tanpa ekspor. Definisi laba: P-05 |
| M-11 | Resep pelanggan | OWNER | Sebelumnya "Pemesanan lensa". Pencatatan resep saja; pemesanan lensa khusus tetap MENUNGGU (P-03, DEC-016). Data kesehatan: P-07 |
| M-12 | Data pelanggan (untuk garansi) | OWNER | Garansi: P-06; privasi: P-07. DEC-028 tetap MENUNGGU |
| M-13 | Landing page publik | DITUNDA | PRD bagian 4.2: owner tidak menyebutnya; `FE/src/Container/` belum dibuat |
| M-15 | Audit log | USULAN | Baru. Daftar aksi final dengan owner (FR-15.1) |

Dependensi: Auth → semua; Kategori → Produk; Produk + Supplier → Pembelian → stok masuk → Retur pembelian; Pelanggan → Resep; Audit log sebelum Penjualan (void dan diskon wajib diaudit, ERD bagian 9); Produk + stok (+ pelanggan/resep opsional) → Penjualan → stok keluar; Inventaris → Opname; Pembelian + Penjualan + Inventaris → Laporan dan Dashboard. Stok harus bisa masuk sebelum keluar.

### Acceptance criteria (semua USULAN, diturunkan dari tujuan proyek)

PRD merujuk daftar ini sebagai "tetap seperti dokumen sebelumnya"; jangan dihapus. Q-xx yang disebut di AC berikut sudah dijawab owner kecuali Q-12 dan Q-13; rincian penggantinya ada di FR terkait (PRD bagian 6) dan dampaknya di PRD bagian 10.

- **M-01:** AC-01.1 login/logout, kredensial salah → pesan generik. AC-01.2 endpoint selain login/publik menolak tanpa autentikasi (401). AC-01.3 role tanpa izin ditolak backend (403). AC-01.4 akun nonaktif kehilangan akses pada request berikutnya. AC-01.5 password tak pernah tersimpan/dikembalikan asli.
- **M-03/04/05:** AC-03.1 CRUD/nonaktif dengan validasi backend. AC-03.2 yang sudah punya transaksi tidak dihapus permanen. AC-03.3 pencarian dan pagination server-side. AC-03.4 SKU unik (format: Q-10).
- **M-06:** AC-06.1 pembelian mencatat supplier, tanggal, item (jumlah, harga beli). AC-06.2 simpan = tambah stok + mutasi dalam satu transaksi atomik. AC-06.3 harga beli item adalah snapshot. AC-06.4 pembatalan (bila Q-07 mengizinkan) = mutasi pembalik.
- **M-07:** AC-07.1 FE hanya kirim produk dan jumlah; harga/total dihitung backend. **AC-07.1 digantikan FR-07.3 (PRD bagian 10); penggantian berlaku setelah developer menyetujui perubahan kontrak di bagian 6.** AC-07.2 jumlah > stok ditolak. AC-07.3 simpan = kurangi stok + mutasi atomik. AC-07.4 dua penjualan bersamaan atas stok terakhir: satu berhasil, stok tak negatif. AC-07.5 harga jual item snapshot. AC-07.6 void (bila Q-05 mengizinkan) = mutasi pembalik + jejak audit.
- **M-08:** AC-08.1 tiap perubahan stok punya mutasi (produk, ±jumlah, jenis, dokumen asal, waktu, pelaku). AC-08.2 stok bisa direkonsiliasi dengan total mutasi. AC-08.3 tidak ada endpoint ubah stok langsung. AC-08.4 stok menipis (ambang: Q-14).
- **M-09:** AC-09.1 bandingkan stok sistem vs fisik. AC-09.2 selisih = penyesuaian tercatat dengan alasan. AC-09.3 siapa menyetujui (Q-06).
- **M-10/02:** AC-10.1 angka dihitung backend. AC-10.2 filter periode; jenis/format ekspor (Q-11).
- **M-13:** AC-13.1 publik tanpa login, terpisah dari dashboard. AC-13.2 isi MENUNGGU, tanpa data karangan.

### Non-functional (USULAN kecuali dicatat)

NFR-01 integritas data (atomik, stok ≥ 0, constraint DB sebagai lapis terakhir). NFR-02 keamanan (bagian 7). NFR-03 keterlacakan aksi penting. NFR-04 alur penjualan mudah dipakai (target kuantitatif belum ada). NFR-05 maintainability. NFR-06 backup terjadwal dan restore teruji. NFR-07 performa: pagination server-side; angka target MENUNGGU. NFR-08 responsif dan aksesibel. NFR-09 serah terima: dokumentasi operasional, akun hosting atas nama toko. Catatan: PRD bagian 8 memakai penomoran NFR-01 sampai NFR-08 sendiri yang tidak sama dengan daftar ini (mis. NFR-03 PRD = perangkat); bila PRD disetujui, daftar ini diganti rujukan ke PRD.

### Out of scope (usulan, bukan keputusan owner)

E-commerce/penjualan online, payment gateway, multi-cabang, aplikasi mobile native, akuntansi penuh/pajak/laporan keuangan resmi, rekam medis/refraksi pasien. Daftar yang diperbarui ada di PRD bagian 4.2 (antara lain piutang/hutang, ekspor PDF/Excel, printer thermal); "rekam medis" dan "akuntansi penuh" disesuaikan karena owner meminta resep dan laba rugi (P-15). Upload foto produk: dijawab owner (Q-15), penyimpanan menunggu P-12.

### Pertanyaan terbuka

Daftar Q-01 sampai Q-17 (status setelah jawaban owner) dan P-01 sampai P-16 (pertanyaan turunan PRD bagian 9) ada di `todo-list.md` (Blockers and decisions needed).

### Asumsi (belum dikonfirmasi)

A-01 satu toko satu cabang. A-02 pengguna internal < ±10 orang. A-03 tanpa payment gateway. A-04 satu mata uang (Rupiah), tanpa pajak khusus. A-05 produk dilacak per unit, varian belum diketahui (Q-10). A-06 dipakai terutama dari komputer toko, juga tablet/HP (Q-16). Owner sudah menjawab hal terkait A-02, A-04, A-05, A-06 (PRD Lampiran A no. 2, 7, 9); asumsi ini dipertahankan sampai PRD disetujui.

### Business rules / constraints

Tidak ada microservices atau infrastruktur kompleks tanpa kebutuhan nyata (DEC-025). Harus memenuhi kebutuhan akademik (laporan KP, bimbingan; format laporan tidak tersedia). Konfirmasi yang dibutuhkan dari dosen: keselarasan judul dan scope (Q-12), format laporan, batas kedalaman fitur. Backup, keamanan, dan serah terima termasuk pekerjaan. Tidak membuat data dummy yang tampak seperti data bisnis nyata.

## 3. Actual technology stack

Versi dari `package.json` (rentang semver, FAKTA, diperiksa ulang 2 Nov 2026). Versi terpasang di `node_modules` (FAKTA 2 Nov 2026): FE React 19.3.0, Vite 8.3.5, TypeScript 6.0.3, react-router-dom 7.18.4, TanStack Query 5.104.0, Axios 1.20.0, Zod 4.6.7, Tailwind 4.3.3; BE Express 5.2.1, TypeScript 7.0.2, `prisma` dan `@prisma/client` 7.10.1, Zod 4.6.7, Vitest 5.0.5, jose 6.2.13, argon2 0.45.1.

| Area | Technology/version | Evidence / notes |
|---|---|---|
| Language | TypeScript (FE `~6.0.2`, BE `^7.0.2`), ESM di FE dan BE | `FE/package.json`, `BE/package.json` (`"type": "module"`, DEC-029) |
| Frontend framework | React `^19.2.8`, Vite `^8.3.0`, react-router-dom `^7.18.4` | SPA, tanpa SSR (DEC-001, DEC-027) |
| Server state / HTTP / form | TanStack Query `^5.104.0`, Axios `^1.20.0`, React Hook Form `^7.89.0` + `@hookform/resolvers`, Zod `^4.6.5` | |
| Styling/UI library | Tailwind CSS `^4.3.3` (CSS-first, tanpa `tailwind.config`), shadcn/ui (`FE/components.json`, style `radix-nova`), `radix-ui`, `lucide-react`, `recharts`, `tw-animate-css` | Font Geist (DEC-024) |
| Backend framework/runtime | Node.js, Express `^5.2.1` | Promise ditolak di handler async diteruskan otomatis ke error middleware |
| Database | PostgreSQL (dev dan test lokal, v18 menurut dokumen lama) | DEC-003 |
| ORM/data access | `prisma` (CLI) `^7.10.0`, `@prisma/client` `^7.10.1`, `@prisma/adapter-pg` `^7.10.1`, `pg` `^8.23.1` | Konfigurasi di `BE/prisma7.config.ts` (DEC-019 REJECTED: nama dipertahankan) |
| Authentication | JWT HS256 via `jose` `^6.2.13` di cookie HttpOnly; `argon2` `^0.45.1`; `cookie-parser` | DEC-013, DEC-031, DEC-032 |
| Validation (BE) | Zod `^4.6.7` | DEC-008 |
| Testing/build/deployment | Vitest `^5.0.5` + Supertest `^7.3.1` (BE); `tsx`; `tsc -p tsconfig.build.json` → `dist/` | FE belum punya test; deployment belum ada |
| Other | FE: `recharts`, `date-fns`, `react-day-picker`, `cmdk`, `@fontsource-variable/montserrat`; BE: `dotenv` `^18.0.9` (`import "dotenv/config"` di `server.ts` dan `prisma7.config.ts`) | Montserrat sudah tidak diimpor di `FE/src/index.css` namun masih ada di dependency (lihat `todo-list.md`) |

Tidak terpasang (jangan diasumsikan ada): Helmet, `@tanstack/react-table` (DEC-020 USULAN), library logging, FE test runner.

## 4. Repository and architecture

- **Entry points:** BE `BE/src/server.ts` (listen) dan `BE/src/app.ts` (Express); FE `FE/src/main.tsx`, `App.tsx`, `routes/router.tsx` (route lazy).
- **Architecture (DEC-006):** layered monolith, satu SPA, satu backend Express, satu PostgreSQL. Tanpa microservices (DEC-025), tanpa shared package/OpenAPI codegen FE-BE (DEC-026), tanpa Next.js/NestJS (DEC-027).

```
BE: Route → Middleware → Controller → Service → Prisma → PostgreSQL
FE: Page → Feature Component → Custom Hook (TanStack Query) → Service → Axios → REST API
```

- **Backend layers:** Route (daftar endpoint+middleware, tanpa logic); Middleware (auth, role, validasi, origin, error); Validator (Zod, tanpa akses DB); Controller (ambil `req`, panggil service, kirim `res`; tanpa Prisma/aturan bisnis); Service (aturan bisnis, transaksi, Prisma; tanpa `req`/`res`); Prisma lewat satu instance `BE/src/lib/prisma.ts`, hanya dipakai service. Error lewat `AppError` (`BE/src/utils/app-error.ts`) dan `error.middleware.ts`.
- **Frontend:** Page hanya menyusun komponen; feature component = UI + hook; hook membungkus `useQuery`/`useMutation`, query key, invalidasi; service satu fungsi per endpoint tanpa React; `services/api/axios.ts` hanya konfigurasi Axios. Props untuk data antar komponen; Context hanya untuk auth (`AuthContext` berisi user dan status login, **tanpa token**); server state hanya TanStack Query (DEC-005).
- **Batas FE-BE:** FE mengirim niat (produk, jumlah); BE menentukan fakta (harga, total, stok, nomor transaksi, waktu). Untuk harga satuan penjualan, perubahan diusulkan PRD dan MENUNGGU persetujuan developer (bagian 6). Validasi FE hanya UX. Pembatasan role di FE hanya tampilan. Tipe Prisma tidak pernah dipakai FE.
- **Config:** semua dari environment, divalidasi Zod saat start di `BE/src/config/env.ts` (gagal start bila tidak valid). `.env` dan `.env.test` tidak di-commit dan tidak boleh disentuh AI. FE hanya variabel publik `VITE_*`.
- **Dev/production:** dev = `vite` (5173) dengan proxy `/api` → `http://localhost:4000` (satu origin); production (DEC-014 USULAN) = hasil `vite build` dilayani Express, satu origin, CORS tidak diperlukan.
- **Penanganan error:** validasi 400 + `details` per field; belum login 401; role 403; data tidak ada 404; konflik data 409; error tak terduga dicatat lengkap, ke klien pesan generik tanpa stack trace. FE: 401 ditangani global, error domain per mutation.

### Struktur folder (baseline, DEC-007; ubah hanya setelah persetujuan developer)

Pada perubahan struktur: jelaskan masalah, mengapa struktur saat ini tidak cukup, alternatif, dampak, rekomendasi; setelah disetujui catat di bagian 9.

```
FE/src/  components/{ui (hasil shadcn, jangan diubah sembarangan), shared} · Container/ (khusus landing page publik, belum dibuat)
         constants/ · types/ (tipe API per domain) · features/<nama>/{components,hooks,services,types.ts,schemas.ts}
         hooks/ · layouts/ · pages/ · routes/ · services/api/axios.ts · lib/ (queryClient, cn) · utils/
BE/      prisma/{schema.prisma, migrations/, seed.ts} · prisma7.config.ts
         src/  config constants routes middlewares validators controllers services lib utils types app.ts server.ts
               generated/prisma/ (hasil `prisma generate`, di-ignore, tidak di-commit)
         tests/ (Vitest + Supertest; setup.ts memuat .env.test)
         tsconfig.json (typecheck seluruh BE, noEmit) · tsconfig.build.json (build src/ → dist/) · vitest.config.ts
```

Aktual (FAKTA): fitur FE yang ada hanya `features/auth`; `FE/src/Container/` dan folder fitur lain belum ada dan tidak dibuat sebelum dibutuhkan. Modul MENUNGGU (pemesanan lensa, pelanggan) tidak punya folder.

**Penamaan:** komponen `PascalCase.tsx`; hook `use-<domain>.ts`; service `<domain>.service.ts`; route/controller/validator BE `<domain>.<layer>.ts` (entitas jamak, mis. `products.routes.ts`); middleware `<fungsi>.middleware.ts`; konstanta `UPPER_SNAKE_CASE` pada objek `as const`; type/interface `PascalCase` tanpa awalan `I`; folder `kebab-case` (kecuali `Container/`); fungsi berawalan kata kerja; boolean berawalan `is`/`has`/`can`; satu istilah per konsep domain. Hindari `helper.ts`, `misc.ts`, `common.ts`, `data.ts`.

**Import:** alias `@/` → `FE/src` (terkonfigurasi di `vite.config.ts`); `import type` untuk type; BE memakai import relatif dengan ekstensi `.js` (nodenext). Arah dependensi FE: `pages` → `features`/`components` → `hooks` → `services` → `services/api`; feature tidak mengimpor feature lain (naikkan ke `components/shared`, `types/`, atau `utils/`). Tidak ada barrel file tanpa alasan.

**Memecah file:** berdasarkan tanggung jawab dan kompleksitas, bukan angka baris (lihat `.agents/skills/core/MODULARIZATION.md`). Service BE yang membesar boleh menjadi `services/<domain>/` dengan service utama sebagai orkestrator, tetapi mulai dari satu file.

**Penyimpangan aktual dari pola dasar:** `features/auth/context/auth-context.ts` (createContext) terpisah dari `AuthContext.tsx` (AuthProvider) demi aturan lint `react-refresh/only-export-components`; rate limit login ada di `services/login-rate-limit.service.ts` (butuh hasil login); `RoleRoute.tsx` ditunda sampai ada route berbasis role; `validateBody` baru memvalidasi body (query/params ditambah saat dibutuhkan).

### Frontend design (DEC-022, 023, 024, 033)

- **Arah:** "Optical Luxury — Vintage Modern": premium, hangat, butik kacamata modern; Light dan Dark; Clean Minimalist, Bento Grid hanya untuk ringkasan (KPI, grafik, produk terlaris, peringatan stok). Referensi visual asli tidak tersedia; hanya deskripsi tertulis.
- **Token:** sumber kebenaran adalah `FE/src/index.css` (`:root` Light, `.dark` Dark, dipetakan lewat `@theme inline`). Jangan menulis nilai warna/spacing/radius berulang di komponen. Palet: Warm Ivory/Paper (Light), Espresso Dark (Dark), primary Olive, aksen Burnt Orange/Terracotta, surface lembut Sage.
- **Aturan kontras yang diputuskan (DEC-023):** Burnt Orange (`--brand-accent`) hanya elemen non-teks; teks aksen Olive di Light memakai token terpisah `--primary-text` (`#566239`); Olive di atas Sage tidak untuk teks; batas input memakai `--input` (≥ 3:1), terpisah dari `--border` dekoratif; warna semantik success/warning/danger/info selalu disertai teks atau ikon. Rasio kontras dihitung dengan rumus WCAG 2.x pada 1 Nov 2026 dan dilaporkan lulus untuk pasangan yang dipakai; tabel nilai token Light/Dark dan rasio lengkap: `git show 1b26217:DESIGN_SYSTEM.md` bagian 2.5. Pemindaian Chrome headless (login, dashboard, ErrorState, dua mode) dilaporkan tanpa temuan di bawah ambang; tidak diulang saat rekonsiliasi.
- **Font (DEC-024):** Geist (`@fontsource-variable/geist`); tidak menambah font. Angka tabular lewat `tabular-nums` (fitur `tnum` terverifikasi di file font). Serif hanya untuk branding dekoratif, bukan tabel/form/angka transaksi. Skala yang sudah dipakai: page title `text-2xl` semibold, judul state/kartu `text-base` semibold, body `text-sm`, caption `text-xs`; section title dan angka KPI ditetapkan saat dipakai.
- **Layout (USULAN dari dokumen lama):** spacing kelipatan 4 px; radius kartu/panel ±10-14 px, tombol/input ±8-10 px (`--radius` 0.625rem); border halus dan shadow lembut.
- **Isi dashboard yang diprioritaskan (USULAN, bila data dan requirement mendukung):** owner: ringkasan penjualan, jumlah transaksi, produk terjual, stok menipis, grafik penjualan, produk terlaris, transaksi terbaru; pegawai: akses cepat pencatatan penjualan, pencarian produk dan cek stok.
- **Shell dashboard (DEC-033):** sidebar memakai `components/ui/sidebar.tsx` (`collapsible="icon"`, lebar 240/72 px via CSS variable di `layouts/DashboardLayout.tsx`, Sheet di bawah 768 px, state UI di cookie `sidebar_state`, pintasan bawaan Ctrl+B); menu aktif ditandai latar, huruf tebal, garis `--brand-accent`, dan `aria-current="page"`; header berisi tombol menu, nama+role dari `GET /api/auth/me`, toggle tema, Keluar; tema lewat `hooks/use-theme.ts` tanpa Context (class `dark` di `<html>`, pilihan di `localStorage` dengan try/catch, `public/theme-init.js` mencegah kilatan).
- **Komponen reusable:** buat saat dipakai dua kali atau lebih. Sudah ada di `components/shared`: `AppSidebar`, `AppHeader`, `PageHeader`, `EmptyState`, `ErrorState`, `LoadingState`. Tabel kompleks: `@tanstack/react-table` USULAN (DEC-020), butuh persetujuan dependency.
- **Aturan UI:** state loading/empty/error/success eksplisit (success hanya setelah respons backend); tabel: teks kiri, angka/harga kanan; AlertDialog hanya untuk aksi destruktif; toast bukan satu-satunya tempat error penting; jangan memakai komponen `ui/` apa adanya tanpa cek terhadap token; tidak ada gradien/glassmorphism/neon/shadow berlebihan sebagai dekorasi default; dashboard tidak boleh menyerupai landing page pemasaran; estetika vintage tidak boleh mengorbankan keterbacaan tabel dan form. Rupiah satu format (`id-ID`, mis. `Rp1.250.000`), tanggal ringkas mis. `22 Okt 2026`, lewat satu fungsi di `FE/src/utils/` (`format-currency.ts`, `format-date.ts`), nilai uang dari API string dan tidak dihitung ulang di FE. Perbedaan dashboard owner vs pegawai belum final (Q-03); jangan membuat perbedaan baru tanpa konfirmasi.

## 5. Features and implementation status

| Feature | Expected behavior | Status | Relevant modules | Verification |
|---|---|---|---|---|
| Fondasi (Tahap 1) | BE/FE berjalan, config tervalidasi, error terpusat, koneksi DB, kerangka test | implemented | `BE/src/{app,server}.ts`, `config/`, `lib/prisma.ts`, `middlewares/error.middleware.ts`, `FE/src/services/api/axios.ts` | Dilaporkan lulus pada audit 24 Okt/1 Nov 2026; tidak dijalankan ulang |
| Auth BE (Tahap 2) | login/logout/me, JWT cookie HttpOnly, deny-by-default, rate limit login, cek Origin | implemented | `routes|validators|controllers|services/auth.*`, `middlewares/{auth,role,origin,validate}.middleware.ts`, `utils/{jwt,password}.ts`, `prisma/seed.ts` | `npm test` 33/33 lulus dua kali terhadap PostgreSQL nyata dilaporkan 1 Nov 2026 (dokumen lama); tidak dijalankan ulang |
| Auth FE | form login, `AuthProvider`, `ProtectedRoute`, logout | implemented | `FE/src/features/auth/*`, `routes/ProtectedRoute.tsx`, `pages/LoginPage.tsx` | Alur login/me/logout lewat proxy Vite diverifikasi dengan HTTP (dokumen lama). Browser: dilaporkan lulus lewat Chrome headless otomatis 1 Nov 2026 (skrip CDP di luar repo, build production + BE pada DB test): `document.cookie` tanpa `access_token`, cookie `httpOnly`, storage tanpa token, redirect ke `/login`, logout, Back setelah logout, tanpa loop. **Belum diverifikasi:** pemeriksaan manual developer, cookie `Secure` di HTTPS, seed owner |
| Shell dashboard | layout, sidebar, header, token warna, tema Light/Dark, state loading/error | implemented | `layouts/DashboardLayout.tsx`, `components/shared/*`, `hooks/use-theme.ts`, `index.css` | Chrome headless 1 Nov 2026 dilaporkan 50/50: kontras dua mode, keyboard dan collapse sidebar, 1280/768/375 px tanpa overflow, tema tanpa kilatan, error logout, ErrorState, skeleton tanpa geser layout. Tidak diulang; FE belum punya test otomatis di repo |
| Dashboard (isi data) | KPI, grafik, stok menipis dari backend | not started | `pages/DashboardPage.tsx` (kerangka) | — |
| Pengelolaan akun pegawai | owner membuat, menonaktifkan, mereset akun pegawai | not started | — | FR-01.6 sampai FR-01.9 |
| Kategori, Produk | CRUD end-to-end sebagai pola acuan | not started | — | Blokir: P-02 (lensa jadi), P-11, persetujuan schema; foto: P-12 |
| Supplier | CRUD mengikuti pola produk | not started | — | |
| Inventaris + Pembelian | ledger mutasi, stok masuk atomik | not started | — | Blokir: P-05 |
| Retur pembelian | stok keluar ke supplier atomik | not started | — | Blokir: P-10 |
| Audit log | tabel tambah-saja, dipakai sebelum penjualan | not started | — | Daftar aksi final dengan owner (FR-15.1) |
| Pelanggan dan resep | pelanggan untuk garansi, riwayat resep | not started | — | Blokir: P-07 |
| Penjualan | stok keluar atomik, snapshot harga | not started | — | **Tidak boleh dikerjakan** sebelum P-01, P-08, P-09, P-14 diputuskan dan kontrak harga disetujui (bagian 6) |
| Stock opname | selisih → mutasi penyesuaian | not started | — | Blokir: P-11 (stok awal) |
| Laporan | agregat dari backend | not started | — | Blokir: P-04, P-05 |
| Hardening | Helmet, `trust proxy`, rate limit umum, audit log, backup | not started | — | |
| Landing page publik | `FE/src/Container/` | not started | — | DITUNDA (M-13) |
| Deployment + serah terima | staging/production, backup, uji restore, UAT | not started | — | Blokir: P-16 (Q-13), DEC-014, DEC-015 |

Urutan tahap, exit criteria, dan Definition of Done: `todo-list.md`.

## 6. API and integration contracts

| Feature/use case | Method + endpoint | Auth required | Request/response contract | FE status | BE status | Integration verification |
|---|---|---|---|---|---|---|
| Health | `GET /api/health` | Tidak | `200 { data: { status: "ok", database: "ok" } }`; DB tak terjangkau → `500 INTERNAL_ERROR` | n/a | implemented | test `BE/tests/health.test.ts` (dilaporkan lulus) |
| Login | `POST /api/auth/login` | Tidak | body `{ username, password }` → `200 { data: { id, username, name, role } }` + cookie `access_token`; gagal `401 UNAUTHENTICATED` "Username atau password salah."; terkunci `429 TOO_MANY_REQUESTS` | implemented | implemented | HTTP via proxy Vite diverifikasi; browser otomatis dilaporkan (bagian 5); manual belum |
| Logout | `POST /api/auth/logout` | Tidak wajib | `204` + hapus cookie | implemented | implemented | idem |
| Sesi saat ini | `GET /api/auth/me` | Ya | `200 { data: user }` atau `401` | implemented | implemented | idem |
| Semua endpoint domain lain | — | — | Nama endpoint modul MENUNGGU tidak ditetapkan | — | — | not designed |

**Konvensi:**
- Prefix `/api` tanpa segmen versi (FE dan BE di-deploy bersamaan; tambah `/api/v1` lewat keputusan baru bila ada klien lain). Resource kata benda jamak kebab-case: `GET /api/products`, `GET /api/products/:id`, `POST`, `PATCH /:id`, `DELETE /:id` (data transaksi tidak pernah dihapus permanen); aksi non-CRUD memakai kata kerja: `POST /api/sales/:id/void`.
- **Sukses:** `{ "data": ..., "meta": { ... } }` (`meta` opsional); tanpa isi → `204`. **Error:** `{ "error": { "code", "message", "details" } }`; `code` string stabil untuk FE, `message` untuk pengguna, `details` opsional per field (DEC-021, `BE/src/utils/api-response.ts`, `middlewares/error.middleware.ts`).
- **Kode error aktif** (`BE/src/constants/error.constants.ts`): `VALIDATION_ERROR` 400 (JSON rusak/Zod gagal) · `UNAUTHENTICATED` 401 · `FORBIDDEN` 403 (role atau Origin/Referer salah) · `NOT_FOUND` 404 · `PAYLOAD_TOO_LARGE` 413 (> 100 KB) · `UNSUPPORTED_MEDIA_TYPE` 415 (ubah data bukan JSON) · `TOO_MANY_REQUESTS` 429 · `INTERNAL_ERROR` 500. Rencana (belum ada): `CONFLICT` dan `INSUFFICIENT_STOCK` (409). Status 422 tidak dipakai: salah bentuk/nilai = 400, bertentangan dengan keadaan data = 409. Path `/api` tanpa sesi lebih dulu kena 401.
- **Daftar:** pagination server-side `?page=1&pageSize=20&sort=createdAt:desc&search=...` + filter per resource; response `meta: { page, pageSize, totalItems, totalPages }`. Field sort/filter dibatasi daftar putih dan divalidasi. Nilai default dan maksimum `pageSize` belum ditetapkan. Pencarian produk kasir memakai endpoint dengan batas hasil.
- **Tiga jenis tipe:** tipe database (Prisma, tidak pernah ke FE), tipe API/DTO (BE memetakan di service; FE di `src/types/<domain>.ts`), tipe form (`schemas.ts` via `z.infer`). Jangan memakai satu tipe untuk tiga tujuan. Bila DTO berubah, ubah BE, tipe FE, dan dokumen ini dalam satu perubahan.
- **Serialisasi:** uang = string desimal (`"1250000.00"`, DEC-011 USULAN); tanggal = ISO 8601 UTC; tanggal murni `YYYY-MM-DD`; ID = number (DEC-030); enum = string yang sama dengan constants FE/BE. Field tak dikenal dibuang oleh `z.object` sehingga `role`/`userId` di body tak pernah sampai ke service.
- **FE tidak menghitung nilai backend:** request penjualan hanya memuat identitas produk dan jumlah (ditambah data terkonfirmasi: pelanggan, metode bayar, diskon: Q-02, Q-04, Q-08, Q-17). Total di layar adalah pratinjau; nilai resmi dari BE. Contoh ilustratif (bukan kontrak final): `POST /api/sales { items: [{ productId, quantity }] }` → `201 { data: { id, total, items } }` atau `409 INSUFFICIENT_STOCK`.
- **Perubahan yang diusulkan, MENUNGGU persetujuan developer:** PRD FR-07.2 sampai FR-07.4 meminta harga satuan tiap baris boleh diketik di kasir. Akibatnya request penjualan akan memuat harga satuan; BE memvalidasi harga itu, menghitung sendiri jumlah baris dan total, dan menyimpan snapshot (PRD bagian 10, AC-07.1 digantikan FR-07.3). Batas harga oleh pegawai menunggu P-01. Sampai disetujui, prinsip di atas tetap kontrak yang berlaku; jangan mengimplementasikan versi baru.
- **Axios:** satu instance `FE/src/services/api/axios.ts` (`baseURL: "/api"`, JSON, `withCredentials: true`), tanpa interceptor `Authorization: Bearer`, tanpa file `api.ts` raksasa. **401:** interceptor membuang cache query selain sesi dan mengosongkan state auth, lalu `ProtectedRoute` mengarahkan ke `/login` dengan tujuan semula; `/auth/login` dan `/auth/me` dikecualikan dan ditangani pemanggilnya (mencegah loop). **`GET /api/auth/me` gagal selain 401** (server mati/error): status auth `error`, `ProtectedRoute` menampilkan `ErrorState` dengan tombol "Coba lagi", bukan mengarahkan ke login. **403:** pesan "tidak berhak" pada konteksnya, sesi tetap.
- **API base URL:** `/api` relatif (satu origin dev lewat proxy Vite, production lewat Express). **CORS:** tidak diaktifkan; bila origin dipisah kelak butuh keputusan baru (daftar putih origin, `SameSite`, CSRF).
- **Perubahan kontrak:** breaking (hapus/ganti nama/ubah tipe field) dikerjakan terkoordinasi (BE + FE + dokumen + test); menambah field opsional bukan breaking. Riwayat 24 Okt 2026: health, format error, auth, kode 401/403/415/429, deny-by-default semua path `/api` selain `/health` dan `/auth/*`, Origin/Referer wajib = `APP_ORIGIN` untuk POST/PUT/PATCH/DELETE.
- **External services:** tidak ada.

## 7. Data and security

### Data

- **Sensitive data handled:** kredensial pengguna (hash argon2id), data transaksi toko. Data pelanggan dan resep (data kesehatan) diminta owner (PRD M-11, M-12, BR-11); tidak ada tabel sampai ERD dan migrasi disetujui; kebijakan privasi menunggu P-07.
- **Schema aktual (FAKTA):** hanya `User` (tabel `users`, enum `user_role`: `owner`, `staff`; kolom `id`, `username` unik `VARCHAR(50)`, `name`, `password_hash`, `role`, `is_active`, `created_at`, `updated_at`). Migrasi: `20261024150000_create_users`, dengan CHECK manual `users_username_lowercase` (`username = lower(username)`). Komentar SQL di migrasi itu masih menyebut `DATABASE.md bagian 4` (kini: "Relasi dan constraint" di bagian ini); file sengaja tidak diedit karena migrasi yang sudah diterapkan tidak diubah. Dilaporkan diterapkan dengan `prisma migrate deploy` ke DB dev `optik_raihan` dan DB test `optik_raihan_test` (1 Nov 2026), tidak diperiksa ulang.
- **Konvensi schema:** model `PascalCase` tunggal dengan `@@map` ke tabel snake_case jamak; field camelCase dengan `@map` snake_case; semua tabel punya `createdAt`/`updatedAt` (`@db.Timestamptz(3)`), tabel transaksi/master penting mencatat pelaku; PK `Int @id @default(autoincrement())` (DEC-030). Satu perubahan logis per migrasi dengan nama deskriptif; migrasi yang sudah dipakai tidak diedit; CHECK dan constraint yang tak bisa ditulis di `schema.prisma` ditambah manual di SQL migrasi dan dicatat di sini; production memakai `prisma migrate deploy`. Tidak ada perubahan schema untuk requirement MENUNGGU. Satu `PrismaClient` dengan `PrismaPg` di `BE/src/lib/prisma.ts`. `$queryRaw` hanya bentuk terparameter, dengan alasan di kode.
- **Model konseptual kandidat (belum final, field menunggu requirement CONFIRMED):** User, Category, Product (stok saat ini), Supplier, Purchase/PurchaseItem, Sale/SaleItem, StockMovement (ledger), StockOpname/StockOpnameItem, AuditLog. Rancangan lengkap berstatus USULAN di `.agents/docs/ERD.md` menambah Customer, Prescription, PurchaseReturn/PurchaseReturnItem, dan DocumentCounter, beserta usulan urutan migrasi (ERD bagian 9). Tidak ada entitas pemesanan lensa (P-03).
- **Relasi dan constraint:** semua relasi FK sungguhan; hapus master yang sudah dipakai transaksi ditolak (`ON DELETE RESTRICT`), gunakan nonaktif/arsip; tabel transaksi tidak dihapus permanen; unique pada identitas bisnis (SKU, nomor transaksi, username; format menunggu Q-09/Q-10); CHECK stok ≥ 0, jumlah item > 0, uang ≥ 0 sebagai lapis terakhir; kolom `NOT NULL` kecuali ada alasan. Indeks dibuat berdasarkan query nyata, bukan menebak.
- **Uang:** `Decimal` (`NUMERIC`), bukan Float atau Int 32-bit (total agregat bisa > ±2,1 miliar); presisi eksplisit `@db.Decimal(p, s)` (menunggu Q-17); total dihitung di backend dengan Decimal, bukan `number` JS (DEC-011 USULAN).
- **Waktu:** simpan UTC (`timestamptz`); tampil dalam zona waktu toko (WIB kandidat, perlu konfirmasi); batas "hari" laporan mengikuti zona waktu toko dan dikonversi di backend.
- **Stok (DEC-012 USULAN):** stok saat ini + ledger `StockMovement` wajib untuk setiap perubahan stok (produk, ±jumlah, jenis, dokumen asal, waktu, pelaku). Invarian: stok saat ini = total ledger, harus bisa dicek dan diuji. Tidak ada kode atau endpoint yang mengubah stok tanpa mutasi. Item transaksi menyimpan harga satuan saat transaksi (snapshot), total transaksi disimpan agar laporan lama stabil. Jenis mutasi: masuk (pembelian), keluar (penjualan), penyesuaian (opname), pembalikan (pembatalan); daftar final menunggu Q-05, Q-06, Q-07.
- **Transaksi atomik:** satu operasi bisnis = satu transaksi Prisma di service. Pengurangan stok dengan update bersyarat atomik (`UPDATE ... SET stok = stok - :qty WHERE id = :id AND stok >= :qty`; nol baris terubah → batal dengan "stok tidak cukup"); jangan baca-hitung-tulis. Proses banyak produk dalam urutan tetap (id) untuk mengurangi deadlock. Isolation default Read Committed cukup; naikkan hanya dengan alasan terukur. Jaga transaksi pendek; tanpa layanan eksternal di dalamnya; perhatikan batas waktu transaksi interaktif Prisma di versi terpasang. Cegah kirim ganda (tombol nonaktif; kunci idempotensi bila perlu). Pencegahan stok negatif tiga lapis: validasi service → update bersyarat → CHECK database.
- **Opname:** selisih (fisik − sistem) menjadi mutasi penyesuaian dengan alasan, tidak menimpa stok; dokumen menyimpan stok sistem saat penghitungan dan stok fisik.
- **Pembatalan dan audit:** transaksi tidak di-hard-delete; pembatalan = ubah status + mutasi pembalik (mutasi asli tetap). Audit log tambah-saja untuk login, perubahan harga, pembatalan, penyesuaian stok, perubahan pengguna/role (daftar final dengan owner).
- **Seed:** `prisma/seed.ts` hanya owner awal dari environment (`SEED_OWNER_*`), tanpa kredensial di kode; hapus dari `.env` setelah seed dan ganti password sebelum production; data contoh harus jelas palsu dan tidak masuk production.
- **Backup (DEC-015 USULAN):** backup penyedia + `pg_dump` berkala ke penyimpanan terpisah + uji restore minimal sekali sebelum serah terima, prosedur dicatat. Retensi/PITR penyedia belum diverifikasi.
- **Test integritas wajib (Tahap 5 dan seterusnya, DB test terpisah):** konkurensi stok terakhir; rollback saat gagal di tengah; rekonsiliasi stok vs ledger; constraint (CHECK/unique/FK) menolak insert langsung; snapshot harga tidak berubah; pembatalan = mutasi pembalik.

### Security (kontrol yang diputuskan atau diterapkan)

- **Authorization:** deny-by-default; semua router setelah `requireAuth` di `BE/src/routes/index.ts` wajib login; route publik ditulis eksplisit (`/health`, `/auth`). Status aktif dan role dibaca dari database pada setiap request. Identitas pelaku selalu dari sesi, bukan body. Route baru tanpa penentuan role harus gagal review. Matriks izin MENUNGGU (Q-03, DEC-018); sementara dua role (`owner`, `staff`) dan izin sensitif (harga beli, void, opname, kelola user) dibatasi seminimal mungkin.
- **Password (DEC-031):** argon2id (default m=64 MiB, t=3, p=4, belum di-benchmark di server production), minimal 12 karakter akun baru, input login ≤ 128 karakter; login dengan username tak ada tetap memverifikasi hash palsu agar waktu respons tidak membedakan. Hash tak pernah masuk DTO atau log.
- **Sesi (DEC-013):** JWT HS256 (`jose`) di cookie HttpOnly `access_token`, Secure di production, SameSite=Lax, Path=/, 8 jam, tanpa refresh token. Jangan simpan token di `localStorage`/`sessionStorage`/`AuthContext`, jangan buat interceptor Bearer, jangan klaim HttpOnly menghilangkan risiko XSS. `JWT_SECRET` dari environment (≥ 32 karakter acak). **Keterbatasan terbukti (audit 1 Nov 2026):** logout hanya menghapus cookie di browser; salinan token sebelum logout tetap diterima `GET /api/auth/me` sampai kedaluwarsa (maks 8 jam). Menonaktifkan user langsung memutus token. Perbaikan yang diusulkan (butuh perubahan schema, belum disetujui): kolom versi sesi pada `users` dinaikkan saat logout dan dicek di `requireAuth`.
- **CSRF (DEC-013):** SameSite=Lax + `requireSameOriginJson` (`BE/src/middlewares/origin.middleware.ts`): POST/PUT/PATCH/DELETE ke `/api` wajib `Origin`/`Referer` = `APP_ORIGIN` dan `Content-Type: application/json` bila ber-body; tidak ada perubahan data lewat GET; tanpa library token CSRF (evaluasi ulang bila origin dipisah).
- **Rate limit login (DEC-032):** in-memory (`BE/src/services/login-rate-limit.service.ts`), kunci IP + username huruf kecil; 5 kegagalan bebas, ke-6 kunci 30 dtk, lalu berlipat dua sampai maks 15 menit; selama terkunci `429` termasuk password benar; sukses mengosongkan counter; counter dilupakan setelah 15 menit; sapuan saat 1000 kunci. Hilang saat restart dan tak dibagi antar-instance (cukup untuk satu instance).
- **Validasi:** semua `body`/`query`/`params` divalidasi Zod di BE; daftar putih field sort/filter; batas body 100 KB; input tak dipakai untuk membentuk path file, nama kolom, atau query mentah.
- **Lainnya:** `x-powered-by` dinonaktifkan; React meng-escape output, jangan `dangerouslySetInnerHTML` dengan data pengguna, validasi skema URL dari data pengguna; tidak mencatat password/hash/token/cookie/isi body login; `.env` di luar git; akun hosting atas nama toko dengan 2FA; `npm audit` berkala dan lockfile di-commit. Upload file belum disetujui (Q-15); bila disetujui: daftar putih tipe berdasarkan isi, batas ukuran, nama acak, penyimpanan di luar direktori eksekusi.
- **Risiko terbuka (Tahap 9):** Helmet/CSP/HSTS belum dipasang; `trust proxy` belum diatur (di balik proxy hosting `req.ip` bisa IP proxy sehingga kunci rate limit praktis per username dan penyerang dapat mengunci akun orang lain sementara, maks 15 menit per siklus); belum ada batas umum per IP untuk banyak username dan belum ada rate limit untuk API lain; audit log belum ada.
- **Test akses tidak sah (wajib):** route non-publik tanpa kredensial 401; role tanpa izin 403; cookie rusak/kedaluwarsa/rahasia lain 401; user nonaktif ditolak; Origin asing ditolak; Content-Type bukan JSON ditolak; field `role`/`userId` palsu diabaikan; injeksi pada search/sort tak menghasilkan error SQL; rate limit login tercapai ditolak. Ada di `BE/tests/{access,auth,errors,env,health}.test.ts`.
- **Migration strategy / destructive constraints:** lihat konvensi schema di atas. Dilarang `db push`, reset, atau migrasi tanpa persetujuan eksplisit developer.

## 8. Commands and verification

Dari `package.json` (FAKTA). Hanya perintah ini yang dikonfirmasi; tidak ada skrip lint/test untuk FE kecuali `lint`.

| Purpose | Actual command | Notes |
|---|---|---|
| Install | `npm install` di `FE/` dan `BE/` (lockfile `package-lock.json` per folder) | Tidak ada workspace root |
| Development | BE: `npm run dev` (`tsx watch src/server.ts`, port 4000); FE: `npm run dev` (`vite`, 5173, proxy `/api`) | BE butuh `BE/.env` (lihat `BE/.env.example`) |
| Lint | FE: `npm run lint` | BE tidak punya skrip lint |
| Typecheck | BE: `npm run typecheck`; FE: `npm run build` menjalankan `tsc -b` | FE tidak punya skrip typecheck terpisah |
| Tests | BE: `npm test` (`vitest run`) | Wajib database test terpisah (`BE/.env.test`, nama database berakhiran `_test`, dicek di `BE/tests/setup.ts`); file test berjalan berurutan; FE belum punya test |
| Build | BE: `npm run build` (`prisma generate && tsc -p tsconfig.build.json`) lalu `npm start`; FE: `npm run build` | `prisma generate` butuh `DATABASE_URL` |
| Seed | `npx prisma db seed` di `BE/` | Butuh `SEED_OWNER_*`; jalankan hanya dengan persetujuan |

Variabel environment BE (nama saja): `NODE_ENV`, `PORT`, `DATABASE_URL`, `JWT_SECRET`, `APP_ORIGIN`, `SEED_OWNER_USERNAME`, `SEED_OWNER_NAME`, `SEED_OWNER_PASSWORD`.

**Standar verifikasi proyek ini:** alur kritis (penjualan, pembelian, stok, opname, auth, otorisasi) wajib punya integration test sebelum tahap dinyatakan selesai, dijalankan terhadap database test terpisah, tak pernah terhadap data production. Laporkan perintah dan output asli; jangan menyatakan test lulus bila tidak dijalankan (`.agents/skills/standards/QUALITY-GATES.md`). Jika test integritas gagal, perbaiki kode, bukan test (ubah test hanya bila memang salah, dengan alasan tertulis).

## 9. Confirmed decisions

Status: `ACCEPTED` kecuali tertulis lain. Mengubah keputusan `ACCEPTED` butuh persetujuan developer: tambah entri baru dan tandai yang lama `SUPERSEDED`. Tanggal hanya bila diketahui; tidak ada tanggal yang ditebak.

| ID | Keputusan | Status | Alasan / catatan |
|---|---|---|---|
| DEC-001 | React + Vite SPA (TS, Tailwind, shadcn/ui, TanStack Query, Axios, RHF+Zod, React Router) | ACCEPTED | Dashboard di balik login, tanpa kebutuhan SEO; tanpa SSR |
| DEC-002 | Express + TypeScript untuk REST API | ACCEPTED | Sederhana, eksplisit, sarana belajar |
| DEC-003 | PostgreSQL | ACCEPTED | `NUMERIC`, CHECK, constraint kuat |
| DEC-004 | Prisma 7 + driver adapter PostgreSQL | ACCEPTED (versi terpasang 7.10.x terverifikasi) | Breaking changes v7 (config, driver adapter); raw SQL untuk CHECK |
| DEC-005 | Modular FE per fitur, BE per layer; props, Context hanya auth, server state TanStack Query | ACCEPTED | Mudah dibaca dan dijelaskan saat bimbingan |
| DEC-006 | Layered monolith | ACCEPTED | Layer-first kurang skalabel untuk banyak domain, wajar untuk skala toko |
| DEC-007 | Struktur folder baseline (bagian 4), `Container/` untuk landing page | ACCEPTED | Ubah hanya lewat persetujuan |
| DEC-008 | Zod untuk validasi request BE di `validators/` via middleware | ACCEPTED | Skema FE dan BE ditulis terpisah (DEC-026) |
| DEC-009 | Vitest + Supertest, DB test terpisah (`BE/.env.test`, nama berakhiran `_test`) | ACCEPTED (24 Okt 2026) | Biaya rendah, nilai tinggi pada stok/transaksi/akses |
| DEC-010 | Judul KP final | ACCEPTED | Lihat bagian 1 (Q-12) |
| DEC-011 | Uang sebagai `Decimal`, string di API | USULAN | Akurasi, batas Int |
| DEC-012 | Ledger stok + transaksi atomik + CHECK stok ≥ 0 | USULAN | Inti masalah proyek |
| DEC-013 | JWT di cookie HttpOnly (8 jam, tanpa refresh), cek Origin/Referer, status aktif dari DB tiap request | ACCEPTED (24 Okt 2026) | Alternatif: browser storage (terbaca saat XSS), sesi server-side (butuh tabel sesi) |
| DEC-014 | PaaS berbayar + PostgreSQL managed berbayar, FE dilayani Express (satu origin), **tanpa tier gratis untuk production** | USULAN | Hasil riset 21 Okt 2026, harga/syarat harus dicek ulang; belum diverifikasi: retensi backup, region, metode bayar, syarat komersial |
| DEC-015 | Backup penyedia + dump berkala + uji restore | USULAN | |
| DEC-016 | Pemesanan lensa | MENUNGGU (Q-01) | Tidak diimplementasikan sebelum dikonfirmasi. Q-01 sudah dijawab owner (sebagian); dampak di PRD bagian 10, sisa: P-03. Status menunggu keputusan developer |
| DEC-017 | Kebijakan harga grosir | MENUNGGU (Q-02) | Memblokir Tahap 6. Q-02 sudah dijawab owner; dampak di PRD bagian 10, sisa: P-01. Status menunggu keputusan developer |
| DEC-018 | Matriks hak akses | MENUNGGU (Q-03) | Sementara deny-by-default, dua role. Q-03 sudah dijawab owner (PRD bagian 3); dampak di PRD bagian 10. Status menunggu keputusan developer |
| DEC-019 | Rename `prisma7.config.ts` → `prisma.config.ts` | REJECTED (24 Okt 2026) | Prisma CLI 7.10.1 memuat `prisma7.config.ts`; tinjau ulang bila versi berikutnya tak mendeteksinya |
| DEC-020 | `@tanstack/react-table` untuk tabel | USULAN | Dependency baru, butuh persetujuan |
| DEC-021 | Format response `{ data, meta }` dan error `{ error: { code, message, details } }` | ACCEPTED (24 Okt 2026) | |
| DEC-022 | Arah desain Optical Luxury — Vintage Modern | ACCEPTED | |
| DEC-023 | Token warna dan penyesuaian kontras | ACCEPTED (1 Nov 2026) | Nilai token tetap USULAN sampai divalidasi pada UI nyata |
| DEC-024 | Font Geist, tanpa font tambahan | ACCEPTED (1 Nov 2026) | |
| DEC-025 | Microservices | REJECTED | Tanpa alasan bisnis/teknis, beban developer tunggal |
| DEC-026 | Shared package FE-BE / OpenAPI codegen | REJECTED (saat ini) | Over-engineering; kontrak dijaga dokumen ini + integration test; tinjau bila klien lain muncul |
| DEC-027 | Next.js dan NestJS | REJECTED | Tanpa kebutuhan SSR; kurva belajar tambahan |
| DEC-028 | Data pelanggan | MENUNGGU (Q-04) | Q-04 sudah dijawab owner; dampak di PRD bagian 10, sisa: P-06, P-07. Status menunggu keputusan developer |
| DEC-029 | Backend ES Modules (`"type": "module"`, `nodenext`, import relatif ber-ekstensi `.js`) | ACCEPTED (24 Okt 2026) | Prisma 7 ESM-first; build `tsc` → `dist/`, `node dist/server.js` |
| DEC-030 | Primary key `Int` autoincrement | ACCEPTED (24 Okt 2026) | Sederhana untuk aplikasi internal; akses tetap dijaga RBAC |
| DEC-031 | Login dengan `username` (unik, huruf kecil, CHECK DB), password argon2id (paket `argon2`) | ACCEPTED (24 Okt 2026) | Pegawai tidak wajib punya email; belum diverifikasi: biaya hash dan instalasi native addon di hosting |
| DEC-032 | `jose`, `cookie-parser`, rate limit login in-memory buatan sendiri | ACCEPTED (24 Okt 2026) | |
| DEC-033 | Sidebar dashboard memakai komponen shadcn `sidebar.tsx` | ACCEPTED (1 Nov 2026) | Context internal dan cookie `sidebar_state` dianggap state UI library, tidak melanggar DEC-005 |

## 10. Known issues, assumptions, and unknowns

- **Known issues:**
  - Logout tidak mencabut token yang sudah tersalin (bagian 7).
  - `trust proxy` belum diatur; rate limit login bisa dipakai mengunci akun orang lain di balik proxy (bagian 7).
  - `@fontsource-variable/montserrat` masih di `FE/package.json` padahal tak lagi diimpor.
  - `WhatsApp Image 2026-09-23 at 12.54.35.jpeg` di root repo berisi foto orang (data pribadi); keputusan developer apakah dipertahankan di repo (lihat `todo-list.md`).
  - `FE/README.md` masih README bawaan template Vite.
  - Build FE memperingatkan chunk utama > 500 kB (2 Nov 2026: 526,56 kB, gzip 171,54 kB; isinya terutama react-dom, react-router, axios, TanStack Query). Halaman sudah lazy; pemecahan vendor chunk butuh perubahan `vite.config.ts` (belum disetujui).
  - Sheet sidebar mobile memuat teks sr-only berbahasa Inggris ("Sidebar", "Displays the mobile sidebar.") dari `components/ui/sidebar.tsx`; mengubahnya berarti menyentuh `ui/` (butuh persetujuan).
  - `.gitignore` berisi `.agents/`, sehingga PADS (`.agents/skills/`), PRD, dan ERD (`.agents/docs/`) tidak ter-commit; dokumen ter-commit merujuk ke berkas yang tidak ada pada clone baru. Keputusan developer (lihat `todo-list.md`).
- **Assumptions:** A-01 sampai A-06 (bagian 2). Angka benchmark argon2 dan retensi backup belum ada.
- **Unknowns requiring investigation:** Q-12 dan Q-13 masih terbuka, Q lain sudah dijawab owner (`todo-list.md`, PRD bagian 10); P-01 sampai P-16 (PRD bagian 9, ringkasan di `todo-list.md`); PRD dan ERD masih DRAFT/USULAN; perilaku cookie `Secure` di HTTPS; instalasi `argon2` di platform hosting; dukungan backup/PITR penyedia hosting; format laporan KP.
- **Blocked items (PRD bagian 9 dan 11):** Tahap 3 (P-02 untuk lensa jadi, P-11, persetujuan schema), Tahap 5 pembelian (P-05) dan retur (P-10), Tahap 6 (P-01, P-08, P-09, P-14, persetujuan kontrak harga), pelanggan dan resep (P-07), Tahap 7 (P-11), Tahap 8 (P-04, P-05), Tahap 11 (P-16/Q-13, DEC-014, DEC-015), foto produk (P-12), pesanan lensa khusus (P-03), laporan KP (P-15/Q-12). P-06 dan P-13 tidak memblokir tahap.

## 11. Current working state

- **Current milestone:** menunggu persetujuan developer atas Tahap 2 (auth) setelah verifikasi; berikutnya Tahap 3 (kategori dan produk) setelah review PRD/ERD, P-02 (untuk lensa jadi), dan persetujuan schema.
- **Last verified result (2 Nov 2026, setelah rekonsiliasi dokumentasi):**
  - BE `npm run typecheck`: lulus (exit 0).
  - BE `npm test`: `Test Files 5 passed (5)`, `Tests 33 passed (33)`, terhadap database test terpisah (`BE/.env.test`).
  - FE `npm run lint`: lulus (exit 0).
  - FE `npm run build`: lulus (exit 0) dengan peringatan chunk > 500 kB (bagian 10).
  - Tidak dijalankan ulang: verifikasi browser (terakhir 1 Nov 2026, bagian 5), alur HTTP via proxy Vite, BE `npm run build`.
- **Files/modules currently being changed:** tidak ada (rekonsiliasi dokumentasi selesai; hanya dokumen dan komentar kode yang berubah).
- **Next action:** lihat `todo-list.md`.
- **Related tasks:** `todo-list.md`.
