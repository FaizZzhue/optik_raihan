# DESIGN_SYSTEM — KP Optik Raihan

> **Tujuan:** single source of truth konsistensi UI/UX aplikasi, dari dashboard sampai halaman operasional.
> **Status:** DRAFT, menunggu review developer. Nilai token berstatus PROPOSED sampai divalidasi pada UI nyata.
> **Versi:** 0.2.0
> **Tanggal penyusunan:** 22 Oktober 2026. **Pembaruan:** 1 November 2026 (token terimplementasi, bagian 2.5, 3, 7).
> **Ruang lingkup:** arah visual, token, komponen, state, aksesibilitas. Tidak mengubah konfigurasi proyek.
> **Referensi:** `STRUCTURE.md`, `CODING_STANDARDS.md`, `REQUIREMENTS.md`, `DECISIONS.md` (DEC-022, DEC-023, DEC-024, DEC-033)

**Keterbatasan:** dokumen awal disusun saat repository kosong. Per 1 November 2026 konfigurasi aktual sudah diverifikasi: Tailwind 4.3 (CSS-first, tanpa `tailwind.config`), shadcn/ui style `radix-nova`, ikon `lucide-react`, font Geist. Referensi visual "Optical Luxury" yang disebut dalam prompt **tidak tersedia** untuk penyusun. Dokumen ini hanya memakai deskripsi tertulis. Nama produk, angka, dan konten pada mockup mana pun bukan data bisnis.

## 1. Arah desain dan identitas visual (DEC-022, ACCEPTED)

- **Tema:** Optical Luxury — Vintage Modern.
- **Karakter:** premium, hangat, minimalis, modern, dengan sentuhan vintage yang relevan dengan brand optik.
- **Layout:** Clean Minimalist, dengan Bento Grid secara selektif (ringkasan KPI, grafik, produk terlaris, peringatan stok).
- **Pengguna:** owner muda dan pegawai toko. Aplikasi harus profesional, intuitif, dan efisien.
- **Kesan:** butik kacamata modern, bukan dashboard admin generik atau aplikasi korporat kaku.
- **Mode:** Light dan Dark.
- **Prioritas UX:** keterbacaan data, kecepatan operasional, navigasi intuitif, konsistensi antarhalaman.

## 2. Design tokens (keputusan DEC-023 ACCEPTED, nilai token PROPOSED)

### 2.1 Palet dasar

| Token | Light | Dark |
|---|---|---|
| Background | Warm Ivory `#F6F1E7` | Espresso Dark `#211F1A` |
| Surface (kartu, panel) | Paper White `#FFFCF6` | Dark Surface `#302D26` |
| Text utama | Espresso `#342B25` | Warm Text `#F3EBDD` |
| Primary | Olive `#66734A` | Soft Olive `#A8B58A` |
| Accent sekunder | Burnt Orange `#C87545` | Terracotta `#D68A60` |
| Surface lembut | Muted Sage `#DCE4D2` | Dark Sage `#3A4030` (ditetapkan 1 Nov 2026) |
| Border | `#E3DACA` (ditetapkan 1 Nov 2026) | `#49443A` |

### 2.2 Hasil pengecekan kontras (dihitung penyusun, rumus WCAG 2.x)

Ambang: teks normal ≥ 4,5:1. Teks besar dan komponen UI ≥ 3:1.

| Pasangan | Rasio | Hasil |
|---|---|---|
| Espresso di atas Ivory | 12,29 | Lulus |
| Espresso di atas Paper | 13,51 | Lulus |
| Olive (teks) di atas Ivory | 4,53 | Lulus tipis |
| Olive (teks) di atas Paper | 4,98 | Lulus |
| Teks Paper di atas tombol Olive | 4,98 | Lulus |
| Olive (teks) di atas Muted Sage | 3,90 | **Gagal** untuk teks normal |
| Burnt Orange (teks) di atas Ivory | 3,07 | **Gagal** untuk teks normal |
| Teks Paper di atas Burnt Orange | 3,37 | **Gagal** untuk teks normal |
| Warm Text di atas Espresso Dark | 13,91 | Lulus |
| Warm Text di atas Dark Surface | 11,60 | Lulus |
| Soft Olive di atas Espresso Dark / Dark Surface | 7,56 / 6,31 | Lulus |
| Terracotta di atas Espresso Dark / Dark Surface | 6,01 / 5,01 | Lulus |
| Espresso Dark di atas tombol Soft Olive | 7,56 | Lulus |
| Border `#49443A` vs Espresso Dark / Dark Surface | 1,70 / 1,42 | Cukup untuk garis pemisah dekoratif, **tidak cukup** untuk batas input (butuh 3:1) |

Konsekuensi untuk implementasi:

- Burnt Orange **bukan warna teks** dan bukan latar tombol berteks terang. Pakai untuk ikon besar, aksen dekoratif, dan elemen non-teks yang tidak membawa informasi penting sendirian. Untuk teks beraksen, gunakan varian lebih gelap (kandidat `#A95A2E`: 4,45, masih tipis, perlu disesuaikan lagi).
- Olive sebagai teks di atas Muted Sage tidak boleh dipakai. Pakai Espresso di atas Sage (10,59).
- Olive sebagai warna teks di Light Mode lulus tipis. Opsi lebih aman: `#566239` (5,83 di atas Ivory) atau `#4E5A34` (7,23). **Dipilih `#566239`** sebagai token terpisah `--primary-text` (DEC-023).
- Border input harus lebih kuat dari border dekoratif, terutama di Dark Mode. Diterapkan lewat token `--input` terpisah dari `--border` (bagian 2.5).

### 2.3 Warna semantik (usulan penyusun, belum disepakati)

Warna semantik tidak boleh membawa makna sendirian. Selalu sertakan label teks atau ikon.

| Makna | Light (teks di atas Paper) | Dark (teks di atas Dark Surface) | Contoh penggunaan |
|---|---|---|---|
| Success | `#2F6B3F` (6,22) | `#8FC79A` (7,07) | Transaksi selesai |
| Warning | `#8A5A00` (5,79) | `#E3B25C` (7,06) | Stok menipis |
| Danger | `#A63A2B` (6,29) | `#EE8F80` (5,81) | Gagal, kondisi kritis |
| Info | `#2F5F80` (6,68) | `#8DB9D6` (6,57) | Informasi netral |

Angka dalam kurung adalah rasio kontras terhitung. Warna semantik diterapkan sebagai token (DEC-023). Nilainya tetap PROPOSED sampai divalidasi pada UI yang memakainya.

### 2.4 Implementasi token

- Satu sumber token untuk Light dan Dark (CSS variables), dikonsumsi Tailwind dan shadcn/ui.
- Mekanisme terverifikasi: Tailwind 4.3 CSS-first. Token ditulis di `FE/src/index.css` (`:root` untuk Light, `.dark` untuk Dark) dan dipetakan ke utility lewat `@theme inline` (misalnya `--primary-text` menjadi `text-primary-text`).
- Dark Mode memakai class `dark` di `<html>`. Rinciannya di bagian 7.
- Jangan menulis nilai warna, spacing, radius, atau shadow yang sama berulang di komponen. Rujuk token.
- Hindari arbitrary values Tailwind tanpa alasan.

### 2.5 Nilai token terimplementasi (PROPOSED, 1 November 2026)

Menggantikan token neutral bawaan shadcn. Token `--chart-1` sampai `--chart-5` sengaja belum diubah karena belum ada grafik.

| Token CSS | Peran | Light | Dark |
|---|---|---|---|
| `--background` | latar halaman | `#F6F1E7` | `#211F1A` |
| `--foreground` | teks utama | `#342B25` | `#F3EBDD` |
| `--card`, `--popover`, `--sidebar` | permukaan | `#FFFCF6` | `#302D26` |
| `--primary`, `--sidebar-primary` | tombol utama | `#66734A` | `#A8B58A` |
| `--primary-foreground` | teks di atas tombol utama | `#FFFCF6` | `#211F1A` |
| `--primary-text` | teks aksen Olive (token terpisah) | `#566239` | `#A8B58A` |
| `--secondary`, `--accent`, `--sidebar-accent` | surface lembut, menu aktif/hover | `#DCE4D2` | `#3A4030` |
| `--muted` | skeleton, hover netral | `#ECE5D8` | `#3A362E` |
| `--muted-foreground` | teks sekunder | `#655A50` | `#B5AA98` |
| `--brand-accent` | Burnt Orange, **non-teks saja** (garis indikator menu aktif) | `#C87545` | `#D68A60` |
| `--destructive` | Danger | `#A63A2B` | `#EE8F80` |
| `--success`, `--warning`, `--info` | semantik (bagian 2.3) | `#2F6B3F`, `#8A5A00`, `#2F5F80` | `#8FC79A`, `#E3B25C`, `#8DB9D6` |
| `--border`, `--sidebar-border` | garis pemisah dekoratif | `#E3DACA` | `#49443A` |
| `--input` | batas kontrol form (≥ 3:1) | `#857A6B` | `#857C6B` |
| `--ring`, `--sidebar-ring` | focus ring | `#66734A` | `#A8B58A` |

Kontras pasangan yang dipakai (dihitung dengan rumus WCAG 2.x, skrip tanpa dependency, 1 November 2026):

| Pasangan | Light | Dark | Ambang |
|---|---|---|---|
| foreground / background | 12,29 | 13,91 | 4,5 |
| foreground / card | 13,51 | 11,60 | 4,5 |
| foreground / secondary (Sage) | 10,59 | 9,07 | 4,5 |
| foreground / muted | 11,04 | 10,15 | 4,5 |
| muted-foreground / background | 5,96 | 7,19 | 4,5 |
| muted-foreground / card | 6,55 | 6,00 | 4,5 |
| muted-foreground / muted | 5,35 | 5,25 | 4,5 |
| muted-foreground / secondary (Sage) | 5,13 | 4,69 | 4,5 |
| primary-foreground / primary | 4,98 | 7,56 | 4,5 |
| primary-text / background | 5,83 | 7,56 | 4,5 |
| primary-text / card | 6,40 | 6,31 | 4,5 |
| primary-text / secondary (Sage) | 5,02 | 4,93 | 4,5 |
| destructive / card | 6,29 | 5,81 | 4,5 |
| destructive / background | 5,72 | 6,96 | 4,5 |
| success / card | 6,22 | 7,07 | 4,5 |
| warning / card | 5,79 | 7,06 | 4,5 |
| info / card | 6,68 | 6,57 | 4,5 |
| tooltip (background di atas foreground) | 12,29 | 13,91 | 4,5 |
| input / background (non-teks) | 3,74 | 3,99 | 3 |
| input / card (non-teks) | 4,11 | 3,33 | 3 |
| ring / background (non-teks) | 4,53 | 7,56 | 3 |
| ring / card (non-teks) | 4,98 | 6,31 | 3 |
| border dekoratif / background, card | 1,23 / 1,35 | 1,70 / 1,42 | dekoratif, tidak membawa informasi |

Pemindaian di browser (Chrome headless) atas semua teks yang terlihat di halaman login, dashboard, dan ErrorState pada kedua mode tidak menemukan pasangan di bawah ambang.

## 3. Tipografi

- Font UI: **Geist** (`@fontsource-variable/geist`, sudah terpasang). Keputusan: DEC-024 ACCEPTED. Kandidat awal Plus Jakarta Sans dan Inter tidak dipakai.
- Angka tabular: **terverifikasi didukung**. Tabel GSUB file `geist-latin-wght-normal.woff2` (subset yang memuat glyph angka) memiliki fitur `tnum` (juga `pnum`, `frac`). Kolom angka transaksi, stok, dan harga memakai utility `tabular-nums` (`font-variant-numeric: tabular-nums`).
- Serif editorial hanya untuk elemen branding atau heading dekoratif terbatas. **Tidak** untuk tabel, form, angka transaksi, atau informasi operasional.
- Skala yang sudah dipakai: page title `text-2xl` semibold (24 px), judul state/kartu `text-base` semibold (16 px), body `text-sm` (14 px), caption/label role `text-xs` (12 px). Section title dan angka KPI ditetapkan saat dipakai.
- Hierarki lewat ukuran, ketebalan, warna, dan jarak, tidak hanya warna mencolok.

## 4. Layout, spacing, radius, elevation

- Spacing berbasis kelipatan 4 px.
- Radius kartu/panel sekitar 10-14 px. Radius tombol/input sekitar 8-10 px.
- Border halus dan shadow lembut. Tidak ada shadow berat di setiap komponen.
- Whitespace cukup tanpa membuang ruang data operasional.
- Bento Grid hanya untuk ringkasan (KPI, grafik, produk terlaris, peringatan stok). Jangan membuat setiap komponen kartu berwarna berbeda. Pertahankan keseimbangan permukaan netral dan aksen.
- Layout harus tetap rapi saat jumlah data, panjang teks, atau ukuran layar berubah.

## 5. Penggunaan shadcn/ui

- Fondasi komponen dasar apabila sudah tersedia atau disepakati: Button, Input, Select, Checkbox, Dropdown Menu, Dialog, Alert Dialog, Table, Tabs, Tooltip, Popover, Calendar, notifikasi (toast).
- Sesuaikan lewat token dan CSS variables. Jangan memakai tampilan default tanpa dicek terhadap dokumen ini.
- Jangan inisialisasi ulang shadcn/ui, mengganti library UI, atau menambah library UI baru tanpa audit dan persetujuan.
- Folder `components/ui/` adalah hasil shadcn. Hindari mengubahnya sembarangan. Variasi khusus dibuat di `components/shared/`.
- Tabel data kompleks: `@tanstack/react-table` diusulkan (DEC-020, PROPOSED).

## 6. Reusable components

Usulan nama (sesuaikan dengan konvensi di `STRUCTURE.md`): `AppSidebar`, `AppHeader`, `PageHeader`, `StatCard`, `ChartCard`, `StatusBadge`, `DataTable`, `SearchInput`, `FilterBar`, `FormField`, `ConfirmDialog`, `EmptyState`, `ErrorState`, `LoadingState`.

Aturan:
- Dibuat berdasarkan kebutuhan nyata saat dipakai dua kali atau lebih, bukan di muka.
- Satu tanggung jawab jelas, hanya variasi yang benar-benar dipakai.
- Tidak memuat logic bisnis (itu milik service dan hook).
- Hindari satu komponen serbaguna yang terlalu kompleks demi mengurangi jumlah file.

## 7. Layout publik dan dashboard

**Dashboard:**
- Sidebar collapsible. Acuan lebar terbuka ± 240 px, ringkas ± 72 px (nilai awal, sesuaikan setelah diuji).
- Sidebar ringkas: tooltip label, indikator menu aktif, akses keyboard.
- Header: kontrol relevan saja (pencarian bila ada fungsinya, notifikasi bila ada fungsinya, info akun).
- Konten: page title, deskripsi singkat bila perlu, aksi utama mudah ditemukan.
- Perubahan lebar sidebar tidak boleh membuat konten bertumpuk atau keluar viewport.

**Implementasi (1 November 2026):**
- Sidebar: komponen shadcn `components/ui/sidebar.tsx` (DEC-033), `collapsible="icon"`. Lebar 240/72 px lewat CSS variable `--sidebar-width`/`--sidebar-width-icon` di `layouts/DashboardLayout.tsx`, tanpa mengubah `components/ui/`. Di bawah 768 px sidebar menjadi Sheet. Status buka/ringkas disimpan komponen di cookie `sidebar_state` (state UI). Pintasan keyboard bawaan: Ctrl+B.
- Menu aktif ditandai latar `--sidebar-accent`, huruf tebal, garis `--brand-accent`, dan `aria-current="page"`. Penanda tidak hanya warna.
- Header: tombol menu, nama dan label role dari `GET /api/auth/me`, toggle tema, tombol Keluar.
- Tema Light/Dark: hook `hooks/use-theme.ts` tanpa Context. Class `dark` dipasang di `<html>`. Selama pengguna belum memilih, tema mengikuti preferensi sistem. Pilihan disimpan di `localStorage` (dibungkus try/catch). `public/theme-init.js` dimuat di `<head>` sebelum halaman digambar sehingga tidak ada kilatan tema.

**Publik (`Container/`):** gaya konsisten dengan brand, tidak memaksakan tampilan dashboard admin. Isi landing page `NEEDS_CONFIRMATION` (REQUIREMENTS M-13).

## 8. Dashboard owner dan pegawai

Visual identity sama. Isi dan navigasi mengikuti role yang benar-benar diterapkan. **Perbedaan role belum final** (Q-03): jangan membuat perbedaan baru tanpa konfirmasi.

- Owner (prioritas, bila data dan requirement mendukung): ringkasan penjualan, jumlah transaksi, produk terjual, stok menipis, grafik penjualan, produk terlaris, transaksi terbaru.
- Pegawai (prioritas): akses cepat pencatatan penjualan, pencarian produk dan cek stok, informasi operasional yang dibutuhkan.

## 9. Komponen operasional

- **Sidebar/navigasi:** satu keluarga ikon konsisten, indikator aktif jelas tapi tidak mencolok, tetap berfungsi pada mode ringkas, keyboard, dan layar kecil.
- **Header:** tinggi, alignment, jarak konsisten. Tidak ada ikon tanpa fungsi.
- **Form:** label jelas, helper text bila perlu, pesan error dekat field, penanda field wajib dan format input konsisten. Form transaksi dan stok mudah dipakai tanpa dekorasi mengganggu.
- **Tabel:** keterbacaan, alignment sesuai tipe (teks kiri, angka/harga kanan, tanggal konsisten), pencarian/filter/pagination/sorting sesuai kebutuhan, tinggi baris tidak terlalu rapat atau longgar, tampilan layak di layar kecil.
- **Dialog:** untuk aksi yang butuh fokus. **Alert Dialog** untuk aksi destruktif atau sulit dibatalkan, dengan konsekuensi dijelaskan jelas. Tidak meminta konfirmasi untuk aksi rutin yang aman.
- **Toast:** hasil aksi singkat. Bedakan sukses, peringatan, gagal secara visual dan teks. Error penting tidak hanya ditampilkan lewat toast.

## 10. State loading, empty, error, success

| State | Aturan |
|---|---|
| Loading | Indikator/skeleton yang tidak menggeser layout (`components/shared/LoadingState.tsx`) |
| Empty | Jelaskan data belum ada dan aksi berikutnya bila relevan |
| Error | Penjelasan singkat dan tindakan pemulihan bila mungkin |
| Success | Umpan balik jelas setelah operasi **benar-benar** berhasil (setelah respons backend) |

Data dummy tidak boleh menggantikan data nyata tanpa penandaan jelas.

## 11. Responsivitas

- Prioritas desktop (operasional toko). Layout tetap berfungsi di tablet dan mobile (perangkat toko: Q-16).
- Sidebar menyesuaikan ruang tanpa menutupi konten permanen.
- KPI, grafik, tabel, form, dialog, navigasi menyesuaikan lebar viewport.
- Hindari horizontal overflow tak sengaja. Tabel lebar scroll di dalam wadahnya sendiri.
- Breakpoint ditentukan oleh kebutuhan konten, bukan sekadar default.

## 12. Aksesibilitas

- Kontras sesuai bagian 2.2 pada kedua mode.
- Semua kontrol punya nama/label. Dukungan keyboard dan focus indicator terlihat.
- Status tidak mengandalkan warna saja.
- Elemen semantik dan atribut ARIA sesuai kebutuhan. Target interaksi nyaman.
- Periksa dialog, dropdown, tooltip, dan sidebar secara khusus.

## 13. Format mata uang dan tanggal

- Rupiah satu format di seluruh aplikasi, misalnya `Rp1.250.000`. Locale `id-ID`.
- Tanggal ringkas misalnya `22 Okt 2026`. Detail transaksi/audit memakai tanggal dan waktu lengkap.
- Zona waktu konsisten dengan aturan backend (`DATABASE.md`, `API_CONTRACT.md`).
- Pemformatan lewat satu fungsi di `FE/src/utils/` (misalnya `format-currency.ts`, `format-date.ts`). Dilarang menghitung atau memformat nilai finansial secara berbeda di tiap komponen. Nilai uang dari API berupa string (`API_CONTRACT.md`) dan tidak dihitung ulang di FE.

## 14. Larangan visual

- Tidak mencampur gaya antarhalaman.
- Tidak ada gradien, glassmorphism, neon, atau shadow berlebihan sebagai dekorasi default.
- Tidak ada banner produk besar yang mengurangi ruang informasi operasional. Foto produk selektif sebagai identitas visual, bukan pengganti data.
- Dashboard tidak boleh menyerupai landing page pemasaran.
- Estetika vintage tidak boleh mengorbankan keterbacaan tabel dan form.
- Komponen berfungsi sama harus tampil dan berperilaku sama.

## 15. Aturan implementasi

1. Audit repo: versi Tailwind, konfigurasi shadcn/ui, library ikon, font, komponen yang ada.
2. Identifikasi token dan pola styling yang sudah ada.
3. Tentukan mekanisme Light/Dark berdasarkan konfigurasi aktual.
4. Catat keputusan final dan nilai token di dokumen ini, lalu perbarui `DECISIONS.md`.
5. Implementasi bertahap tanpa merusak yang sudah berjalan.
6. Uji konsistensi visual, responsivitas, aksesibilitas, dan state komponen.

Jangan mengarang referensi desain, aset, logo, atau data bisnis. Jika identitas visual belum ditentukan, tandai sebagai keputusan desain yang perlu disepakati.
