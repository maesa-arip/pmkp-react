# MASTER PROMPT - SIMDALIN (EXISTING APP MAINTENANCE)
# Versi 1.0

Dokumen ini adalah sumber kebenaran disiplin kerja untuk merawat, mengaudit, dan
memperbaiki aplikasi SIMDALIN yang sudah ada. Bukan untuk membangun dari nol.

Setiap sesi menerima: file ini + `prompt/docs/ARCHITECTURE_MAP.md` +
`prompt/docs/CONVENTIONS.md` + satu file task aktif. Kerjakan satu task sampai
tuntas, lalu berhenti dan laporkan.

## Prinsip Utama

Kode yang sudah jalan adalah aset. Tugas perubahan adalah memperbaiki yang rusak
dengan risiko serendah mungkin, bukan menulis ulang sesuai selera.

1. Understand -> Change -> Verify. Jangan mengedit file yang belum dibaca.
2. Reversibilitas. Perubahan harus kecil, fokus, dan mudah di-review.
3. Match, don't impose. Ikuti gaya dominan di area yang disentuh.
4. Surface, don't surprise. Temuan di luar scope dicatat ke findings, bukan
   diperbaiki diam-diam.

## Disiplin Perubahan

- Satu task = satu tujuan.
- Diff minimal: jangan reformat, rename, atau refactor di luar scope.
- Jangan upgrade dependency kecuali task khusus memintanya.
- Jangan menambah library baru untuk fix kecil.
- Hapus kode hanya setelah mencari pemakaiannya dan menjelaskan alasan.
- Ikuti pola flash Inertia, validation Laravel, resource collection, dan layout
  React yang sudah ada.

## Keamanan Regresi

1. Baseline dulu: jalankan `php artisan test` sebelum perubahan dan catat yang
   sudah merah. Baseline per 2026-09-19 adalah 6 failed / 133 passed. Test
   berjalan di atas `dev_simdalin` dan wajib memakai `DatabaseTransactions`;
   `tests/TestCase.php` menolak trait yang men-drop tabel (lihat TASK_08).
2. Reproduce bug sebelum memperbaiki.
3. Tambah atau ubah test untuk bug bila memungkinkan.
4. Sesudah fix: jalankan test terkait dan build frontend bila UI tersentuh.
5. Jika test suite masih merah karena baseline, pastikan tidak menambah kegagalan.
6. Untuk perubahan alur register risiko, IKP, mutu, export, atau permission,
   verifikasi manual karena area itu bergantung pada data seeded/backup.

## Standar Investigasi Bug

```
1. Reproduce    -> langkah atau test yang menunjukkan bug
2. Isolate      -> file:line dan jalur eksekusi
3. Root cause   -> sebab utama, bukan gejala
4. Blast radius -> pemakai kode/route/model yang terdampak
5. Fix          -> perubahan terkecil yang benar
6. Verify       -> test + langkah manual
```

## Anti-Pola Yang Dilarang Saat Memperbaiki

- Menulis ulang modul besar untuk bug kecil.
- Drive-by refactor file yang tidak terkait.
- Menonaktifkan/menghapus test agar hijau.
- Menelan error diam-diam.
- Mengubah kontrak route, props Inertia, atau skema DB tanpa task khusus.
- Meninggalkan `dd()`, `console.log`, debug, atau file copy baru.

## Laporan Task

```
## LAPORAN TASK [ID] - [JUDUL]

### Masalah & akar penyebab
- Gejala: ...
- Root cause: file:line - ...

### Perubahan
- path/to/file - apa yang diubah & kenapa

### Verifikasi
- Test: ...
- Build/lint: ...

### Blast radius / risiko sisa
- ...

### Temuan baru
- ...

### Aman di-merge?
YA / TIDAK - alasan
```
