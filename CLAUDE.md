# CLAUDE.md

Adapter tipis untuk Claude Code. Standar kerja lengkap ada di PADS dan tidak disalin ke sini.

@AGENTS.md
@PREFERENCES.md

## Lokasi dokumen

| Dokumen | Lokasi |
|---|---|
| PADS (standar kerja AI) | `.agents/skills/core/`, `.agents/skills/workflows/`, `.agents/skills/standards/`, `.agents/skills/adapters/`. Rujukan `core/…`, `workflows/…`, `standards/…` di `AGENTS.md` berarti path di bawah `.agents/skills/` |
| Requirement (PRD) | `.agents/docs/PRD.md` |
| Rancangan data (ERD) | `.agents/docs/ERD.md`. Berstatus USULAN, bukan schema yang berlaku (`BE/prisma/schema.prisma`) |
| Fakta proyek dan progres | `PROJECT-CONTEXT.md` dan `todo-list.md` di root |
| Instruksi dan preferensi | `AGENTS.md`, `PREFERENCES.md`, `TECH-STACK-PROFILE.md` di root |

## Untuk repository ini

1. Ikuti `AGENTS.md` (urutan awal, siklus kerja, prioritas instruksi, handoff). Baca dokumen `.agents/skills/core/`, `.agents/skills/workflows/`, `.agents/skills/standards/` yang relevan saja.
2. Baca `PROJECT-CONTEXT.md` (fakta, keputusan, kontrak, aturan data dan keamanan proyek ini) dan `todo-list.md` (tahap aktif, blocker) sebelum mengerjakan task non-trivial.
3. Aturan khusus proyek yang tidak boleh dilanggar tanpa persetujuan developer (rinci di `PROJECT-CONTEXT.md`):
   - Jangan membaca atau mengubah `.env` dan `.env.test`. Hanya `.env.example` yang boleh diperbarui, tanpa nilai rahasia.
   - Jangan menambah, menghapus, atau memperbarui dependency.
   - Jangan mengubah `schema.prisma`, menjalankan migrasi, `db push`, atau reset database.
   - Jangan mengubah struktur folder baseline, kontrak API yang sudah dipakai FE, strategi auth, atau keputusan berstatus `ACCEPTED`.
   - Jangan mengerjakan fitur berstatus `NEEDS_CONFIRMATION` atau `OUT_OF_SCOPE`.
   - Jangan mengarang hasil test. Laporkan perintah dan output aslinya; jika tidak dijalankan, katakan.
4. Perbarui `PROJECT-CONTEXT.md` dan `todo-list.md` bila fakta atau status berubah (lihat `.agents/skills/standards/DOCUMENTATION.md`).
