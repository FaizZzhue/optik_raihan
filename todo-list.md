# Project TODO List

> Mencatat pekerjaan yang dapat ditindaklanjuti. Status faktual; jangan tandai selesai sebelum acceptance criteria dan verifikasi terpenuhi. Fakta proyek ada di `PROJECT-CONTEXT.md`.

## Status definitions

- `BACKLOG`: teridentifikasi, belum dimulai.
- `READY`: requirement dan dependensi jelas.
- `IN_PROGRESS`: sedang dikerjakan.
- `BLOCKED`: tak bisa lanjut; sebut alasan dan pihak/dependensi.
- `VERIFY`: implementasi ada, verifikasi yang dipersyaratkan belum lengkap.
- `DONE`: acceptance criteria terpenuhi dan verifikasi tercatat.
- `CANCELLED`: sengaja dibatalkan; catat alasannya.

## Priority definitions

- `P0`: blocker kritis, masalah keamanan/integritas data, penghambat rilis.
- `P1`: bernilai tinggi atau wajib untuk milestone saat ini.
- `P2`: pekerjaan terencana normal.
- `P3`: opsional / tidak mendesak.

## Current milestone

- **Milestone:** Tahap 3, Tahap 4, Tahap 5 (pembelian + ledger), akun pegawai, dan audit log terimplementasi di `main`, status VERIFY menunggu review developer. Tahap 2 tetap menunggu persetujuan developer. Tahap 6 (penjualan) terblokir P-01, P-08, P-09, P-14 dan persetujuan kontrak harga.
- **Goal:** developer mereview hasil Tahap 3 sampai 5 dan mengonfirmasi DEC-034 sampai DEC-038; owner menjawab P-01, P-02 (TASK-023) agar penjualan bisa dimulai.
- **Target date (if applicable):** tidak ada dasar tanggal; tidak ditetapkan.
- **Last updated:** 2 November 2026 (implementasi dan verifikasi Tahap 4, 5, akun pegawai, audit log; sebelumnya Tahap 3; sebelumnya sinkronisasi dengan `.agents/docs/PRD.md`, `.agents/docs/ERD.md`, dan lokasi PADS di `.agents/skills/`; sebelumnya rekonsiliasi dokumentasi setelah adopsi PADS, hasil pemeriksaan di `PROJECT-CONTEXT.md` bagian 11).

## Aturan pengerjaan tahap (dari proyek ini)

- Vertical slice: tiap tahap menghasilkan fitur utuh dari database sampai UI yang bisa diuji. **Satu tahap pada satu waktu**; tahap berikutnya tidak dimulai sebelum exit criteria tahap sebelumnya terpenuhi dan developer menyetujui.
- Tahap yang bergantung pada requirement `NEEDS_CONFIRMATION` diblokir sampai pertanyaan terkait dijawab. Q-01 dan Q-04 sudah dijawab owner (PRD bagian 10): pelanggan dan resep masuk rencana (TASK-021, terblokir P-07); pemesanan lensa khusus tetap tidak ada dalam rencana sampai P-03 diputuskan.
- Perubahan `schema.prisma`, migrasi, dependency baru, dan perubahan struktur memerlukan persetujuan eksplisit.
- **Definition of Done (semua tahap):** acceptance criteria tahap terpenuhi; kode sesuai konvensi `PROJECT-CONTEXT.md` bagian 4 dan `.agents/skills/standards/QUALITY-GATES.md`; test yang dipersyaratkan ditulis **dan benar-benar dijalankan** dengan output asli dilaporkan; tidak ada dependency/schema/struktur berubah tanpa persetujuan; `PROJECT-CONTEXT.md` (kontrak, data, keputusan) dan todo ini diperbarui; tidak ada secret/data pribadi di kode; developer sudah mereview dan menyetujui.
- **Jika tahap gagal:** hentikan; laporkan apa adanya (gejala, pesan error, yang sudah dicoba); cari akar masalah sebelum memperbaiki; bila menyentuh struktur/keputusan ikuti prosedur perubahan dan catat di `PROJECT-CONTEXT.md` bagian 9; bila test integritas gagal perbaiki kode, bukan test; tahap selesai hanya bila exit criteria terpenuhi, bukan karena "hampir".
- Estimasi waktu tidak dicantumkan karena tidak ada dasar yang valid.
- Jika waktu KP terbatas: prioritaskan Tahap 1 sampai 6; laporan dan dashboard dibuat sederhana dahulu (rencana dokumen lama, `git show 1b26217:IMPLEMENTATION_PLAN.md`).

## Tasks

| ID | Task / outcome | Priority | Status | Area | Dependencies | Acceptance criteria / verification |
|---|---|---|---|---|---|---|
| TASK-001 | Tahap 0: audit repo dan rekonsiliasi dokumentasi | P1 | DONE | Docs | Tidak ada | Versi dependency terverifikasi dari `package.json`; keputusan DEC-004, DEC-013, DEC-019 diputuskan. Sisa pertanyaan Q-01, Q-02, Q-03, Q-10, Q-12 masih terbuka (lihat Blockers) |
| TASK-002 | Tahap 1: fondasi (config tervalidasi, error terpusat, health, koneksi Prisma, kerangka test, FE via proxy) | P1 | DONE | BE/FE | TASK-001 | Integration test health dan format error lulus (dilaporkan 24 Okt 2026) |
| TASK-003 | Tahap 2: authentication dan RBAC (login/logout/me, proteksi route BE dan FE) | P1 | VERIFY | BE/FE | DEC-013 | `npm test` 33/33 lulus dua kali (dilaporkan 1 Nov 2026); HTTP via proxy diverifikasi. Sisa: pemeriksaan browser manual developer (TASK-004), cookie `Secure` di HTTPS, seed owner, persetujuan developer; matriks izin: jawaban owner di PRD bagian 3, DEC-018 masih MENUNGGU |
| TASK-004 | Verifikasi auth di browser: cookie tak terbaca JS, reload memulihkan sesi, redirect saat 401, logout | P1 | VERIFY | FE | TASK-003 | Otomatis, diulang 2 Nov 2026 di mesin developer (Chrome 156 headless via CDP, build produksi + BE pada DB test): login lewat form; cookie `access_token` `httpOnly=true`, `sameSite=Lax`, `document.cookie` kosong, token tidak ada di storage; reload di `/barang` memulihkan sesi; cookie dihapus lalu request API → diarahkan ke `/login` dengan `from=/barang`; logout menghapus cookie dan Back tetap di `/login`. Sisa: developer mengulang secara manual dengan akun hasil seed di DB dev; cookie `Secure` di HTTPS |
| TASK-005 | Tahap 3: CRUD kategori dan produk end-to-end sebagai **pola acuan** | P1 | VERIFY | FE/BE/DB | Schema dan migrasi disetujui developer (chat 2 Nov 2026). Sisa di luar task ini: P-02 (lensa jadi), P-11 (stok awal), foto (TASK-024) | AC-03.1 sampai AC-03.4; PRD FR-03.1 sampai FR-03.9, FR-04.1; pagination dan pencarian server-side; state loading/empty/error; integration test CRUD, validasi, otorisasi, penolakan hapus produk bertransaksi; developer dapat menjelaskan alur Page → Hook → Service → Axios → Route → Controller → Service → Prisma. Risiko: pola salah akan ditiru semua fitur, review ketat. **Bukti 2 Nov 2026:** `npm test` 79/79 (16 kategori, 30 barang), typecheck dan build BE lulus, lint dan build FE lulus, tanpa drift DB dev/test, browser otomatis 31/31 (`PROJECT-CONTEXT.md` bagian 11). Penolakan hapus barang bertransaksi baru bisa diuji setelah tabel transaksi ada; hapus kategori yang dipakai barang sudah diuji (409). **Belum:** review developer, konfirmasi DEC-034 sampai DEC-036, pemeriksaan manual di DB dev |
| TASK-006 | Tahap 4: supplier mengikuti pola Tahap 3 | P2 | VERIFY | FE/BE/DB | TASK-005 | AC-03.1 sampai AC-03.3 untuk supplier; PRD FR-05.1; tanpa penyimpangan dari pola **Bukti 2 Nov 2026:** `suppliers.test.ts` 8/8, browser otomatis (tambah, ubah, nonaktif, supplier nonaktif tidak bisa dipilih). Izin hanya owner: DEC-037 USULAN. Belum: review developer. |
| TASK-007 | Tahap 5: ledger stok dan pembelian (stok masuk atomik, riwayat mutasi) | P1 | VERIFY | BE/DB/FE | TASK-006; P-05 (harga pokok); DEC-011, DEC-012; persetujuan schema. Retur pembelian di TASK-019 | AC-06.1 sampai AC-06.3 (AC-06.4: PRD FR-06.5 mengusulkan pembelian tidak dibatalkan, koreksi lewat retur/opname), PRD FR-06.x dan FR-08.1 sampai FR-08.3, AC-08.1 sampai AC-08.3; CHECK stok ≥ 0 aktif; test rollback, rekonsiliasi stok vs ledger, snapshot harga, otorisasi. Exit: stok masuk tidak mungkin tanpa mutasi **Bukti 2 Nov 2026:** `purchases.test.ts` 14/14 (konkurensi 8 pembelian serentak, rekonsiliasi stok vs ledger, semua-atau-tidak-sama-sekali, CHECK ledger, snapshot harga beli, hapus barang/supplier terpakai 409); kartu stok; browser otomatis. **Sengaja belum (DEC-038):** pembaruan `cost_price` (P-05), nomor dokumen (P-09), tanggal mundur (BR-10). Tidak ada uji rollback yang memaksa gagal di tengah transaksi setelah stok berubah; validasi barang/supplier terjadi sebelum penulisan. |
| TASK-008 | Tahap 6: penjualan (stok keluar atomik, riwayat, detail transaksi) | P1 | BACKLOG | BE/DB/FE | TASK-007; TASK-020 (audit_logs); TASK-021 bila penjualan dikaitkan pelanggan/resep; P-01, P-08, P-09, P-14; persetujuan perubahan kontrak harga (`PROJECT-CONTEXT.md` bagian 6) | AC-07.2 sampai AC-07.5, PRD FR-07.1 sampai FR-07.15 (AC-07.1 digantikan FR-07.3 setelah kontrak disetujui; void: FR-07.13); total selalu dihitung backend, apakah FE mengirim harga satuan menunggu persetujuan kontrak; test konkurensi stok terakhir, stok tak cukup, rollback, snapshot, total di backend, otorisasi, kirim ganda; semua test integritas lulus tanpa kecuali. **Tidak boleh dikerjakan** sebelum P-01, P-08, P-09, P-14 diputuskan |
| TASK-009 | Tahap 7: stock opname dengan penyesuaian tercatat | P2 | BACKLOG | BE/DB/FE | TASK-007; P-11 (stok awal lewat opname pertama) | AC-09.1 sampai AC-09.3, PRD FR-09.1 sampai FR-09.4; selisih → mutasi, stok sistem terekam, rekonsiliasi utuh; opname tak pernah menimpa stok langsung |
| TASK-010 | Tahap 8: isi dashboard dan laporan | P2 | BACKLOG | BE/FE | TASK-008; P-04 (stok menipis), P-05 (laba) | AC-10.1, AC-10.2, PRD FR-10.1 sampai FR-10.6 dan FR-02.1 (tampil di layar, tanpa ekspor); angka dihitung backend, batas hari zona waktu toko; agregat dibandingkan dengan data uji yang diketahui; bisa direkonsiliasi dengan transaksi sumber |
| TASK-011 | Tahap 9: hardening (Helmet/CSP/HSTS, `trust proxy`, rate limit umum, audit log, penanganan error production, backup terjadwal) | P1 | BACKLOG | BE/Ops | Tahap 2 sampai 8. Tabel audit log dan aksi inti dibuat lebih dulu di TASK-020; tahap ini melengkapi dan membahas pembatasan tambah-saja di database (ERD bagian 5) | Seluruh test akses tidak sah (`PROJECT-CONTEXT.md` bagian 7) lulus; audit log merekam aksi yang disepakati dengan owner; tinjauan keamanan selesai, temuan ditangani atau dicatat |
| TASK-012 | Tahap 10: landing page publik di `FE/src/Container/` | P3 | BLOCKED | FE | Isi dari owner (M-13); DITUNDA menurut PRD bagian 4.2 | AC-13.1, AC-13.2; hanya komponen yang dipakai; boleh paralel setelah Tahap 1 bila isi sudah ada |
| TASK-013 | Tahap 11: deployment dan serah terima | P1 | BLOCKED | Ops | Q-13 (P-16), DEC-014, DEC-015 | HTTPS aktif; variabel lingkungan di platform; **uji restore backup berhasil dan terdokumentasi**; akun hosting atas nama toko dengan 2FA; UAT dengan pegawai/owner; panduan deploy ulang dan restore. Verifikasi dulu: retensi backup, region, metode bayar, syarat komersial |
| TASK-014 | Perbaiki masalah logout: token tersalin tetap valid sampai 8 jam | P2 | BLOCKED | BE/DB | Persetujuan perubahan schema (kolom versi sesi di `users`) | Usulan: naikkan versi saat logout, cek di `requireAuth`; test token lama ditolak setelah logout |
| TASK-015 | Hapus `@fontsource-variable/montserrat` dari `FE/package.json` | P3 | BLOCKED | FE | Persetujuan dependency | `npm run build` FE lulus setelah dihapus |
| TASK-016 | Catat jawaban owner (kuesioner chat) dengan sumber tertulis, lalu ubah status requirement/Q terkait | P1 | DONE (hanya bagian "jawaban owner dicatat") | Docs | Bukti tertulis dari developer | Bukti: 17 jawaban tercatat di `.agents/docs/PRD.md` Lampiran A; status Q di Blockers dan modul di `PROJECT-CONTEXT.md` bagian 2 merujuk PRD bagian 10. **Tidak termasuk:** perubahan status DEC-016, 017, 018, 028 (tetap MENUNGGU, keputusan developer) dan persetujuan PRD. Catatan: `.agents/` di-ignore git, jadi bukti ini belum ter-commit |
| TASK-017 | Putuskan nasib `WhatsApp Image 2026-09-23 at 12.54.35.jpeg` di root repo (foto orang) | P2 | BLOCKED | Docs | Keputusan developer | Dipindahkan ke luar repo atau dipertahankan dengan sengaja; tidak dihapus tanpa persetujuan |
| TASK-018 | Ganti `FE/README.md` bawaan template Vite dengan README proyek | P3 | BACKLOG | Docs | Tidak ada | README berisi perintah yang terkonfirmasi (`PROJECT-CONTEXT.md` bagian 8) |
| TASK-019 | Tahap 5: retur pembelian ke supplier (M-14) | P2 | BLOCKED | BE/DB/FE | TASK-007; P-10 (penyelesaian retur); TASK-020; persetujuan schema | PRD FR-14.1, FR-14.2; jumlah retur tidak melebihi stok; stok keluar + mutasi `purchase_return_out` dalam satu transaksi; retur tercatat di audit log; test rollback, rekonsiliasi stok vs ledger, otorisasi (hanya owner) |
| TASK-020 | Tabel `audit_logs` dan pencatatan aksi inti, sebelum Tahap 6 (M-15) | P1 | VERIFY | BE/DB | Persetujuan schema dan migrasi; daftar aksi final dengan owner (Blockers) | PRD FR-15.1 sampai FR-15.3, ERD bagian 4.11 dan 9; tambah-saja; tanpa password, token, atau isi resep; hanya owner yang dapat melihat; test isi log dan otorisasi **Bukti 2 Nov 2026:** migrasi `create_audit_logs`; dicatat dalam transaksi yang sama: login, ubah harga jual/beli, buat/nonaktif/aktif/reset akun; `GET /api/audit-logs` hanya owner; halaman Log aktivitas; `audit-logs.test.ts` 6/6. Belum: daftar aksi final dengan owner; aksi void, diskon, penyesuaian stok, retur, koreksi resep menunggu fiturnya. |
| TASK-021 | Pelanggan dan resep (M-12, M-11), sebelum atau bersama Tahap 6 | P2 | BLOCKED | BE/DB/FE | P-07 (privasi data resep); TASK-020 (koreksi resep diaudit); persetujuan schema | PRD FR-12.1, FR-12.2, FR-11.1 sampai FR-11.3; resep baru tidak menimpa yang lama; data resep tidak muncul di log, nota, atau URL; test otorisasi. Garansi (P-06) dan pesanan lensa khusus (P-03) tidak termasuk |
| TASK-022 | Pengelolaan akun pegawai oleh owner (M-01) | P2 | VERIFY | BE/FE | Persetujuan TASK-003; TASK-020 (pembuatan, penonaktifan, reset akun diaudit) | PRD FR-01.6 sampai FR-01.9 (FR-01.9 USULAN); pegawai ditolak 403; password awal tidak ditulis di kode atau log, minimal 12 karakter (DEC-031); akun nonaktif langsung kehilangan akses (AC-01.4); test otorisasi **Bukti 2 Nov 2026:** `/api/users` hanya owner; buat akun (selalu pegawai), nonaktif/aktif (langsung memutus akses), reset password; akun owner tidak bisa diubah (DEC-037); `users.test.ts` 9/9; browser otomatis. Keterbatasan: reset password tidak memutus sesi aktif (TASK-014). |
| TASK-024 | Foto barang (PRD FR-03.4, FR-03.5) | P2 | BLOCKED | BE/FE | P-12 (penyimpanan menunggu hosting); kemungkinan butuh dependency upload (persetujuan) | Kolom `products.photo_path` sudah ada. Tipe dicek dari isi file, batas ukuran, nama acak, tidak dieksekusi; foto tampil di daftar, detail, dan pemilihan barang; test upload ditulis sebelum dibangun |
| TASK-025 | Kunci line ending file migrasi (`.gitattributes` `*.sql text eol=lf`) | P3 | BACKLOG | Repo | Persetujuan developer | Clone baru di Windows (`core.autocrlf=true`) tidak mengubah migrasi ke CRLF; `migrate status` tetap "up to date" |
| TASK-023 | Tanyakan P-01 dan P-02 ke owner, catat jawabannya | P1 | READY | Docs | Developer menghubungi owner | Jawaban P-01 (batas harga yang boleh diketik pegawai; diskon nominal atau persen) dan P-02 (lensa jadi per ukuran atau per model) dicatat dengan sumber di PRD; status P-01/P-02 dan dependensi TASK-005/TASK-008 diperbarui |

## Frontend tasks

| ID | Task | Priority | Status | Related modules | API dependency | Verification |
|---|---|---|---|---|---|---|
| FE-001 | Isi dashboard dari data backend (KPI, grafik, stok menipis) | P2 | BLOCKED | `pages/DashboardPage.tsx` | Endpoint laporan belum didesain (TASK-010) | Tidak memakai data dummy yang tampak nyata |
| FE-002 | `RoleRoute.tsx` untuk route berbasis role | P3 | DONE | `routes/RoleRoute.tsx` | Izin kategori DEC-034 (USULAN) | Dipakai untuk `/kategori`; pegawai diarahkan ke `/` (browser 2 Nov 2026) |
| FE-003 | Fungsi format Rupiah dan tanggal di `FE/src/utils/` | P2 | BACKLOG | `utils/format-currency.ts` (ada), `utils/format-date.ts` (belum) | Tidak ada | Rupiah selesai dan dipakai di daftar dan form barang (`Rp1.250.000`, browser 2 Nov 2026). Tanggal dibuat bersama halaman pertama yang menampilkan tanggal |
| FE-004 | Menyiapkan test FE | P3 | BACKLOG | FE | Persetujuan dependency | Belum ada test runner FE; keputusan terpisah |

## Backend tasks

| ID | Task | Priority | Status | Related modules | Contract / dependency | Verification |
|---|---|---|---|---|---|---|
| BE-001 | `validateQuery` dan `validateParams` | P2 | DONE | `middlewares/validate.middleware.ts` | TASK-005 | Dipakai route kategori/barang; test 400 untuk `status`, `page`, `pageSize`, `categoryId`, dan id bukan angka lulus (2 Nov 2026) |
| BE-002 | Kode error `INSUFFICIENT_STOCK` | P2 | BACKLOG | `constants/error.constants.ts` | Dipakai saat benar-benar dibutuhkan (TASK-007/008) | `CONFLICT` sudah ditambah di TASK-005. Ditambah ke `PROJECT-CONTEXT.md` bagian 6 |
| BE-003 | Benchmark biaya hash argon2 dan instalasi native addon di platform hosting | P2 | BACKLOG | `utils/password.ts` | Platform hosting dipilih (Q-13) | Hasil benchmark dicatat; parameter disesuaikan bila perlu |
| BE-004 | Nilai default dan maksimum `pageSize` | P2 | DONE | `FE/src/constants/pagination.constants.ts`, `BE/src/constants/catalog.constants.ts` | TASK-005 | Default 20, maksimum 100 (USULAN), dicatat di `PROJECT-CONTEXT.md` bagian 6; test default 20 dan 101 → 400 lulus |

## Client/API integration tasks

| ID | Task | Priority | Status | Endpoint/contract | FE status | BE status | End-to-end verification |
|---|---|---|---|---|---|---|---|
| INT-001 | Login, logout, me | P1 | VERIFY | `/api/auth/*` | implemented | implemented | HTTP via proxy Vite diverifikasi; browser otomatis dilaporkan lulus, manual belum (TASK-004) |
| INT-002 | Health | P3 | DONE | `GET /api/health` | n/a | implemented | Test `BE/tests/health.test.ts` dilaporkan lulus |
| INT-004 | Kategori dan barang | P1 | VERIFY | `/api/categories`, `/api/products` (`PROJECT-CONTEXT.md` bagian 6) | implemented | implemented | Integration test BE 46 kasus dan browser otomatis 31/31 lewat build produksi satu origin (2 Nov 2026); review developer belum |
| INT-005 | Supplier, pembelian, kartu stok, akun pegawai, log aktivitas | P1 | VERIFY | `/api/suppliers`, `/api/purchases`, `/api/products/:id/stock-movements`, `/api/users`, `/api/audit-logs` (`PROJECT-CONTEXT.md` bagian 6) | implemented | implemented | Integration test 37 kasus baru dan browser otomatis 19/19 lewat build produksi satu origin (2 Nov 2026); review developer belum |
| INT-003 | Endpoint domain lain (retur pembelian, penjualan, pelanggan, resep, opname, laporan) | P1 | BLOCKED | Belum didesain | pending | pending | Not designed; tambahkan kontrak di `PROJECT-CONTEXT.md` bagian 6 sebelum implementasi |

## Blockers and decisions needed

Pertanyaan dari dokumentasi awal (Q-xx) dan pertanyaan turunan PRD (P-xx). Jawaban owner atas kuesioner tercatat di `.agents/docs/PRD.md` Lampiran A; isi jawaban tidak disalin ke sini. Status Q: `OPEN`; `ANSWERED` = dijawab owner, dampak di PRD bagian 10; `PARTIAL` = sebagian dijawab, sisanya dilacak sebagai P-xx; `UNCLEAR` = jawaban tidak tegas, dilacak sebagai P-xx. Status keputusan DEC-016, 017, 018, 028 tidak berubah karena jawaban ini (`PROJECT-CONTEXT.md` bagian 9).

| Item | Impact | What is needed | Status |
|---|---|---|---|
| Q-01 Pemesanan lensa tidak ada di judul final | Modul, tabel, status, alur baru | Apakah toko menerima pesanan custom (lensa/resep)? Alurnya: DP, status, pengambilan? (Owner, dosen) | PARTIAL (PRD bagian 10; sisa P-03) |
| Q-02 Harga grosir | Model harga di produk dan penjualan; memblokir Tahap 6 | Cara harga grosir ditentukan dan siapa boleh mengubah (Owner) | ANSWERED (PRD bagian 10; lanjutan P-01) |
| Q-03 Matriks hak akses | RBAC, tampilan, audit | Apa yang boleh/tidak untuk owner vs pegawai: harga beli, void, opname, kelola user (Owner) | ANSWERED (PRD bagian 3 dan 10; lanjutan P-13) |
| Q-04 Data pelanggan | Tabel pelanggan, privasi | Apakah pelanggan dicatat, data apa, untuk apa (Owner) | ANSWERED (PRD bagian 10; lanjutan P-06, P-07) |
| Q-05 Pembatalan/retur penjualan | Alur void, mutasi pembalik | Boleh dibatalkan/diretur? Siapa berwenang, batas waktu (Owner) | ANSWERED (PRD bagian 10; lanjutan P-08) |
| Q-06 Persetujuan opname | Status dokumen opname | Siapa menyetujui penyesuaian, seberapa sering opname (Owner) | ANSWERED (PRD bagian 10) |
| Q-07 Retur pembelian ke supplier | Mutasi dan dokumen retur | Apakah ada retur ke supplier (Owner) | ANSWERED (PRD bagian 10; lanjutan P-10) |
| Q-08 Pembayaran tempo, hutang/piutang, metode bayar | Status dan tabel pembayaran | Ada tempo/cicilan? Metode bayar apa saja (Owner) | ANSWERED (PRD bagian 10; lanjutan P-14) |
| Q-09 Nomor invoice dan bukti transaksi | Format nomor, cetak/struk | Format nomor, perlu cetak, printer apa (Owner) | PARTIAL (PRD bagian 10; sisa P-09) |
| Q-10 Varian produk dan satuan | Model produk (frame, warna, ukuran, lensa); memblokir Tahap 3 | Pengelompokan barang, stok per varian, format SKU (Owner) | ANSWERED (PRD bagian 10; lanjutan P-02) |
| Q-11 Jenis laporan | Query, tampilan, ekspor | Laporan apa, periode, format (layar/PDF/Excel) (Owner, dosen) | ANSWERED (PRD bagian 10; lanjutan P-05) |
| Q-12 Judul final tidak memuat pembelian/pemesanan | Konsistensi scope laporan KP | Apakah judul dan scope selaras menurut dosen (Dosen) | OPEN (P-15) |
| Q-13 Hosting | Biaya, backup, region | Siapa membayar dan dengan metode apa, budget bulanan (Owner) | OPEN (P-16) |
| Q-14 Stok menipis | Ambang per produk atau global | Cara menentukan batas minimum (Owner) | UNCLEAR (PRD bagian 10; dilacak P-04) |
| Q-15 Foto produk | Keamanan upload, penyimpanan file | Apakah produk perlu foto (Owner) | ANSWERED (PRD bagian 10; lanjutan P-12) |
| Q-16 Pengguna dan perangkat | Prioritas responsivitas, kapasitas | Jumlah pengguna dan perangkat di toko (Owner) | ANSWERED (PRD bagian 10) |
| Q-17 Diskon dan pajak | Perhitungan total di backend | Ada diskon per item/transaksi atau pajak (Owner) | ANSWERED (PRD bagian 10; lanjutan P-01) |
| Daftar aksi yang diaudit | Cakupan audit log (TASK-020) | Konfirmasi usulan PRD FR-15.1 dengan owner | OPEN |
| Persetujuan schema untuk Tahap 3 | Memblokir TASK-005 | Developer menyetujui perubahan `schema.prisma` dan migrasi setelah P-02; rancangan di ERD bagian 9 | RESOLVED (disetujui developer di chat 2 Nov 2026: migrasi `20261102090000_create_categories_products`, diterapkan ke DB dev dan test) |
| DEC-034 Izin katalog | Siapa boleh kelola kategori dan hapus barang | Developer/owner mengonfirmasi usulan di `PROJECT-CONTEXT.md` bagian 9 | OPEN |
| DEC-035 SKU dari sequence database | Format dan cara pembuatan SKU | Developer mengonfirmasi | OPEN |
| DEC-036 Hapus vs nonaktif | Kapan data boleh dihapus permanen | Developer mengonfirmasi | OPEN |
| DEC-037 Izin supplier dan akun | Supplier hanya owner; akun owner tidak dikelola lewat API | Developer mengonfirmasi | OPEN |
| DEC-038 Aturan pembelian | Tanggal = waktu catat, tanpa nomor dokumen, harga beli barang tidak otomatis | Developer mengonfirmasi (terkait P-05, P-09, BR-10) | OPEN |
| Review PRD dan ERD (DRAFT 0.1.0, USULAN) | Requirement berlabel OWNER/USULAN belum disahkan; ERD belum boleh dijadikan schema | Developer mereview dan menyetujui atau mengoreksi | OPEN |
| Perubahan kontrak "FE tidak mengirim harga" | AC-07.1, TASK-008, `PROJECT-CONTEXT.md` bagian 6 | Persetujuan developer atas usulan PRD FR-07.2 sampai FR-07.4 | OPEN |
| `.agents/` di `.gitignore` | PADS, PRD, dan ERD tidak ter-commit; dokumen ter-commit merujuk ke berkas yang tidak ada di clone baru | Keputusan developer: track `.agents/` atau tetap lokal | OPEN |

### Pertanyaan turunan PRD (P-xx)

Rincian, usulan penyusun, dan konteks: PRD bagian 9. Semua `OPEN`.

| ID | Masalah | Tahap yang diblokir |
|---|---|---|
| P-01 | Harga yang boleh diketik pegawai bertabrakan dengan aturan diskon hanya oleh owner; bentuk diskon (nominal/persen) belum ditentukan | Tahap 6 (TASK-008); ditanyakan lewat TASK-023 |
| P-02 | Belum jelas apakah lensa jadi dicatat per ukuran dioptri atau per model | Tahap 3 untuk lensa jadi (TASK-005); ditanyakan lewat TASK-023 |
| P-03 | Belum pasti apakah ada lensa yang dipesan ke pihak lain (DP, status, pengambilan) | Modul pesanan lensa (belum ada task) |
| P-04 | Ambang stok menipis tidak dipilih owner | Tahap 8, peringatan (TASK-010) |
| P-05 | Definisi laba rugi (laba kotor) dan metode harga pokok belum diputuskan | Tahap 5 dan 8 (TASK-007, TASK-010) |
| P-06 | Masa garansi dan pencatatan klaim garansi belum jelas | Tidak memblokir |
| P-07 | Persetujuan pelanggan, retensi, akses, dan penghapusan data resep belum ditetapkan | Pelanggan dan resep (TASK-021) |
| P-08 | Batas void "3 hari" (72 jam atau hari kalender) dan pengembalian uang belum jelas | Tahap 6 (TASK-008) |
| P-09 | Format nomor nota dan kebutuhan barcode belum ditetapkan | Tahap 6 (TASK-008) |
| P-10 | Penyelesaian retur ke supplier (uang kembali, kredit, tukar) belum jelas | Tahap 5, retur (TASK-019) |
| P-11 | Cara memasukkan stok awal tanpa mengubah stok langsung belum disetujui | Tahap 3/7 (TASK-005, TASK-009) |
| P-12 | Penyimpanan foto bergantung pada hosting yang belum dipilih | Foto produk (bagian TASK-005) |
| P-13 | Perlu konfirmasi bahwa pegawai memang boleh melihat harga beli | Tidak memblokir |
| P-14 | Pembayaran campuran dan kembalian tunai belum dijawab | Tahap 6 (TASK-008) |
| P-15 | Resep dan laba rugi diminta padahal "rekam medis" dan "akuntansi" sebelumnya dikeluarkan; judul hanya "Penjualan" (Q-12) | Laporan KP (konfirmasi dosen) |
| P-16 | Hosting, biaya, dan backup belum dijawab (Q-13) | Tahap 11 (TASK-013) |

## Recently completed

| ID | Outcome | Verification evidence | Date/context |
|---|---|---|---|
| TASK-001 | Audit repo dan rekonsiliasi dokumentasi | Versi dari `package.json`; keputusan tercatat | 24 Okt 2026 (dokumen lama) |
| TASK-002 | Fondasi BE/FE | Test health dan format error dilaporkan lulus | 24 Okt 2026 (dokumen lama) |
| — | Shell dashboard (layout, sidebar, header, token warna, tema Light/Dark; DEC-023, DEC-024, DEC-033) | Chrome headless 50/50 dilaporkan (kontras, keyboard, responsif, tema, state error/loading); kode ter-commit di 1b26217 | 1 Nov 2026; belum ada test FE di repo |
| BE-001, BE-004, FE-002 | `validateQuery`/`validateParams`, default/maks `pageSize`, `RoleRoute` | Test BE 79/79 dan browser otomatis 31/31 | 2 Nov 2026, bagian dari TASK-005 |
| TASK-016 | Jawaban owner atas kuesioner dicatat (bagian pencatatan saja; status DEC tidak berubah) | `.agents/docs/PRD.md` Lampiran A; status Q di Blockers merujuk PRD bagian 10 | 2 Nov 2026; `.agents/` di-ignore git |
| — | Adopsi PADS dan rekonsiliasi dokumentasi: file PADS dipindah ke root, 12 dokumen lama dihapus, rujukan komentar kode diarahkan ke `PROJECT-CONTEXT.md`, fakta yang hilang dipulihkan | Hanya dokumentasi dan komentar kode berubah; pemeriksaan di `PROJECT-CONTEXT.md` bagian 11 | 2 Nov 2026 |

## Rules for updating

- Buat task dengan hasil yang jelas, bukan entri samar seperti "perbaiki kode".
- Pecah pekerjaan menurut hasil yang dapat diverifikasi sendiri.
- Catat dependensi dan blocker secara eksplisit; gunakan `VERIFY` bila implementasi ada tetapi verifikasi belum lengkap.
- Untuk pekerjaan API, bedakan `contract proposed`, `backend pending`, `frontend pending`, `implemented`, `verified`.
- Sertakan perintah, nama test, atau bukti verifikasi nyata. Jangan menulis tanggal, pemilik, hasil, atau status penyelesaian yang tidak ada dasarnya.
- Fokus pada pekerjaan saat ini dan yang baru selesai; jangan menjadi transkrip sesi.
