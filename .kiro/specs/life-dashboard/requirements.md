# Requirements: Life Dashboard

## Jam dan tanggal

WHEN the page loads or every second passes
THE SYSTEM SHALL display the current time in HH:MM format with seconds shown smaller beside it

WHEN the page loads or every second passes
THE SYSTEM SHALL display the current date in full Indonesian format (e.g. Sabtu, 21 November 2026)

## Sapaan

WHEN the current hour is between 05 and 10
THE SYSTEM SHALL display "Selamat pagi"

WHEN the current hour is between 11 and 14
THE SYSTEM SHALL display "Selamat siang"

WHEN the current hour is between 15 and 18
THE SYSTEM SHALL display "Selamat sore"

WHEN the current hour is outside 05-18
THE SYSTEM SHALL display "Selamat malam"

WHEN no name has been saved
THE SYSTEM SHALL display the greeting without a name (e.g. "Selamat pagi.")

WHEN a name has been saved
THE SYSTEM SHALL display the greeting with the name (e.g. "Selamat pagi, Chesta.")

WHEN the user saves a name
THE SYSTEM SHALL persist it to localStorage and update the greeting immediately without reload

## Timer fokus

WHEN the page loads
THE SYSTEM SHALL show the timer in idle state at the saved duration (default 25 minutes)

WHEN the user presses Mulai from idle or done state
THE SYSTEM SHALL start counting down from the full duration, store endsAt as Date.now() + durationMs

WHEN the user presses Jeda while the timer is running
THE SYSTEM SHALL pause the timer and show the remaining time

WHEN the user presses Lanjut while the timer is paused
THE SYSTEM SHALL resume counting down from the remaining time

WHEN the user presses Reset
THE SYSTEM SHALL return the timer to idle state at the full duration

WHEN the timer reaches zero
THE SYSTEM SHALL set status to done, show "Waktu habis.", and change the digit color to the signal color

WHEN the timer is running or paused
THE SYSTEM SHALL disable the duration input and show the reason

WHEN the user changes the duration while timer is idle
THE SYSTEM SHALL save the new duration and reset the display

WHEN the page reloads while the timer is running
THE SYSTEM SHALL resume the countdown based on the saved endsAt value

WHEN the page reloads and endsAt has already passed
THE SYSTEM SHALL set the timer to done state immediately

## Daftar tugas

WHEN the user submits a non-empty task title
THE SYSTEM SHALL add the task, persist it, and clear the input

WHEN the user submits a task title that matches an existing task (case-insensitive)
THE SYSTEM SHALL reject it and show "Tugas ini sudah ada." near the input

WHEN the user submits an empty task title
THE SYSTEM SHALL do nothing and not show an error

WHEN the user toggles the checkbox on a task
THE SYSTEM SHALL mark it done or undone, apply strikethrough, and persist

WHEN the user presses Ubah on a task
THE SYSTEM SHALL replace the row with an inline input pre-filled with the current title

WHEN the user presses Simpan in edit mode or presses Enter
THE SYSTEM SHALL save the new title and exit edit mode

WHEN the user presses Batal in edit mode or presses Escape
THE SYSTEM SHALL discard changes and exit edit mode

WHEN the user presses Hapus on a task
THE SYSTEM SHALL remove it, persist, and show an undo toast for 8 seconds

WHEN the user presses Urungkan in the toast
THE SYSTEM SHALL restore the deleted task

WHEN the user changes the sort selection
THE SYSTEM SHALL re-render the list in the chosen order and persist the preference

## Tautan cepat

WHEN the user submits a label and URL
THE SYSTEM SHALL normalize the URL (add https:// if no scheme), save the link, and clear the form

WHEN the submitted URL uses javascript: or data: scheme
THE SYSTEM SHALL reject it with "Alamat harus diawali http:// atau https://"

WHEN the submitted URL already exists in the list
THE SYSTEM SHALL reject it with "Tautan ini sudah ada."

WHEN the user clicks a saved link
THE SYSTEM SHALL open it in a new tab with rel="noopener noreferrer"

WHEN the user presses Hapus on a link
THE SYSTEM SHALL remove it and show an undo toast for 8 seconds

## Penyimpanan dan error

WHEN localStorage is unavailable
THE SYSTEM SHALL show a banner and continue operating in memory

WHEN a localStorage key contains corrupt JSON
THE SYSTEM SHALL discard that key, use the default value, and show "Data lama tidak terbaca dan sudah dihapus."

WHEN a localStorage key contains valid JSON but a field has the wrong type (e.g. name is null, durationMs is a string)
THE SYSTEM SHALL discard that key, use the default value, and show the data corrupt banner

WHEN tasks or links contain items with missing or wrong-typed fields
THE SYSTEM SHALL filter out only the invalid items and keep the valid ones

WHEN a write to localStorage fails
THE SYSTEM SHALL keep the in-memory state intact and show a storage unavailable banner

## Keyboard

WHEN the user toggles a task checkbox using Space
THE SYSTEM SHALL return focus to that same checkbox after re-rendering the list
