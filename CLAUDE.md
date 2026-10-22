# CLAUDE.md — KP Optik Raihan

> **Tujuan:** entry point dan instruksi utama untuk Claude AI pada repository ini.
> **Status:** DRAFT, menunggu review developer
> **Versi:** 0.1.0
> **Tanggal penyusunan:** 22 Oktober 2026
> **Ruang lingkup:** aturan kerja AI. Detail panjang ada di dokumen khusus dan dirujuk lewat path, tidak disalin ke sini.
> **Referensi:** semua file di `docs/` (lihat bagian 12)

---

## 1. Identitas proyek

- **Nama:** KP Optik Raihan
- **Judul KP:** "Rancang Bangun Aplikasi Penjualan Kacamata Berbasis Web pada Toko Kacamata Raihan" (DEC-010)
- **Tujuan:** aplikasi web untuk operasional Toko Kacamata Raihan: penjualan, pembelian, dan pengelolaan inventaris sesuai scope yang dikonfirmasi. Ini aplikasi yang akan dipakai toko, bukan prototype.
- **Developer:** satu orang, masih belajar Express, REST API, Prisma, PostgreSQL, dan transaksi database. Jangan membuat backend lebih abstrak dari yang perlu.
- **Struktur repo:** `FE/` (React + Vite) dan `BE/` (Express + Prisma) dalam satu repository.

## 2. Urutan membaca dokumentasi

Baca berurutan sebelum mengerjakan task non-trivial:

1. `CLAUDE.md` (file ini)
2. `docs/PROJECT_CONTEXT.md`
3. `docs/REQUIREMENTS.md`
4. `docs/DECISIONS.md`
5. `docs/ARCHITECTURE.md` dan `docs/STRUCTURE.md`
6. `docs/CODING_STANDARDS.md`
7. Sesuai task: `docs/DATABASE.md`, `docs/API_CONTRACT.md`, `docs/SECURITY.md`, `docs/DESIGN_SYSTEM.md`
8. `docs/IMPLEMENTATION_PLAN.md` untuk mengetahui tahap aktif

## 3. Prioritas sumber kebenaran

Jika sumber bertentangan, pakai urutan ini:

1. Hasil bimbingan dosen terbaru yang benar-benar tersedia
2. Hasil wawancara owner dan pegawai yang benar-benar tersedia
3. Baseline requirement final
4. Dokumen discovery lama
5. Analisis teknis dan asumsi yang belum dikonfirmasi

Dokumen nomor 1-3 saat ini **tidak tersedia di repository**. Lihat `docs/PROJECT_CONTEXT.md` bagian 7. Jangan mengarang isinya. Jika tidak ada sumber, tandai `NEEDS_CONFIRMATION` dan tanyakan.

## 4. Aturan sebelum mengubah source code

1. Baca dokumen yang relevan (bagian 2) dan cek `docs/DECISIONS.md` apakah keputusan terkait sudah `ACCEPTED`.
2. Periksa kondisi aktual repo: struktur, `package.json`, versi dependency, konfigurasi. Jangan berasumsi.
3. Cari dulu apakah type, constant, util, atau komponen yang dibutuhkan sudah ada. Jangan duplikasi.
4. Pastikan task tidak menyentuh requirement berstatus `NEEDS_CONFIRMATION` atau `OUT_OF_SCOPE`.
5. Kerjakan satu tahap dalam `docs/IMPLEMENTATION_PLAN.md` pada satu waktu.
6. Ubah hanya file yang relevan dengan task.

## 5. Arsitektur ringkas

Rincian: `docs/ARCHITECTURE.md`, `docs/STRUCTURE.md`.

```
BE: Route → Middleware → Controller → Service → Prisma → PostgreSQL
FE: Page → Feature Component → Custom Hook → Service → Axios → REST API
```

- Layered monolith. Tidak ada microservices atau shared package (DEC-025, DEC-026).
- **Frontend bukan sumber kebenaran** untuk harga, total, dan stok. Backend menghitung ulang.
- Context hanya untuk state global yang benar-benar global (auth). Server state memakai TanStack Query.

## 6. Aturan modularisasi

Satu file = satu tanggung jawab jelas. Pecah berdasarkan kompleksitas dan tanggung jawab, bukan angka baris kaku. Jangan memecah fungsi kecil menjadi banyak file demi terlihat modular. Aturan lengkap: `docs/STRUCTURE.md` dan `docs/CODING_STANDARDS.md`.

## 7. Aturan pencegahan AI slop

- Jangan membuat file, folder, abstraksi, atau helper yang belum dibutuhkan task saat ini.
- Jangan membuat base class, generic repository, atau wrapper yang hanya dipakai sekali.
- Jangan menulis komentar yang hanya mengulang kode.
- Jangan menambah fitur, parameter, atau opsi "untuk jaga-jaga".
- Jangan memakai `any` tanpa alasan tertulis.
- Jangan menyalin paragraf dokumentasi ke banyak tempat. Rujuk path-nya.
- Jangan membuat data dummy yang tampak seperti data bisnis nyata.

## 8. Kebijakan dependency

- Dilarang menginstal, menghapus, atau memperbarui dependency tanpa persetujuan eksplisit developer.
- Sebelum mengusulkan dependency baru: jelaskan kebutuhan, alternatif tanpa dependency, ukuran dan pemeliharaannya.
- Pakai versi yang benar-benar terpasang. Jangan menulis kode untuk versi yang belum diverifikasi (terutama Prisma 7 dan Tailwind).

## 9. Kebijakan schema dan migrasi

- `schema.prisma` hanya diubah setelah requirement terkait `CONFIRMED` dan developer menyetujui.
- Jangan menjalankan migrasi, `db push`, atau reset database tanpa persetujuan eksplisit.
- Setiap migrasi harus bisa dijelaskan: apa yang berubah dan mengapa. Aturan: `docs/DATABASE.md`.
- Jangan menyentuh `.env`. Hanya `.env.example` yang boleh diperbarui, tanpa nilai rahasia.

## 10. Kebijakan testing

- Alur kritis (penjualan, pembelian, stok, stock opname, auth, otorisasi) wajib punya integration test sebelum tahap dinyatakan selesai.
- Test dijalankan terhadap database test terpisah, tidak pernah terhadap data produksi.
- Dilarang mengarang hasil test. Laporkan perintah yang dijalankan dan output aslinya. Jika test tidak dijalankan, katakan.
- Rincian per tahap: `docs/IMPLEMENTATION_PLAN.md`.

## 11. Gerbang persetujuan, pelaporan, dan larangan

**Wajib minta persetujuan developer** sebelum:
- mengubah struktur folder baseline (`docs/STRUCTURE.md`)
- menambah atau mengganti dependency
- mengubah schema, menjalankan migrasi, atau mengubah strategi auth
- mengubah kontrak API yang sudah dipakai FE
- mengerjakan fitur berstatus `NEEDS_CONFIRMATION`
- mengubah keputusan `ACCEPTED` di `docs/DECISIONS.md`

Jika struktur tidak cukup untuk suatu kebutuhan, jelaskan dulu: masalah, mengapa struktur saat ini tidak cukup, alternatif, dampak, rekomendasi. Baru ubah setelah disetujui.

**Pelaporan pekerjaan:**
- Sebutkan file yang dibuat/diubah, apa yang dikerjakan, apa yang **tidak** dikerjakan, dan apa yang belum diverifikasi.
- Laporkan error apa adanya (pesan dan konteks). Jangan menyembunyikan atau memperhalus kegagalan.
- Bedakan fakta terverifikasi, analisis, dan asumsi.

**Dilarang:**
- Mengarang hasil test, output command, versi dependency, atau data toko.
- Mengklaim implementasi atau verifikasi yang tidak dilakukan.
- Mengklaim requirement disetujui tanpa bukti tertulis.
- Menyimpan secret, token, atau data pribadi di dokumentasi atau kode.

## 12. Peta dokumen

| File | Isi |
|---|---|
| `docs/PROJECT_CONTEXT.md` | Konteks, sumber kebenaran, asumsi |
| `docs/REQUIREMENTS.md` | Scope, requirement, status, pertanyaan terbuka |
| `docs/ARCHITECTURE.md` | Arsitektur, alur request, error, deployment |
| `docs/STRUCTURE.md` | Tree folder, penamaan, aturan pemecahan file |
| `docs/DESIGN_SYSTEM.md` | Token, komponen, aksesibilitas, state UI |
| `docs/CODING_STANDARDS.md` | Standar kode dan checklist review |
| `docs/DATABASE.md` | Aturan desain data dan integritas stok |
| `docs/API_CONTRACT.md` | Konvensi REST, format response, tipe |
| `docs/SECURITY.md` | Baseline keamanan |
| `docs/IMPLEMENTATION_PLAN.md` | Tahapan implementasi dan exit criteria |
| `docs/DECISIONS.md` | Catatan keputusan dan statusnya |
