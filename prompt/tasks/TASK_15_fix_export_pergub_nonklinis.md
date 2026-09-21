# TASK 15 - EXPORT PERGUB NON KLINIS GAGAL TOTAL

| Field | Isi |
|-------|-----|
| ID | TASK_15 |
| Severity | P1 |
| Tipe | perbaikan bug - SQL only_full_group_by |
| Status | DONE 2026-09-21 |
| Temuan | `prompt/docs/FINDINGS_LOG.md` #35 |

## Masalah

Menu "PERGUB Non Klinis" di Report Risiko tidak pernah menghasilkan berkas. MySQL
menolak query sheet REGISTER RISIKO:

```
SQLSTATE[42000]: 1055 Expression #N of SELECT list is not in GROUP BY clause and
contains nonaggregated column 'dev_simdalin.risk_gradings.name_klinis_pergub'
```

Diuji pada versi asli (sebelum seluruh pekerjaan sesi ini): **2024, 2025, dan
2026 sama-sama gagal**. Jadi bukan masalah tahun 2026 dan bukan regresi dari
TASK_13 - exportnya memang tidak pernah jalan.

## Root Cause

`FormatLARSDHPNonKlinisExport` sheet REGISTER RISIKO memilih peringkat risiko
lewat CASE yang ditulis tangan di dalam `selectRaw`:

```sql
CASE COALESCE((SELECT value FROM risk_grading_settings WHERE `key` = "export_lars_dhp_nonklinis" ...)
    WHEN "nonklinis"       THEN risk_gradings.name_nonklinis
    WHEN "klinis_pergub"   THEN risk_gradings.name_klinis_pergub
    WHEN "bpkp"            THEN risk_gradings.name_bpkp
    WHEN "klinis_bpkp"     THEN risk_gradings.name_klinis_bpkp
    WHEN "nonklinis_bpkp"  THEN risk_gradings.name_nonklinis_bpkp
    ELSE risk_gradings.name_nonklinis_pergub
END as grading_name
```

CASE itu menyentuh **enam** kolom `risk_gradings.name_*`, sedangkan `groupBy`
hanya mendaftar **tiga** (`name_nonklinis`, `name_nonklinis_pergub`, `name_bpkp`).
Dengan `only_full_group_by` aktif, tiga kolom sisanya membuat query ditolak.

Dua daftar itu ditulis tangan secara terpisah, jadi tidak ada yang menjaga
keduanya tetap sinkron.

## Perubahan

`app/Exports/FormatLARSDHPNonKlinisExport.php`, mengikuti opsi kedua pada temuan
#35 - setting dibaca di PHP, bukan di SQL, sehingga hanya satu kolom disentuh:

- `selectRaw`: CASE 8 baris diganti satu pemanggilan
  `RiskGrading::selectNameSql('risk_gradings', 'export_lars_dhp_nonklinis', 'nonklinis_pergub', 'grading_name')`
- `groupBy`: tiga entri grading diganti satu
  `DB::raw(RiskGrading::nameColumnSql('risk_gradings', 'export_lars_dhp_nonklinis', 'nonklinis_pergub'))`

Select dan groupBy sekarang memanggil helper yang sama dengan argumen yang sama,
jadi mengubah setting grading tidak bisa lagi membuat keduanya tidak sinkron.
Pola ini sudah dipakai `FormatBPKPExport` (`RiskGrading::selectNameSql('risk_grading3', ...)`).

Diff: 9 baris dihapus, 4 baris ditambah. Tidak ada sheet lain yang disentuh.

## Verifikasi

Export berhasil untuk seluruh tahun yang punya periode:

| Tahun | Hasil |
|-------|-------|
| 2023 | 152.608 bytes |
| 2024 | 167.125 bytes |
| 2025 | 189.375 bytes |
| 2026 | 83.660 bytes |

Isi kolom peringkat inherent (kolom S sheet REGISTER RISIKO, `nk-2025.xlsx`)
memakai penamaan pergub sesuai setting `nonklinis_pergub`: EKSTRIM, TINGGI,
SEDANG, RENDAH, SANGAT RENDAH.

Tiga export register lain tidak terpengaruh - dibandingkan sel per sel terhadap
keluaran sebelum task ini:

| Export | Sel dibandingkan | Sel berbeda |
|--------|------------------|-------------|
| `FormatBPKPExport` | 23.249 | 0 |
| `FormatLARSDHPKlinisExport` | 6.393 | 0 |
| `FormatSedangTerjadiExport` | 23.249 | 0 |

```
php artisan test
Tests: 1 failed, 167 passed
```

Sama dengan baseline; satu-satunya merah `ExampleTest` (temuan #2). Tidak ada
test baru: perbaikan ini murni SQL dan terbukti lewat pembangkitan berkas nyata
pada empat tahun, sedangkan satu proses PHP hanya boleh memuat satu
`Format*Export` (temuan #25) sehingga test unduhan tidak bisa mencakup keempat
export sekaligus.

## Temuan baru

#36 - pada sheet yang sama, kolom peringkat residual/treated/actual memakai
`grading2.name` / `grading3.name` / `grading4.name`, yaitu kolom `name` mentah
alias penamaan **klinis**, sehingga satu sheet mencampur dua penamaan: kolom S
berisi EKSTRIM/TINGGI sedangkan kolom AA berisi Extreme/High. Tidak diperbaiki di
sini karena mengubah teks yang terlihat pengguna dan itu keputusan pemilik
laporan.

## Aman di-merge?

YA. Menyentuh satu sheet pada satu berkas, tidak mengubah route, props, maupun
skema. Export yang tadinya selalu gagal kini menghasilkan berkas, dan tiga export
lain terbukti tidak bergeser satu sel pun.

Uji manual: buka Report Risiko > PERGUB Non Klinis, unduh setahun penuh 2025 dan
2026, pastikan berkas terbentuk dan kolom PERINGKAT RISIKO pertama berisi
EKSTRIM/TINGGI/SEDANG/RENDAH.
