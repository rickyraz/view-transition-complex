# 03 - Fungsi Core `<ViewTransition />` di React

Dokumen ini menjelaskan fungsi inti `<ViewTransition />` di React dan kaitannya langsung dengan implementasi di project ini.

---

## 1) Fungsi Core `<ViewTransition />`

Fungsi inti `<ViewTransition />` adalah:
- Menandai **bagian UI mana** yang boleh dianimasikan saat transition.
- Menentukan secara deklaratif:
  - **what to animate** (elemen apa)
  - **when to animate** (kapan transisi aktif)
  - **how to animate** (ditentukan lewat CSS view transition pseudo-elements)
- Mendukung **shared element transition** antar area UI.

Intinya, `<ViewTransition />` adalah boundary deklaratif untuk sistem transisi React + browser View Transitions API.

---

## 2) Mental Model Sederhana (Pemula)

Anggap `<ViewTransition />` sebagai "label transisi" untuk satu potongan UI.

Properti penting yang dipakai di project ini:
- `name`: identitas elemen transisi
- `share`: menandai elemen boleh jadi shared transition
- `enter` / `exit`: class khusus saat elemen masuk/keluar
- `update`: class khusus berdasarkan tipe transisi
- `default`: class fallback

Visual akhirnya dikontrol lewat CSS selector `::view-transition-*`.

---

## 3) Kapan `<ViewTransition />` Aktif?

`<ViewTransition />` bekerja saat update terjadi di dalam transition trigger, misalnya:
- `startTransition(...)`
- route navigation dengan `viewTransition` dari router
- update async tertentu

Di project ini, trigger manual banyak lewat helper `withTransitionType(...)` di `src/App.tsx`:
1. `startTransition(...)`
2. `addTransitionType(type)`
3. jalankan update state

Lalu CSS bisa target tipe itu melalui:
- `:active-view-transition-type(...)`

---

## 4) Kaitannya dengan Implementasi Project Ini

## A) Intra-route (dalam halaman)
Ditangani oleh React `<ViewTransition />` di `src/App.tsx`.

Contoh route yang memakai ini:
- `SimpleRoute`
- `MediumRoute`
- `ComplexRoute`
- `EdgeRoute`
- `PerformanceTracksRoute`
- `CompilerIdeRoute`
- `AutoEffectDepsRoute`
- `FragmentRefsRoute`
- `ConcurrentStoresRoute`

## B) Antar-route (navigasi halaman)
Ditangani oleh TanStack Router `viewTransition` di `src/routes/__root.tsx`.

Typed route transition:
- `route-forward`
- `route-backward`

---

## 5) Kenapa Dipakai Pendekatan Hybrid Ketat?

Karena route-level transition dan component-level transition bisa bentrok kalau mengontrol area yang sama.

Di project ini dipisah jelas:
- Antar halaman: router-level transition
- Dalam halaman: component-level transition

Manfaat:
- timing lebih stabil
- lebih mudah debug
- efek smooth lebih konsisten

---

## 6) Bug Nyata yang Jadi Pelajaran

Kasus:
- tab aktif sudah berubah warna, tapi elemen aktif kepotong di ujung nav.

Akar masalah:
- active state benar, tapi scroll viewport nav tidak ikut bergerak.

Fix:
- auto-scroll elemen aktif dengan `scrollIntoView(...)`
- update indikator lagi setelah scroll

Pelajaran penting:
active navigation harus punya dua hal:
1. active styling
2. active visibility

---

## 7) Batasan `<ViewTransition />`

`<ViewTransition />` bukan untuk semua animasi.

Gunakan View Transition untuk:
- perpindahan state/layout besar
- shared element antar region
- route/intra-route transition penting

Gunakan animasi CSS biasa untuk:
- hover
- micro-interaction kecil
- shimmer/loading effect

---

## 8) Checklist Praktis untuk Pemula

1. Tentukan boundary transisi secara jelas.
2. Pakai `name` yang stabil.
3. Gunakan typed transition jika butuh kontrol detail.
4. Sinkronkan CSS selector dengan transition types.
5. Pastikan layout stabil (hindari jumping).
6. Untuk nav horizontal, pastikan active item otomatis terlihat.

---

## Ringkas Satu Kalimat

Di project ini, fungsi core `<ViewTransition />` adalah **mengorkestrasi transisi lokal komponen secara deklaratif dan typed**, sementara navigasi antar-route diserahkan ke TanStack Router agar transisi tidak bentrok.
