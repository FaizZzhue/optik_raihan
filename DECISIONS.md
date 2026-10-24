# DECISIONS — KP Optik Raihan

> **Tujuan:** mencatat keputusan teknis agar tidak berubah tanpa alasan.
> **Status:** DRAFT, menunggu review developer
> **Versi:** 0.1.0
> **Tanggal penyusunan:** 22 Oktober 2026
> **Ruang lingkup:** keputusan arsitektur, teknologi, data, keamanan, desain, dan scope.
> **Referensi:** semua dokumen di `docs/`, terutama `ARCHITECTURE.md`, `SECURITY.md`, `REQUIREMENTS.md`

## Cara membaca

**Status:** `PROPOSED` (usulan), `ACCEPTED` (diterima developer), `REJECTED`, `SUPERSEDED`, `NEEDS_CONFIRMATION` (butuh jawaban owner/dosen).

**Tanggal:** hanya dicantumkan bila diketahui. Tanggal persetujuan **tidak diketahui** untuk semua entri, jadi kolom tersebut berisi "tidak tercatat". Jangan diisi dengan tebakan. Isi saat keputusan benar-benar disetujui.

**Dasar status `ACCEPTED`:** keputusan yang ditetapkan langsung oleh developer dalam prompt proyek (baseline stack, struktur, judul, arah desain). Rekomendasi dari audit teknologi **tidak** otomatis `ACCEPTED`.

**Mengubah keputusan `ACCEPTED`:** butuh persetujuan developer. Catat entri baru, tandai lama `SUPERSEDED`.

## Ringkasan

| ID | Keputusan | Status |
|---|---|---|
| DEC-001 | React + Vite (SPA) | ACCEPTED |
| DEC-002 | Express + TypeScript | ACCEPTED |
| DEC-003 | PostgreSQL | ACCEPTED |
| DEC-004 | Prisma 7 sebagai target, verifikasi versi | ACCEPTED |
| DEC-005 | Modularisasi FE dan BE | ACCEPTED |
| DEC-006 | Layered monolith | ACCEPTED |
| DEC-007 | Struktur folder baseline (termasuk `Container/`) | ACCEPTED |
| DEC-008 | Zod untuk validasi request BE | ACCEPTED |
| DEC-009 | Testing Vitest + Supertest | ACCEPTED |
| DEC-010 | Judul KP final | ACCEPTED |
| DEC-011 | Uang sebagai Decimal | PROPOSED |
| DEC-012 | Ledger stok + transaksi atomik | PROPOSED |
| DEC-013 | JWT di cookie HttpOnly | ACCEPTED |
| DEC-014 | Kebijakan hosting | PROPOSED |
| DEC-015 | Strategi backup | PROPOSED |
| DEC-016 | Fitur pemesanan lensa | NEEDS_CONFIRMATION |
| DEC-017 | Kebijakan harga grosir | NEEDS_CONFIRMATION |
| DEC-018 | Matriks hak akses | NEEDS_CONFIRMATION |
| DEC-019 | Nama berkas konfigurasi Prisma | REJECTED |
| DEC-020 | TanStack Table untuk tabel | PROPOSED |
| DEC-021 | Format response/error API | ACCEPTED |
| DEC-022 | Arah desain Optical Luxury — Vintage Modern | ACCEPTED |
| DEC-023 | Token warna dan penyesuaian kontras | PROPOSED |
| DEC-024 | Font UI | NEEDS_CONFIRMATION |
| DEC-025 | Microservices | REJECTED |
| DEC-026 | Shared package FE-BE / OpenAPI codegen | REJECTED |
| DEC-027 | Next.js dan NestJS | REJECTED |
| DEC-028 | Data pelanggan | NEEDS_CONFIRMATION |
| DEC-029 | Backend memakai ES Modules | ACCEPTED |
| DEC-030 | Primary key integer autoincrement | ACCEPTED |
| DEC-031 | Login dengan username, hash argon2id | ACCEPTED |
| DEC-032 | Library dan rate limit auth | ACCEPTED |

## Keputusan

### DEC-001 React + Vite (SPA)
- **Tanggal:** tidak tercatat. **Status:** ACCEPTED.
- **Konteks:** aplikasi berupa dashboard di balik login, tanpa kebutuhan SEO.
- **Keputusan:** React + Vite + TypeScript + Tailwind + shadcn/ui, TanStack Query, Axios, React Hook Form + Zod, React Router.
- **Alasan:** sesuai kemampuan developer, build statis mudah dilayani, tidak butuh server rendering.
- **Alternatif:** Next.js (lihat DEC-027).
- **Dampak/trade-off:** tanpa SSR. Landing page cukup SPA dengan meta tag yang baik.
- **Referensi:** `ARCHITECTURE.md`, `STRUCTURE.md`.

### DEC-002 Express + TypeScript
- **Tanggal:** tidak tercatat. **Status:** ACCEPTED.
- **Konteks:** developer sedang mempelajari Express dan REST API.
- **Keputusan:** Express + TypeScript untuk REST API.
- **Alasan:** sederhana, eksplisit, cocok sebagai sarana belajar dan mata kuliah terkait.
- **Alternatif:** NestJS (DEC-027), framework lain.
- **Dampak/trade-off:** disiplin struktur dijaga manual lewat `STRUCTURE.md` dan `CODING_STANDARDS.md`.

### DEC-003 PostgreSQL
- **Tanggal:** tidak tercatat. **Status:** ACCEPTED.
- **Keputusan:** PostgreSQL sebagai database utama.
- **Alasan:** tipe `NUMERIC`, dukungan CHECK dan constraint yang kuat, selaras dengan stack dan pembelajaran.
- **Alternatif:** MySQL. Juga mampu untuk skala ini, perbedaannya tidak dramatis.
- **Referensi:** `DATABASE.md`.

### DEC-004 Prisma 7 sebagai target, dengan verifikasi versi
- **Tanggal:** tidak tercatat. **Status:** ACCEPTED (target). **Tindak lanjut:** versi terpasang belum terverifikasi.
- **Keputusan:** Prisma ORM, target v7, dengan driver adapter PostgreSQL bila sesuai versi.
- **Alasan:** tipe aman, migrasi bawaan, ramah pemula.
- **Dampak:** Prisma 7 membawa breaking changes (konfigurasi di `prisma.config.ts`, driver adapter wajib). Verifikasi `package.json` sebelum menulis kode. Raw SQL dibutuhkan untuk CHECK constraint dan kasus tertentu.
- **Referensi:** `DATABASE.md`, DEC-019.

### DEC-005 Modularisasi FE dan BE
- **Tanggal:** tidak tercatat. **Status:** ACCEPTED.
- **Keputusan:** FE modular per fitur, BE per layer. Props untuk data antar komponen, Context hanya untuk auth, TanStack Query untuk server state, `constants/` untuk data statis reusable, `types/` untuk tipe reusable.
- **Alasan:** mudah dibaca, dicari, dan dijelaskan saat bimbingan.
- **Dampak:** aturan pemecahan dan pencegahan duplikasi di `STRUCTURE.md` dan `CODING_STANDARDS.md`.

### DEC-006 Layered monolith
- **Tanggal:** tidak tercatat. **Status:** ACCEPTED.
- **Keputusan:** Route → Middleware → Controller → Service → Prisma → PostgreSQL.
- **Alternatif:** modular monolith per domain, microservices (DEC-025).
- **Dampak/trade-off:** layer-first kurang skalabel untuk banyak domain, wajar untuk skala toko.

### DEC-007 Struktur folder baseline
- **Tanggal:** tidak tercatat. **Status:** ACCEPTED.
- **Keputusan:** struktur di `STRUCTURE.md` menjadi baseline. `FE/src/Container/` dipertahankan untuk landing page publik. `constants/` dan `types/` terpisah, `utils/` untuk fungsi murni, `lib/` untuk konfigurasi library. Domain berpenamaan jamak (`products.*`).
- **Dampak:** perubahan struktur hanya lewat prosedur `STRUCTURE.md` bagian 13.

### DEC-008 Zod untuk validasi request BE
- **Tanggal:** tidak tercatat. **Status:** ACCEPTED.
- **Keputusan:** validasi `body/query/params` dengan Zod di `validators/` lewat middleware.
- **Dampak:** FE dan BE memakai bahasa skema yang sama tetapi skema ditulis terpisah (DEC-026).

### DEC-009 Testing: Vitest + Supertest
- **Tanggal:** diterima developer 24 Oktober 2026 (Tahap 1). **Status:** ACCEPTED.
- **Konteks:** prompt menyebut keduanya "apabila sesuai dengan konfigurasi proyek". Audit Tahap 0 menemukan belum ada framework test.
- **Keputusan:** integration test BE dengan Vitest + Supertest di database test terpisah, fokus alur kritis. Test hanya membaca `BE/.env.test`, dan nama database test wajib berakhiran `_test` (dicek di `BE/tests/setup.ts`).
- **Alasan:** biaya rendah, nilai tinggi pada stok, transaksi, dan akses.

### DEC-010 Judul KP final
- **Tanggal:** tidak tercatat. **Status:** ACCEPTED.
- **Keputusan:** "Rancang Bangun Aplikasi Penjualan Kacamata Berbasis Web pada Toko Kacamata Raihan".
- **Catatan konflik:** prompt lebih awal memuat "Penjualan, Pembelian, dan Pemesanan". Judul terbaru lebih sempit sementara scope kerja tetap mencakup pembelian dan inventaris. Selaras atau tidaknya menunggu dosen (Q-12).

### DEC-011 Uang sebagai Decimal
- **Tanggal:** tidak tercatat. **Status:** PROPOSED (rekomendasi audit).
- **Keputusan (usulan):** `Decimal`/`NUMERIC`, bukan Float atau Int 32-bit. Dikirim sebagai string di API.
- **Alasan:** akurasi dan batas Int pada total agregat besar.
- **Referensi:** `DATABASE.md` bagian 6, `API_CONTRACT.md` bagian 7.

### DEC-012 Ledger stok dan transaksi atomik
- **Tanggal:** tidak tercatat. **Status:** PROPOSED (rekomendasi audit).
- **Keputusan (usulan):** stok saat ini + ledger mutasi wajib untuk setiap perubahan stok. Operasi bisnis dalam satu transaksi Prisma. Update bersyarat atomik. CHECK stok ≥ 0.
- **Alasan:** inilah inti masalah proyek (stok tidak sesuai, butuh keterlacakan). Validasi FE tidak cukup.
- **Dampak:** desain lebih ketat dan test integritas wajib.
- **Referensi:** `DATABASE.md` bagian 8-10, 15.

### DEC-013 JWT di cookie HttpOnly
- **Tanggal:** diterima developer 24 Oktober 2026 (Tahap 2), bersama status M-01 CONFIRMED. **Status:** ACCEPTED.
- **Keputusan:** JWT (HS256) di cookie HttpOnly `access_token`, Secure di production, SameSite=Lax, Path=/, berlaku **8 jam** tanpa refresh token. Status aktif dan role pengguna dibaca dari database pada setiap request. Request ubah data diperiksa `Origin`/`Referer` terhadap `APP_ORIGIN` dan wajib JSON bila ber-body.
- **Alasan:** token tidak terbaca JavaScript. Satu origin di produksi menyederhanakan CSRF.
- **Alternatif:** JWT di browser storage (token terbaca bila ada XSS), sesi server-side (bisa dicabut, butuh tabel sesi dan menyimpang dari baseline JWT).
- **Dampak/trade-off:** `AuthContext` tanpa token, tanpa interceptor Bearer, perlu mitigasi CSRF. HttpOnly tidak menghilangkan risiko XSS.
- **Referensi:** `SECURITY.md`, `API_CONTRACT.md` bagian 9, `ARCHITECTURE.md` bagian 9.

### DEC-014 Kebijakan hosting
- **Tanggal:** tidak tercatat. **Status:** PROPOSED. Harga dan syarat layanan harus dicek ulang sebelum memilih.
- **Keputusan (usulan):** PaaS berbayar dengan PostgreSQL managed berbayar, FE dilayani Express (satu origin). **Tidak memakai tier gratis untuk produksi.**
- **Alasan (hasil riset audit teknologi 21 Oktober 2026):** layanan gratis tertentu tidur setelah tidak aktif atau menghapus database gratis setelah masa tertentu. Paket gratis Vercel Hobby dibatasi untuk penggunaan non-komersial. Ini perlu diverifikasi ulang pada halaman resmi sebelum keputusan.
- **Yang belum diverifikasi:** retensi dan fitur backup paket pilihan, region terdekat, metode bayar, syarat penggunaan komersial.
- **Alternatif:** FE dan BE dipisah (menambah CORS/cookie lintas-domain), VPS mandiri (beban pemeliharaan).
- **Dampak:** biaya bulanan nyata, FE dan BE di-deploy bersamaan.

### DEC-015 Strategi backup
- **Tanggal:** tidak tercatat. **Status:** PROPOSED.
- **Keputusan (usulan):** backup penyedia + dump berkala ke penyimpanan terpisah + uji restore sebelum serah terima.
- **Referensi:** `DATABASE.md` bagian 14.

### DEC-016 Fitur pemesanan lensa
- **Status:** NEEDS_CONFIRMATION (Q-01).
- **Konteks:** judul awal menyebut "Pemesanan", judul final tidak. Tidak ada sumber yang menetapkannya.
- **Keputusan:** tidak diimplementasikan sampai dikonfirmasi owner dan dosen.
- **Dampak:** jika masuk scope, perlu modul, model data, dan alur status baru. Tidak ada folder `orders/` sekarang.

### DEC-017 Kebijakan harga grosir
- **Status:** NEEDS_CONFIRMATION (Q-02).
- **Dampak:** menentukan model harga di produk dan penjualan. Blokir Tahap 6.

### DEC-018 Matriks hak akses
- **Status:** NEEDS_CONFIRMATION (Q-03).
- **Keputusan sementara:** deny by default, dua role (`owner`, `staff`), izin sensitif dibatasi seminimal mungkin sampai dikonfirmasi.

### DEC-019 Nama berkas konfigurasi Prisma
- **Tanggal:** ditolak developer 24 Oktober 2026 (Tahap 1). **Status:** REJECTED.
- **Konteks:** developer memakai berkas bernama `prisma7.config.ts`. Dokumentasi resmi Prisma 7 menyebut `prisma.config.ts` di root project.
- **Usulan yang ditolak:** ganti ke nama standar `prisma.config.ts`.
- **Alasan penolakan:** audit Tahap 0 membuktikan Prisma CLI 7.10.1 memuat `prisma7.config.ts` ("Loaded Prisma config from prisma7.config.ts"). Rename hanya soal konvensi.
- **Dampak:** berkas tetap `BE/prisma7.config.ts`. Jika versi Prisma berikutnya tidak lagi mendeteksinya, tinjau ulang keputusan ini.

### DEC-020 TanStack Table untuk tabel
- **Tanggal:** tidak tercatat. **Status:** PROPOSED.
- **Keputusan (usulan):** tambah `@tanstack/react-table` untuk tabel dengan sorting, filter, pagination server-side.
- **Alasan:** shadcn/ui tidak menyediakan data table lengkap secara bawaan.
- **Dampak:** dependency baru. Butuh persetujuan sebelum dipasang.

### DEC-021 Format response dan error API
- **Tanggal:** diterima developer 24 Oktober 2026 (Tahap 1). **Status:** ACCEPTED.
- **Keputusan:** sukses `{ data, meta }`, error `{ error: { code, message, details } }`, dipakai konsisten di seluruh endpoint. Diimplementasikan di `BE/src/utils/api-response.ts` dan `BE/src/middlewares/error.middleware.ts`.
- **Referensi:** `API_CONTRACT.md` bagian 2-4.

### DEC-022 Arah desain Optical Luxury — Vintage Modern
- **Tanggal:** tidak tercatat. **Status:** ACCEPTED.
- **Keputusan:** tema premium hangat bergaya butik kacamata modern, Light dan Dark Mode, Clean Minimalist dengan Bento Grid selektif.
- **Catatan:** referensi visual tidak tersedia untuk penyusun dokumen. Hanya deskripsi tertulis yang dipakai.

### DEC-023 Token warna dan penyesuaian kontras
- **Tanggal:** tidak tercatat. **Status:** PROPOSED.
- **Konteks:** palet awal dari developer. Pengecekan kontras menemukan Burnt Orange gagal sebagai teks normal, Olive di atas Sage gagal, dan Olive di atas Ivory lulus tipis (4,53:1).
- **Keputusan (usulan):** pertahankan palet, batasi pemakaian Burnt Orange untuk non-teks, pertimbangkan varian Olive lebih gelap untuk teks. Warna semantik yang diusulkan perlu disetujui.
- **Referensi:** `DESIGN_SYSTEM.md` bagian 2.

### DEC-024 Font UI
- **Status:** NEEDS_CONFIRMATION.
- **Pilihan:** Plus Jakarta Sans atau Inter. Dukungan angka tabular belum diverifikasi.

### DEC-025 Microservices
- **Status:** REJECTED. Tidak ada alasan bisnis atau teknis. Menambah beban operasional developer tunggal. Dasar: arahan developer dan audit.

### DEC-026 Shared package FE-BE / OpenAPI codegen
- **Status:** REJECTED (untuk saat ini). Over-engineering untuk satu developer. Kontrak dijaga lewat `API_CONTRACT.md` dan integration test. Tinjau ulang bila klien lain muncul.

### DEC-027 Next.js dan NestJS
- **Status:** REJECTED. Next.js menambah runtime server kedua tanpa kebutuhan SEO/SSR. NestJS menambah kurva belajar di atas Express, Prisma, dan PostgreSQL yang sedang dipelajari.

### DEC-028 Data pelanggan
- **Status:** NEEDS_CONFIRMATION (Q-04).
- **Dampak:** tabel pelanggan dan pertimbangan privasi data pribadi. Tidak diimplementasikan sampai dikonfirmasi.

### DEC-029 Backend memakai ES Modules
- **Tanggal:** diterima developer 24 Oktober 2026 (Tahap 1). **Status:** ACCEPTED.
- **Konteks:** audit Tahap 0 menemukan `BE/package.json` bertipe CommonJS sementara `prisma7.config.ts` ditulis ESM, sehingga typecheck gagal. Dokumentasi Prisma 7 menyatakan Prisma 7 ESM-first.
- **Keputusan:** `"type": "module"`, TypeScript `module`/`moduleResolution` `nodenext`, import relatif memakai ekstensi `.js`. Generator `prisma-client` memakai output default (ESM).
- **Alternatif:** CommonJS dengan `moduleFormat = "cjs"` (melawan default Prisma 7).
- **Dampak:** build memakai `tsc -p tsconfig.build.json` ke `dist/`, lalu `node dist/server.js`.

### DEC-030 Primary key integer autoincrement
- **Tanggal:** diterima developer 24 Oktober 2026 (Tahap 2). **Status:** ACCEPTED.
- **Keputusan:** semua tabel memakai `Int @id @default(autoincrement())` (`SERIAL`). ID dikirim di API sebagai number.
- **Alasan:** paling sederhana dibaca dan di-debug untuk aplikasi internal satu toko.
- **Alternatif:** UUID v7 (tidak bisa ditebak, string panjang).
- **Trade-off:** urutan dan jumlah ID terlihat oleh pengguna yang berhak. Akses tetap dijaga RBAC di BE.

### DEC-031 Login dengan username, hash argon2id
- **Tanggal:** diterima developer 24 Oktober 2026 (Tahap 2). **Status:** ACCEPTED.
- **Keputusan:** identitas login `username` (unik, huruf kecil, dijaga CHECK di database). Password di-hash argon2id (paket `argon2`, parameter default m=64 MiB, t=3, p=4). Panjang minimum password akun baru 12 karakter.
- **Alasan:** pegawai tidak wajib punya email (lebih sedikit data pribadi). argon2id adalah pilihan utama OWASP.
- **Belum diverifikasi:** benchmark biaya hash di server produksi, dan instalasi native addon `argon2` di platform hosting.

### DEC-032 Library dan rate limit auth
- **Tanggal:** disetujui developer 24 Oktober 2026 (Tahap 2). **Status:** ACCEPTED.
- **Keputusan:** `jose` untuk JWT, `cookie-parser` untuk membaca cookie, rate limit login ditulis sendiri in-memory (`BE/src/services/login-rate-limit.service.ts`) dengan angka di `SECURITY.md` bagian 8.
- **Alternatif:** jsonwebtoken, paket `cookie`, rate-limiter-flexible, express-rate-limit.
- **Trade-off:** counter hilang saat restart dan tidak dibagi antar-instance (cukup untuk satu instance).
