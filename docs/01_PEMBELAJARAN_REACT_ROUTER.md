# Pembelajaran React Dev Pemula
## 01 - TanStack Router File-Based + Struktur Proyek

Dokumen ini menjelaskan fondasi routing yang sudah diimplementasi pada project.

---

## Tujuan

- Membuat navigasi antar halaman yang rapi, scalable, dan type-safe.
- Menyatukan route metadata, active state, dan UX nav horizontal.
- Menjadi base yang mudah dipahami React dev pemula.

---

## Stack Routing

Lihat `package.json`:
- `@tanstack/react-router`
- `@tanstack/router-plugin`
- `@tanstack/router-cli`

Script penting:
- `pnpm routes:generate`
- `pnpm routes:watch`

---

## Arsitektur yang Dipakai

### 1) Entry App
- `src/main.tsx`
  - Mount `<RouterProvider router={router} />`.

### 2) Router Setup
- `src/router.tsx`
  - `routeTree` dari file generated.
  - `defaultPreload: 'intent'`.
  - `defaultViewTransition: true`.

### 3) Route Tree Generated
- `src/routeTree.gen.ts`
  - Auto-generated.
  - Jangan edit manual.

### 4) Root Layout
- `src/routes/__root.tsx`
  - Header + nav route horizontal.
  - Active indicator sliding.
  - Auto-scroll tab aktif agar terlihat penuh.
  - `<Outlet />` untuk konten route aktif.
  - fallback `notFound` ke `/simple`.

### 5) File-Based Route Mapping
- `src/routes/index.tsx` -> redirect `/` ke `/simple`
- `src/routes/simple.tsx`
- `src/routes/medium.tsx`
- `src/routes/complex.tsx`
- `src/routes/edge.tsx`
- `src/routes/perf-tracks.tsx`
- `src/routes/compiler-ide.tsx`
- `src/routes/auto-effects.tsx`
- `src/routes/fragment-refs.tsx`
- `src/routes/concurrent-stores.tsx`

---

## Komposisi Komponen

Di fase pembelajaran ini, komponen route masih diekspor dari `src/App.tsx`:
- `SimpleRoute`
- `MediumRoute`
- `ComplexRoute`
- `EdgeRoute`
- `PerformanceTracksRoute`
- `CompilerIdeRoute`
- `AutoEffectDepsRoute`
- `FragmentRefsRoute`
- `ConcurrentStoresRoute`

Metadata route juga ada di `src/App.tsx`:
- `routeOrder`
- `routeMeta`

Kelebihan pendekatan ini untuk pemula:
- Semua logika mudah dicari.
- Tidak perlu lompat banyak file di awal.
- Nanti bisa dipecah bertahap per feature.

---

## Manipulasi Route yang Sudah Dibuat

### Active route robust
Di `src/routes/__root.tsx`, dipakai resolver aktif:
- exact match (`/complex`)
- nested match (`/complex/details`)
- fallback `/simple`

### Direction-aware route transition
Masih di `src/routes/__root.tsx`, direction route dihitung dari `routeOrder`:
- ke index lebih besar -> `route-forward`
- ke index lebih kecil -> `route-backward`

Direction dipassing ke:
- `Link viewTransition.types`

### Redirect handling
- `/` diarahkan ke `/simple`.
- route tidak dikenal diarahkan ke `/simple`.

---

## Bug Nyata dan Solusi Engineering

### 1) Active tab tidak terlihat penuh
Penyebab:
- nav overflow horizontal
- active state berubah, tapi scroll container tidak ikut bergerak

Solusi:
- auto-scroll elemen aktif dengan `scrollIntoView(...)`

### 2) Indicator active tidak presisi
Penyebab:
- ukuran indicator statis

Solusi:
- ukur elemen aktif (`left/top/width/height`) lalu injeksi ke CSS variable

### 3) Header jump karena judul panjang
Penyebab:
- `<h1>` wrap menambah tinggi topbar

Solusi:
- stabilkan slot judul (`flex: 1`, `min-width: 0`, clamp heading)

---

## Accessibility Dasar

Pada link route aktif:
- `aria-current="page"`

Ini penting agar screen reader tahu halaman aktif.

---

## Checklist Validasi

1. `pnpm lint` harus clean.
2. `pnpm build` harus sukses.
3. Klik route panjang, active tab tetap terlihat penuh.
4. Coba browser back/forward, state aktif tetap sinkron.
5. Coba judul route panjang, topbar tidak loncat berlebihan.

---

## Cara Menambah Route Baru

1. Tambah komponen route di `src/App.tsx` (atau file terpisah).
2. Tambah `routeOrder` + `routeMeta`.
3. Buat file route baru di `src/routes/*.tsx`.
4. Jalankan `pnpm routes:generate`.
5. Test route aktif, transisi, dan responsive.

---

Dokumen ini adalah fondasi. Lanjut ke dokumen no. 2 untuk fokus khusus View Transition.
