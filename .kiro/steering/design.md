# Arah visual: instrumen di atas kertas

Dokumen ini mengikat sama kuatnya dengan `product.md`. Kalau kamu perlu memilih antara
"terlihat keren" dan "sesuai dokumen ini", pilih dokumen ini.

## 0. Design read

Tulis baris ini di awal rencana sebelum menyentuh HTML:

> Reading this as: an app screen for one person starting their day, in a paper-and-ink
> instrument style, dial ENERGY 1 / RHYTHM 2 / MOTION 1.

Yang dimaksud:

- **ENERGY 1**: halaman tidak menyapa dengan keras. Tanpa hero, tanpa ilustrasi besar,
  tanpa warna yang berteriak. Yang menarik mata adalah ukuran huruf, bukan dekorasi.
- **RHYTHM 2**: grid konsisten, lalu satu ketidaksamaan yang disengaja, yaitu pembagian
  7/5, bukan 6/6 dan bukan tiga kartu sama besar.
- **MOTION 1**: gerak hanya ada di hover, tekan, dan satu momen saat timer selesai.
  Tidak ada animasi masuk, tidak ada animasi saat scroll.

## 1. Arah, satu paragraf

Bayangkan halaman agenda cetak yang kebetulan hidup, ditempel di samping alat ukur
mekanis. Angka besar dan tenang, garis rambut yang tipis dan lurus, kertas berwarna
netral dingin, dan satu-satunya warna di halaman itu adalah tanda bahwa waktu sedang
berjalan. Tidak ada kartu, tidak ada bayangan, tidak ada sudut membulat yang ramah,
tidak ada gradien.

Alasan: halaman ini dibuka jam 7 pagi oleh orang yang belum sepenuhnya bangun, dan
dilihat 20 kali sehari selama dua detik. Setiap bayangan, setiap gradien, setiap ikon
adalah biaya yang dibayar ulang 20 kali. Yang dibutuhkan hanya angka yang terbaca dan
satu hal yang jelas harus dikerjakan.

## 2. Focal point dan accent

- **Focal point**: angka jam. Ia elemen terbesar di halaman, kira-kira tiga kali tinggi
  teks sapaan. Tidak ada elemen lain yang boleh mendekati ukurannya.
- **Accent**: `--signal`, satu warna, satu tugas, yaitu **waktu yang sedang berjalan**.
  Hanya muncul di tiga tempat:
  1. digit timer saat status `running` atau `done`
  2. garis progres timer saat `running`
  3. cincin fokus keyboard

  Alasan cincin fokus ikut memakai aksen: fokus dan timer sama-sama menandai "sekarang
  sedang aktif di sini". Satu makna, bukan dua.

  Tombol utama **tidak** memakai aksen. Tombol utama memakai tinta gelap. Ini yang
  membedakan halaman ini dari dashboard AI biasa, yang menaruh warna aksen di setiap
  tombol sampai warna itu berhenti berarti apa pun.

- **Motif identitas**: kotak tinta 4x4px di kiri setiap label bagian, sejajar dengan
  garis rambut. Ada empat kali di halaman (Sekarang, Fokus, Hari ini, Tautan). Bukan
  hiasan, ini penanda margin, seperti nomor di halaman buku catatan.

## 3. Yang dilarang

Kalau kamu merasa salah satu dari ini akan memperbaiki tampilan, jangan. Itu justru
tanda kamu sedang menuju default.

1. Gradien apa pun. Nol `linear-gradient`, nol `radial-gradient`, nol `conic-gradient`.
2. `backdrop-filter`, `filter: blur()`, kaca, atau apa pun yang terlihat seperti kaca.
3. `box-shadow` di elemen apa pun. Nol. Pemisahan dibuat dengan garis dan ruang.
4. Kartu. Nol `border-radius` pada wadah besar, nol kotak pembungkus dengan latar
   berbeda. Bagian dipisah garis rambut, bukan kotak.
5. Sudut membulat di mana-mana. Radius hanya untuk kontrol: tombol, input, select.
   Bukan untuk section, bukan untuk baris, bukan untuk daftar.
6. Ungu, lavender, biru-ke-ungu, atau apa pun yang berdekatan dengannya.
7. Ikon. Tidak ada icon font, tidak ada SVG ikon, tidak ada emoji. Setiap aksi ditulis
   sebagai kata kerja.
8. Font eksternal. Nol `@import`, nol `<link>` ke Google Fonts, nol `@font-face`, nol
   unduhan.
9. Inter, Poppins, Montserrat, Space Grotesk, Geist, Roboto, DM Sans, Plus Jakarta Sans.
10. Monospace di mana pun. Timer bukan terminal.
11. Bayangan teks, garis bawah bergradasi, atau teks bergradien.
12. Animasi masuk. Tidak ada fade-in saat load, tidak ada slide-up saat scroll.
13. Hover yang mengangkat elemen (`translateY(-2px)`) atau membesarkan kartu.
14. Kapsul. Nol `border-radius: 999px`. Tombol tidak berbentuk pil.
15. Toast yang muncul dari bawah dengan bayangan melayang.
16. Avatar, logo, ilustrasi, atau foto. Halaman ini tidak punya aset gambar, dan tidak
    akan mengarang.
17. Angka karangan: "streak 12 hari", "produktivitas 87%", "3 task selesai dari 7
    target". Satu-satunya angka yang boleh ada adalah yang dihitung dari data nyata.
18. Copy penyemangat: "Yuk mulai produktif", "Kamu hebat hari ini", "Ayo semangat",
    "Let's go". Ini alat, bukan pelatih.
19. Tanda seru di antarmuka.
20. Emoji.

## 4. Token warna

Semua nilai warna hanya boleh muncul di blok `:root` ini. Di tempat lain, pakai
`var(--...)`. Kalau kamu butuh warna baru, berarti desainnya yang salah.

```css
:root {
  color-scheme: light;

  /* kertas: netral dingin, sedikit kehijauan. Bukan krem, bukan krem-abu. */
  --paper:        #F2F4EF;
  --paper-raised: #F8F9F5;   /* latar input, satu tingkat di atas kertas */

  /* tinta */
  --ink:          #1A1F1C;
  --ink-soft:     #5C635E;   /* label, meta, tanggal */
  --ink-hover:    #2A302C;   /* latar tombol utama saat hover */
  --ink-wash:     rgba(26, 31, 28, 0.05);  /* latar tombol sekunder saat hover */

  /* garis */
  --rule:         #D8DCD4;   /* garis rambut dekoratif. Sengaja di bawah 3:1. */
  --line-strong:  #7A817B;   /* batas kontrol yang harus terbaca. Di atas 3:1. */

  /* aksen. Satu warna, satu tugas: waktu yang berjalan. */
  --signal:       #B23A1E;
}
```

Target kontras, wajib diukur di browser dan dilaporkan, bukan dikira:

- `--ink` di `--paper`: sekitar 15:1. Badan teks.
- `--ink-soft` di `--paper`: sekitar 5.5:1. Hanya untuk teks 14px ke atas.
- `--signal` di `--paper`: sekitar 5.5:1. Aman untuk teks.
- `--line-strong` di `--paper`: minimal 3:1.
- Teks `--paper` di atas `--ink` (tombol utama): sekitar 15:1.

Kenapa `--rule` dan `--line-strong` dipisah: garis pemisah bagian itu dekorasi dan boleh
tipis. Tapi batas input, batas tombol sekunder, dan garis progres adalah informasi, dan
informasi harus lolos 3:1. Dashboard AI biasa memakai satu abu-abu pucat untuk keduanya,
lalu kolom inputnya hilang di layar redup.

Belum ada tema gelap. Jangan menulis `@media (prefers-color-scheme: dark)`. Jangan
menulis `filter: invert()`. Kalau nanti ditambahkan, itu lewat token yang sama, bukan
lewat tempelan.

## 5. Tipografi

Dua keluarga, keduanya sudah ada di mesin pengguna. Nol unduhan.

```css
--sans:  "Segoe UI Variable Text", "Segoe UI", -apple-system, BlinkMacSystemFont,
         "Helvetica Neue", system-ui, sans-serif;
--serif: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino,
         Georgia, serif;
```

Pembagian tugas, dan alasannya:

- **Sans untuk data**: jam, tanggal, timer, isi tugas, label, tombol. Angka butuh bentuk
  yang tidak berubah dan lebar yang sama. Di sinilah `font-variant-numeric: tabular-nums`
  wajib dipakai: jam, timer, dan hitungan tugas. Tanpa itu, angka bergeser tiap detik
  dan mata menangkapnya sebagai halaman yang gelisah.
- **Serif untuk suara manusia**: hanya sapaan. Satu tempat. Karena itu satu-satunya
  kalimat di halaman yang ditulis untuk dibaca, bukan dipindai.

Tanpa monospace. Timer memakai sans tabular, dan itu sudah cukup jelas.

Skala:

| Token | Nilai | Dipakai |
|---|---|---|
| `--t-label` | 0.75rem (12px) | label bagian, 600, uppercase, tracking 0.04em |
| `--t-meta` | 0.8125rem (13px) | tanggal, status timer, hitungan |
| `--t-ui` | 0.9375rem (15px) | baris tugas, tautan, tombol, input |
| `--t-body` | 1rem (16px) | teks bantuan, pesan error |
| `--t-greet` | `clamp(1.375rem, 1.05rem + 1.3vw, 1.75rem)` | sapaan, serif, 400 |
| `--t-timer` | `clamp(2.25rem, 1.6rem + 3vw, 3.25rem)` | digit timer, 500 |
| `--t-clock` | `clamp(3rem, 2rem + 5.2vw, 5.5rem)` | jam, 500 |

Aturan setelan:

- Berat hanya 400, 500, 600. Tidak ada 700, karena 600 sudah cukup dan 700 membuatnya
  berteriak.
- `--t-clock`: `letter-spacing: -0.02em`, `line-height: 1`, tabular.
- `--t-greet`: `line-height: 1.15`, `text-wrap: balance`, `max-width: 24ch`.
- Badan teks: `line-height: 1.55`, `max-width: 62ch`, `text-wrap: pretty`.
- Label: `text-transform: uppercase`, `letter-spacing: 0.04em`, `line-height: 1.25`.
  Di HTML tetap ditulis "Fokus", bukan "FOKUS", supaya pembaca layar tidak mengejanya.
- Tanggal: `font-variant-numeric: tabular-nums`, `line-height: 1.4`.
- Tidak ada `font-synthesis`. Tidak ada teks miring di halaman ini.
- Jangan memakai `clamp()` untuk jarak. Hanya untuk ukuran huruf.

## 6. Spasi, radius, garis

```css
:root {
  --s1: 4px;  --s2: 8px;   --s3: 12px;  --s4: 16px;
  --s5: 24px; --s6: 32px;  --s7: 48px;  --s8: 64px;

  --r1: 6px;    /* tombol, input, select */
  --r2: 10px;   /* toast. Hanya ini. */

  --hair: 1px;
}
```

Nol nilai jarak di luar skala itu. Kalau butuh 20px, pakai 16 atau 24.

Hubungan ruang, supaya mata tahu apa yang satu kelompok:

- Label dan isinya: `var(--s2)`.
- Antar baris dalam satu daftar: `var(--s3)`.
- Antar elemen dalam satu bagian: `var(--s5)`.
- Antar bagian: `var(--s7)`, dengan garis rambut `--rule` di tengah, yaitu `--s5` di atas
  garis dan `--s5` di bawah garis.
- Padding halaman: `var(--s5)` di 390px, `var(--s7)` dari 900px.

## 7. Layout

Desktop 1000px ke atas, grid 12 kolom, jarak antar kolom 24px, lebar maksimum isi
1120px, padding halaman 48px. Hanya dua baris.

```
+--------------------------------------------------------------+
| SEKARANG                                   | FOKUS           |
| 07:04 32                                   | 25:00           |
| Sabtu, 21 November 2026                    | Mulai  Reset    |
| Selamat pagi, Chesta.                      | ------------    |
|                                            | Siap. Tekan...  |
|                                            | Durasi [ 25 ]   |
|--------------------------------------------|-----------------|
| HARI INI                       2 dari 5    | TAUTAN          |
| Tugas baru  [....................] Tambah  | Nama  [......]  |
|                                            | Alamat[......]  |
| [ ] Beli kopi                    Ubah Hapus| Simpan          |
| [x] Kirim laporan                Ubah Hapus|                 |
|                                            | Wikipedia       |
|                                            | Hapus           |
+--------------------------------------------------------------+
```

Aturan:

- Kolom kiri 7 span, kanan 5 span. Bukan 6/6, karena jam butuh ruang horizontal dan
  kolom kanan cukup untuk timer.
- Satu garis rambut horizontal memisah baris pertama dan kedua, selebar isi, tepat di
  titik grid 8px. Tidak ada garis vertikal di antara kolom. Kalau kamu menambahkan garis
  vertikal, halaman berubah jadi tabel.
- Tidak ada jarak antar blok yang lebih besar dari 64px. Halaman ini satu layar, bukan
  tiga bagian.
- Tinggi total pada 1440x900, dengan tiga tugas dan dua tautan, harus muat tanpa scroll.
  Kalau meluber, kurangi padding, bukan ukuran huruf jam.
- Urutan DOM sama dengan urutan visual sama dengan urutan Tab. Jangan pakai `order`,
  `grid-row` yang menukar, atau `position: absolute` untuk menyusun blok.
- Di bawah 1000px: satu kolom, urutan Sekarang, Fokus, Hari ini, Tautan.
- Di 390px: padding 24px, tombol form selebar baris, tidak ada elemen yang lebih lebar
  dari `100%`, tidak ada `min-width` pada input. Uji juga 320px.

## 8. Komponen

Istilah kelas bebas, tapi bentuk, state, dan ukurannya mengikat.

**Label bagian.** Tinggi huruf 12px, 600, uppercase, `--ink-soft`, tracking 0.04em.
Didahului kotak 4x4px `--ink` dengan jarak 8px. Boleh ada meta rata kanan (hitungan,
pilihan urut) pada baris yang sama, memakai `--t-meta`, `--ink-soft`.

**Jam.** `--t-clock`, 500, `--ink`, tabular. Detik di dalam `<span>` terpisah, ukuran
50% dari jam, `--ink-soft`, baseline sejajar, jarak 8px. Jangan turunkan detik ke bawah
seperti superskrip, karena itu menggeser baseline.

**Sapaan.** `--t-greet`, serif, 400, `--ink`. Satu-satunya tempat serif.

**Timer.** Digit `--t-timer`, 500, tabular, `--ink` saat diam atau jeda, `--signal` saat
berjalan atau selesai. Di bawah digit, garis progres: tinggi 2px, latar `--rule`, isi
`--signal`, `transform: scaleX(0..1)` dengan `transform-origin: left`, `border-radius: 0`.
Tanpa transisi pada garis progres. Alasan: progres yang dihaluskan akan berbohong
tentang sisa waktu, dan di sini satu detik terlihat.

**Tombol.** Tinggi minimum 44px, padding 0 16px, radius `--r1`, font 15px 500,
`border: 1px solid`. Tiga jenis, tidak lebih:

- *Utama*: latar `--ink`, teks `--paper`, border `--ink`. Satu saja di halaman: tombol
  timer. Hover: latar `--ink-hover`. Aktif: `transform: scale(0.97)`, 100ms.
- *Sekunder*: latar transparan, teks `--ink`, border `--line-strong`. Hover: latar
  `--ink-wash`.
- *Teks*: tanpa border, tanpa latar, teks `--ink`, `text-decoration: underline` hanya
  saat hover. Dipakai untuk `Ubah`, `Hapus`, `Batal`, `Urungkan`.

Tidak ada tombol bahaya berwarna merah. Kata kerjanya yang menjelaskan, bukan warnanya.

**Input.** Tinggi minimum 44px, radius `--r1`, `border: 1px solid var(--line-strong)`,
latar `--paper-raised`, teks 15px `--ink`, padding 0 12px. Placeholder `--ink-soft`
dengan kontras ≥ 4.5:1, dan tidak pernah menjadi satu-satunya label. Di atas setiap
input ada `<label>` yang terlihat, 12px, 600, `--ink-soft`, jarak 8px.

Fokus: `outline: 2px solid var(--signal); outline-offset: 3px;`. Jangan `outline: none`
tanpa pengganti. Jangan `box-shadow` untuk cincin fokus.

**Baris tugas.** Tinggi minimum 48px. Susunan: checkbox 20px, teks, lalu `Ubah` dan
`Hapus` sebagai tombol teks. Tidak ada garis antar baris, tidak ada latar, tidak ada
kartu. Jarak antar baris `--s3`; itu sudah memisahkan.

Selesai: teks diberi `text-decoration: line-through`, warna `--ink-soft`, checkbox
tercentang. Tiga penanda, jadi tidak bergantung pada warna saja.

Checkbox memakai input asli, `accent-color: var(--ink)`, bukan gambar buatan. Area klik
adalah `<label>` selebar baris, tinggi 44px.

**Baris tautan.** `<a>` dengan teks 15px, ditambah penanda arah keluar berupa teks kecil
`(baru)` di `--ink-soft` kalau perlu, atau tidak sama sekali. Tombol `Hapus` di kanan,
14px, muncul selalu (jangan sembunyi di balik hover, karena di layar sentuh hover tidak
ada).

**Toast urungkan.** `position: fixed`, bawah tengah, jarak 24px dari tepi. Latar `--ink`,
teks `--paper`, radius `--r2`, padding 12px 16px, `max-width: calc(100% - 48px)`.
Tanpa bayangan. Teks lalu tombol `Urungkan` bergaris bawah. Durasi 8 detik, berhenti
saat kursor masuk atau tombol difokus. `role="status"`.

**Banner penyimpanan.** Satu baris di atas isi, latar `--paper-raised`, `border-left: 3px`
solid `--signal`, padding 12px 16px, teks 15px. Bisa ditutup dengan tombol `Tutup`.
Ini satu-satunya tempat aksen dipakai di luar waktu, dan itu boleh, karena ini satu-satunya
keadaan darurat di halaman.

**Garis rambut.** `1px solid var(--rule)`. Jangan pernah 2px. Jangan pernah `dashed`
kecuali untuk area drop, dan halaman ini tidak punya drop.

## 9. Nada tulisan

Bahasa Indonesia, kalimat pendek, kata kerja di depan. Huruf kapital di awal kalimat saja
(`sentence case`), walaupun label dirender uppercase oleh CSS.

- Tanpa tanda seru.
- Tanpa emoji.
- Tanpa tanda pisah panjang (em dash) di teks antarmuka maupun komentar. Koma, titik,
  titik dua, atau kurung.
- Tanpa kata pemanis: "mudah", "cepat", "sederhana", "personal", "produktif", "fokus
  lebih baik", "seamless", "powerful", "siap membantu".
- Jangan menyapa dua kali. Sapaan di h1 sudah cukup.
- Kalimat bantuan menyebut tindakan, bukan manfaat: "Reset dulu untuk mengubah durasi.",
  bukan "Atur waktumu sesuai ritme."

Teks yang dipakai, persis. Jangan mengarang varian lain:

| Tempat | Teks |
|---|---|
| `<title>` | `Life Dashboard` |
| h1, nama kosong | `Selamat pagi.` (siang, sore, malam mengikuti jam) |
| h1, nama terisi | `Selamat pagi, Chesta.` |
| label bagian 1 | `Sekarang` |
| label bagian 2 | `Fokus` |
| label bagian 3 | `Hari ini` |
| label bagian 4 | `Tautan` |
| meta hitungan | `2 dari 5 selesai` |
| timer diam | `Siap. Tekan mulai.` |
| timer jalan | `Selesai pukul 07.29.` |
| timer jeda | `Berhenti di 12:04.` |
| timer habis | `Waktu habis.` |
| tombol timer | `Mulai` / `Jeda` / `Lanjut` / `Reset` |
| label durasi | `Durasi (menit)` |
| kunci durasi | `Reset dulu untuk mengubah durasi.` |
| placeholder tugas | `Satu hal untuk hari ini` |
| label tugas | `Tugas baru` |
| tombol tugas | `Tambah` |
| tugas kosong | `Belum ada tugas.` |
| bantuan tugas kosong | `Satu baris cukup. Bisa diubah nanti.` |
| duplikat tugas | `Tugas ini sudah ada.` |
| ubah / hapus | `Ubah` / `Hapus` |
| simpan / batal | `Simpan` / `Batal` |
| label urut | `Urutkan` |
| opsi urut | `Dibuat` / `A-Z` / `Belum selesai dulu` |
| label tautan, nama | `Nama` |
| label tautan, alamat | `Alamat` |
| tombol tautan | `Simpan` |
| tautan kosong | `Belum ada tautan.` |
| bantuan tautan kosong | `Simpan situs yang paling sering kamu buka.` |
| alamat tidak sah | `Alamat harus diawali http:// atau https://.` |
| tautan duplikat | `Tautan ini sudah ada.` |
| hapus | `Tugas dihapus.` / `Tautan dihapus.` |
| undo | `Urungkan` |
| label nama | `Nama panggilan` |
| nama tersimpan | `Tersimpan.` |
| catatan kaki | `Data tersimpan di browser ini, tidak dikirim ke mana pun.` |
| penyimpanan mati | `Penyimpanan tidak tersedia. Perubahan hilang saat tab ditutup.` |
| data rusak | `Data lama tidak terbaca dan sudah dihapus.` |

Catatan kaki di atas bukan klaim pemasaran. Itu benar secara teknis, karena halaman ini
tidak punya `fetch` dan tidak punya backend. Kalau kode berubah sampai ada panggilan
jaringan, hapus dulu kalimatnya.

## 10. Gerak

Anggaran gerak, tidak boleh lebih:

| Kejadian | Durasi | Easing |
|---|---|---|
| Tombol ditekan | `scale(.97)` | 100ms, `ease-out` |
| Hover tombol, baris, tautan | latar dan warna | 140ms, `ease-out` |
| Input fokus | garis tepi jadi `--signal` | 140ms, `ease-out` |
| Timer selesai (satu-satunya momen) | garis 2px menggambar kiri ke kanan, digit berganti warna | 320ms, `cubic-bezier(.22,1,.36,1)` |

Yang dilarang: `transition: all`, animasi `width` atau `height`, `bounce`, `looping float`,
`@keyframes` untuk masuk, stagger pada baris daftar, `scroll-behavior: smooth`, dan
animasi yang berjalan terus tanpa alasan.

`@media (prefers-reduced-motion: reduce)`: matikan transform dan transisi, sisakan
perubahan warna tanpa durasi. Garis tetap muncul, hanya tidak bergerak.

## 11. Aksesibilitas

- `<html lang="id">`.
- Satu `<h1>` yaitu sapaan. Label bagian memakai `<h2>`.
- `<header>`, `<main>`, `<section>`, `<footer>`, masing-masing dengan `aria-labelledby`
  atau `aria-label` yang sesuai.
- Setiap kontrol punya nama aksesibel. Input punya `<label for>` yang terlihat.
- Tidak ada `div` yang bisa diklik. Aksi adalah `<button type="button">`. Navigasi adalah
  `<a href>`.
- `cursor: pointer` untuk semua kontrol aktif, `not-allowed` untuk yang dinonaktifkan.
- Tombol yang dinonaktifkan tetap terbaca alasannya, bukan hilang.
- Pesan error dan hitungan memakai `role="status"` atau `aria-live="polite"`, tidak
  dibacakan tiap detik.
- Tombol utama timer punya `aria-pressed` atau label yang berubah. Label yang berubah
  lebih baik, karena `aria-pressed` pada "Mulai" membingungkan.
- Timer tidak diumumkan tiap detik. Cukup saat berpindah state.
- Fokus terlihat di semua latar, termasuk di atas `--ink`.
- Hit area minimal 44x44px untuk semua kontrol.
- `prefers-reduced-motion` dihormati.
- `prefers-contrast: more` boleh ditambahkan dengan menaikkan `--line-strong`, tapi bukan
  keharusan.
- Tidak ada `user-scalable=no`.
- Tidak ada `aria-label` yang bertentangan dengan teks terlihat.

## 12. Tes anti-generik

Jalankan tiga ini sebelum bilang selesai. Kalau gagal satu, ulang arahnya, jangan
menambal.

1. **Tes ganti isi.** Ganti semua teks judul dengan teks lain, misalnya "Ruang Kerja".
   Apakah halamannya masih terasa satu sistem yang dibuat untuk satu orang? Kalau
   jawabannya "sekarang jadi template dashboard biasa", berarti identitasnya cuma
   ada di teks, dan itu belum selesai.
2. **Tes kartu.** Lihat screenshot 390px. Hitung berapa kotak yang punya latar berbeda
   dari halaman. Jawaban yang benar: nol, atau hanya toast dan banner penyimpanan.
   Kalau ada kotak latar di atas, di bawah, dan di tengah, kamu baru saja membuat
   dashboard AI.
3. **Tes satu warna.** Berubah jadi hitam putih. Apakah hierarki masih terbaca? Jam
   masih jelas paling besar? Kalau yang paling mencolok jadi tombolnya, berarti ukuran
   hurufnya belum bekerja dan kamu menutupinya dengan warna.

## 13. Yang tidak boleh ditambahkan tanpa saya minta

Logo, nama aplikasi di dalam halaman, avatar, tema gelap, jam analog, kalender, cuaca,
quote harian, statistik produktivitas, streak, grafik, konfeti, suara, notifikasi
browser, drag and drop, shortcut keyboard tersembunyi, modal pembuka, halaman
pengaturan, tab, routing, animasi scroll, library apa pun, dan komentar yang menceritakan
alasanmu menulis kode ini.

Alasan aturan terakhir: kalau keputusannya butuh komentar untuk dipertahankan, keputusan
itu belum matang. Kodenya harus menjelaskan dirinya sendiri. Komentar hanya untuk
jebakan teknis, seperti "jumlah tick tidak boleh dipakai sebagai sumber waktu".
