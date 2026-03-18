# Pembelajaran React Dev Pemula
## 02 - Implementasi View Transition Supaya Smooth

Dokumen ini fokus khusus ke praktik View Transition yang sudah dipakai di project: antar route, intra-route, dan tips menghindari efek "jumping".

---

## 1) Konsep Dasar

Di project ini ada 2 level animasi:

### A. Route-level (antar halaman)
Di-handle oleh TanStack Router (`viewTransition` pada `Link`).

### B. Intra-route (di dalam halaman)
Di-handle oleh React ViewTransition + typed transitions di komponen route.

Ini disebut pendekatan **hybrid ketat**.

---

## 2) Kenapa Hybrid Ketat Dipakai

Kalau semua hal dianimasikan oleh satu layer tanpa batas yang jelas, efeknya sering:
- timing bentrok
- terasa kurang smooth
- susah debug

Dengan hybrid ketat:
- route change: fokus di router-level
- update internal komponen: fokus di component-level

Hasilnya: lebih mudah kontrol dan lebih konsisten.

---

## 3) Implementasi Route-Level View Transition

Lokasi utama: `src/routes/__root.tsx`.

Yang dilakukan:
- Set `viewTransition` pada setiap `Link` route.
- Hitung direction transisi lewat `resolveRouteTypes(...)`:
  - `route-forward`
  - `route-backward`

Typed transition ini dipakai oleh CSS selector:
- `:active-view-transition-type(route-forward)`
- `:active-view-transition-type(route-backward)`

---

## 4) Implementasi Intra-Route View Transition

Lokasi utama: `src/App.tsx`.

Contoh typed transition yang sudah dipakai:
- `scene-swap`, `scene-expand`
- `kanban-move`, `kanban-density`, `kanban-energy`
- `mission-nav`, `sync-seed`, `async-resolve`, `diag-toggle`
- `edge-focus`, `edge-queue`, `edge-severity`, `edge-filter`
- `perf-sample`, `perf-focus`, `compiler-fix`, `auto-mode`, `fragment-measure`, `store-enqueue`, `store-flush`

Helper yang dipakai:
- `withTransitionType(type, update)`
  - memanggil `startTransition(...)`
  - menambahkan `addTransitionType(type)`

---

## 5) Hal yang Membuat Transisi Terasa Smooth

### 1) Active indicator presisi
- Indicator nav tidak statis.
- Diukur dari elemen aktif (`left/top/width/height`).

### 2) Active tab selalu terlihat
- Saat route aktif berubah, tab aktif di-scroll ke viewport.
- Pakai `scrollIntoView({ inline: 'center', block: 'nearest' })`.

### 3) Layout stabil
- `.route-canvas` punya `min-height` untuk mengurangi lompatan tinggi antar route.
- Topbar copy distabilkan agar judul panjang tidak mengubah layout drastis.

### 4) Styling delta tidak terlalu ekstrem
- Tab non-active tetap punya baseline style.
- Active state menonjol tapi tidak terlalu "meloncat".

### 5) Preload route
- Link nav memakai `preload="render"` supaya perpindahan route tidak nunggu lama.

---

## 6) Biang Kerok yang Sering Terjadi (dan Terjadi di Project Ini)

### Kasus: active route benar tapi tidak kelihatan
Gejala:
- pill biru muncul
- tapi kepotong di sisi kanan/kiri

Biang kerok:
- overflow horizontal aktif
- scroll container tidak sinkron dengan state aktif

Fix:
- auto focus visual ke active element dengan `scrollIntoView`

---

## 7) CSS Kunci yang Dipakai

Lihat `src/App.css`:
- `.route-nav`
  - `overflow-x: auto`
  - `flex-wrap: nowrap`
  - `scroll-padding-inline`
- `.route-nav::before`
  - indicator aktif (sliding pill)
- `.route-pill`
  - baseline + active text color
- typed view transition selectors
  - `::view-transition-group(...)`
  - `:active-view-transition-type(...)`

---

## 8) Debug Checklist Kalau Animasi Terasa Tidak Smooth

1. Cek apakah route-level dan component-level saling overlap di area yang sama.
2. Cek apakah active element ter-scroll ke viewport saat route ganti.
3. Cek apakah ada layout shift dari judul panjang / konten tinggi.
4. Cek preload strategy (`intent` vs `render`) untuk route penting.
5. Cek typed transition CSS selector cocok dengan `addTransitionType` / `viewTransition.types`.

---

## 9) Tips untuk React Dev Pemula

- Mulai dari transisi sederhana dulu (durasi + easing).
- Baru tambahkan typed transitions setelah alur state stabil.
- Pastikan nav active bukan cuma berubah warna, tapi juga **terlihat penuh**.
- Pikirkan UX sebagai kombinasi:
  - state correctness
  - visual correctness
  - viewport correctness

---

## 10) Rangkuman

Implementasi smooth bukan hanya soal animasi CSS. Yang paling penting justru sinkronisasi:
- route state
- active indicator
- viewport nav
- stabilitas layout

Kalau keempat ini sinkron, transisi akan terasa natural dan "engineered".
