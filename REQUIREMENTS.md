# REQUIREMENTS — KP Optik Raihan

> **Tujuan:** mendefinisikan ruang lingkup fitur, kebutuhan sistem, status konfirmasi, dan pertanyaan terbuka.
> **Status:** DRAFT, menunggu review developer
> **Versi:** 0.1.0
> **Tanggal penyusunan:** 22 Oktober 2026
> **Ruang lingkup:** requirement fungsional dan nonfungsional. Desain teknis ada di dokumen lain.
> **Referensi:** `PROJECT_CONTEXT.md`, `DECISIONS.md`, `DATABASE.md`, `IMPLEMENTATION_PLAN.md`

## 1. Cara membaca dokumen ini

**Status requirement:**

| Status | Arti |
|---|---|
| `CONFIRMED` | Tercantum di judul final atau tujuan proyek yang ditetapkan developer |
| `PROPOSED` | Diusulkan karena prasyarat teknis atau disebut sebagai kebutuhan awal, belum ada bukti persetujuan |
| `NEEDS_CONFIRMATION` | Belum jelas atau belum ada sumber. **Tidak boleh diimplementasikan** sebelum dikonfirmasi |
| `OUT_OF_SCOPE` | Sengaja dikeluarkan |

Sumber yang tersedia hanya prompt developer (lihat `PROJECT_CONTEXT.md` bagian 7). Tidak ada hasil wawancara atau bimbingan di repo, sehingga status `CONFIRMED` hanya diberikan pada hal yang tertulis langsung di judul/tujuan proyek. Acceptance criteria di bawah berstatus `PROPOSED` sampai direview developer dan owner.

## 2. Aktor dan hak akses

| Aktor | Status | Catatan |
|---|---|---|
| Owner | PROPOSED | Disebut dalam kebutuhan awal |
| Pegawai | PROPOSED | Disebut dalam kebutuhan awal |

**Matriks hak akses: `NEEDS_CONFIRMATION` (Q-03).** Sampai dikonfirmasi, implementasi hanya boleh memakai prinsip *deny by default* dan satu pemisahan umum: role `owner` dan role `staff`. Jangan menetapkan siapa boleh melihat harga beli, membatalkan transaksi, atau menyetujui opname.

## 3. Daftar modul

| ID | Modul | Status | Dasar |
|---|---|---|---|
| M-01 | Authentication dan authorization | **CONFIRMED** | Dikonfirmasi developer 24 Okt 2026 (DEC-013). Matriks izin tetap menunggu Q-03 |
| M-02 | Dashboard | PROPOSED | Kebutuhan awal |
| M-03 | Produk | PROPOSED | Prasyarat penjualan, pembelian, inventaris |
| M-04 | Kategori | PROPOSED | Kebutuhan awal |
| M-05 | Supplier | PROPOSED | Prasyarat pembelian |
| M-06 | Pembelian | **CONFIRMED** | Tujuan proyek |
| M-07 | Penjualan | **CONFIRMED** | Judul KP |
| M-08 | Inventaris dan riwayat mutasi stok | **CONFIRMED** | Tujuan proyek (pengelolaan inventaris), keterlacakan stok |
| M-09 | Stock opname | PROPOSED | Kebutuhan awal |
| M-10 | Laporan | PROPOSED | Kebutuhan awal |
| M-11 | Pemesanan lensa | NEEDS_CONFIRMATION | Tidak ada di judul final (Q-01) |
| M-12 | Data pelanggan | NEEDS_CONFIRMATION | Disebut "sesuai kebutuhan sistem" tanpa rincian (Q-04) |
| M-13 | Landing page publik | PROPOSED | Folder `Container/` dibuat sengaja; isi belum didefinisikan |

## 4. Dependensi antarmodul

```
M-01 Auth ──▶ semua modul lain
M-04 Kategori ──▶ M-03 Produk
M-03 Produk + M-05 Supplier ──▶ M-06 Pembelian ──▶ M-08 Inventaris (stok masuk)
M-03 Produk + M-08 stok ──▶ M-07 Penjualan ──▶ M-08 Inventaris (stok keluar)
M-08 Inventaris ──▶ M-09 Stock opname (penyesuaian tercatat)
M-06 + M-07 + M-08 ──▶ M-10 Laporan dan M-02 Dashboard
```

Stok harus bisa masuk (pembelian) sebelum bisa keluar (penjualan). Itu dasar urutan di `IMPLEMENTATION_PLAN.md`.

## 5. Requirement fungsional dan acceptance criteria

Semua kriteria `PROPOSED`, diturunkan dari tujuan proyek (konsistensi stok, keterlacakan). Angka dan aturan bisnis spesifik sengaja tidak ditetapkan.

### M-01 Authentication dan authorization

- AC-01.1 Pengguna terdaftar bisa login dan logout. Kredensial salah menghasilkan pesan generik yang tidak membocorkan apakah username ada.
- AC-01.2 Endpoint selain login dan landing page publik menolak request tanpa autentikasi (401).
- AC-01.3 Request dari role tanpa izin ditolak backend (403), bukan hanya disembunyikan di UI.
- AC-01.4 Akun yang dinonaktifkan tidak bisa mengakses sistem pada request berikutnya.
- AC-01.5 Password tidak pernah tersimpan atau dikembalikan dalam bentuk asli.

### M-03 Produk, M-04 Kategori, M-05 Supplier

- AC-03.1 Create, read, update, dan nonaktifkan/hapus data master, dengan validasi di backend.
- AC-03.2 Produk yang sudah punya transaksi tidak boleh dihapus permanen (diarsipkan/dinonaktifkan).
- AC-03.3 Daftar mendukung pencarian dan pagination dari sisi server.
- AC-03.4 Kode/SKU produk unik (aturan format: Q-10).

### M-06 Pembelian (CONFIRMED sebagai modul; aturan rinci PROPOSED)

- AC-06.1 Satu pembelian mencatat supplier, tanggal, dan satu atau lebih item beserta jumlah dan harga beli.
- AC-06.2 Menyimpan pembelian menambah stok dan mencatat mutasi stok dalam satu transaksi atomik. Jika salah satu gagal, tidak ada yang tersimpan.
- AC-06.3 Harga beli pada item tersimpan sebagai snapshot dan tidak berubah saat harga produk berubah.
- AC-06.4 Pembatalan pembelian (jika diizinkan: Q-07) menghasilkan mutasi pembalik, bukan penghapusan.

### M-07 Penjualan (CONFIRMED sebagai modul; aturan rinci PROPOSED)

- AC-07.1 Frontend hanya mengirim produk dan jumlah. Harga dan total dihitung backend dari data database.
- AC-07.2 Penjualan dengan jumlah melebihi stok ditolak backend dengan pesan yang jelas.
- AC-07.3 Menyimpan penjualan mengurangi stok dan mencatat mutasi dalam satu transaksi atomik.
- AC-07.4 Dua penjualan bersamaan atas stok terakhir: hanya satu yang berhasil, stok tidak pernah negatif.
- AC-07.5 Harga jual pada item tersimpan sebagai snapshot.
- AC-07.6 Pembatalan/void (jika diizinkan: Q-05) mengembalikan stok lewat mutasi pembalik dan meninggalkan jejak audit.

### M-08 Inventaris dan riwayat mutasi

- AC-08.1 Setiap perubahan stok memiliki catatan mutasi: produk, jumlah (+/-), jenis, referensi dokumen asal, waktu, dan pelaku.
- AC-08.2 Stok saat ini dapat direkonsiliasi dengan total mutasi (konsistensi bisa dicek).
- AC-08.3 Tidak ada endpoint yang mengubah angka stok langsung tanpa mutasi.
- AC-08.4 Peringatan stok menipis: aturan ambang batas `NEEDS_CONFIRMATION` (Q-14).

### M-09 Stock opname

- AC-09.1 Opname membandingkan stok sistem dengan stok fisik yang diinput.
- AC-09.2 Selisih menghasilkan penyesuaian stok yang tercatat sebagai mutasi dengan alasan.
- AC-09.3 Siapa yang boleh menyetujui penyesuaian: `NEEDS_CONFIRMATION` (Q-06).

### M-10 Laporan dan M-02 Dashboard

- AC-10.1 Angka pada laporan dan dashboard dihitung backend dari data transaksi, bukan dari kalkulasi frontend.
- AC-10.2 Laporan mendukung filter periode. Jenis laporan dan format ekspor: `NEEDS_CONFIRMATION` (Q-11).

### M-13 Landing page publik

- AC-13.1 Halaman publik dapat diakses tanpa login dan terpisah dari area dashboard.
- AC-13.2 Isi (profil toko, kontak, produk) `NEEDS_CONFIRMATION`. Tidak boleh memuat data bisnis karangan.

## 6. Requirement nonfungsional

| ID | Kebutuhan | Status |
|---|---|---|
| NFR-01 | **Integritas data:** transaksi dan perubahan stok atomik, stok tidak boleh negatif, constraint di database sebagai lapis terakhir | PROPOSED |
| NFR-02 | **Keamanan:** autentikasi, RBAC deny-by-default, validasi input, proteksi dasar sesuai `SECURITY.md` | PROPOSED |
| NFR-03 | **Keterlacakan:** aksi penting tercatat (siapa, kapan, apa) | PROPOSED |
| NFR-04 | **Kemudahan pakai:** alur penjualan dapat dipakai pegawai tanpa pelatihan panjang. Target kuantitatif belum ditetapkan | PROPOSED |
| NFR-05 | **Maintainability:** modular sesuai `STRUCTURE.md` dan `CODING_STANDARDS.md` | PROPOSED |
| NFR-06 | **Ketersediaan data:** backup terjadwal dan prosedur restore teruji | PROPOSED |
| NFR-07 | **Performa:** tabel besar memakai pagination server-side. Angka target (waktu respons, jumlah data) belum ada sumbernya | NEEDS_CONFIRMATION |
| NFR-08 | **Responsivitas dan aksesibilitas** sesuai `DESIGN_SYSTEM.md` | PROPOSED |
| NFR-09 | **Serah terima:** dokumentasi operasional dan akun hosting atas nama toko | PROPOSED |

## 7. Di luar scope

Tidak disebut oleh sumber manapun, jadi dikeluarkan sampai ada konfirmasi tertulis. Ini usulan, bukan keputusan owner.

| Item | Status |
|---|---|
| Penjualan online/e-commerce untuk pelanggan | OUT_OF_SCOPE |
| Payment gateway dan pembayaran online | OUT_OF_SCOPE |
| Multi-cabang | OUT_OF_SCOPE |
| Aplikasi mobile native | OUT_OF_SCOPE |
| Akuntansi penuh, pajak, laporan keuangan resmi | OUT_OF_SCOPE |
| Pemeriksaan refraksi/rekam medis pasien | OUT_OF_SCOPE |
| Upload file/foto produk | NEEDS_CONFIRMATION (Q-15) |

## 8. Pertanyaan terbuka

| ID | Masalah | Dampak teknis | Pertanyaan konkret | Pihak |
|---|---|---|---|---|
| Q-01 | Pemesanan lensa tidak ada di judul final | Perlu modul, tabel, status, dan alur tersendiri | Apakah toko menerima pesanan custom (lensa/resep)? Apa alurnya: DP, status, pengambilan? | Owner, dosen |
| Q-02 | Harga grosir belum didefinisikan | Model harga (harga bertingkat per produk, per qty, atau diskon manual) | Bagaimana harga grosir ditentukan? Siapa yang boleh mengubahnya? | Owner |
| Q-03 | Matriks hak akses belum ada | RBAC, tampilan, audit | Apa yang boleh dan tidak boleh dilakukan owner vs pegawai? Siapa boleh melihat harga beli, void, opname, kelola user? | Owner |
| Q-04 | Data pelanggan | Tabel pelanggan, privasi data pribadi | Apakah pelanggan dicatat? Data apa saja, dan untuk apa? | Owner |
| Q-05 | Pembatalan/retur penjualan | Alur void, mutasi pembalik | Apakah penjualan boleh dibatalkan atau diretur? Siapa yang berwenang, dan batas waktunya? | Owner |
| Q-06 | Persetujuan opname | Status dokumen opname | Siapa menyetujui penyesuaian stok? Seberapa sering opname dilakukan? | Owner |
| Q-07 | Retur pembelian ke supplier | Mutasi dan dokumen retur | Apakah ada retur barang ke supplier? | Owner |
| Q-08 | Pembayaran tempo, hutang/piutang, metode bayar | Status pembayaran, tabel pembayaran | Apakah ada penjualan atau pembelian tempo/cicilan? Metode bayar apa saja? | Owner |
| Q-09 | Nomor invoice dan bukti transaksi | Format nomor, cetak/struk | Format nomor transaksi? Perlu cetak struk/invoice? Printer apa? | Owner |
| Q-10 | Varian produk dan satuan | Model produk (frame, warna, ukuran, lensa sebagai produk atau bukan) | Bagaimana barang dikelompokkan? Apakah stok dihitung per varian? Format SKU? | Owner |
| Q-11 | Jenis laporan | Query, tampilan, ekspor | Laporan apa yang dibutuhkan, periodenya, dan formatnya (layar, PDF, Excel)? | Owner, dosen |
| Q-12 | Judul final tidak memuat pembelian/pemesanan | Konsistensi scope laporan KP | Apakah judul dan scope sudah selaras menurut dosen? | Dosen |
| Q-13 | Hosting | Biaya, backup, region | Siapa membayar hosting, dengan metode apa? Budget bulanan? | Owner |
| Q-14 | Stok menipis | Ambang per produk atau global | Bagaimana batas stok minimum ditentukan? | Owner |
| Q-15 | Foto produk | Keamanan upload, penyimpanan file | Apakah produk perlu foto? | Owner |
| Q-16 | Pengguna dan perangkat | Prioritas responsivitas, kapasitas | Berapa pengguna dan perangkat apa yang dipakai di toko? | Owner |
| Q-17 | Diskon dan pajak | Perhitungan total di backend | Apakah ada diskon per item/transaksi atau pajak? | Owner |
