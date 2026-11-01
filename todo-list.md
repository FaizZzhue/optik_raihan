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

- **Milestone:** Tahap 2 (Authentication dan RBAC) menunggu persetujuan developer; Tahap 3 (kategori dan produk) berikutnya.
- **Goal:** fondasi dan auth terverifikasi di browser, lalu pola acuan CRUD end-to-end pada kategori dan produk.
- **Target date (if applicable):** tidak ada dasar tanggal; tidak ditetapkan.
- **Last updated:** 2 November 2026 (rekonsiliasi dokumentasi setelah adopsi PADS; hasil pemeriksaan di `PROJECT-CONTEXT.md` bagian 11).

## Aturan pengerjaan tahap (dari proyek ini)

- Vertical slice: tiap tahap menghasilkan fitur utuh dari database sampai UI yang bisa diuji. **Satu tahap pada satu waktu**; tahap berikutnya tidak dimulai sebelum exit criteria tahap sebelumnya terpenuhi dan developer menyetujui.
- Tahap yang bergantung pada requirement `NEEDS_CONFIRMATION` diblokir sampai pertanyaan terkait dijawab. Pemesanan lensa dan pelanggan tidak ada dalam rencana sampai Q-01 dan Q-04 dijawab.
- Perubahan `schema.prisma`, migrasi, dependency baru, dan perubahan struktur memerlukan persetujuan eksplisit.
- **Definition of Done (semua tahap):** acceptance criteria tahap terpenuhi; kode sesuai konvensi `PROJECT-CONTEXT.md` bagian 4 dan `standards/QUALITY-GATES.md`; test yang dipersyaratkan ditulis **dan benar-benar dijalankan** dengan output asli dilaporkan; tidak ada dependency/schema/struktur berubah tanpa persetujuan; `PROJECT-CONTEXT.md` (kontrak, data, keputusan) dan todo ini diperbarui; tidak ada secret/data pribadi di kode; developer sudah mereview dan menyetujui.
- **Jika tahap gagal:** hentikan; laporkan apa adanya (gejala, pesan error, yang sudah dicoba); cari akar masalah sebelum memperbaiki; bila menyentuh struktur/keputusan ikuti prosedur perubahan dan catat di `PROJECT-CONTEXT.md` bagian 9; bila test integritas gagal perbaiki kode, bukan test; tahap selesai hanya bila exit criteria terpenuhi, bukan karena "hampir".
- Estimasi waktu tidak dicantumkan karena tidak ada dasar yang valid.
- Jika waktu KP terbatas: prioritaskan Tahap 1 sampai 6; laporan dan dashboard dibuat sederhana dahulu (rencana dokumen lama, `git show 1b26217:IMPLEMENTATION_PLAN.md`).

## Tasks

| ID | Task / outcome | Priority | Status | Area | Dependencies | Acceptance criteria / verification |
|---|---|---|---|---|---|---|
| TASK-001 | Tahap 0: audit repo dan rekonsiliasi dokumentasi | P1 | DONE | Docs | Tidak ada | Versi dependency terverifikasi dari `package.json`; keputusan DEC-004, DEC-013, DEC-019 diputuskan. Sisa pertanyaan Q-01, Q-02, Q-03, Q-10, Q-12 masih terbuka (lihat Blockers) |
| TASK-002 | Tahap 1: fondasi (config tervalidasi, error terpusat, health, koneksi Prisma, kerangka test, FE via proxy) | P1 | DONE | BE/FE | TASK-001 | Integration test health dan format error lulus (dilaporkan 24 Okt 2026) |
| TASK-003 | Tahap 2: authentication dan RBAC (login/logout/me, proteksi route BE dan FE) | P1 | VERIFY | BE/FE | DEC-013 | `npm test` 33/33 lulus dua kali (dilaporkan 1 Nov 2026); HTTP via proxy diverifikasi. Sisa: pemeriksaan browser manual developer (TASK-004), cookie `Secure` di HTTPS, seed owner, persetujuan developer; matriks izin menunggu Q-03 |
| TASK-004 | Verifikasi auth di browser: cookie tak terbaca JS, reload memulihkan sesi, redirect saat 401, logout | P1 | VERIFY | FE | TASK-003 | Otomatis: Chrome headless (skrip CDP di luar repo, build production + BE pada DB test) dilaporkan lulus 1 Nov 2026; tidak diulang. Sisa: developer mengulang secara manual di browser dengan akun hasil seed dan mencatat hasilnya |
| TASK-005 | Tahap 3: CRUD kategori dan produk end-to-end sebagai **pola acuan** | P1 | BLOCKED | FE/BE/DB | Q-10; persetujuan schema dan migrasi; persetujuan TASK-003 | AC-03.1 sampai AC-03.4; pagination dan pencarian server-side; state loading/empty/error; integration test CRUD, validasi, otorisasi, penolakan hapus produk bertransaksi; developer dapat menjelaskan alur Page → Hook → Service → Axios → Route → Controller → Service → Prisma. Risiko: pola salah akan ditiru semua fitur, review ketat |
| TASK-006 | Tahap 4: supplier mengikuti pola Tahap 3 | P2 | BACKLOG | FE/BE/DB | TASK-005 | AC-03.1 sampai AC-03.3 untuk supplier; tanpa penyimpangan dari pola |
| TASK-007 | Tahap 5: ledger stok dan pembelian (stok masuk atomik, riwayat mutasi) | P1 | BACKLOG | BE/DB/FE | TASK-006; Q-07, Q-08, Q-09 (sebagian); DEC-011, DEC-012 | AC-06.1 sampai AC-06.4 (pembatalan hanya bila Q-07), AC-08.1 sampai AC-08.3; CHECK stok ≥ 0 aktif; test rollback, rekonsiliasi stok vs ledger, snapshot harga, otorisasi. Exit: stok masuk tidak mungkin tanpa mutasi |
| TASK-008 | Tahap 6: penjualan (stok keluar atomik, riwayat, detail transaksi) | P1 | BACKLOG | BE/DB/FE | TASK-007; Q-02, Q-05, Q-08, Q-09, Q-17 | AC-07.1 sampai AC-07.5 (AC-07.6 bila Q-05); FE tidak mengirim harga/total; test konkurensi stok terakhir, stok tak cukup, rollback, snapshot, total di backend, otorisasi, kirim ganda; semua test integritas lulus tanpa kecuali. **Tidak boleh dikerjakan** sebelum model harga dan nomor transaksi jelas |
| TASK-009 | Tahap 7: stock opname dengan penyesuaian tercatat | P2 | BACKLOG | BE/DB/FE | TASK-007; Q-06 | AC-09.1 sampai AC-09.3; selisih → mutasi, stok sistem terekam, rekonsiliasi utuh; opname tak pernah menimpa stok langsung |
| TASK-010 | Tahap 8: isi dashboard dan laporan | P2 | BACKLOG | BE/FE | TASK-008; Q-11, Q-14 | AC-10.1, AC-10.2; angka dihitung backend, batas hari zona waktu toko; agregat dibandingkan dengan data uji yang diketahui; bisa direkonsiliasi dengan transaksi sumber |
| TASK-011 | Tahap 9: hardening (Helmet/CSP/HSTS, `trust proxy`, rate limit umum, audit log, penanganan error production, backup terjadwal) | P1 | BACKLOG | BE/Ops | Tahap 2 sampai 8 | Seluruh test akses tidak sah (`PROJECT-CONTEXT.md` bagian 7) lulus; audit log merekam aksi yang disepakati dengan owner; tinjauan keamanan selesai, temuan ditangani atau dicatat |
| TASK-012 | Tahap 10: landing page publik di `FE/src/Container/` | P3 | BLOCKED | FE | Isi dari owner (M-13) | AC-13.1, AC-13.2; hanya komponen yang dipakai; boleh paralel setelah Tahap 1 bila isi sudah ada |
| TASK-013 | Tahap 11: deployment dan serah terima | P1 | BLOCKED | Ops | Q-13, DEC-014, DEC-015 | HTTPS aktif; variabel lingkungan di platform; **uji restore backup berhasil dan terdokumentasi**; akun hosting atas nama toko dengan 2FA; UAT dengan pegawai/owner; panduan deploy ulang dan restore. Verifikasi dulu: retensi backup, region, metode bayar, syarat komersial |
| TASK-014 | Perbaiki masalah logout: token tersalin tetap valid sampai 8 jam | P2 | BLOCKED | BE/DB | Persetujuan perubahan schema (kolom versi sesi di `users`) | Usulan: naikkan versi saat logout, cek di `requireAuth`; test token lama ditolak setelah logout |
| TASK-015 | Hapus `@fontsource-variable/montserrat` dari `FE/package.json` | P3 | BLOCKED | FE | Persetujuan dependency | `npm run build` FE lulus setelah dihapus |
| TASK-016 | Catat jawaban owner (kuesioner chat) ke `PROJECT-CONTEXT.md` dengan sumber tertulis, lalu ubah status requirement/Q terkait | P1 | READY | Docs | Bukti tertulis dari developer | Q yang terjawab berpindah dari MENUNGGU ke CONFIRMED di bagian 2 dan 9 dengan rujukan sumber; tidak ada klaim persetujuan tanpa bukti |
| TASK-017 | Putuskan nasib `WhatsApp Image 2026-09-23 at 12.54.35.jpeg` di root repo (foto orang) | P2 | BLOCKED | Docs | Keputusan developer | Dipindahkan ke luar repo atau dipertahankan dengan sengaja; tidak dihapus tanpa persetujuan |
| TASK-018 | Ganti `FE/README.md` bawaan template Vite dengan README proyek | P3 | BACKLOG | Docs | Tidak ada | README berisi perintah yang terkonfirmasi (`PROJECT-CONTEXT.md` bagian 8) |

## Frontend tasks

| ID | Task | Priority | Status | Related modules | API dependency | Verification |
|---|---|---|---|---|---|---|
| FE-001 | Isi dashboard dari data backend (KPI, grafik, stok menipis) | P2 | BLOCKED | `pages/DashboardPage.tsx` | Endpoint laporan belum didesain (TASK-010) | Tidak memakai data dummy yang tampak nyata |
| FE-002 | `RoleRoute.tsx` untuk route berbasis role | P3 | BLOCKED | `routes/` | Matriks izin (Q-03) | Dibuat saat ada route yang butuh role tertentu |
| FE-003 | Fungsi format Rupiah dan tanggal di `FE/src/utils/` | P2 | BACKLOG | `utils/format-currency.ts`, `utils/format-date.ts` | Tidak ada | Dibuat bersama halaman pertama yang menampilkan uang/tanggal; satu format di seluruh aplikasi |
| FE-004 | Menyiapkan test FE | P3 | BACKLOG | FE | Persetujuan dependency | Belum ada test runner FE; keputusan terpisah |

## Backend tasks

| ID | Task | Priority | Status | Related modules | Contract / dependency | Verification |
|---|---|---|---|---|---|---|
| BE-001 | `validateQuery` dan `validateParams` | P2 | BACKLOG | `middlewares/validate.middleware.ts` | Route pertama yang butuh query/params (TASK-005) | Test validasi 400 per field |
| BE-002 | Kode error `CONFLICT` dan `INSUFFICIENT_STOCK` | P2 | BACKLOG | `constants/error.constants.ts` | Dipakai saat benar-benar dibutuhkan (TASK-007/008) | Ditambah ke `PROJECT-CONTEXT.md` bagian 6 |
| BE-003 | Benchmark biaya hash argon2 dan instalasi native addon di platform hosting | P2 | BACKLOG | `utils/password.ts` | Platform hosting dipilih (Q-13) | Hasil benchmark dicatat; parameter disesuaikan bila perlu |
| BE-004 | Nilai default dan maksimum `pageSize` | P2 | BACKLOG | `FE/constants/pagination.constants.ts`, config BE | TASK-005 | Dicatat sekali dan konsisten FE-BE |

## Client/API integration tasks

| ID | Task | Priority | Status | Endpoint/contract | FE status | BE status | End-to-end verification |
|---|---|---|---|---|---|---|---|
| INT-001 | Login, logout, me | P1 | VERIFY | `/api/auth/*` | implemented | implemented | HTTP via proxy Vite diverifikasi; browser otomatis dilaporkan lulus, manual belum (TASK-004) |
| INT-002 | Health | P3 | DONE | `GET /api/health` | n/a | implemented | Test `BE/tests/health.test.ts` dilaporkan lulus |
| INT-003 | Endpoint domain (produk, kategori, supplier, pembelian, penjualan, opname, laporan) | P1 | BLOCKED | Belum didesain | pending | pending | Not designed; tambahkan kontrak di `PROJECT-CONTEXT.md` bagian 6 sebelum implementasi |

## Blockers and decisions needed

Pertanyaan terbuka dari dokumentasi awal. Jawaban owner yang sudah diterima developer lewat chat belum tercatat di repo (TASK-016); sampai dicatat dengan bukti tertulis, statusnya tetap MENUNGGU di sini.

| Item | Impact | What is needed | Status |
|---|---|---|---|
| Q-01 Pemesanan lensa tidak ada di judul final | Modul, tabel, status, alur baru | Apakah toko menerima pesanan custom (lensa/resep)? Alurnya: DP, status, pengambilan? (Owner, dosen) | OPEN |
| Q-02 Harga grosir | Model harga di produk dan penjualan; memblokir Tahap 6 | Cara harga grosir ditentukan dan siapa boleh mengubah (Owner) | OPEN |
| Q-03 Matriks hak akses | RBAC, tampilan, audit | Apa yang boleh/tidak untuk owner vs pegawai: harga beli, void, opname, kelola user (Owner) | OPEN |
| Q-04 Data pelanggan | Tabel pelanggan, privasi | Apakah pelanggan dicatat, data apa, untuk apa (Owner) | OPEN |
| Q-05 Pembatalan/retur penjualan | Alur void, mutasi pembalik | Boleh dibatalkan/diretur? Siapa berwenang, batas waktu (Owner) | OPEN |
| Q-06 Persetujuan opname | Status dokumen opname | Siapa menyetujui penyesuaian, seberapa sering opname (Owner) | OPEN |
| Q-07 Retur pembelian ke supplier | Mutasi dan dokumen retur | Apakah ada retur ke supplier (Owner) | OPEN |
| Q-08 Pembayaran tempo, hutang/piutang, metode bayar | Status dan tabel pembayaran | Ada tempo/cicilan? Metode bayar apa saja (Owner) | OPEN |
| Q-09 Nomor invoice dan bukti transaksi | Format nomor, cetak/struk | Format nomor, perlu cetak, printer apa (Owner) | OPEN |
| Q-10 Varian produk dan satuan | Model produk (frame, warna, ukuran, lensa); memblokir Tahap 3 | Pengelompokan barang, stok per varian, format SKU (Owner) | OPEN |
| Q-11 Jenis laporan | Query, tampilan, ekspor | Laporan apa, periode, format (layar/PDF/Excel) (Owner, dosen) | OPEN |
| Q-12 Judul final tidak memuat pembelian/pemesanan | Konsistensi scope laporan KP | Apakah judul dan scope selaras menurut dosen (Dosen) | OPEN |
| Q-13 Hosting | Biaya, backup, region | Siapa membayar dan dengan metode apa, budget bulanan (Owner) | OPEN |
| Q-14 Stok menipis | Ambang per produk atau global | Cara menentukan batas minimum (Owner) | OPEN |
| Q-15 Foto produk | Keamanan upload, penyimpanan file | Apakah produk perlu foto (Owner) | OPEN |
| Q-16 Pengguna dan perangkat | Prioritas responsivitas, kapasitas | Jumlah pengguna dan perangkat di toko (Owner) | OPEN |
| Q-17 Diskon dan pajak | Perhitungan total di backend | Ada diskon per item/transaksi atau pajak (Owner) | OPEN |
| Daftar aksi yang diaudit | Cakupan audit log | Konfirmasi dengan owner | OPEN |
| Persetujuan schema untuk Tahap 3 | Memblokir TASK-005 | Developer menyetujui perubahan `schema.prisma` dan migrasi setelah Q-10 | OPEN |

## Recently completed

| ID | Outcome | Verification evidence | Date/context |
|---|---|---|---|
| TASK-001 | Audit repo dan rekonsiliasi dokumentasi | Versi dari `package.json`; keputusan tercatat | 24 Okt 2026 (dokumen lama) |
| TASK-002 | Fondasi BE/FE | Test health dan format error dilaporkan lulus | 24 Okt 2026 (dokumen lama) |
| — | Shell dashboard (layout, sidebar, header, token warna, tema Light/Dark; DEC-023, DEC-024, DEC-033) | Chrome headless 50/50 dilaporkan (kontras, keyboard, responsif, tema, state error/loading); kode ter-commit di 1b26217 | 1 Nov 2026; belum ada test FE di repo |
| — | Adopsi PADS dan rekonsiliasi dokumentasi: file PADS dipindah ke root, 12 dokumen lama dihapus, rujukan komentar kode diarahkan ke `PROJECT-CONTEXT.md`, fakta yang hilang dipulihkan | Hanya dokumentasi dan komentar kode berubah; pemeriksaan di `PROJECT-CONTEXT.md` bagian 11 | 2 Nov 2026 |

## Rules for updating

- Buat task dengan hasil yang jelas, bukan entri samar seperti "perbaiki kode".
- Pecah pekerjaan menurut hasil yang dapat diverifikasi sendiri.
- Catat dependensi dan blocker secara eksplisit; gunakan `VERIFY` bila implementasi ada tetapi verifikasi belum lengkap.
- Untuk pekerjaan API, bedakan `contract proposed`, `backend pending`, `frontend pending`, `implemented`, `verified`.
- Sertakan perintah, nama test, atau bukti verifikasi nyata. Jangan menulis tanggal, pemilik, hasil, atau status penyelesaian yang tidak ada dasarnya.
- Fokus pada pekerjaan saat ini dan yang baru selesai; jangan menjadi transkrip sesi.
