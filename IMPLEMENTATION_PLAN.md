# IMPLEMENTATION_PLAN — KP Optik Raihan

> **Tujuan:** roadmap implementasi bertahap, berurutan menurut dependensi, dan dapat diuji.
> **Status:** DRAFT, menunggu review developer
> **Versi:** 0.1.0
> **Tanggal penyusunan:** 22 Oktober 2026
> **Ruang lingkup:** urutan, deliverable, kriteria selesai. **Tidak ada tahap yang dikerjakan saat ini.** Estimasi waktu tidak dicantumkan karena tidak ada dasar yang valid.
> **Referensi:** `REQUIREMENTS.md`, `ARCHITECTURE.md`, `STRUCTURE.md`, `DATABASE.md`, `API_CONTRACT.md`, `SECURITY.md`, `CODING_STANDARDS.md`, `DECISIONS.md`

**Pendekatan:** vertical slice. Setiap tahap menghasilkan fitur utuh dari database sampai UI yang bisa diuji. Satu tahap pada satu waktu. Tahap berikutnya tidak dimulai sebelum exit criteria tahap sebelumnya terpenuhi dan developer menyetujui.

**Aturan umum:** tahap yang bergantung pada requirement berstatus `NEEDS_CONFIRMATION` diblokir sampai pertanyaan terkait dijawab. Perubahan `schema.prisma` dan migrasi memerlukan persetujuan eksplisit. Modul pemesanan lensa dan pelanggan **tidak ada** dalam rencana ini sampai Q-01 dan Q-04 dijawab.

## Ringkasan tahap

| Tahap | Nama | Diblokir oleh |
|---|---|---|
| 0 | Konfirmasi dan audit repository | tidak ada |
| 1 | Fondasi | Tahap 0 |
| 2 | Authentication dan RBAC | Q-03 (minimal), DEC-013 |
| 3 | Master data: kategori dan produk (pola utama) | Q-10 |
| 4 | Supplier | Tahap 3 |
| 5 | Inventaris (ledger) dan pembelian | Q-07, Q-08, Q-09 (sebagian) |
| 6 | Penjualan | Q-02, Q-05, Q-08, Q-09, Q-17 (sebagian) |
| 7 | Stock opname | Q-06 |
| 8 | Dashboard dan laporan | Q-11, Q-14 |
| 9 | Hardening | Tahap 2-8 |
| 10 | Landing page publik | M-13 isi |
| 11 | Deployment dan serah terima | Q-13, DEC-014, DEC-015 |

## Definition of Done (berlaku untuk semua tahap)

- Acceptance criteria tahap terpenuhi.
- Kode sesuai `STRUCTURE.md` dan `CODING_STANDARDS.md` (checklist bagian 12 terisi).
- Test yang dipersyaratkan ditulis dan **benar-benar dijalankan**. Output asli dilaporkan.
- Tidak ada dependency, perubahan schema, atau perubahan struktur tanpa persetujuan.
- Dokumentasi terdampak diperbarui (`API_CONTRACT.md`, `DATABASE.md`, `DECISIONS.md`).
- Tidak ada secret atau data pribadi di kode.
- Developer sudah mereview dan menyetujui.

## Tahap 0: Konfirmasi dan audit repository

- **Deliverable:** hasil audit repo nyata (versi dependency, konfigurasi), jawaban pertanyaan prioritas, keputusan `PROPOSED` utama direview.
- **Pekerjaan:** verifikasi versi Prisma, Tailwind, shadcn/ui, Express, Vite, dan lainnya dari `package.json` dan lockfile. Rekonsiliasi dokumentasi dengan kondisi aktual. Tanyakan Q-01, Q-02, Q-03, Q-10, Q-12.
- **Acceptance criteria:** daftar versi terverifikasi tercatat. Keputusan DEC-013, DEC-014, DEC-019 diterima atau diubah. Judul vs scope (Q-12) jelas.
- **Test:** tidak ada.
- **Exit criteria:** dokumentasi konsisten dengan repo aktual. Tidak ada kontradiksi yang belum dicatat.

## Tahap 1: Fondasi

- **Deliverable:** BE dan FE berjalan, konfigurasi tervalidasi, penanganan error terpusat, koneksi database, kerangka test.
- **File/modul:** `BE/src/{app,server}.ts`, `config/`, `lib/prisma.ts`, `middlewares/error.middleware.ts`, `utils/{app-error,api-response}.ts`, `prisma7.config.ts` (DEC-019 REJECTED), `FE/src/{main,App}.tsx`, `services/api/axios.ts`, `lib/queryClient.ts`, alias `@/`.
- **Acceptance criteria:** BE start gagal bila konfigurasi tidak valid. Endpoint kesehatan merespons. Error mengikuti format `API_CONTRACT.md` bagian 3. FE dapat memanggil BE melalui proxy dalam satu origin. Koneksi Prisma ke PostgreSQL berfungsi dengan versi terpasang.
- **Test:** integration test endpoint kesehatan dan format error (Vitest + Supertest, database test terpisah).
- **Exit criteria:** test lulus. Migrasi pertama (jika ada) disetujui dan dijalankan terkontrol.

## Tahap 2: Authentication dan RBAC

- **Deliverable:** login/logout/me, proteksi route BE dan FE, role dasar.
- **File/modul:** `routes|validators|controllers|services/auth.*`, `middlewares/{auth,role}.middleware.ts`, `utils/{password,jwt}.ts`, `constants/auth.constants` (role), `FE/features/auth/*`, `routes/{ProtectedRoute,RoleRoute}.tsx`, seed owner awal.
- **Acceptance criteria:** AC-01.1 sampai AC-01.5. Token tidak ada di JavaScript FE. Matriks izin awal sesuai jawaban Q-03.
- **Test:** seluruh daftar `SECURITY.md` bagian 15 yang berlaku pada tahap ini.
- **Exit criteria:** test keamanan lulus. Perilaku cookie diuji pada kondisi mirip production.
- **Status (24 Okt 2026):** kode, migrasi (file), seed, dan test ditulis. Test yang butuh database belum dijalankan karena DB development dan test belum tersedia.
- **Status (1 Nov 2026, audit Prompt 5):** migrasi diterapkan ke DB dev dan DB test. `npm test` 33/33 lulus (dua kali berturut-turut) terhadap PostgreSQL nyata. Alur login, me, dan logout lewat proxy Vite terverifikasi dengan HTTP. Belum diverifikasi: perilaku di browser (cookie tidak terbaca JS, reload, redirect), cookie `Secure` di HTTPS, dan seed owner (dijalankan developer). Tahap menunggu persetujuan developer.
- **Deviasi dari daftar file:**
  - `RoleRoute.tsx` ditunda sampai ada route berbasis role.
  - Rate limit login berada di `services/login-rate-limit.service.ts`, bukan middleware.
  - `validateBody` hanya memvalidasi body; query dan params ditambahkan saat route pertama membutuhkannya.
- **Shell dashboard (layout, sidebar, header, token warna, tema Light/Dark):** diusulkan dikerjakan sebelum Tahap 3. Developer memutuskan (1 Nov 2026) menundanya sampai Tahap 2 terverifikasi dengan database, agar dashboard dapat diuji setelah login sungguhan. Keputusan desainnya sudah dicatat: DEC-023, DEC-024, DEC-033.

## Tahap 3: Master data, kategori dan produk (pola utama)

- **Deliverable:** CRUD kategori dan produk end-to-end sebagai **pola acuan** untuk fitur berikutnya.
- **File/modul:** `features/{categories,products}/*`, `FE/types/{category,product}.ts`, BE `routes|validators|controllers|services` untuk `categories` dan `products`, model Prisma terkait (field menunggu Q-10).
- **Acceptance criteria:** AC-03.1 sampai AC-03.4. Pagination dan pencarian di server. State loading/empty/error sesuai `DESIGN_SYSTEM.md`.
- **Test:** integration test CRUD, validasi, otorisasi, penolakan hapus produk yang sudah bertransaksi (bila sudah ada).
- **Exit criteria:** developer dapat menjelaskan alur Page → Hook → Service → Axios → Route → Controller → Service → Prisma untuk produk. Pola disetujui sebagai acuan.
- **Risiko:** pola yang salah akan ditiru di semua fitur. Review ketat sebelum lanjut.

## Tahap 4: Supplier

- **Deliverable:** CRUD supplier mengikuti pola Tahap 3.
- **Acceptance criteria:** AC-03.1 sampai AC-03.3 untuk supplier.
- **Test:** seperti Tahap 3.
- **Exit criteria:** tidak ada penyimpangan dari pola yang disetujui.

## Tahap 5: Inventaris (ledger) dan pembelian

- **Deliverable:** ledger mutasi stok, pembelian dengan penambahan stok atomik, riwayat mutasi.
- **File/modul:** model StockMovement, Purchase, PurchaseItem. `services/purchases.service.ts`, layanan stok/ledger, `features/{purchases,inventory}/*`.
- **Acceptance criteria:** AC-06.1 sampai AC-06.4 (pembatalan hanya bila Q-07 menyetujui), AC-08.1 sampai AC-08.3. CHECK constraint stok ≥ 0 aktif.
- **Test:** rollback saat gagal di tengah, rekonsiliasi stok vs ledger, snapshot harga, otorisasi (`DATABASE.md` bagian 15).
- **Exit criteria:** stok masuk tidak mungkin tanpa mutasi. Test integritas lulus.

## Tahap 6: Penjualan

- **Deliverable:** pencatatan penjualan dengan pengurangan stok atomik, riwayat penjualan, detail transaksi.
- **File/modul:** `services/sales.service.ts` (dipecah ke subfolder hanya bila sudah membesar), `features/sales/*`.
- **Acceptance criteria:** AC-07.1 sampai AC-07.5, AC-07.6 bila Q-05 menyetujui. FE tidak mengirim harga/total.
- **Test:** konkurensi stok terakhir, stok tidak cukup, rollback, snapshot, perhitungan total di backend, otorisasi, idempotensi tombol/kirim ganda.
- **Exit criteria:** seluruh test integritas lulus tanpa kecuali.
- **Tidak boleh dikerjakan** sebelum model harga (Q-02, Q-17) dan format nomor transaksi (Q-09) jelas.

## Tahap 7: Stock opname

- **Deliverable:** proses opname dengan penyesuaian stok tercatat.
- **Acceptance criteria:** AC-09.1 sampai AC-09.3 (persetujuan sesuai Q-06).
- **Test:** selisih menghasilkan mutasi, stok sistem terekam pada opname, rekonsiliasi tetap utuh.
- **Exit criteria:** opname tidak pernah menimpa stok langsung.

## Tahap 8: Dashboard dan laporan

- **Deliverable:** dashboard dan laporan sesuai jawaban Q-11 dan Q-14.
- **Acceptance criteria:** AC-10.1, AC-10.2. Angka dihitung backend, batas hari mengikuti zona waktu toko.
- **Test:** hasil agregat dibandingkan dengan data transaksi uji yang diketahui. Uji batas tanggal.
- **Exit criteria:** angka laporan dapat direkonsiliasi dengan transaksi sumber.

## Tahap 9: Hardening

- **Deliverable:** rate limiting, header keamanan, audit log, penanganan error production, backup terjadwal.
- **Acceptance criteria:** seluruh `SECURITY.md` bagian 15 lulus. Audit log merekam aksi yang disepakati dengan owner.
- **Exit criteria:** tinjauan keamanan terhadap `SECURITY.md` selesai, temuan ditangani atau dicatat.

## Tahap 10: Landing page publik

- **Deliverable:** halaman publik di `FE/src/Container/` hanya dengan komponen yang dipakai.
- **Acceptance criteria:** AC-13.1, AC-13.2. Isi dari data yang dikonfirmasi owner.
- **Catatan:** dapat dikerjakan paralel setelah Tahap 1 karena risiko rendah, tetapi isi menunggu konfirmasi.

## Tahap 11: Deployment dan serah terima

- **Deliverable:** lingkungan staging dan production, backup berjalan, dokumentasi operasional.
- **Acceptance criteria:** HTTPS aktif. Variabel lingkungan diatur di platform. **Uji restore backup berhasil dan terdokumentasi.** Akun hosting atas nama toko dengan 2FA. UAT bersama pegawai/owner dilakukan. Panduan deploy ulang dan restore tersedia.
- **Verifikasi wajib sebelum memilih paket:** retensi backup, region, metode bayar, syarat penggunaan komersial (`DECISIONS.md` DEC-014).
- **Exit criteria:** owner dapat mengoperasikan aplikasi dan prosedur pemulihan tertulis.

## Kebijakan jika tahap gagal

1. Hentikan tahap. Jangan lanjut membangun di atas fondasi yang gagal.
2. Laporkan apa adanya: gejala, pesan error, apa yang sudah dicoba.
3. Tentukan akar masalah sebelum memperbaiki. Jangan menambal gejala.
4. Jika masalah menyentuh struktur atau keputusan: ikuti prosedur perubahan (`STRUCTURE.md` bagian 13) dan catat di `DECISIONS.md`.
5. Jika test integritas gagal, perbaiki kode, bukan test. Test hanya diubah bila memang salah, dengan alasan tertulis.
6. Tahap dianggap selesai hanya bila exit criteria terpenuhi, bukan karena "hampir".

## Risiko dan mitigasi

| Risiko | Mitigasi |
|---|---|
| Kurva belajar backend | Vertical slice Tahap 3 sebagai pola, review per tahap |
| Scope melebar | Requirement `NEEDS_CONFIRMATION` diblokir. Perubahan scope dicatat |
| Stok tidak konsisten | Ledger, update atomik, CHECK, test integritas |
| Friksi konfigurasi Prisma 7 | Ikuti dokumentasi resmi, verifikasi versi di Tahap 0 |
| Waktu KP terbatas | Prioritaskan Tahap 1-6. Laporan dan dashboard dibuat sederhana dahulu |
| Kehilangan data | Backup ganda dan uji restore (Tahap 11) |
| Pertanyaan tak terjawab menunda tahap | Ajukan pertanyaan terblokir sedini mungkin (Tahap 0) |
