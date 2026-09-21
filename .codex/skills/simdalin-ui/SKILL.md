---
name: simdalin-ui
description: >-
  Existing UI/UX conventions for the SIMDALIN frontend, reverse-engineered from
  the React/Inertia code in resources/js. Use whenever editing, fixing, or
  reviewing SIMDALIN frontend screens, components, forms, layouts, tables, or
  Inertia page props.
---

# SIMDALIN Frontend Conventions

This skill captures how the SIMDALIN frontend is already built. For an existing
app, conform to the dominant pattern near the file being edited.

## Stack Terdeteksi

```
React 18
@inertiajs/react
laravel-vite-plugin
Tailwind CSS 3 with @tailwindcss/forms
react-hot-toast
@heroicons/react and @tabler/icons
lodash debounce/pickBy
react-select, react-datepicker
dayjs and moment available
```

Sumber: `package.json`, `resources/js/app.jsx`, `tailwind.config.js`.

## Pola Yang Harus Ditiru

| Kebutuhan | Pola repo ini | File patokan |
|-----------|---------------|--------------|
| Page Inertia | Page berada di `resources/js/Pages/**`, die-resolve oleh nama string dari backend | `resources/js/app.jsx` |
| Layout | Set `Page.layout = ...`; master sederhana memakai `MasterDataIndex.layout` | `resources/js/Pages/Master/RiskCategory/Index.jsx` |
| List master data | Gunakan `MasterDataIndex` dengan props title, description, route delete, columns, Create/Edit | `resources/js/Components/MasterDataIndex.jsx` |
| Fetch/filter/sort | Gunakan `router.get(route(route().current()), pickBy(params), { preserveState, preserveScroll })` dengan debounce | `resources/js/Components/MasterDataIndex.jsx` |
| Empty state | Empty state berada dalam area table dengan icon `CircleStackIcon` dan teks title/description | `resources/js/Components/MasterDataIndex.jsx` |
| Form sederhana | Form menerima `errors`, `submit`, `data`, `setData`, `closeButton`; input memakai komponen shared | `resources/js/Pages/Master/RiskCategory/Form.jsx` |
| Error form | Tampilkan `InputError` di bawah field | `resources/js/Pages/Master/RiskCategory/Form.jsx` |
| Input | Pakai `InputLabel`, `TextInput`, `TextInputWithError`, atau komponen UI existing | `resources/js/Components/TextInputWithError.jsx` |
| Modal CRUD | Pakai `AddModal`, `EditModal`, `DestroyModal` | `resources/js/Components/MasterDataIndex.jsx` |
| Notifikasi | Flash `type`/`message` dari Inertia ditampilkan dengan `react-hot-toast` | `resources/js/Layouts/AuthenticatedLayout.jsx` |
| Icon aksi | Pakai Heroicons untuk plus, search, edit, delete, dropdown | `resources/js/Components/MasterDataIndex.jsx` |
| Warna | Tailwind utility dengan slate/sky/cyan untuk UI modern; dark mode memakai class | `resources/js/Components/MasterDataIndex.jsx`, `tailwind.config.js` |

## Aturan Saat Mengedit UI

1. Tiru file sekitar dan komponen shared existing sebelum membuat komponen baru.
2. Jangan tambah library UI baru untuk perbaikan kecil.
3. Pertahankan kontrak props Inertia dari controller/resource.
4. Untuk master data sederhana, pilih `MasterDataIndex` daripada membuat table baru.
5. Untuk destructive action, gunakan modal existing, bukan `window.confirm`.
6. Untuk operasi sukses/gagal dari backend, gunakan flash `type` dan `message`.
7. Jalankan `npm run build` bila menyentuh React/CSS/Vite.
8. Jangan membersihkan file copy atau komentar lama kecuali task memang cleanup.

## Anti-Pola UI Yang Ada

- File copy seperti `Dashboard copy.jsx` dan `Index copy.jsx`; jangan jadikan acuan
  utama.
- Beberapa halaman lama punya status loading/error yang tidak seragam; saat
  menyentuh halaman, ikuti pola shared terbaru di `MasterDataIndex`.
- Ada campuran icon Heroicons dan Tabler; pilih yang sudah dipakai di area sekitar.
