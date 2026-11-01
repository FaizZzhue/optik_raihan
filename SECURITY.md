# SECURITY — KP Optik Raihan

> **Tujuan:** baseline keamanan aplikasi.
> **Status:** DRAFT, menunggu review developer. Keputusan yang belum disetujui ditandai (bagian 17).
> **Versi:** 0.1.0
> **Tanggal penyusunan:** 22 Oktober 2026
> **Ruang lingkup:** kontrol keamanan aplikasi web ini. Belum ada kode yang bisa diaudit (repository kosong). Dokumen ini menetapkan apa yang **wajib** diterapkan dan diuji, bukan yang sudah diterapkan.
> **Referensi:** `ARCHITECTURE.md`, `API_CONTRACT.md`, `DATABASE.md`, `CODING_STANDARDS.md`, `DECISIONS.md` (DEC-013, DEC-014)

**Prinsip:** tidak ada metode yang sepenuhnya aman. Setiap kontrol mengurangi risiko tertentu, bukan menghilangkannya. Dokumen ini menyebut trade-off secara terbuka.

## 1. Autentikasi dan otorisasi

- Autentikasi: login dengan kredensial, hasil berupa sesi/token yang diverifikasi **di backend** setiap request.
- Otorisasi: diputuskan di backend dengan `auth.middleware` lalu `role.middleware`. FE hanya mengatur tampilan.
- Pesan kegagalan login generik (tidak menyebut apakah username ada) untuk mengurangi enumerasi akun.
- Pengecekan status aktif pengguna pada setiap request sehingga akun yang dinonaktifkan langsung kehilangan akses.
- Role diambil dari database pada setiap request (atau pada cara yang menjamin perubahan role langsung berlaku), bukan dipercaya dari klaim lama dalam token.
- Body request tidak boleh menentukan role atau identitas pelaku (mencegah mass assignment). Identitas pelaku selalu dari sesi.

## 2. RBAC dan deny by default

- Setiap route diproteksi secara default. Route publik ditulis eksplisit sebagai pengecualian (login, landing page publik).
- Izin per role didefinisikan eksplisit. **Matriks hak akses menunggu konfirmasi** (Q-03, DEC-018). Sampai itu, hanya role `owner` dan `staff` tanpa asumsi izin sensitif: akses ke harga beli, pembatalan, opname, dan manajemen user dibatasi seminimal mungkin sampai dikonfirmasi.
- Menambah route baru tanpa penentuan role harus gagal pada review (checklist di `CODING_STANDARDS.md`).

## 3. Password hashing

- Password disimpan hanya sebagai hash dengan algoritma khusus password (bcrypt atau argon2id). Pilih satu saat implementasi dan catat sebagai dependency yang disetujui.
- Tingkat biaya (cost) disetel setinggi yang masih nyaman pada server produksi. Titik awal bcrypt cost 12 adalah angka awal, bukan hasil benchmark, dan harus dievaluasi.
- Tidak pernah menyimpan, mencatat di log, atau mengembalikan password dalam bentuk asli. Hash tidak ikut dalam DTO.
- Kebijakan panjang minimum password ditetapkan saat implementasi. Tidak ada password default yang tertinggal di produksi (seed: `DATABASE.md` bagian 13).
- **Diterapkan (24 Okt 2026, DEC-031):** argon2id (paket `argon2`, parameter default m=64 MiB, t=3, p=4, belum di-benchmark). Password akun baru minimal 12 karakter (`PASSWORD_MIN_LENGTH`). Input password login dibatasi 128 karakter. Login dengan username yang tidak ada tetap menjalankan verifikasi argon2 terhadap hash palsu agar waktu respons tidak membedakan kasusnya.

## 4. JWT dan cookie (DEC-013, PROPOSED)

Rekomendasi: JWT di cookie dengan `HttpOnly`, `Secure` (produksi), `SameSite=Lax`.

- Rahasia penandatanganan JWT dari environment variable, panjang dan acak memadai, dirotasi bila diduga bocor.
- Klaim minimal (identitas pengguna). Hindari data sensitif di payload.
- Masa berlaku dibatasi (kandidat: satu shift kerja, nilai menunggu keputusan). Tidak ada token tanpa kedaluwarsa.
- JWT murni tidak bisa dicabut sebelum kedaluwarsa. Mitigasinya adalah pengecekan status aktif pada tiap request (bagian 1). Pencabutan sesi per perangkat butuh mekanisme tambahan dan tidak dalam scope awal.
- **Terbukti pada audit 1 Nov 2026:** logout hanya menghapus cookie di browser. Salinan token yang diambil sebelum logout tetap diterima `GET /api/auth/me` sampai kedaluwarsa (maksimal 8 jam). Menonaktifkan user langsung memutus token tersebut. Usulan perbaikan (butuh perubahan schema, belum disetujui): kolom versi sesi pada `users` yang dinaikkan saat logout dan dicek di `requireAuth`.
- Jika cookie HttpOnly dipakai:
  - **Jangan** menyimpan token di `localStorage` atau `sessionStorage`.
  - **Jangan** menaruh token di `AuthContext`.
  - **Jangan** membuat interceptor `Authorization: Bearer` untuk token yang tidak terbaca JavaScript.
  - Gunakan pengaturan kredensial request sesuai `API_CONTRACT.md` bagian 10.
  - Terapkan mitigasi CSRF (bagian 5).
  - **Jangan** menyatakan HttpOnly menghilangkan risiko XSS. HttpOnly mencegah script membaca cookie, tetapi script yang berjalan di halaman masih bisa memicu request atas nama pengguna.
- Alternatif yang dipertimbangkan: sesi server-side (bisa dicabut, butuh tabel sesi) dan JWT di browser storage (mudah, tetapi token terbaca jika ada XSS). Detail di `DECISIONS.md` DEC-013.

## 5. CSRF dan validasi Origin

Berlaku karena autentikasi memakai cookie.

- `SameSite=Lax` mengurangi pengiriman cookie pada request lintas situs.
- Request yang mengubah data (POST, PATCH, DELETE) memeriksa header `Origin` (atau `Referer` bila `Origin` tidak ada) terhadap origin aplikasi, dan menolak yang tidak cocok.
- Endpoint mengubah data hanya menerima `Content-Type: application/json`.
- Tidak ada perubahan data lewat metode GET.
- Tidak memakai library token CSRF pada tahap awal, dengan trade-off lebih sederhana tetapi bergantung pada perilaku browser. Evaluasi ulang bila origin dipisah atau klien lain muncul.
- Perilaku harus diuji (bagian 15).

## 6. CORS

- Production: satu origin (FE dilayani Express), jadi CORS tidak diperlukan dan tidak diaktifkan terbuka.
- Development: proxy Vite menjaga satu origin.
- Jika origin dipisahkan kelak: daftar putih origin eksplisit, tanpa wildcard bila memakai kredensial, dan tinjau ulang `SameSite` dan CSRF. Perubahan ini membutuhkan keputusan baru.

## 7. Helmet dan security headers

- Gunakan middleware header keamanan (Helmet atau setara) di `app.ts`.
- Content Security Policy disesuaikan dengan hasil build FE (script, style, font). Uji bahwa aplikasi tetap berfungsi, jangan mematikan CSP hanya karena merepotkan.
- Aktifkan HSTS di production melalui HTTPS. HTTPS disediakan platform hosting. Verifikasi sebelum go-live.
- Atur `trust proxy` sesuai arsitektur hosting agar IP klien dan status HTTPS terbaca benar (penting untuk rate limiting dan cookie `Secure`). Verifikasi perilaku di platform pilihan.
- Nonaktifkan header yang membocorkan teknologi (`X-Powered-By`).

## 8. Rate limiting

- Wajib pada endpoint login. Tambahkan batas wajar secara umum pada API.
- Penguncian akun permanen setelah beberapa gagal bisa dipakai untuk menyerang ketersediaan akun. Pilih backoff bertahap berdasarkan kombinasi IP dan username.
- Penyimpanan counter in-memory cukup untuk satu instance. Jika instance lebih dari satu, butuh penyimpanan bersama.
- Angka batas ditetapkan saat implementasi dan dicatat di sini.
- **Diterapkan pada login (24 Okt 2026, `BE/src/services/login-rate-limit.service.ts`):** kunci = IP + username (huruf kecil). 5 kegagalan pertama bebas. Kegagalan ke-6 mengunci 30 detik, ke-7 60 detik, dan seterusnya berlipat dua sampai maksimal 15 menit. Selama terkunci, login ditolak `429 TOO_MANY_REQUESTS`, termasuk dengan password benar. Login sukses mengosongkan counter. Counter dilupakan setelah 15 menit tanpa kegagalan baru, dan entri yang sudah terlupakan disapu saat jumlah kunci mencapai 1000 agar memori tidak tumbuh tanpa batas.
- **Risiko terbuka (Tahap 9):** `trust proxy` belum diatur. Di balik proxy hosting, `req.ip` bisa berupa IP proxy, sehingga kunci praktis menjadi per username dan penyerang dapat mengunci sementara akun orang lain (maksimal 15 menit per siklus). Belum ada batas umum per IP untuk banyak username, dan belum ada rate limit umum untuk API lain.

## 9. Validasi input

- Semua `body`, `query`, `params` divalidasi Zod di backend (`API_CONTRACT.md` bagian 8). Validasi FE tidak dihitung sebagai kontrol keamanan.
- Daftar putih untuk field sort dan filter. Batas panjang string dan ukuran body.
- Jangan memakai input untuk membentuk path file, nama kolom, atau query mentah.

## 10. SQL injection dan Prisma

- Gunakan Prisma Client (query terparameter). Jangan menyambung string SQL dari input.
- Jika SQL mentah dibutuhkan (laporan, penguncian), gunakan bentuk terparameter dari Prisma, bukan variasi yang menerima string mentah. Setiap pemakaian raw query diberi alasan di kode dan ditinjau.
- Akun database aplikasi memakai hak minimum yang praktis bagi penyedia pilihan.

## 11. XSS dan rendering konten

- React meng-escape output secara default. Jangan memakai `dangerouslySetInnerHTML` dengan data dari pengguna atau database.
- Data pengguna (nama produk, catatan) ditampilkan sebagai teks.
- CSP (bagian 7) sebagai lapis tambahan.
- Hati-hati dengan URL dari data pengguna (`href`, `src`). Validasi skema yang diizinkan.

## 12. Secrets dan environment variables

- Rahasia hanya di environment platform dan `.env` lokal. `.env` masuk `.gitignore`. `.env.example` memuat nama tanpa nilai rahasia.
- Tidak ada secret di FE. Variabel `VITE_*` bersifat publik.
- Validasi konfigurasi saat startup. Aplikasi gagal start jika rahasia penting hilang.
- Jika secret pernah masuk git: anggap bocor, rotasi, dan bersihkan sesuai prosedur.
- Akun hosting atas nama toko dengan autentikasi dua faktor.

## 13. Sanitasi log

- Jangan mencatat password, hash password, token, cookie, nomor identitas, atau isi body login.
- Log error memuat konteks teknis (route, id pengguna, id request) tanpa data sensitif.
- Lindungi akses ke log. Tentukan retensi yang wajar.

## 14. Upload file (kondisional)

Upload foto produk **belum disetujui** (Q-15). Jika disetujui, minimal: daftar putih tipe berdasarkan isi (bukan hanya ekstensi), batas ukuran, nama file acak, penyimpanan di luar direktori yang dieksekusi atau di object storage, dan tanpa mengeksekusi file yang diunggah. Tambahkan bagian pengujiannya sebelum fitur dibangun.

## 15. Pengujian akses tidak sah

Integration test (Supertest) minimal untuk:

- Setiap route non-publik tanpa kredensial → 401.
- Role tanpa izin → 403 (untuk tiap route sensitif).
- Token/cookie rusak, kedaluwarsa, atau ditandatangani rahasia lain → 401.
- Pengguna yang dinonaktifkan → ditolak pada request berikutnya.
- Request ubah data dengan `Origin` asing → ditolak.
- Request ubah data dengan `Content-Type` bukan JSON → ditolak.
- Body berisi field `role` atau `userId` palsu → diabaikan.
- Input percobaan injeksi pada parameter pencarian/sort → tidak menghasilkan error SQL atau data tak semestinya.
- Batas rate limit pada login tercapai → ditolak sesuai konfigurasi.

## 16. Error handling di production dan audit

- Error tak terduga: pesan generik ke klien, detail hanya di log.
- Tidak ada stack trace, query, atau path server di response.
- **Audit log** untuk aksi penting (login, gagal login berulang, perubahan harga, pembatalan, penyesuaian stok, perubahan pengguna/role). Daftar final dikonfirmasi bersama owner. Audit log bersifat tambah-saja (`DATABASE.md` bagian 12).
- Pemeliharaan: `npm audit` berkala dan lockfile dikomit.

## 17. Keputusan keamanan yang belum disetujui

| Hal | Status | Keputusan terkait |
|---|---|---|
| JWT di cookie HttpOnly | **ACCEPTED** (diterapkan Tahap 2) | DEC-013 |
| Mitigasi CSRF via SameSite + Origin check | **ACCEPTED** (diterapkan Tahap 2) | DEC-013 |
| Satu origin di produksi (tanpa CORS) | PROPOSED | DEC-014 |
| Algoritma hash password | **ACCEPTED**: argon2id | DEC-031 |
| Matriks hak akses | NEEDS_CONFIRMATION | DEC-018 |
| Masa berlaku sesi | **ACCEPTED**: 8 jam, tanpa refresh token | DEC-013 |
| Daftar aksi yang diaudit | NEEDS_CONFIRMATION | Dengan owner |
| Upload file | NEEDS_CONFIRMATION | Q-15 |
