# Design: Life Dashboard

## Stack

Satu file HTML, satu CSS, satu JS vanilla. Tidak ada build step, tidak ada dependency.
Berjalan di file:// dan di GitHub Pages tanpa konfigurasi tambahan.

## Struktur file

```
index.html
css/style.css
js/app.js
```

## State

Satu objek `state` sebagai sumber kebenaran tunggal. Tidak ada pembacaan dari DOM.

```
state.tasks     Task[]
state.links     Link[]
state.settings  Settings
state.timer     Timer
```

```
Task     { id, title, done, createdAt }
Link     { id, label, url }
Settings { name, durationMs, sort }
Timer    { status, endsAt, remainingMs }
```

## localStorage

Empat kunci dengan namespace dan versi:

```
lifedash.v1.tasks
lifedash.v1.links
lifedash.v1.settings
lifedash.v1.timer
```

Semua baca pakai `tryReadRaw` yang membedakan tiga kondisi: kunci tidak ada, kunci ada
dan valid, kunci ada tapi JSON rusak. Semua tulis pakai `tryWrite` dengan try/catch.

## Timer

Hitungan berbasis `endsAt - Date.now()`, bukan pengurangan tiap tick. `endsAt` disimpan
saat Mulai ditekan: `Date.now() + durationMs`. Tick berjalan tiap 1000ms via setInterval.
Saat halaman dibuka ulang dengan timer running, cukup bandingkan `endsAt` dengan
`Date.now()` untuk tahu apakah sudah selesai atau masih berjalan.

## Render

Render per wilayah: `renderClock`, `renderGreeting`, `renderTimer`, `renderTasks`,
`renderLinks`. Tidak ada render ulang seluruh halaman. Clock dan greeting diperbarui
tiap detik. Timer diperbarui tiap detik hanya saat running. Tasks dan links diperbarui
hanya saat data berubah.

## Event

Event delegation untuk task-list dan link-list. Listener dipasang sekali di `wireEvents`,
tidak per-render. Listener toast dipasang sekali di `wireToast`.

## Cross-tab sync

`window.addEventListener('storage', ...)` mendeteksi perubahan dari tab lain dan
memanggil `loadState()` lalu `renderAll()`.
