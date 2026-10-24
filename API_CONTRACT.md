# API_CONTRACT — KP Optik Raihan

> **Tujuan:** menjaga kontrak komunikasi antara frontend dan backend.
> **Status:** DRAFT, menunggu review developer
> **Versi:** 0.1.0
> **Tanggal penyusunan:** 22 Oktober 2026
> **Ruang lingkup:** konvensi REST, format request/response/error, tipe, dan kebijakan kredensial. **Belum ada API yang diimplementasikan.** Semua bentuk di bawah adalah usulan (DEC-021, DEC-013: PROPOSED) dan harus konsisten di seluruh endpoint setelah disetujui.
> **Referensi:** `ARCHITECTURE.md`, `DATABASE.md`, `SECURITY.md`, `STRUCTURE.md`, `DECISIONS.md`

## 1. Konvensi endpoint REST

- Prefix `/api`. Tidak ada segmen versi pada tahap awal karena FE dan BE di-deploy bersamaan (lihat bagian 13).
- Resource berupa kata benda jamak, huruf kecil, kebab-case: `/api/products`, `/api/stock-opnames`.
- Metode:

| Aksi | Metode dan path |
|---|---|
| Daftar | `GET /api/products` |
| Detail | `GET /api/products/:id` |
| Buat | `POST /api/products` |
| Ubah (sebagian) | `PATCH /api/products/:id` |
| Nonaktifkan/hapus | `DELETE /api/products/:id` (data transaksi tidak pernah dihapus permanen, lihat `DATABASE.md`) |
| Aksi domain | `POST /api/sales/:id/void` (kata kerja hanya untuk aksi yang bukan CRUD) |

- Auth: `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`.
- Nama endpoint untuk modul `NEEDS_CONFIRMATION` (pemesanan lensa, pelanggan) tidak ditetapkan.
- Path dan nama field memakai istilah domain yang sama dengan kode (`CODING_STANDARDS.md` bagian 2).

## 2. Format response sukses

```json
{ "data": <objek atau array>, "meta": { ... } }
```

- `data` selalu ada. `meta` opsional (pagination dan sejenisnya).
- Aksi tanpa isi mengembalikan 204 tanpa body.

## 3. Format response error

```json
{
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Stok tidak mencukupi untuk satu atau lebih item.",
    "details": [ { "field": "items.0.quantity", "message": "..." } ]
  }
}
```

- `code`: string stabil untuk dipakai FE (bukan teks bahasa). `message`: teks untuk pengguna. `details`: opsional, untuk error per field atau konteks.
- Kode awal yang diusulkan: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `INSUFFICIENT_STOCK`, `INTERNAL_ERROR`. Daftar final mengikuti yang benar-benar diimplementasikan dan dicatat di sini.
- **Sudah diimplementasikan** (`BE/src/constants/error.constants.ts`):

| Kode | Status | Kapan |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Body JSON rusak, atau validasi Zod gagal (`details` per field) |
| `UNAUTHENTICATED` | 401 | Tanpa sesi, sesi rusak/kedaluwarsa/user nonaktif, atau login gagal (pesan generik) |
| `FORBIDDEN` | 403 | Role tidak berhak, atau Origin/Referer bukan origin aplikasi |
| `NOT_FOUND` | 404 | Resource atau path tidak dikenal (path di bawah `/api` tanpa sesi lebih dulu kena 401) |
| `PAYLOAD_TOO_LARGE` | 413 | Body > 100 KB |
| `UNSUPPORTED_MEDIA_TYPE` | 415 | Request ubah data ber-body yang bukan `application/json` |
| `TOO_MANY_REQUESTS` | 429 | Login terkunci sementara (`SECURITY.md` bagian 8) |
| `INTERNAL_ERROR` | 500 | Error tak terduga, pesan generik "Terjadi kesalahan pada server." |
- Tidak ada stack trace atau detail internal di production.

## 4. HTTP status codes

| Status | Pemakaian |
|---|---|
| 200 | Berhasil (GET, PATCH) |
| 201 | Berhasil membuat resource |
| 204 | Berhasil tanpa body |
| 400 | Request tidak valid (validasi gagal) |
| 401 | Belum login atau sesi tidak valid |
| 403 | Login tetapi tidak berhak |
| 404 | Resource tidak ditemukan |
| 409 | Konflik dengan keadaan data (duplikat, stok tidak cukup) |
| 413 | Body request melebihi batas ukuran |
| 415 | Body request ubah data bukan JSON |
| 429 | Terlalu banyak percobaan (rate limit login) |
| 500 | Error tak terduga |

Status 422 tidak dipakai agar kontrak sederhana. Satu aturan: salah bentuk/nilai input = 400, bertentangan dengan keadaan data = 409.

## 5. Pagination, sorting, filtering, pencarian

- Daftar besar memakai pagination **di server**.
- Query: `?page=1&pageSize=20&sort=createdAt:desc&search=kata`, ditambah filter spesifik per resource (misal `categoryId`, `from`, `to`).
- Nilai default `pageSize` dan batas maksimumnya ditetapkan satu kali dan dicatat di `FE/src/constants/pagination.constants.ts` serta konfigurasi BE (nilai belum ditentukan).
- Response daftar:

```json
{ "data": [ ... ], "meta": { "page": 1, "pageSize": 20, "totalItems": 134, "totalPages": 7 } }
```

- Field yang boleh di-sort dan difilter dibatasi daftar putih per endpoint dan divalidasi, tidak diteruskan mentah ke query.
- Filter tanggal memakai batas hari menurut zona waktu toko (`DATABASE.md` bagian 7).
- Pencarian produk untuk kasir memakai endpoint pencarian dengan batas hasil, bukan memuat seluruh produk.

## 6. Tiga jenis tipe: API, form, database

| Jenis | Tempat | Isi | Catatan |
|---|---|---|---|
| **Tipe database** | BE (Prisma) | Bentuk data di database | **Tidak pernah** diimpor FE dan tidak dikirim mentah ke klien |
| **Tipe API (DTO)** | BE: bentuk response. FE: `src/types/<domain>.ts` | Bentuk JSON yang benar-benar dikirim | Decimal = string, Date = string ISO |
| **Tipe form** | FE: `features/<x>/schemas.ts` lewat `z.infer` | Input pengguna di form | Bisa berbeda dari DTO (misal angka sebagai string input) |

Aturan:
- BE memetakan entitas Prisma ke DTO di service. Field internal (misal hash password, field audit internal) tidak ikut.
- Tipe request dan response endpoint yang sama berada di tempat yang mudah dicari (`types/` global bila lintas fitur, `types.ts` fitur bila spesifik).
- Jangan memakai satu tipe untuk tiga tujuan sekaligus.
- Jika bentuk DTO berubah, ubah BE, tipe FE, dan dokumen ini dalam satu perubahan.

## 7. Konversi Decimal dan Date

- **Uang:** string desimal, misalnya `"1250000.00"`. Jangan `number` agar tidak ada kehilangan presisi. FE hanya memformat untuk tampilan (`utils/format-currency.ts`), tidak menghitung nilai kontrak dengan `number` float.
- **Tanggal/waktu:** string ISO 8601 UTC (`"2026-10-22T03:00:00.000Z"`). FE menampilkan dalam zona waktu toko.
- **Tanggal murni** (tanpa jam, jika dibutuhkan): `YYYY-MM-DD`, dengan arti yang didokumentasikan per field.
- **ID:** sesuai jenis primary key yang diputuskan (`DATABASE.md` bagian 2).
- Enum dikirim sebagai string yang sama dengan constants (`FE/src/constants/`, `BE/src/constants/`). Nilai dibuat konsisten di dua sisi.

## 8. Validasi

- BE memvalidasi semua `body`, `query`, dan `params` dengan Zod (`BE/src/validators/<domain>.validator.ts`) lewat middleware validasi. Kegagalan menghasilkan 400 `VALIDATION_ERROR` dengan `details` per field.
- FE memvalidasi form dengan skema sendiri untuk UX. Kedua skema harus selaras tetapi ditulis terpisah (DEC-026). Kesesuaiannya dijaga lewat integration test endpoint.
- **Field tak dikenal diabaikan** (dibuang oleh `z.object` di `validateBody`), sehingga field seperti `role` atau `userId` di body tidak pernah sampai ke service.

## 9. Autentikasi dan cookie (DEC-013, PROPOSED)

Jika JWT cookie HttpOnly disetujui:

- `POST /api/auth/login` memvalidasi kredensial, menetapkan cookie `HttpOnly`, `Secure` (di produksi), `SameSite=Lax`, `Path=/`, dengan masa berlaku yang ditentukan. Body hanya berisi data user, **bukan token**.
- `POST /api/auth/logout` menghapus cookie.
- `GET /api/auth/me` mengembalikan user saat ini (dipakai FE untuk memulihkan status login setelah reload).
- Request yang mengubah data (POST/PATCH/DELETE) diperiksa header `Origin` dan harus berformat JSON (mitigasi CSRF, lihat `SECURITY.md`).
- Token tidak disimpan di `localStorage` dan tidak ada di `AuthContext`.
- Cookie dan perilakunya (`Secure` di lingkungan lokal HTTP) harus diuji pada lingkungan nyata sebelum dianggap berfungsi.

Jika keputusan berubah, bagian ini, `SECURITY.md`, dan `ARCHITECTURE.md` diperbarui bersamaan.

## 10. Konfigurasi Axios, kredensial, same-origin

- Satu instance di `FE/src/services/api/axios.ts`: `baseURL: "/api"`, header JSON, `withCredentials: true` (aman dan eksplisit meskipun same-origin).
- Development: proxy Vite meneruskan `/api` ke BE agar tetap satu origin. Production: Express melayani FE dan API pada origin yang sama (`ARCHITECTURE.md` bagian 10). CORS tidak diperlukan pada kondisi ini. Jika origin dipisahkan kelak, perlu perubahan terdokumentasi (CORS daftar putih, `SameSite`, CSRF) dan keputusan baru di `DECISIONS.md`.
- Tidak ada interceptor `Authorization: Bearer` pada skema cookie.
- Setiap feature service memakai instance ini. Tidak ada file `api.ts` raksasa berisi seluruh endpoint.

## 11. Penanganan 401 dan 403

- **401:** interceptor mengosongkan state auth dan mengarahkan ke halaman login (menjaga tujuan semula bila memungkinkan). Hindari loop saat memanggil `GET /api/auth/me` pada halaman login.
- **403:** FE menampilkan pesan "tidak berhak" pada konteksnya, tidak mengeluarkan pengguna dari sesi.
- Menyembunyikan menu berdasarkan role hanya soal tampilan. Keputusan akses tetap di BE.

## 12. FE tidak menghitung ulang nilai backend

- FE **tidak** mengirim harga satuan, total, atau stok sebagai dasar perhitungan. Request penjualan hanya memuat identitas produk dan jumlah (ditambah data lain yang dikonfirmasi, seperti pelanggan, metode bayar, diskon: Q-02, Q-04, Q-08, Q-17).
- BE membaca harga dan stok dari database, menghitung total, dan mengembalikannya.
- Ringkasan total di layar sebelum submit adalah **pratinjau**. Nilai resmi adalah yang dikembalikan BE setelah transaksi tersimpan.
- Laporan dan dashboard ditampilkan dari angka yang dihitung BE.

## 13. Versi kontrak dan perubahan

- Dokumen ini adalah sumber kebenaran kontrak. Perubahan kontrak dicatat di bagian riwayat di bawah.
- Karena FE dan BE di-deploy bersamaan, perubahan breaking dikerjakan dalam satu perubahan terkoordinasi (BE + FE + dokumen + test).
- Jika klien lain muncul (aplikasi lain, integrasi), tambahkan segmen versi (`/api/v1`) lewat keputusan baru di `DECISIONS.md`.
- Menambah field opsional pada response tidak breaking. Menghapus, mengganti nama, atau mengubah tipe field adalah breaking.
- Jaga kontrak dengan integration test (Supertest) untuk endpoint kritis.

**Riwayat perubahan kontrak:**

| Tanggal | Perubahan |
|---|---|
| 24 Okt 2026 | `GET /api/health` (publik, tanpa auth): `200 { "data": { "status": "ok", "database": "ok" } }`. Jika database tidak terjangkau: `500 INTERNAL_ERROR` lewat error middleware. |
| 24 Okt 2026 | Format error bagian 3 diterapkan (DEC-021). Kode aktif: `VALIDATION_ERROR`, `NOT_FOUND`, `PAYLOAD_TOO_LARGE`, `INTERNAL_ERROR`. Status 413 ditambahkan ke bagian 4. |
| 24 Okt 2026 | Auth (DEC-013): `POST /api/auth/login` body `{ username, password }` → `200 { data: { id, username, name, role } }` + cookie `access_token` (HttpOnly, SameSite=Lax, Path=/, Max-Age=28800, Secure di production); gagal → `401 UNAUTHENTICATED` "Username atau password salah."; terkunci → `429`. `POST /api/auth/logout` → `204` + hapus cookie (tidak butuh sesi). `GET /api/auth/me` → `200 { data: user }` atau `401`. |
| 24 Okt 2026 | Kode baru: `UNAUTHENTICATED`, `FORBIDDEN`, `UNSUPPORTED_MEDIA_TYPE`, `TOO_MANY_REQUESTS`; status 415 dan 429 ditambahkan. Semua path `/api` selain `/health` dan `/auth/*` wajib sesi (deny by default). POST/PUT/PATCH/DELETE ke `/api` wajib Origin/Referer = `APP_ORIGIN`. |

## 14. Contoh ilustratif (bukan kontrak final)

Membuat penjualan, hanya untuk menunjukkan prinsip bagian 12:

```
POST /api/sales
{ "items": [ { "productId": "<id>", "quantity": 2 } ] }

201
{ "data": { "id": "<id>", "total": "…", "items": [ { "productId": "<id>", "quantity": 2, "unitPrice": "…" } ] } }

409
{ "error": { "code": "INSUFFICIENT_STOCK", "message": "…", "details": [ … ] } }
```

Field tambahan (pelanggan, metode bayar, diskon, nomor transaksi) ditentukan setelah Q-02, Q-04, Q-08, Q-09, dan Q-17 terjawab.
