# Life Dashboard: requirements

Satu halaman statis, dibuka pagi hari sebagai tab pertama. Tidak ada backend, tidak ada
jaringan, tidak ada framework.

## Lingkup

Halaman ini berisi empat bagian: jam dan sapaan, timer fokus, daftar tugas, tautan cepat.
Semua data disimpan di localStorage sisi klien.

## Teknologi

- HTML, CSS, JavaScript vanilla, satu file masing-masing.
- Tidak ada npm, bundler, TypeScript, atau library eksternal.
- Harus berjalan di Chrome, Firefox, Edge, Safari versi sekarang.
- Harus bisa dibuka lewat file:// dan lewat GitHub Pages.

## Fitur yang dibangun

### Jam dan tanggal
- Jam 24 jam, format HH:MM, detik di sebelahnya lebih kecil.
- Tanggal format Indonesia panjang: "Sabtu, 21 November 2026".
- Diperbarui tiap detik dari new Date(), bukan penghitung.

### Sapaan
- Pagi 05.00-10.59, siang 11.00-14.59, sore 15.00-18.59, malam selebihnya.
- Kalau nama kosong: "Selamat pagi." Kalau terisi: "Selamat pagi, Chesta."
- Nama disimpan di localStorage, maksimal 24 karakter.

### Timer fokus
- Durasi bawaan 25 menit, bisa diubah 1-120 menit saat timer diam.
- Tombol utama berganti label: Mulai, Jeda, Lanjut.
- Tombol Reset mengembalikan ke durasi penuh dan state diam.
- Hitungan berbasis endsAt - Date.now(), bukan pengurangan tiap detik.
- State timer persist. Reload saat timer jalan: timer lanjut.
- Saat habis: digit merah, status "Waktu habis.", tombol kembali ke "Mulai".

### Daftar tugas
- Tambah, ubah (in-place), tandai selesai, hapus.
- Nama maksimal 120 karakter. Duplikat ditolak (case-insensitive).
- Hapus pakai undo toast 8 detik.
- Urutan: Dibuat, A-Z, Belum selesai dulu. Tersimpan.
- Hitungan aktual: "2 dari 5 selesai".

### Tautan cepat
- Pasangan label (maks 24 karakter) dan alamat.
- Alamat tanpa skema otomatis dapat https://.
- Hanya http: dan https: diterima. javascript: dan data: ditolak.
- Hapus pakai undo toast yang sama.
- Dibuka di tab baru dengan rel="noopener noreferrer".

## Penyimpanan

Empat kunci dengan namespace dan versi:
- lifedash.v1.tasks
- lifedash.v1.links
- lifedash.v1.settings
- lifedash.v1.timer

Semua baca-tulis dibungkus try/catch. JSON rusak per kunci dibuang dan diganti default,
banner muncul. localStorage mati: halaman tetap jalan di memori.

## Yang tidak dibangun

Tidak ada tema gelap, tidak ada drag-drop, tidak ada shortcut tersembunyi, tidak ada
notifikasi browser, tidak ada animasi masuk, tidak ada statistik, tidak ada streak,
tidak ada backend.
