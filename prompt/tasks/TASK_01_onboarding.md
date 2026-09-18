# TASK 01 - ONBOARDING / PEMETAAN CODEBASE (READ-ONLY)

| Field | Isi |
|-------|-----|
| ID | TASK_01 |
| Severity | - |
| Tipe | investigasi read-only |
| Status | DONE |

## Tujuan

Memahami aplikasi SIMDALIN existing dan menuangkannya ke dokumen agar task
perbaikan berikutnya aman.

## Hasil

- [x] `CLAUDE.md`
- [x] `prompt/MASTER_PROMPT.md`
- [x] `prompt/AUDIT_CHECKLIST.md`
- [x] `prompt/docs/ARCHITECTURE_MAP.md`
- [x] `prompt/docs/CONVENTIONS.md`
- [x] `prompt/docs/FINDINGS_LOG.md`
- [x] `.claude/skills/simdalin-ui/SKILL.md`

## Baseline

- `php artisan route:list`: berhasil, 273 routes.
- `php artisan test`: gagal baseline, 23 failed dan 1 passed. Error utama adalah
  FK migration `fgd_actuals` ke `risk_registers` ketika database test kosong.

## Catatan

Tidak ada kode aplikasi diubah pada task ini. Perubahan hanya menambahkan dokumen
prompt/audit dan skill UI lokal.
