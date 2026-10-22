# CODING_STANDARDS — KP Optik Raihan

> **Tujuan:** menjaga kualitas implementasi dan mencegah AI slop.
> **Status:** DRAFT, menunggu review developer
> **Versi:** 0.1.0
> **Tanggal penyusunan:** 22 Oktober 2026
> **Ruang lingkup:** standar kode FE dan BE. Penempatan file ada di `STRUCTURE.md`.
> **Referensi:** `STRUCTURE.md`, `ARCHITECTURE.md`, `API_CONTRACT.md`, `SECURITY.md`, `../CLAUDE.md`

## 1. Prinsip

1. **Satu file, satu tanggung jawab yang jelas.** Tetapi jangan memecah fungsi sederhana menjadi banyak file demi terlihat modular.
2. **Jelas lebih baik dari pintar.** Kode harus bisa dijelaskan oleh developer yang masih belajar Express/Prisma saat bimbingan.
3. **Sederhana dulu.** Abstraksi dibuat setelah ada kebutuhan nyata (dipakai dua kali atau lebih, atau jelas memperjelas).
4. **Backend adalah sumber kebenaran** untuk harga, total, stok, dan aturan bisnis.
5. **Tidak ada duplikasi definisi.** Cek dulu apakah type, constant, util, atau komponen sudah ada, lalu import.

## 2. Penamaan

Aturan file/folder: `STRUCTURE.md` bagian 7. Tambahan:

| Hal | Aturan |
|---|---|
| Fungsi | Kata kerja yang menjelaskan efek: `createSale`, `calculateSaleTotal` |
| Boolean | Awalan `is`, `has`, `can`: `isActive`, `hasStock` |
| Komponen | Kata benda: `ProductTable`, bukan `RenderProducts` |
| Hook | `useXxx`, dalam file `use-xxx.ts` |
| Type | PascalCase tanpa awalan `I`: `Product`, bukan `IProduct` |
| Konstanta | `UPPER_SNAKE_CASE` pada objek `as const` |
| Istilah domain | Satu istilah per konsep di seluruh kode (jangan campur `item`/`barang`/`produk` untuk hal yang sama) |

Nama harus menggambarkan fungsi sebenarnya. Hindari `helper`, `misc`, `common`, `stuff`, `data`.

## 3. Batas tanggung jawab per unit

### Frontend

| Unit | Boleh | Tidak boleh |
|---|---|---|
| Page | Menyusun komponen dan layout | Fetch, mutation, validasi, business logic |
| Feature component | UI dan interaksi, memanggil hook, menerima props | Memanggil Axios langsung, menyimpan server state sendiri |
| Custom hook | `useQuery`/`useMutation`, query key, invalidasi, state milik fitur | JSX |
| Service | Satu fungsi per endpoint, mengembalikan data | State React, JSX, toast |
| `schemas.ts` | Skema Zod form | Pemanggilan API |
| `utils/` | Fungsi murni | Efek samping, akses state/API |
| Context | State global yang benar-benar global (auth) | Server state, data fitur |

Props dipakai untuk data antar komponen parent ke child. Jangan menaikkan data ke Context hanya untuk menghindari beberapa level props.

### Backend

| Unit | Boleh | Tidak boleh |
|---|---|---|
| Route | Mendaftarkan endpoint dan middleware | Logic |
| Middleware | Auth, role, validasi, error | Business logic domain |
| Validator | Skema Zod | Akses database |
| Controller | Ambil input, panggil service, kirim response | Query Prisma, aturan bisnis panjang |
| Service | Aturan bisnis, perhitungan, transaksi, Prisma | `req`/`res`, format HTTP |
| `utils/` | Fungsi murni | Akses database |

## 4. TypeScript

- Mode `strict` aktif. Verifikasi `tsconfig` aktual sebelum mengandalkannya.
- Gunakan `import type` untuk impor yang hanya berupa type.
- **Hindari `any`.** Jika terpaksa, beri komentar singkat alasan dan batasi cakupannya. Utamakan `unknown` lalu persempit.
- Hindari type assertion (`as`) yang menutupi masalah. Persempit dengan validasi (Zod) atau type guard.
- Tipe respons API, tipe form, dan tipe database dipisah (`API_CONTRACT.md` bagian 6). Tipe Prisma tidak diimpor ke FE.
- Literal bersama memakai objek `as const`, tipe turunannya diekspor dari file yang sama jika memungkinkan.

## 5. Penanganan error

- BE: lempar `AppError` dari service, tangani terpusat di `error.middleware.ts` (`ARCHITECTURE.md` bagian 7).
- Jangan menelan error (`catch {}` kosong). Tangani, atau lempar ulang dengan konteks.
- Jangan membocorkan stack trace atau detail internal ke klien pada production.
- FE: 401 ditangani global. Error domain ditampilkan dekat konteksnya sesuai `DESIGN_SYSTEM.md` bagian 10.
- Jangan menampilkan pesan sukses sebelum operasi benar-benar sukses.

## 6. Validasi

- Semua input BE divalidasi Zod di `validators/` melalui middleware, bukan berulang di controller.
- Validasi FE (RHF + Zod) adalah kenyamanan, bukan jaminan.
- Skema FE yang panjang dipindah ke `schemas.ts`.
- Jangan mempercayai harga, total, atau role dari body request.

## 7. Logging

- Log terstruktur dengan level (info/warn/error). Pilihan library ditentukan saat implementasi dan disetujui (dependency).
- Jangan mencatat password, token, cookie, atau data pribadi (`SECURITY.md`).
- Log error mencakup konteks (route, user id, id request) tetapi bukan isi sensitif.
- Jangan meninggalkan `console.log` debugging di kode yang selesai.

## 8. Dependency

- Tidak ada dependency baru tanpa persetujuan. Alasan, alternatif tanpa dependency, dan pemeliharaan dijelaskan lebih dulu.
- Gunakan versi terpasang. Jangan menulis kode untuk API versi lain tanpa verifikasi.
- Jangan menambah library untuk hal yang bisa ditulis jelas dalam beberapa baris.

## 9. Duplikasi dan abstraksi

- Dilarang menduplikasi type, constant, atau util yang sudah ada. Import ulang.
- Dilarang membuat base class, generic repository, factory, atau HOC yang hanya dipakai sekali.
- Tiga baris mirip belum tentu layak diabstraksi. Abstraksi dibuat jika mengurangi beban baca.
- Jangan membuat parameter, opsi, atau fitur "untuk jaga-jaga".

## 10. Kapan memecah file

Berdasarkan kompleksitas dan tanggung jawab (`STRUCTURE.md` bagian 5 dan 6), bukan angka baris kaku. Angka baris hanya sinyal untuk memeriksa ulang. Jangan memecah fungsi kecil yang hanya dipakai satu tempat.

## 11. Komentar dan dokumentasi kode

- Komentar menjelaskan **alasan** (mengapa transaksi dipakai di sini, mengapa urutan ini penting), bukan mengulang apa yang kode lakukan.
- Aturan bisnis yang tidak jelas dari kode diberi komentar singkat dengan rujukan ke requirement (misalnya `REQ-` atau AC id).
- Jangan meninggalkan kode yang di-comment tanpa alasan.

## 12. Checklist review sebelum menyatakan tugas selesai

- [ ] Sesuai tahap di `IMPLEMENTATION_PLAN.md` dan tidak menyentuh requirement `NEEDS_CONFIRMATION`.
- [ ] File ditempatkan sesuai `STRUCTURE.md`. Tidak ada folder/file kosong tanpa alasan.
- [ ] Tidak ada duplikasi type, constant, atau util. Sudah dicek yang ada.
- [ ] Tidak ada `any` tanpa alasan tertulis. `import type` dipakai untuk type.
- [ ] Alur layer dipatuhi (tidak ada query Prisma di controller, tidak ada Axios di komponen).
- [ ] Input divalidasi di BE. FE tidak menghitung nilai finansial/stok sebagai sumber kebenaran.
- [ ] Error ditangani, tidak ada pesan sukses prematur, tidak ada stack trace ke klien.
- [ ] Tidak ada secret, token, atau data pribadi di kode atau log.
- [ ] Test untuk alur kritis ditulis dan **benar-benar dijalankan**. Output aslinya dilaporkan.
- [ ] Tidak ada dependency baru tanpa persetujuan.
- [ ] Laporan akhir menyebut apa yang dikerjakan, yang tidak dikerjakan, dan yang belum diverifikasi.
