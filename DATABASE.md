# DATABASE — KP Optik Raihan

> **Tujuan:** aturan desain database dan integritas data (khususnya stok dan transaksi).
> **Status:** DRAFT, menunggu review developer
> **Versi:** 0.1.0
> **Tanggal penyusunan:** 22 Oktober 2026
> **Ruang lingkup:** prinsip dan model **konseptual**. Dokumen ini **bukan schema final** dan tidak memuat field bisnis yang belum dikonfirmasi.
> **Referensi:** `REQUIREMENTS.md`, `API_CONTRACT.md`, `ARCHITECTURE.md`, `SECURITY.md`, `DECISIONS.md` (DEC-004, DEC-011, DEC-012, DEC-015)

**Status implementasi:** belum ada `schema.prisma` yang bisa diperiksa (repository kosong). Semua isi di bawah adalah **rekomendasi desain**, bukan deskripsi schema yang sudah diterapkan. Perilaku Prisma yang disebut di sini harus diverifikasi terhadap versi yang terpasang (target v7, DEC-004).

## 1. Teknologi

- PostgreSQL sebagai database (DEC-003). Prisma ORM sebagai akses data (DEC-004).
- Prisma 7 mewajibkan driver adapter untuk membuat client, dan konfigurasi CLI berada di `prisma.config.ts` pada root project BE (DEC-019). Ikuti dokumentasi resmi untuk versi terpasang.
- Satu instance `PrismaClient` di `BE/src/lib/prisma.ts`. Hanya service yang memakainya.
- Prisma melindungi dari SQL injection lewat query terparameter. Jika `$queryRaw` dipakai, gunakan bentuk terparameter, tidak pernah menyambung string dari input pengguna (`SECURITY.md`).

## 2. Konvensi schema dan migrasi

- Nama model PascalCase tunggal di Prisma, dipetakan ke tabel snake_case jamak (`@@map`). Pola pemetaan ditetapkan sekali dan konsisten.
- Nama field camelCase di Prisma, kolom snake_case di database (`@map`).
- Semua tabel punya `createdAt`, `updatedAt`. Tabel transaksi dan master yang penting mencatat pelaku (`createdById`).
- Primary key: jenis (UUID atau integer auto-increment) **belum diputuskan**. Tentukan sekali sebelum schema pertama dan catat di `DECISIONS.md`.
- Migrasi: satu perubahan logis per migrasi, dengan nama deskriptif. Migrasi yang sudah dipakai di lingkungan bersama tidak diedit, buat migrasi baru.
- Migrasi dijalankan **hanya dengan persetujuan** (`../CLAUDE.md` bagian 9). Di produksi gunakan perintah deploy migrasi, bukan perintah development.
- Constraint yang tidak bisa ditulis di `schema.prisma` (misalnya CHECK) ditambahkan manual di SQL migrasi dan dicatat di dokumen ini.
- Tidak ada perubahan schema untuk requirement berstatus `NEEDS_CONFIRMATION`.

## 3. Model konseptual (kandidat, belum final)

| Entitas konseptual | Tujuan | Terkait requirement |
|---|---|---|
| User | Akun dengan role dan status aktif | M-01 |
| Category | Pengelompokan produk | M-04 |
| Product | Barang yang dijual, termasuk stok saat ini | M-03 (struktur: Q-10) |
| Supplier | Pemasok | M-05 |
| Purchase, PurchaseItem | Dokumen pembelian dan barisnya | M-06 |
| Sale, SaleItem | Dokumen penjualan dan barisnya | M-07 |
| StockMovement | Ledger setiap perubahan stok | M-08 |
| StockOpname, StockOpnameItem | Perbandingan stok fisik vs sistem | M-09 |
| AuditLog | Jejak aksi penting | NFR-03 |

Tidak ada entitas untuk pemesanan lensa atau pelanggan sampai Q-01 dan Q-04 dijawab. Field spesifik tiap entitas ditentukan setelah requirement terkait `CONFIRMED`.

## 4. Relasi, foreign key, dan constraint

- Semua relasi memakai foreign key sungguhan.
- Penghapusan data master yang sudah dipakai transaksi **ditolak** (`ON DELETE RESTRICT` atau setara). Gunakan nonaktif/arsip untuk menyembunyikannya.
- Tabel transaksi (penjualan, pembelian, mutasi, opname, audit) tidak dihapus permanen.
- **Unique constraint** pada identitas bisnis: SKU/kode produk, nomor transaksi, username/email. Aturan format menunggu Q-09 dan Q-10.
- **CHECK constraint** (ditulis manual di SQL migrasi):
  - stok produk ≥ 0,
  - jumlah item transaksi > 0,
  - harga dan nilai uang ≥ 0.
  CHECK adalah lapis pengaman terakhir. Validasi utama tetap di service.
- Kolom wajib `NOT NULL` kecuali ada alasan bisnis.

## 5. Indeks

Dibuat berdasarkan query nyata, bukan menebak. Kandidat:

- Pencarian produk (nama, SKU) dan filter kategori.
- Transaksi berdasarkan tanggal dan status (laporan).
- Mutasi stok berdasarkan produk dan waktu.
- Foreign key yang sering dipakai join.

Setiap indeks punya biaya tulis. Tambahkan setelah ada query yang lambat atau pola akses yang jelas.

## 6. Uang

- Simpan sebagai `Decimal` (kolom `NUMERIC` di PostgreSQL), **bukan** `Float`. Jangan memakai `Int` 32-bit karena total agregat (misalnya penjualan grosir sebulan) dapat melebihi sekitar 2,1 miliar.
- Presisi dan skala ditentukan eksplisit (`@db.Decimal(p, s)`). Nilai pasti menunggu Q-17 (pajak, diskon) dan kebutuhan pecahan rupiah.
- Perhitungan total dilakukan di backend dengan tipe Decimal, tidak dengan `number` JavaScript.
- Tiga hal ini harus selaras: tipe kolom, tipe di service, dan serialisasi di API.

### Serialisasi ke DTO

- Prisma mengembalikan `Decimal` sebagai objek. Di DTO, nilai uang dikirim sebagai **string desimal** (contoh `"1250000.00"`), bukan `number`. Aturan lengkap: `API_CONTRACT.md` bagian 7.
- Konversi dilakukan di service (fungsi mapping ke DTO), bukan di controller atau FE.
- Tanggal dikirim sebagai string ISO 8601 UTC.

## 7. Waktu

- Simpan timestamp dalam UTC. Cek tipe kolom yang dihasilkan Prisma untuk `DateTime` pada versi terpasang. Pertimbangkan tipe berzona waktu (`timestamptz`) agar tidak ambigu.
- Tampilan memakai zona waktu operasional toko (WIB sebagai kandidat, perlu konfirmasi).
- "Hari" pada laporan harian mengikuti zona waktu toko, bukan UTC. Konversi batas hari dilakukan di backend.

## 8. Model stok dan mutasi stok

### 8.1 Pendekatan yang direkomendasikan (DEC-012, PROPOSED)

- Setiap produk menyimpan **stok saat ini** (untuk baca cepat).
- Setiap perubahan stok **wajib** menghasilkan satu baris **StockMovement** (ledger) dengan: produk, perubahan jumlah (+/-), jenis, dokumen asal (pembelian, penjualan, opname, pembatalan), waktu, pelaku, dan catatan bila perlu.
- **Invarian:** stok saat ini = total perubahan pada ledger. Invarian ini harus bisa dicek (query rekonsiliasi) dan diuji.
- Tidak ada kode yang mengubah stok tanpa menulis mutasi. Tidak ada endpoint "set stok" langsung.

### 8.2 Jenis mutasi (kandidat, belum final)

Stok masuk dari pembelian, stok keluar dari penjualan, penyesuaian dari opname, serta pembalikan akibat pembatalan. Daftar final menunggu Q-05, Q-06, Q-07.

### 8.3 Snapshot harga

Item transaksi menyimpan harga satuan **saat transaksi terjadi** (harga beli pada pembelian, harga jual pada penjualan). Mengubah harga produk di kemudian hari tidak mengubah transaksi lama. Nilai total transaksi disimpan agar laporan lama stabil.

## 9. Transaksi atomik

### 9.1 Mengapa harus atomik

Satu penjualan mengubah beberapa hal: dokumen penjualan, item, stok produk, dan mutasi stok. Jika proses terputus di tengah (error, timeout, koneksi putus), tanpa atomisitas data menjadi tidak konsisten: penjualan tercatat tetapi stok tidak berkurang, atau sebaliknya. Ini persis masalah yang ingin dihapus. Atomik berarti semua perubahan berhasil bersama atau batal bersama.

Hal yang sama berlaku untuk pembelian, pembatalan, dan penyesuaian opname.

### 9.2 Mengapa validasi frontend tidak cukup

- Stok di layar adalah salinan lama. Dua pegawai dapat melihat "stok tersisa 1" dan sama-sama menjual.
- Request dapat dikirim langsung ke API tanpa lewat UI.
- Payload (harga, total) dapat dimanipulasi dari browser.
- Browser tidak bisa menjamin penulisan multi-baris yang atomik.

### 9.3 Pola implementasi

- Semua langkah satu operasi bisnis dijalankan di dalam **satu transaksi Prisma** pada service (bukan controller).
- Pengurangan stok memakai **update bersyarat atomik**: kurangi stok hanya bila stok ≥ jumlah diminta. Bentuk konseptual:
  `UPDATE produk SET stok = stok - :qty WHERE id = :id AND stok >= :qty`.
  Jika tidak ada baris yang terubah, transaksi dibatalkan dengan error bisnis "stok tidak cukup".
- Jangan memakai pola "baca stok, hitung di aplikasi, tulis kembali". Itu rentan terhadap race condition.
- Jika satu transaksi menyentuh banyak produk, proses dalam urutan tetap (misalnya urut id produk) untuk mengurangi risiko deadlock.
- Isolation level default PostgreSQL (Read Committed) cukup untuk pola update bersyarat di atas karena update mengunci baris. Naikkan level hanya bila ada alasan terukur.
- Perhatikan batas waktu transaksi interaktif Prisma pada versi terpasang. Jaga transaksi pendek: siapkan data dan validasi sebelum masuk transaksi, dan jangan memanggil layanan eksternal di dalamnya.
- Pencegahan kirim ganda (klik dua kali): tombol dinonaktifkan di FE, dan kunci idempotensi dipertimbangkan bila diperlukan.

## 10. Pencegahan stok negatif

Tiga lapis, semua dipakai:

1. Validasi di service sebelum menulis (pesan jelas ke pengguna).
2. Update bersyarat atomik (bagian 9.3).
3. CHECK constraint stok ≥ 0 di database.

## 11. Stock opname

- Opname tidak menimpa angka stok. Selisih (fisik − sistem) menghasilkan **penyesuaian** yang tercatat sebagai mutasi dengan alasan.
- Dokumen opname menyimpan stok sistem saat penghitungan dan stok fisik yang diinput, agar riwayat tetap bisa diaudit.
- Alur persetujuan dan frekuensi menunggu Q-06.

## 12. Pembatalan dan jejak audit

- Transaksi tidak di-hard-delete. Pembatalan mengubah status dan membuat mutasi pembalik. Mutasi asli tetap ada.
- Kebijakan siapa boleh membatalkan menunggu Q-05.
- Aksi penting dicatat di audit log: login, perubahan harga, pembatalan, penyesuaian stok, perubahan pengguna/role. Daftar final dikonfirmasi bersama owner.
- Audit log hanya ditambah, tidak diedit atau dihapus oleh aplikasi.

## 13. Seed

- Seed (`prisma/seed.ts`) hanya membuat data minimal untuk pengembangan: akun owner awal dan referensi dasar.
- Kredensial seed dari environment, tidak ditulis di kode, dan wajib diganti sebelum produksi.
- Data contoh untuk pengembangan harus jelas palsu dan tidak pernah dimasukkan ke database produksi.

## 14. Backup dan pemulihan (DEC-015, PROPOSED)

- Gunakan backup bawaan penyedia database **dan** dump berkala (`pg_dump`) ke penyimpanan terpisah. Jangan bergantung pada satu mekanisme.
- Retensi dan fitur point-in-time recovery **belum diverifikasi** untuk penyedia yang dipilih. Cek sebelum memilih paket.
- Lakukan **uji restore** minimal sekali sebelum serah terima, dan catat prosedurnya.
- Tier database gratis yang kedaluwarsa atau berretensi sangat pendek tidak dipakai untuk produksi (DEC-014).

## 15. Pengujian integritas data

Test berjalan di database test terpisah:

- **Konkurensi:** dua penjualan paralel untuk stok terakhir, hanya satu berhasil dan stok tidak negatif.
- **Rollback:** kegagalan sengaja di tengah transaksi membuat tidak ada perubahan tersimpan di tabel manapun.
- **Rekonsiliasi:** stok produk sama dengan total ledger setelah rangkaian operasi.
- **Constraint:** insert langsung yang melanggar CHECK/unique/FK ditolak database.
- **Snapshot:** mengubah harga produk tidak mengubah transaksi lama.
- **Pembatalan:** mutasi pembalik mengembalikan stok dan mutasi asli tetap ada.
