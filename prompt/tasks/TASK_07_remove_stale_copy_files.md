# TASK 07 - Remove Stale Copy Files

> Status: REGRESSED - file yang tercatat "dihapus" di bawah masih tracked di
> branch aktif (audit 2026-09-19). Lihat `prompt/docs/FINDINGS_LOG.md` temuan #6.

## Tujuan

Membersihkan file salinan/debug lama agar pencarian kode dan maintenance tidak
rawan salah acuan.

## Perubahan

- Menghapus file PHP/JSX salinan dengan pola `copy`, `copy 2`, `copy 3`, dan
  `- Copy`.
- Memastikan tidak ada reference aktif ke nama file salinan di `app`,
  `resources`, `routes`, `config`, `database`, atau `tests` sebelum dihapus.

## File Dihapus

- `app/Exports/FormatBPKPNonKlinisExport copy.php`
- `app/Http/Controllers/RiskRegisterNonKlinisController copy.php`
- `app/Http/Controllers/OpsiPengendalianController - Copy.php`
- `resources/js/Pages/Welcome copy.jsx`
- `resources/js/Layouts/Sidebar copy.jsx`
- `resources/js/Components/Modal/ExportModal copy.jsx`
- `resources/js/Components/ComboboxMultiple copy.jsx`
- `resources/js/Pages/Dashboard copy.jsx`
- `resources/js/Pages/Dashboard copy 2.jsx`
- `resources/js/Pages/Dashboard copy 3.jsx`
- `resources/js/Pages/RiskRegister/Klinis/Index copy.jsx`
- `resources/js/Pages/RiskRegister/Klinis/Form copy.jsx`
- `resources/js/Pages/RiskRegister/NonKlinis/Index copy.jsx`

## Verifikasi

- `rg --files | rg -i "(^|[\\/])(.* copy( [0-9]+)?\\.(php|jsx|js|css|md)$|.* - Copy\\.(php|jsx|js|css|md)$)"` - tidak ada hasil.
