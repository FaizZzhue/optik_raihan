
# TECH-STACK-PROFILE.md

> **Tujuan:** Mendokumentasikan tingkat penguasaan teknologi pengguna agar AI coding agent dapat memilih pendekatan implementasi yang sesuai, memberikan bantuan secara proporsional, dan mempertimbangkan kemampuan pengguna dalam menentukan stack proyek.

## 1. Aturan untuk AI Coding Agent

Saat membaca profil ini:

1. Bedakan teknologi yang sudah dikuasai, sedang dipelajari, dan belum dikuasai.
2. Jangan mengubah status kemampuan tanpa konfirmasi eksplisit dari pengguna.
3. Untuk teknologi yang sudah dikuasai, berikan solusi langsung dengan fokus pada kualitas kode, arsitektur, keamanan, performa, maintainability, dan trade-off teknis.
4. Untuk teknologi yang sedang dipelajari, berikan implementasi yang mengikuti praktik baik serta penjelasan pada bagian yang penting.
5. Untuk teknologi yang belum dikuasai, berikan panduan yang jelas dan hindari kompleksitas yang tidak diperlukan.
6. Utamakan stack yang sudah digunakan dalam proyek. Jangan mengganti framework, database, ORM, atau library tanpa alasan teknis yang jelas.
7. Jangan memilih teknologi baru hanya karena populer atau sedang tren. Pertimbangkan kebutuhan proyek, kompatibilitas, keamanan, performa, dan pemeliharaan.
8. Profil ini menjelaskan kemampuan pribadi pengguna, sedangkan `PROJECT-CONTEXT.md` menjelaskan stack dan kondisi aktual proyek. Jangan mencampuradukkan keduanya.
9. Sebelum mengusulkan stack baru, periksa repository, struktur kode, `package.json`, dependency, dan dokumentasi proyek yang tersedia.
10. Jika pengguna secara eksplisit memperbarui kemampuan atau preferensinya, perbarui profil ini berdasarkan pernyataan tersebut.

## 2. Arti Tingkat Kemampuan

Gunakan label berikut untuk mengklasifikasikan tingkat kemampuan.

| Label | Arti | Cara AI sebaiknya membantu |
|---|---|---|
| `Mahir` | Mampu merancang, mengimplementasikan, men-debug, dan menjelaskan trade-off secara mandiri, termasuk kasus kompleks. | Fokus pada arsitektur, optimasi, edge case, code review, dan trade-off. |
| `Kompeten` | Mampu mengerjakan kebutuhan umum secara mandiri, tetapi mungkin membutuhkan bantuan untuk kasus kompleks. | Berikan solusi langsung dengan penjelasan pada keputusan penting. |
| `Familiar` | Memahami konsep dasar dan dapat mengikuti atau memodifikasi implementasi dengan panduan. | Berikan langkah yang jelas dan contoh implementasi. |
| `Sedang dipelajari` | Sedang membangun pemahaman dan pengalaman praktik. | Berikan contoh, penjelasan, dan praktik yang benar. |
| `Pernah digunakan` | Pernah menggunakan teknologi dalam proyek, tetapi penguasaan belum dikonfirmasi. | Jangan menganggap pengguna sudah menguasainya. |
| `Belum dikuasai` | Pengguna menyatakan belum menguasai teknologi tersebut. | Berikan panduan dasar dan hindari kompleksitas yang tidak diperlukan. |
| `Belum dikonfirmasi` | Belum ada informasi yang cukup mengenai kemampuan pengguna. | Jangan membuat klaim tentang kemampuan pengguna. |

**Catatan klasifikasi:** Label `Kompeten` digunakan sebagai klasifikasi operasional untuk teknologi yang dinyatakan sudah dikuasai oleh pengguna. Label ini tidak dimaksudkan sebagai hasil pengujian kemampuan teknis.

## 3. Profil Kemampuan Saat Ini

Status pada bagian ini didasarkan pada konfirmasi pengguna tanggal 27 Oktober 2026. Status dapat diperbarui apabila pengguna memberikan informasi terbaru.

### 3.1 Bahasa Pemrograman

| Teknologi | Tingkat kemampuan | Catatan / bukti konfirmasi |
|---|---|---|
| JavaScript | Kompeten | Dikonfirmasi sudah dikuasai oleh pengguna. |
| TypeScript | Kompeten | Dikonfirmasi sudah dikuasai oleh pengguna. |
| HTML | Kompeten | Dikonfirmasi sudah dikuasai oleh pengguna. |
| CSS | Kompeten | Dikonfirmasi sudah dikuasai oleh pengguna. |
| SQL | Kompeten | Dikonfirmasi sudah dikuasai oleh pengguna. |

### 3.2 Frontend Development

| Teknologi | Tingkat kemampuan | Catatan / bukti konfirmasi |
|---|---|---|
| React | Kompeten | Dikonfirmasi sudah dikuasai oleh pengguna. |
| Next.js | Kompeten | Dikonfirmasi sudah dikuasai oleh pengguna. |
| Vite | Kompeten | Dikonfirmasi sudah dikuasai oleh pengguna. |
| Tailwind CSS | Kompeten | Dikonfirmasi sudah dikuasai oleh pengguna. |
| shadcn/ui | Kompeten | Dikonfirmasi sudah dikuasai oleh pengguna. |
| React Bits | Kompeten | Dikonfirmasi sudah dikuasai oleh pengguna. |
| Vue.js | Belum dikuasai | Pengguna menyatakan belum menguasai Vue. |

### 3.3 Backend dan Integrasi

| Teknologi / konsep | Tingkat kemampuan | Catatan / bukti konfirmasi |
|---|---|---|
| Node.js | Kompeten | Dikonfirmasi sudah dikuasai oleh pengguna. |
| Express.js | Kompeten | Dikonfirmasi sudah dikuasai oleh pengguna. |
| REST API | Kompeten | Dikonfirmasi sudah dikuasai oleh pengguna. |
| Authentication & authorization | Kompeten | Dikonfirmasi sudah dikuasai oleh pengguna. |
| API integration dari frontend | Kompeten | Dikonfirmasi sudah dikuasai oleh pengguna. |
| Laravel | Belum dikuasai | Pengguna menyatakan belum menguasai Laravel. |

### 3.4 Database dan Data Access

| Teknologi | Tingkat kemampuan | Catatan / bukti konfirmasi |
|---|---|---|
| Supabase | Kompeten | Dikonfirmasi sudah dikuasai oleh pengguna. |
| MongoDB | Kompeten | Termasuk teknologi database yang dinyatakan sudah dikuasai oleh pengguna. |
| PostgreSQL | Sedang dipelajari | Pengguna sedang mendalami PostgreSQL. |
| Prisma ORM | Sedang dipelajari | Pengguna sedang mendalami Prisma ORM. |
| SQL schema, migration, dan query | Kompeten | SQL dikonfirmasi sudah dikuasai; detail tingkat penguasaan setiap aspek schema dan migration tidak dinilai secara terpisah. |
| Database lainnya | Belum dikonfirmasi secara individual | Pengguna menyatakan menguasai database lainnya, tetapi teknologi spesifik di luar yang disebutkan belum dirinci. |

### 3.5 Tools, Testing, dan Deployment

| Teknologi / tool | Tingkat kemampuan | Catatan / bukti konfirmasi |
|---|---|---|
| Git dan GitHub | Belum dikonfirmasi | Tingkat penguasaan belum dikonfirmasi secara eksplisit dalam pembaruan profil ini. |
| npm / package manager | Belum dikonfirmasi | Tingkat penguasaan belum dikonfirmasi secara eksplisit. |
| Vercel | Belum dikonfirmasi | Penguasaan deployment belum dikonfirmasi secara eksplisit dalam pembaruan profil ini. |
| Automated testing | Belum dikonfirmasi | Framework testing dan tingkat penguasaan belum dikonfirmasi. |
| CI/CD | Belum dikonfirmasi | Tingkat penguasaan belum dikonfirmasi. |

## 4. Preferensi Teknologi

Bagian ini mencatat teknologi yang dapat diprioritaskan sesuai kebutuhan proyek.

- **Frontend utama:** React dan Next.js.
- **Build tool:** Vite untuk proyek React yang sesuai.
- **Bahasa pemrograman:** JavaScript dan TypeScript.
- **Styling:** Tailwind CSS.
- **Komponen UI:** shadcn/ui.
- **Animasi dan komponen tambahan:** React Bits, jika sesuai dengan kebutuhan dan kompatibilitas proyek.
- **Backend:** Node.js dan Express.js.
- **Database:** Supabase atau MongoDB sesuai kebutuhan proyek.
- **Database yang sedang dipelajari:** PostgreSQL.
- **ORM yang sedang dipelajari:** Prisma ORM.
- **Integrasi:** REST API dan integrasi API dari frontend.
- **Framework yang belum dikuasai:** Vue.js dan Laravel.

Preferensi tersebut bukan instruksi untuk menggunakan seluruh teknologi dalam setiap proyek. Pilih stack berdasarkan kebutuhan, kondisi repository, kompatibilitas, keamanan, performa, dan kemudahan pemeliharaan.

Jangan menggunakan PostgreSQL dan Prisma ORM secara berlebihan atau mengasumsikan pengguna telah menguasai seluruh aspek lanjutannya. Jika proyek mengharuskan penggunaan keduanya, implementasikan dengan praktik baik dan berikan penjelasan pada bagian yang penting.

## 5. Prinsip Implementasi untuk AI Coding Agent

Saat membantu pengguna mengembangkan aplikasi:

1. **Pahami proyek terlebih dahulu.** Baca dokumentasi, struktur folder, konfigurasi, dan dependency sebelum mengubah kode.
2. **Pertahankan stack yang ada.** Jangan melakukan migrasi teknologi tanpa alasan teknis yang kuat.
3. **Utamakan kode yang mudah dipelihara.** Gunakan struktur modular secukupnya, penamaan yang konsisten, dan pemisahan tanggung jawab yang jelas.
4. **Perhatikan keamanan.** Validasi input, tangani error, lindungi kredensial, dan terapkan autentikasi serta otorisasi sesuai kebutuhan.
5. **Jaga integrasi frontend dan backend.** Pastikan kontrak API, tipe data, validasi, dan penanganan error konsisten.
6. **Perhatikan database.** Gunakan schema yang sesuai, relasi yang jelas, constraint, dan query yang efisien.
7. **Hindari dependency yang tidak diperlukan.** Jangan menambahkan library hanya untuk menyelesaikan masalah sederhana yang dapat ditangani dengan stack yang ada.
8. **Lakukan verifikasi.** Jalankan pemeriksaan tipe, lint, build, atau testing yang tersedia dalam proyek.
9. **Jelaskan perubahan penting.** Sertakan alasan teknis untuk keputusan yang berdampak pada arsitektur, keamanan, dan pemeliharaan.
10. **Jangan mengarang hasil pengujian.** Laporkan hanya pemeriksaan yang benar-benar telah dijalankan dan hasil yang benar-benar diperoleh.

## 6. Cara Memperbarui Profil

Ketika pengguna mengonfirmasi perubahan kemampuan:

- Perbarui tingkat kemampuan teknologi yang relevan.
- Catat bukti atau pengalaman singkat yang benar-benar disebutkan pengguna.
- Tambahkan tanggal pembaruan jika berguna.
- Catat bagian yang masih dipelajari jika pengguna menyebutkannya.
- Jangan mengubah teknologi lain yang tidak berkaitan dengan konfirmasi tersebut.
- Jangan mengklaim tingkat `Mahir` tanpa dasar yang memadai.
- Jangan menyimpulkan penguasaan suatu teknologi hanya karena teknologi tersebut pernah muncul dalam proyek.

## 7. Instruksi untuk Memulai Proyek Baru

Sebelum mengusulkan atau mengimplementasikan stack untuk proyek baru:

1. Baca `TECH-STACK-PROFILE.md`.
2. Baca `PROJECT-CONTEXT.md` atau dokumentasi konteks proyek yang tersedia.
3. Periksa stack dan dependency yang benar-benar ada di repository.
4. Tentukan apakah kebutuhan dapat dipenuhi menggunakan stack yang sudah ada.
5. Identifikasi teknologi yang sudah dikuasai dan teknologi yang masih dipelajari.
6. Jika menggunakan PostgreSQL atau Prisma ORM, berikan penjelasan tambahan pada konfigurasi, schema, relasi, migration, dan query yang penting.
7. Jika teknologi yang belum dikuasai diperlukan, jelaskan alasan pemilihannya dan berikan panduan implementasi.
8. Minta persetujuan sebelum mengganti stack utama atau melakukan migrasi besar.

**Prinsip utama:** Pilih solusi yang paling sesuai dengan kebutuhan proyek dan kemampuan pengguna, bukan sekadar teknologi yang sedang populer.
