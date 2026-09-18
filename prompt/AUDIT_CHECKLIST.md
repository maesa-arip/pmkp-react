# AUDIT CHECKLIST - SIMDALIN

Gunakan checklist ini untuk audit aplikasi existing. Hasil temuan dicatat ke
`prompt/docs/FINDINGS_LOG.md` dengan severity P0-P3. Audit berarti membaca dan
mencatat; perbaikan dibuat sebagai task terpisah.

Severity:
- P0: keamanan, kehilangan data, atau risiko data penting.
- P1: bug fungsional.
- P2: inkonsistensi atau technical debt yang nyata.
- P3: kosmetik/minor.

## Keamanan

- Endpoint sensitif memiliki authentication dan authorization.
- Query sort/filter dari request memakai whitelist kolom.
- Tidak ada IDOR: objek dicek hak aksesnya, bukan hanya ID valid.
- Input server-side divalidasi.
- Password di-hash, token tidak bocor di log/response.
- Upload/export file memvalidasi tipe, path, dan parameter.
- `.env` tidak ikut commit dan rahasia tidak di-hardcode.

## Correctness

- Route tidak mengandung whitespace tak sengaja.
- Migration dapat dijalankan dari database kosong.
- Update status risk register menjaga riwayat dengan konsisten.
- Delete data penting tidak menghapus audit trail tanpa task eksplisit.
- Tanggal memakai Carbon dengan timezone yang jelas.

## Konsistensi

- Response Inertia memakai resource + `additional` metadata seperti pola existing.
- Flash memakai `type` dan `message`.
- Frontend list memakai pola `MasterDataIndex` untuk master data sederhana.
- Form memakai `useForm`, `InputLabel`, `TextInput`, `InputError`, dan tombol existing.

## Test & Build

- `php artisan test` dicatat baseline sebelum perubahan.
- `npm run build` dijalankan bila menyentuh React/CSS/Vite.
- Test terkait ditambah bila memperbaiki bug yang bisa direproduksi.

## Performa

- List besar memakai pagination.
- Relasi list memakai eager loading untuk menghindari N+1.
- Export berat tidak mengambil data lebih dari yang diperlukan.
