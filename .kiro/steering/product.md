# Life Dashboard: aturan produk dan teknis

Dokumen ini mengikat. Kalau instruksi di chat bertentangan dengan dokumen ini, sebutkan
konfliknya lebih dulu, lalu ikuti dokumen ini sampai saya bilang lain. Jangan diam-diam
mengubah keputusan di sini.

## 1. Yang dibangun

Satu halaman statis untuk satu orang, dibuka pagi hari sebagai tab pertama, dipakai 15
sampai 30 detik. Isinya: jam, sapaan, timer fokus, daftar tugas hari itu, tautan yang
sering dibuka.

Ukuran keberhasilan: orang bisa tahu jam berapa sekarang, tahu apa yang harus dikerjakan
pertama, dan mulai fokus, tanpa mengklik apa pun selain tombol Mulai.

Ukuran kegagalan: halaman ini terasa seperti template dashboard yang bisa ditukar
dengan produk lain hanya dengan mengganti nama.

## 2. Ini aplikasi, bukan landing page

Tidak ada hero, tidak ada subheadline penjualan, tidak ada CTA "Get Started", tidak ada
section fitur, testimoni, harga, FAQ, atau footer promosi. Tidak ada navigasi.

Aturan komposisi di skill yang ditulis untuk halaman marketing (foto produk, key art,
urutan section, satu-satunya CTA di hero) tidak berlaku di sini.

Yang berlaku: hierarki dalam satu layar, grid, tipografi, kontras, state kosong dan
error, keyboard, dan disiplin anti-slop.

## 3. Batasan dari brief

Tidak bisa dinegosiasi, walaupun kamu punya cara yang lebih rapi:

- HTML untuk struktur, CSS untuk tampilan, JavaScript vanilla.
- Tanpa framework, tanpa library, tanpa bundler, tanpa build step, tanpa npm, tanpa
  TypeScript, tanpa Sass.
- Tanpa backend, tanpa API, tanpa fetch, tanpa service worker, tanpa WebSocket.
- Semua data di `localStorage`, sisi klien saja.
- Harus jalan di Chrome, Firefox, Edge, Safari versi sekarang.
- Harus jalan sebagai situs statis di GitHub Pages.
- Tepat satu file CSS di `css/`.
- Tepat satu file JavaScript di `js/`.
- Tanpa setup test. Jangan bikin file test.

## 4. Struktur file

```
index.html
css/style.css
js/app.js
.kiro/            (jangan disentuh, jangan dihapus, jangan diubah)
```

Hanya empat entri di atas yang boleh ada di dalam repo, di luar isi `.kiro`.

Aturan tambahan:

- Nol `<style>` inline. Nol atribut `style="..."`.
- Nol `<script>` inline. Nol atribut `onclick`, `oninput`, `onsubmit`, sejenisnya.
- Nol aset eksternal: tanpa font, gambar, ikon, atau CDN. Kalau butuh ikon, itu tanda
  ikonnya tidak perlu, tulis kata.
- Nol favicon file. Pasang `<link rel="icon" href="data:,">` supaya console bersih.
- Script dimuat dengan `<script defer src="js/app.js"></script>` di `<head>`. Bukan
  `type="module"`, karena `type="module"` gagal saat dibuka lewat `file://`, dan halaman
  ini harus bisa dibuka langsung tanpa server.

## 5. Fitur MVP

Tidak lebih dari ini.

### 5.1 Jam dan tanggal

- Tanggal Indonesia, format lengkap: `Sabtu, 21 November 2026`.
- Jam empat digit, 24 jam: `07:04`. Detik ditampilkan lebih kecil di sebelahnya.
- Diperbarui tiap detik. Elemennya `<time>` dengan `datetime` yang ikut diperbarui.
- Format lewat `Intl.DateTimeFormat('id-ID', ...)`. Jangan menulis nama bulan atau hari
  manual, jangan pakai array bahasa.
- Nilai selalu dibaca dari `new Date()` di dalam fungsi render. Jangan menaikkan
  penghitung (`detik++`) untuk menggerakkan jam.

### 5.2 Sapaan

- Batas waktu:
  - 05.00 sampai 10.59 → `Selamat pagi`
  - 11.00 sampai 14.59 → `Selamat siang`
  - 15.00 sampai 18.59 → `Selamat sore`
  - 19.00 sampai 04.59 → `Selamat malam`
- Kalau nama kosong, tanpa koma dan tanpa nama: `Selamat pagi.`
- Kalau nama terisi: `Selamat pagi, Chesta.`
- Nama bisa diubah. Setelah disimpan, sapaan langsung berubah tanpa reload.
- Sapaan diperbarui bersamaan dengan jam. Kalau melewati batas 11.00, sapaan ikut
  berganti tanpa refresh.
- Nama disimpan di `localStorage`, maksimal 24 karakter, di-trim, spasi ganda dirapatkan.

### 5.3 Timer fokus

- Durasi bawaan 25 menit. Bisa diubah 1 sampai 120 menit, bilangan bulat. Tersimpan.
- Tampilan `MM:SS`, tabular. Contoh: `25:00`, `04:09`.
- Tombol utama berganti label sesuai state: `Mulai` → `Jeda` → `Lanjut`.
- Tombol `Reset` mengembalikan ke durasi penuh dan state diam.
- Saat sisa waktu mencapai nol, status berubah menjadi `selesai`, digit memakai warna
  aksen, dan baris status berbunyi `Waktu habis.`. Tombol utama kembali ke label `Mulai`
  dan memulai durasi penuh dari awal. Tanpa suara, tanpa notifikasi browser, tanpa
  confetti, tanpa restart otomatis.
- Hitungan berbasis waktu, bukan berbasis jumlah tick:

```js
// sisa milidetik = waktuSelesai - Date.now()
// waktuSelesai ditetapkan sekali saat Mulai: Date.now() + durasiMs
// tidak ada "sisa -= 1000" tiap interval
```

  Ini wajib. Timer yang mengurangi 1000 tiap tick akan melenceng saat tab
  di-background, dan melenceng lagi setelah laptop tidur. Saya akan mengujinya dengan
  membandingkan ke stopwatch.
- State timer ikut tersimpan. Kalau halaman di-reload saat timer berjalan, hitungan
  lanjut, bukan kembali ke 25:00. Kalau `waktuSelesai` sudah lewat saat halaman dibuka,
  state langsung `selesai`.
- Mengubah durasi hanya bisa saat state diam. Saat berjalan atau jeda, input dinonaktifkan
  dan ada teks kecil yang menyebut alasannya. Tidak ada tombol mati tanpa penjelasan.

### 5.4 Daftar tugas

- Tambah, ubah, tandai selesai, hapus. Keempatnya persist.
- Nama tugas maksimal 120 karakter, di-trim.
- Tugas dengan nama yang sama tidak bisa ditambahkan. Perbandingan tanpa peduli huruf
  besar-kecil dan spasi depan-belakang. Pesan muncul di dekat input, bukan lewat
  `alert()`, dan input tidak dikosongkan supaya bisa diperbaiki.
- Tugas kosong tidak bisa disimpan. Tidak ada error yang keras, cukup inputnya tidak
  bergerak.
- Edit di tempat: teks tugas berubah jadi input, dengan `Simpan` dan `Batal`. Enter
  menyimpan, Escape membatalkan, fokus kembali ke tombol `Ubah` baris itu.
- Hapus langsung, tanpa dialog konfirmasi, dengan `Urungkan` di toast selama 8 detik.
  Memindahkan kursor ke toast menghentikan hitungan, karena 8 detik masih terlalu cepat
  untuk dibaca sambil ragu.
- Urutan: `Dibuat`, `A-Z`, `Belum selesai dulu`. Pilihan tersimpan. Urutan yang dipilih
  mengatur tampilan, tidak mengubah data di localStorage.
- Ada hitungan asli di atas daftar: `2 dari 5 selesai`. Ini bukan angka karangan, ini
  hasil hitung.

### 5.5 Tautan

- Pasangan label dan alamat. Label maksimal 24 karakter.
- Alamat dinormalkan: kalau tidak ada skema, tambahkan `https://`. Terima masukan berantakan,
  simpan bentuk yang rapi, tampilkan bentuk yang rapi.
- Hanya `http:` dan `https:` yang diterima. `javascript:`, `data:`, `file:` ditolak dengan
  pesan.
- Validasi dengan `new URL()`, bukan regex.
- Kalau alamat sudah ada, tolak sebagai duplikat.
- Tautan dirender sebagai `<a href>` sungguhan dengan `target="_blank"` dan
  `rel="noopener noreferrer"`. Bukan `<button>` yang memanggil `window.open`.
- Hapus dengan `Urungkan` yang sama seperti tugas.

## 6. Data

Empat kunci, satu namespace. Versi di nama kunci supaya bentuk data bisa berubah nanti
tanpa menabrak data lama.

```
lifedash.v1.tasks     Task[]
lifedash.v1.links     Link[]
lifedash.v1.settings  Settings
lifedash.v1.timer     Timer
```

```ts
type Task = { id: string; title: string; done: boolean; createdAt: number }

type Link = { id: string; label: string; url: string }

type Settings = {
  name: string           // "" kalau belum diisi
  durationMs: number     // bawaan 1500000
  sort: "created" | "alpha" | "open"
}

type Timer = {
  status: "idle" | "running" | "paused" | "done"
  endsAt: number | null  // epoch ms, hanya saat running
  remainingMs: number    // hanya berarti saat paused
}
```

Aturan penyimpanan:

- Satu kunci satu nilai JSON. Jangan menyimpan satu string raksasa berisi semuanya.
- Semua baca dan tulis dibungkus `try/catch`. `localStorage` bisa melempar error, dan
  akan melempar di mode privat atau saat kuota penuh, dan itu bukan kasus teoretis.
- JSON rusak atau bentuk data tidak dikenal: buang kunci itu saja, pakai nilai bawaan,
  tampilkan banner. Jangan biarkan halaman putih karena satu kunci yang dihapus tangan.
- Kalau menulis gagal: state di memori tetap jalan, banner muncul, jangan rollback. Orang
  lebih memilih aplikasi yang jalan tanpa simpan daripada aplikasi yang membalas
  ketikannya.
- Dengarkan event `storage` dan render ulang. Dua tab harus melihat data yang sama.
- Tidak ada data yang dikirim keluar halaman. Tidak ada `fetch`, tidak ada `XMLHttpRequest`,
  tidak ada `navigator.sendBeacon`, tidak ada piksel.

## 7. Aturan kode

- Satu file JS, satu file CSS. Tidak ada pecah file tanpa izin saya.
- `'use strict'` di dalam IIFE pembungkus. Tidak ada variabel global yang bocor.
- Satu objek `state` sebagai satu-satunya sumber kebenaran. Jangan membaca sumber
  kebenaran dari DOM.
- Render per wilayah: `renderClock`, `renderGreeting`, `renderTimer`, `renderTasks`,
  `renderLinks`. Jangan render ulang seluruh halaman setiap satu detik, karena itu
  menghapus fokus dan kursor di tengah orang mengetik.
- Event delegation untuk daftar yang isinya berubah. Jangan pasang listener baru per baris
  di setiap render.
- `addEventListener` saja. Nol atribut handler di HTML.
- Nol `alert`, `confirm`, `prompt`. Nol `eval`, `Function`, `document.write`.
- Nol `innerHTML` berisi data pengguna. Untuk HTML tetap tanpa sisipan boleh, tapi lebih
  baik bangun node dengan `createElement` dan `textContent`. Data pengguna tidak pernah
  jadi string HTML.
- ID dengan `crypto.randomUUID()`, cadangan `${Date.now()}-${Math.random()}` kalau tidak
  tersedia.
- Komentar hanya untuk keputusan yang tidak jelas dari kodenya: kenapa hitungan pakai
  `endsAt`, kenapa `try/catch` di sini, kenapa urutan render begini. Nol komentar yang
  mengulang barisnya sendiri, nol banner pemisah, nol kode yang dikomentari, nol `TODO`.
- Nol `console.log` di kode final.
- CSS: token di `:root`, nol nilai warna mentah di luar blok token, nol `!important`.
  Pakai skala spasi dan skala radius yang sudah ditetapkan. Jangan tambah nilai baru
  kalau yang lama bisa dipakai.
- Nama kelas dan id bahasa Inggris, konsisten. Teks antarmuka bahasa Indonesia.

## 8. Tiga kondisi yang wajib ada

- **Kosong**: daftar tugas kosong, daftar tautan kosong, sapaan tanpa nama, timer diam.
- **Error**: `localStorage` ditolak, kuota penuh, JSON rusak, alamat tautan tidak sah,
  tugas duplikat.
- **Selesai**: timer mencapai nol, tugas ditandai selesai, tugas dihapus dan bisa
  diurungkan.

Tidak ada state loading. Halaman ini tidak memuat apa pun dari jaringan, jadi skeleton
loader adalah kebohongan. Jangan bikin.

## 9. Selesai berarti

Semua ini benar, dan sudah kamu buktikan di browser, bukan di kepalamu:

1. Buka lewat `http://`, bukan hanya `file://`.
2. Reload: tugas, tautan, nama, durasi, urutan, dan posisi timer masih ada.
3. Timer tetap akurat setelah tab ditinggal 3 menit dan setelah laptop tidur.
4. Nama kosong tidak menghasilkan `Selamat pagi, .` atau koma menggantung.
5. Tugas duplikat ditolak, huruf besar-kecil tidak lolos.
6. Alamat tautan tanpa `https://` tetap bisa dibuka dan tersimpan rapi.
7. `javascript:alert(1)` di kolom tautan ditolak.
8. Hapus lalu `Urungkan` mengembalikan baris ke posisi semula.
9. Tab sampai habis: urutan fokus masuk akal, tiap kontrol punya cincin fokus yang
   terlihat, Escape membatalkan edit.
10. Console bersih: nol error, nol warning, nol 404.
11. 320px tidak ada scroll horizontal. 390, 768, 1024, 1440 tidak ada yang terpotong.
12. Zoom 200% tidak memotong kontrol.
13. `prefers-reduced-motion: reduce` menyala: sisa animasi hilang, semua isi tetap terbaca.
14. `localStorage` dimatikan di DevTools: halaman tetap bisa dipakai, banner muncul,
    console tidak merah.
15. Grep sumber: nol `—`, nol `!`, nol `alert(`, nol `innerHTML =`, nol `http`.
16. Badan teks terukur ≥ 4.5:1 terhadap latarnya.

## 10. Format laporan

Setelah satu task selesai, laporkan begini, tanpa basa-basi:

```
Task 3: render tugas + state kosong
File: index.html, css/style.css, js/app.js
Diuji: tambah 3 tugas, reload, hapus 1, Urungkan
Hasil: -
  [PASS] reload mempertahankan 3 tugas
  [PASS] Urungkan mengembalikan baris ke indeks 2
  [BELUM] keyboard di 390px, belum dicoba
Catatan: fokus pindah ke input setelah tambah, sengaja
```

Aturan laporan:

- Kalau belum dijalankan, tulis `[BELUM]`. Jangan tulis `[PASS]`.
- `[PASS]` harus punya bukti yang bisa saya ulang, bukan "sudah dicek".
- Jangan lapor lima hal yang berhasil dan diam soal satu yang gagal.
- Jangan menulis ringkasan motivasi di akhir, seperti "Semoga membantu!" atau "Dengan
  ini dashboard-nya jadi lebih baik!". Saya tidak butuh.
- Jangan mengklaim kecepatan, skor Lighthouse, atau angka pengukuran yang tidak kamu
  ukur. Kalau tidak diukur, tulis "tidak diukur".
