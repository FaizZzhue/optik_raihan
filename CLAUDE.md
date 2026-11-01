# CLAUDE.md

Adapter tipis untuk Claude Code. Standar kerja lengkap ada di PADS dan tidak disalin ke sini.

@AGENTS.md
@PREFERENCES.md

## Untuk repository ini

1. Ikuti `AGENTS.md` (urutan awal, siklus kerja, prioritas instruksi, handoff). Baca dokumen `core/`, `workflows/`, `standards/` yang relevan saja.
2. Baca `PROJECT-CONTEXT.md` (fakta, keputusan, kontrak, aturan data dan keamanan proyek ini) dan `todo-list.md` (tahap aktif, blocker) sebelum mengerjakan task non-trivial.
3. Aturan khusus proyek yang tidak boleh dilanggar tanpa persetujuan developer (rinci di `PROJECT-CONTEXT.md`):
   - Jangan membaca atau mengubah `.env` dan `.env.test`. Hanya `.env.example` yang boleh diperbarui, tanpa nilai rahasia.
   - Jangan menambah, menghapus, atau memperbarui dependency.
   - Jangan mengubah `schema.prisma`, menjalankan migrasi, `db push`, atau reset database.
   - Jangan mengubah struktur folder baseline, kontrak API yang sudah dipakai FE, strategi auth, atau keputusan berstatus `ACCEPTED`.
   - Jangan mengerjakan fitur berstatus `NEEDS_CONFIRMATION` atau `OUT_OF_SCOPE`.
   - Jangan mengarang hasil test. Laporkan perintah dan output aslinya; jika tidak dijalankan, katakan.
4. Perbarui `PROJECT-CONTEXT.md` dan `todo-list.md` bila fakta atau status berubah (lihat `standards/DOCUMENTATION.md`).
