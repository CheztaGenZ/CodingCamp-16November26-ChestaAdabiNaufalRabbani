'use strict';

(function () {

  /* ── Storage keys ── */
  const KEY_TASKS    = 'lifedash.v1.tasks';
  const KEY_LINKS    = 'lifedash.v1.links';
  const KEY_SETTINGS = 'lifedash.v1.settings';
  const KEY_TIMER    = 'lifedash.v1.timer';

  /* ── Defaults ── */
  const DEFAULT_SETTINGS = { name: '', durationMs: 25 * 60 * 1000, sort: 'created' };
  const DEFAULT_TIMER    = { status: 'idle', endsAt: null, remainingMs: 0 };

  /* ── State ── */
  let state = {
    tasks:    [],
    links:    [],
    settings: Object.assign({}, DEFAULT_SETTINGS),
    timer:    Object.assign({}, DEFAULT_TIMER),
  };

  /* ── Undo ── */
  let undoStack = null;
  let undoTimer = null;

  /* ── Storage helpers ── */
  let storageAvailable = true;

  function tryRead(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }

  function tryWrite(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (_) {
      return false;
    }
  }

  function checkStorage() {
    try {
      const probe = '__lifedash_probe__';
      localStorage.setItem(probe, '1');
      localStorage.removeItem(probe);
      return true;
    } catch (_) {
      return false;
    }
  }

  function showStorageBanner(msg) {
    const banner = document.getElementById('storage-banner');
    const msgEl  = document.getElementById('storage-banner-msg');
    msgEl.textContent = msg;
    banner.hidden = false;
  }

  function persistAll() {
    const ok = [
      tryWrite(KEY_TASKS,    state.tasks),
      tryWrite(KEY_LINKS,    state.links),
      tryWrite(KEY_SETTINGS, state.settings),
      tryWrite(KEY_TIMER,    state.timer),
    ];
    if (ok.some(r => r === false) && storageAvailable) {
      showStorageBanner('Penyimpanan tidak tersedia. Perubahan hilang saat tab ditutup.');
    }
  }

  function persistTimer() {
    tryWrite(KEY_TIMER, state.timer);
  }

  /* ── Load state ── */
  function loadState() {
    storageAvailable = checkStorage();

    if (!storageAvailable) {
      showStorageBanner('Penyimpanan tidak tersedia. Perubahan hilang saat tab ditutup.');
      return;
    }

    let dataCorrupt = false;

    const rawTasks = tryRead(KEY_TASKS, null);
    if (Array.isArray(rawTasks)) {
      state.tasks = rawTasks;
    } else if (rawTasks !== null) {
      dataCorrupt = true;
      tryWrite(KEY_TASKS, []);
    }

    const rawLinks = tryRead(KEY_LINKS, null);
    if (Array.isArray(rawLinks)) {
      state.links = rawLinks;
    } else if (rawLinks !== null) {
      dataCorrupt = true;
      tryWrite(KEY_LINKS, []);
    }

    const rawSettings = tryRead(KEY_SETTINGS, null);
    if (rawSettings && typeof rawSettings === 'object') {
      state.settings = Object.assign({}, DEFAULT_SETTINGS, rawSettings);
    } else if (rawSettings !== null) {
      dataCorrupt = true;
      tryWrite(KEY_SETTINGS, DEFAULT_SETTINGS);
    }

    const rawTimer = tryRead(KEY_TIMER, null);
    if (rawTimer && typeof rawTimer === 'object') {
      const t = Object.assign({}, DEFAULT_TIMER, rawTimer);
      if (t.status === 'running') {
        if (t.endsAt !== null && Date.now() >= t.endsAt) {
          t.status = 'done';
          t.endsAt = null;
          t.remainingMs = 0;
        }
      }
      state.timer = t;
    } else if (rawTimer !== null) {
      dataCorrupt = true;
      tryWrite(KEY_TIMER, DEFAULT_TIMER);
    }

    if (dataCorrupt) {
      showStorageBanner('Data lama tidak terbaca dan sudah dihapus.');
    }
  }

  /* ── ID generator ── */
  function newId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random()}`;
  }

  /* ── Clock & greeting ── */
  function greetPhrase(hour) {
    if (hour >= 5  && hour <= 10) return 'Selamat pagi';
    if (hour >= 11 && hour <= 14) return 'Selamat siang';
    if (hour >= 15 && hour <= 18) return 'Selamat sore';
    return 'Selamat malam';
  }

  function renderClock() {
    const now      = new Date();
    const hour     = now.getHours();
    const min      = String(now.getMinutes()).padStart(2, '0');
    const sec      = String(now.getSeconds()).padStart(2, '0');
    const hourStr  = String(hour).padStart(2, '0');

    const clockEl = document.getElementById('clock');
    clockEl.setAttribute('datetime', now.toISOString());
    clockEl.innerHTML = '';
    const mainTime = document.createTextNode(`${hourStr}:${min}`);
    const secSpan  = document.createElement('span');
    secSpan.className = 'seconds';
    secSpan.textContent = sec;
    clockEl.appendChild(mainTime);
    clockEl.appendChild(secSpan);

    const dateEl = document.getElementById('date');
    const dateFmt = new Intl.DateTimeFormat('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
    dateEl.setAttribute('datetime', now.toISOString().slice(0, 10));
    dateEl.textContent = dateFmt.format(now);

    renderGreeting(hour);
  }

  function renderGreeting(hour) {
    const name     = state.settings.name.trim();
    const phrase   = greetPhrase(hour);
    const greetEl  = document.getElementById('greeting');
    if (name) {
      greetEl.textContent = `${phrase}, ${name}.`;
    } else {
      greetEl.textContent = `${phrase}.`;
    }
  }

  /* ── Timer ── */
  let tickRaf = null;

  function formatMs(ms) {
    const totalSec = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function timerRemainingMs() {
    const t = state.timer;
    if (t.status === 'running' && t.endsAt !== null) {
      return Math.max(0, t.endsAt - Date.now());
    }
    if (t.status === 'paused') {
      return t.remainingMs;
    }
    if (t.status === 'idle') {
      return state.settings.durationMs;
    }
    return 0;
  }

  function renderTimer() {
    const t         = state.timer;
    const digitsEl  = document.getElementById('timer-digits');
    const statusEl  = document.getElementById('timer-status');
    const barEl     = document.getElementById('timer-bar');
    const primaryEl = document.getElementById('btn-timer-primary');
    const durationInput = document.getElementById('input-duration');
    const durationHint  = document.getElementById('duration-hint');
    const totalMs   = state.settings.durationMs;

    const remMs = timerRemainingMs();
    digitsEl.textContent = formatMs(remMs);

    digitsEl.classList.remove('running', 'done');
    if (t.status === 'running' || t.status === 'done') {
      digitsEl.classList.add(t.status);
    }

    const progress = t.status === 'done' ? 1 : (totalMs > 0 ? (totalMs - remMs) / totalMs : 0);
    barEl.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;

    if (t.status === 'idle') {
      statusEl.textContent = 'Siap. Tekan mulai.';
      primaryEl.textContent = 'Mulai';
      durationInput.disabled = false;
      durationHint.hidden = true;
    } else if (t.status === 'running') {
      const endsDate = new Date(t.endsAt);
      const hh = String(endsDate.getHours()).padStart(2, '0');
      const mm = String(endsDate.getMinutes()).padStart(2, '0');
      statusEl.textContent = `Selesai pukul ${hh}.${mm}.`;
      primaryEl.textContent = 'Jeda';
      durationInput.disabled = true;
      durationHint.hidden = false;
    } else if (t.status === 'paused') {
      const m = Math.floor(remMs / 60000);
      const s = Math.floor((remMs % 60000) / 1000);
      statusEl.textContent = `Berhenti di ${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.`;
      primaryEl.textContent = 'Lanjut';
      durationInput.disabled = true;
      durationHint.hidden = false;
    } else if (t.status === 'done') {
      statusEl.textContent = 'Waktu habis.';
      primaryEl.textContent = 'Mulai';
      durationInput.disabled = false;
      durationHint.hidden = true;
    }
  }

  function timerTick() {
    const t = state.timer;
    if (t.status === 'running') {
      const remMs = t.endsAt - Date.now();
      if (remMs <= 0) {
        state.timer.status = 'done';
        state.timer.endsAt = null;
        state.timer.remainingMs = 0;
        persistTimer();

        const barEl = document.getElementById('timer-bar');
        barEl.classList.add('completing');
        barEl.style.transform = 'scaleX(1)';

        const digitsEl = document.getElementById('timer-digits');
        digitsEl.textContent = '00:00';
        digitsEl.classList.remove('running');
        digitsEl.classList.add('done');

        renderTimer();
        stopTick();
        return;
      }
      renderTimer();
      tickRaf = requestAnimationFrame(timerTick);
    }
  }

  function startTick() {
    if (tickRaf) cancelAnimationFrame(tickRaf);
    tickRaf = requestAnimationFrame(timerTick);
  }

  function stopTick() {
    if (tickRaf) {
      cancelAnimationFrame(tickRaf);
      tickRaf = null;
    }
  }

  /* ── Tasks ── */
  function sortedTasks() {
    const tasks = state.tasks.slice();
    const sort  = state.settings.sort;
    if (sort === 'alpha') {
      tasks.sort((a, b) => a.title.localeCompare(b.title, 'id'));
    } else if (sort === 'open') {
      tasks.sort((a, b) => {
        if (a.done === b.done) return a.createdAt - b.createdAt;
        return a.done ? 1 : -1;
      });
    } else {
      tasks.sort((a, b) => a.createdAt - b.createdAt);
    }
    return tasks;
  }

  function renderTasks() {
    const list     = document.getElementById('task-list');
    const empty    = document.getElementById('task-empty');
    const countEl  = document.getElementById('task-count');

    const tasks  = sortedTasks();
    const total  = state.tasks.length;
    const done   = state.tasks.filter(t => t.done).length;

    countEl.textContent = total > 0 ? `${done} dari ${total} selesai` : '';

    list.innerHTML = '';

    if (total === 0) {
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-item' + (task.done ? ' done' : '');
      li.dataset.id = task.id;

      const labelEl = document.createElement('label');
      labelEl.htmlFor = `chk-${task.id}`;

      const chk = document.createElement('input');
      chk.type = 'checkbox';
      chk.id = `chk-${task.id}`;
      chk.checked = task.done;
      chk.setAttribute('aria-label', task.title);

      const titleSpan = document.createElement('span');
      titleSpan.className = 'task-title';
      titleSpan.textContent = task.title;

      labelEl.appendChild(chk);
      labelEl.appendChild(titleSpan);

      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'task-actions';

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'btn-text';
      editBtn.textContent = 'Ubah';
      editBtn.dataset.action = 'edit';
      editBtn.dataset.id = task.id;

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'btn-text';
      delBtn.textContent = 'Hapus';
      delBtn.dataset.action = 'delete';
      delBtn.dataset.id = task.id;

      actionsDiv.appendChild(editBtn);
      actionsDiv.appendChild(delBtn);

      li.appendChild(labelEl);
      li.appendChild(actionsDiv);

      list.appendChild(li);
    });
  }

  function addTask(title) {
    const trimmed = title.trim().replace(/  +/g, ' ');
    if (!trimmed) return;

    const dup = state.tasks.some(t => t.title.trim().toLowerCase() === trimmed.toLowerCase());
    if (dup) {
      const errEl = document.getElementById('task-error');
      errEl.textContent = 'Tugas ini sudah ada.';
      return;
    }

    const task = {
      id: newId(),
      title: trimmed.slice(0, 120),
      done: false,
      createdAt: Date.now(),
    };
    state.tasks.push(task);
    persistAll();
    renderTasks();

    document.getElementById('task-error').textContent = '';
    const inp = document.getElementById('input-task');
    inp.value = '';
    inp.focus();
  }

  function toggleTask(id) {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;
    task.done = !task.done;
    persistAll();
    renderTasks();
  }

  function startEditTask(id) {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;

    const li = document.querySelector(`.task-item[data-id="${id}"]`);
    if (!li) return;

    li.innerHTML = '';

    const editRow = document.createElement('div');
    editRow.className = 'task-edit-row';

    const inp = document.createElement('input');
    inp.type = 'text';
    inp.value = task.title;
    inp.maxLength = 120;
    inp.setAttribute('aria-label', 'Edit tugas');

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'task-edit-actions';

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn-secondary';
    saveBtn.textContent = 'Simpan';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn-text';
    cancelBtn.textContent = 'Batal';

    actionsDiv.appendChild(saveBtn);
    actionsDiv.appendChild(cancelBtn);
    editRow.appendChild(inp);
    editRow.appendChild(actionsDiv);
    li.appendChild(editRow);

    inp.focus();
    inp.select();

    function doSave() {
      const val = inp.value.trim().replace(/  +/g, ' ');
      if (!val) {
        renderTasks();
        return;
      }
      const dup = state.tasks.some(t => t.id !== id && t.title.trim().toLowerCase() === val.toLowerCase());
      if (dup) {
        const errEl = document.getElementById('task-error');
        errEl.textContent = 'Tugas ini sudah ada.';
        renderTasks();
        return;
      }
      task.title = val.slice(0, 120);
      persistAll();
      renderTasks();
      document.getElementById('task-error').textContent = '';
      const editBtn = document.querySelector(`.task-item[data-id="${id}"] [data-action="edit"]`);
      if (editBtn) editBtn.focus();
    }

    function doCancel() {
      renderTasks();
      const editBtn = document.querySelector(`.task-item[data-id="${id}"] [data-action="edit"]`);
      if (editBtn) editBtn.focus();
    }

    saveBtn.addEventListener('click', doSave);
    cancelBtn.addEventListener('click', doCancel);
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter')  { e.preventDefault(); doSave(); }
      if (e.key === 'Escape') { e.preventDefault(); doCancel(); }
    });
  }

  function deleteTask(id) {
    const idx  = state.tasks.findIndex(t => t.id === id);
    if (idx === -1) return;
    const removed = state.tasks[idx];
    state.tasks.splice(idx, 1);
    persistAll();
    renderTasks();
    showToast('Tugas dihapus.', () => {
      state.tasks.splice(idx, 0, removed);
      persistAll();
      renderTasks();
    });
  }

  /* ── Links ── */
  function normalizeUrl(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    let url = trimmed;
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
      return parsed.href;
    } catch (_) {
      return null;
    }
  }

  function renderLinks() {
    const list  = document.getElementById('link-list');
    const empty = document.getElementById('link-empty');

    list.innerHTML = '';

    if (state.links.length === 0) {
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    state.links.forEach(link => {
      const li = document.createElement('li');
      li.className = 'link-item';
      li.dataset.id = link.id;

      const a = document.createElement('a');
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = link.label;

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'btn-text';
      delBtn.textContent = 'Hapus';
      delBtn.dataset.action = 'delete-link';
      delBtn.dataset.id = link.id;

      li.appendChild(a);
      li.appendChild(delBtn);
      list.appendChild(li);
    });
  }

  function addLink(label, rawUrl) {
    const trimLabel = label.trim().replace(/  +/g, ' ').slice(0, 24);
    const errEl = document.getElementById('link-error');

    if (!trimLabel) return;

    const normalized = normalizeUrl(rawUrl);
    if (!normalized) {
      errEl.textContent = 'Alamat harus diawali http:// atau https://.';
      return;
    }

    const dup = state.links.some(l => l.url === normalized);
    if (dup) {
      errEl.textContent = 'Tautan ini sudah ada.';
      return;
    }

    const link = { id: newId(), label: trimLabel, url: normalized };
    state.links.push(link);
    persistAll();
    renderLinks();

    errEl.textContent = '';
    document.getElementById('input-link-label').value = '';
    document.getElementById('input-link-url').value = '';
    document.getElementById('input-link-label').focus();
  }

  function deleteLink(id) {
    const idx = state.links.findIndex(l => l.id === id);
    if (idx === -1) return;
    const removed = state.links[idx];
    state.links.splice(idx, 1);
    persistAll();
    renderLinks();
    showToast('Tautan dihapus.', () => {
      state.links.splice(idx, 0, removed);
      persistAll();
      renderLinks();
    });
  }

  /* ── Toast ── */
  function showToast(msg, undoFn) {
    if (undoTimer) clearTimeout(undoTimer);
    undoStack = undoFn;

    const toastEl  = document.getElementById('toast');
    const msgEl    = document.getElementById('toast-msg');
    const undoBtn  = document.getElementById('toast-undo');

    msgEl.textContent = msg;
    toastEl.hidden = false;

    function startUndoTimer() {
      undoTimer = setTimeout(hideToast, 8000);
    }

    function stopUndoTimer() {
      if (undoTimer) clearTimeout(undoTimer);
    }

    toastEl.addEventListener('mouseenter', stopUndoTimer);
    toastEl.addEventListener('mouseleave', startUndoTimer);
    undoBtn.addEventListener('focus', stopUndoTimer);
    undoBtn.addEventListener('blur', startUndoTimer);

    startUndoTimer();
  }

  function hideToast() {
    document.getElementById('toast').hidden = true;
    undoStack = null;
  }

  /* ── Event wiring ── */
  function wireEvents() {
    /* Clock tick */
    setInterval(renderClock, 1000);

    /* Name save */
    document.getElementById('btn-save-name').addEventListener('click', () => {
      const inp = document.getElementById('input-name');
      let val = inp.value.trim().replace(/  +/g, ' ').slice(0, 24);
      state.settings.name = val;
      persistAll();
      renderGreeting(new Date().getHours());
      const msg = document.getElementById('name-saved-msg');
      msg.textContent = 'Tersimpan.';
      setTimeout(() => { msg.textContent = ''; }, 2000);
    });

    document.getElementById('input-name').addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('btn-save-name').click();
      }
    });

    /* Timer primary */
    document.getElementById('btn-timer-primary').addEventListener('click', () => {
      const t = state.timer;
      if (t.status === 'idle' || t.status === 'done') {
        state.timer = {
          status: 'running',
          endsAt: Date.now() + state.settings.durationMs,
          remainingMs: 0,
        };
        persistTimer();
        renderTimer();
        startTick();
      } else if (t.status === 'running') {
        const remMs = t.endsAt - Date.now();
        state.timer = {
          status: 'paused',
          endsAt: null,
          remainingMs: Math.max(0, remMs),
        };
        persistTimer();
        stopTick();
        renderTimer();
      } else if (t.status === 'paused') {
        state.timer = {
          status: 'running',
          endsAt: Date.now() + state.timer.remainingMs,
          remainingMs: 0,
        };
        persistTimer();
        renderTimer();
        startTick();
      }
    });

    /* Timer reset */
    document.getElementById('btn-timer-reset').addEventListener('click', () => {
      stopTick();
      const barEl = document.getElementById('timer-bar');
      barEl.classList.remove('completing');
      state.timer = {
        status: 'idle',
        endsAt: null,
        remainingMs: 0,
      };
      persistTimer();
      renderTimer();
    });

    /* Duration change */
    document.getElementById('input-duration').addEventListener('change', e => {
      if (state.timer.status !== 'idle' && state.timer.status !== 'done') return;
      let val = parseInt(e.target.value, 10);
      if (isNaN(val) || val < 1)   val = 1;
      if (val > 120) val = 120;
      e.target.value = val;
      state.settings.durationMs = val * 60 * 1000;
      state.timer = { status: 'idle', endsAt: null, remainingMs: 0 };
      persistAll();
      renderTimer();
    });

    /* Task list delegation */
    document.getElementById('task-list').addEventListener('click', e => {
      const editBtn = e.target.closest('[data-action="edit"]');
      const delBtn  = e.target.closest('[data-action="delete"]');
      const chk     = e.target.closest('input[type="checkbox"]');

      if (editBtn) {
        startEditTask(editBtn.dataset.id);
      } else if (delBtn) {
        deleteTask(delBtn.dataset.id);
      } else if (chk) {
        toggleTask(chk.closest('.task-item').dataset.id);
      }
    });

    /* Add task */
    document.getElementById('btn-add-task').addEventListener('click', () => {
      addTask(document.getElementById('input-task').value);
    });

    document.getElementById('input-task').addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTask(document.getElementById('input-task').value);
      }
    });

    /* Sort */
    document.getElementById('select-sort').addEventListener('change', e => {
      state.settings.sort = e.target.value;
      persistAll();
      renderTasks();
    });

    /* Link list delegation */
    document.getElementById('link-list').addEventListener('click', e => {
      const delBtn = e.target.closest('[data-action="delete-link"]');
      if (delBtn) deleteLink(delBtn.dataset.id);
    });

    /* Add link */
    document.getElementById('btn-add-link').addEventListener('click', () => {
      addLink(
        document.getElementById('input-link-label').value,
        document.getElementById('input-link-url').value
      );
    });

    document.getElementById('input-link-url').addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('btn-add-link').click();
      }
    });

    /* Toast undo */
    document.getElementById('toast-undo').addEventListener('click', () => {
      if (undoStack) undoStack();
      hideToast();
    });

    /* Storage banner close */
    document.getElementById('storage-banner-close').addEventListener('click', () => {
      document.getElementById('storage-banner').hidden = true;
    });

    /* Cross-tab sync */
    window.addEventListener('storage', e => {
      if (!e.key || !e.key.startsWith('lifedash.')) return;
      loadState();
      renderAll();
    });
  }

  /* ── Init ── */
  function renderAll() {
    renderClock();
    renderTimer();
    renderTasks();
    renderLinks();

    const nameInp = document.getElementById('input-name');
    nameInp.value = state.settings.name;

    const sortSel = document.getElementById('select-sort');
    sortSel.value = state.settings.sort;

    const durInp = document.getElementById('input-duration');
    durInp.value = Math.round(state.settings.durationMs / 60000);

    if (state.timer.status === 'running') {
      startTick();
    }
  }

  loadState();
  wireEvents();
  renderAll();

})();
