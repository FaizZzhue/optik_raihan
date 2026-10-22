# PROJECT_CONTEXT — KP Optik Raihan

> **Tujuan:** menjelaskan konteks proyek, sumber kebenaran, dan batas pengetahuan dokumentasi ini.
> **Status:** DRAFT, menunggu review developer
> **Versi:** 0.1.0
> **Tanggal penyusunan:** 22 Oktober 2026
> **Ruang lingkup:** konteks dan batasan proyek. Requirement ada di `REQUIREMENTS.md`, keputusan di `DECISIONS.md`.
> **Referensi:** `../CLAUDE.md`, `REQUIREMENTS.md`, `DECISIONS.md`

**Label yang dipakai di seluruh dokumen:**

| Label | Arti |
|---|---|
| **FAKTA** | Disebut langsung dalam prompt/dokumen proyek yang tersedia |
| **KEPUTUSAN** | Sudah dikunci developer (lihat `DECISIONS.md`, status `ACCEPTED`) |
| **ANALISIS** | Pendapat teknis penyusun, belum disetujui |
| **ASUMSI** | Dipakai agar dokumen bisa berjalan, belum dikonfirmasi |
| **MENUNGGU** | Butuh konfirmasi owner atau dosen |

## 1. Judul KP final

**"Rancang Bangun Aplikasi Penjualan Kacamata Berbasis Web pada Toko Kacamata Raihan"** (KEPUTUSAN, DEC-010)

Catatan konflik: prompt sebelumnya memakai judul yang memuat "Penjualan, Pembelian, dan Pemesanan". Judul terbaru hanya memuat "Penjualan", tetapi scope kerja tetap menyebut pembelian dan inventaris. Dokumen ini memakai judul terbaru dan mencatat konflik scope sebagai Q-12 di `REQUIREMENTS.md`.

## 2. Tujuan aplikasi

FAKTA: membantu operasional toko, terutama pencatatan penjualan, pembelian, dan pengelolaan inventaris sesuai scope yang dikonfirmasi. Target: aplikasi yang benar-benar bisa dipakai toko, dengan prioritas akurasi data, keterlacakan transaksi, dan konsistensi stok.

## 3. Latar belakang dan masalah yang diketahui

FAKTA (dari konteks awal proyek, bukan hasil wawancara yang tersedia di repo):

- Pencatatan transaksi masih manual.
- Ada risiko ketidaksesuaian antara stok fisik dan catatan.
- Diperlukan keterlacakan perubahan stok.
- Alur pembelian dan penjualan harus menjaga konsistensi data.

Dokumen ini tidak memuat angka transaksi, volume harian, jumlah produk, atau jumlah pengguna karena tidak ada sumbernya.

## 4. Aktor

| Aktor | Status | Catatan |
|---|---|---|
| Owner | FAKTA (disebut di prompt) | Hak akses rinci MENUNGGU (Q-03) |
| Pegawai | FAKTA (disebut di prompt) | Hak akses rinci MENUNGGU (Q-03) |
| Pelanggan sebagai pengguna sistem | MENUNGGU | Belum ada bukti pelanggan login. Data pelanggan sebagai catatan: Q-04 |
| Pengunjung publik (landing page) | KEPUTUSAN | Folder `FE/src/Container/` dibuat khusus untuk landing page publik |

## 5. Stack teknologi (baseline)

| Layer | Teknologi |
|---|---|
| Frontend | React, Vite, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, Axios, React Hook Form, Zod |
| Backend | Node.js, Express, TypeScript, REST API, Zod (validasi request) |
| Autentikasi | JWT. Mekanisme penyimpanan belum final (DEC-013, PROPOSED) |
| Database | PostgreSQL, Prisma ORM (target v7, versi terpasang wajib diverifikasi: DEC-004) |
| Testing | Vitest, Supertest (DEC-009, PROPOSED) |

Semua versi dependency **belum diverifikasi** karena `package.json` tidak tersedia (bagian 7).

## 6. Batasan proyek

- Dikerjakan satu developer mahasiswa KP dengan waktu dan sumber daya terbatas.
- Harus lolos kebutuhan akademik: laporan KP dan bimbingan dosen. Detail template laporan tidak tersedia.
- Aplikasi akan dipakai pihak toko, sehingga backup, keamanan, dan serah terima ikut dalam scope kerja.
- Tidak ada microservices, tidak ada infrastruktur kompleks tanpa kebutuhan nyata (DEC-025).
- Tidak ada fitur di luar scope yang dikonfirmasi (lihat `REQUIREMENTS.md`).

## 7. Sumber informasi dan keterbatasan audit

Audit workspace dilakukan pada 22 Oktober 2026 saat dokumen ini disusun.

| Sumber | Tersedia? |
|---|---|
| Codebase FE/BE | **Tidak.** Workspace tidak berisi source code |
| `package.json`, lockfile, konfigurasi Vite/TS/Tailwind/Prisma | **Tidak** |
| Dokumen Markdown lama | **Tidak** |
| Hasil bimbingan dosen | **Tidak** |
| Hasil wawancara owner/pegawai | **Tidak** |
| Baseline requirement final | **Tidak** |
| Prompt proyek dari developer | **Ya.** Satu-satunya sumber isi dokumen ini |

Konsekuensi: seluruh isi dokumen berasal dari prompt developer dan analisis teknis. Tidak ada klaim bahwa sumber lain telah diperiksa. Saat sumber tersedia, dokumentasi harus direkonsiliasi (lihat bagian 9).

Prioritas jika sumber bertentangan (sama dengan `../CLAUDE.md` bagian 3): bimbingan dosen terbaru, wawancara owner/pegawai, baseline requirement final, discovery lama, lalu analisis/asumsi.

## 8. Konteks developer

FAKTA: developer kuat di React, Next.js, TypeScript, Tailwind, komponen, props, dan Context. Masih mempelajari Express, REST API, middleware, JWT, Prisma, PostgreSQL, transaction database, serta error handling dan keamanan API. Backend relevan dengan mata kuliah Pemrograman Aplikasi Web II.

Implikasi untuk dokumentasi dan kode:
- Backend dijaga sederhana dan eksplisit. Setiap layer punya tanggung jawab yang mudah dijelaskan saat bimbingan.
- Pola dibangun lewat satu vertical slice (Products) lalu ditiru.
- Penjelasan di kode dan dokumen harus mengajarkan alasan, bukan hanya perintah.

## 9. Asumsi yang belum dikonfirmasi

| ID | Asumsi | Dampak jika salah |
|---|---|---|
| A-01 | Satu toko, satu cabang | Perlu desain multi-lokasi untuk stok |
| A-02 | Pengguna internal kurang dari sekitar 10 orang | Mempengaruhi kebutuhan performa dan hosting |
| A-03 | Tidak ada pembayaran online/payment gateway | Perlu integrasi, keamanan, dan aturan tambahan |
| A-04 | Satu mata uang (Rupiah), tanpa pajak khusus | Mempengaruhi perhitungan total |
| A-05 | Produk dilacak per unit barang (belum diketahui apakah ada varian warna/ukuran) | Mempengaruhi model data produk (Q-10) |
| A-06 | Aplikasi dipakai terutama dari komputer toko, juga bisa dari tablet/HP | Mempengaruhi prioritas UI (Q-16) |

## 10. Yang menunggu konfirmasi

Daftar lengkap pertanyaan, dampak, dan pihak pengonfirmasi ada di `REQUIREMENTS.md` bagian 8. Yang paling menentukan desain data: pemesanan lensa (Q-01), harga grosir (Q-02), matriks hak akses (Q-03), dan varian produk (Q-10).

Konfirmasi akademik yang dibutuhkan dari dosen: konsistensi judul dengan scope (Q-12), format laporan, dan batas kedalaman fitur.
