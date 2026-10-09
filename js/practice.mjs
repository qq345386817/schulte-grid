import { Round, SIZES, HISTORY_LIMIT, createSheets, dailyProgress, normalizeData } from './practice-core.mjs';

const t = JSON.parse(document.getElementById('practice-copy').textContent);
const lang = document.documentElement.lang;
const $ = id => document.getElementById(id);
const storageKey = 'schulte-grid-web-v1';
const iconUrl = new URL('../images/lucide.svg', import.meta.url).href;
let persistent = true;
let data;
try {
  data = normalizeData(JSON.parse(localStorage.getItem(storageKey)));
} catch {
  data = normalizeData(null);
  persistent = false;
}
let round = new Round(data.size);
let animation;
let view = 'practice';
let page = 0;
let printSize = data.size;
let sheets = [];
let wrongTimer;
const numberFormat = new Intl.NumberFormat(lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const timeText = seconds => `${numberFormat.format(seconds)} s`;
const icon = name => `<svg class="icon" aria-hidden="true"><use href="${iconUrl}#${name}"></use></svg>`;

function readStored() {
  try { return normalizeData(JSON.parse(localStorage.getItem(storageKey))); } catch { return null; }
}

function save() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
    persistent = true;
  } catch { persistent = false; }
  $('local-note').textContent = persistent ? t.local : t.storageError;
}

function applyTheme() {
  if (data.theme === 'system') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = data.theme;
  $('theme').value = data.theme;
}

function updateStats() {
  $('timer').textContent = timeText(round.elapsed / 1000);
  $('next-number').textContent = round.state === 'complete' ? '—' : round.next;
  $('mistakes').textContent = round.mistakes;
  $('pause').disabled = round.state === 'ready' || round.state === 'complete';
  const action = round.state === 'paused' ? 'resume' : 'pause';
  $('pause').title = t[action];
  $('pause').setAttribute('aria-label', t[action]);
  $('pause').innerHTML = icon(action === 'resume' ? 'play' : 'pause');
}

function tick() {
  $('timer').textContent = timeText(round.elapsed / 1000);
  if (round.state === 'running') animation = requestAnimationFrame(tick);
}

function stopAnimation() { cancelAnimationFrame(animation); }

function renderBoard() {
  const board = $('board');
  board.setAttribute('aria-busy', 'false');
  board.style.setProperty('--size', data.size);
  board.classList.toggle('paused', round.state === 'paused');
  board.setAttribute('aria-label', `${t.practice} ${data.size}×${data.size}`);
  board.replaceChildren(...round.numbers.map(number => {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.textContent = number;
    cell.dataset.number = number;
    cell.classList.toggle('done', number < round.next);
    cell.disabled = round.state === 'paused' || round.state === 'complete' || number < round.next;
    if (round.state === 'paused') cell.setAttribute('aria-label', t.paused);
    return cell;
  }));
  document.querySelectorAll('[data-size]').forEach(button => button.setAttribute('aria-pressed', Number(button.dataset.size) === data.size));
  updateStats();
}

function restart() {
  stopAnimation();
  clearTimeout(wrongTimer);
  round = new Round(data.size);
  $('result').hidden = true;
  $('round-message').textContent = t.ready;
  renderBoard();
}

function pause() {
  round.pause();
  stopAnimation();
  clearTimeout(wrongTimer);
  renderBoard();
  $('round-message').textContent = t.paused;
}

function renderSummary() {
  const progress = dailyProgress(data.records);
  $('daily-count').textContent = `${progress.today} / ${data.goal}`;
  $('daily-progress').max = data.goal;
  $('daily-progress').value = Math.min(progress.today, data.goal);
  $('goal').value = data.goal;
  $('streak').textContent = progress.streak;
  $('history-total').textContent = data.records.length;
  $('history-today').textContent = progress.today;
  $('bests').replaceChildren(...SIZES.map(size => {
    const records = data.records.filter(record => record.size === size);
    const row = document.createElement('div');
    row.className = 'best-row';
    const name = document.createElement('span');
    name.textContent = `${size}×${size}`;
    const time = document.createElement('span');
    time.textContent = records.length ? timeText(Math.min(...records.map(record => record.seconds))) : '—';
    row.append(name, time);
    return row;
  }));
}

function complete() {
  stopAnimation();
  const stored = readStored();
  if (stored) data.records = stored.records;
  data.records.unshift({
    id: crypto.randomUUID(), date: new Date().toISOString(),
    size: data.size, seconds: round.elapsed / 1000, mistakes: round.mistakes
  });
  data.records = data.records.slice(0, HISTORY_LIMIT);
  save();
  renderSummary();
  $('round-message').textContent = t.complete;
  $('result-time').textContent = `${data.size}×${data.size} · ${timeText(round.elapsed / 1000)} · ${t.mistakes}: ${round.mistakes}`;
  $('result').hidden = false;
  $('result').querySelector('p:nth-of-type(2)').textContent = persistent ? t.saved : t.storageError;
  $('board').querySelectorAll('button').forEach(button => { button.disabled = true; });
  $('again').focus({ preventScroll: true });
}

$('board').addEventListener('click', event => {
  const cell = event.target.closest('button[data-number]');
  if (!cell || cell.disabled) return;
  clearTimeout(wrongTimer);
  $('board').querySelectorAll('.incorrect').forEach(button => button.classList.remove('incorrect'));
  const priorState = round.state;
  const result = round.choose(Number(cell.dataset.number));
  if (result === 'incorrect') {
    cell.classList.add('incorrect');
    $('round-message').textContent = t.incorrect.replace('{n}', round.next);
    wrongTimer = setTimeout(() => cell.classList.remove('incorrect'), 450);
  } else if (result !== 'ignored') {
    cell.classList.add('done');
    cell.disabled = true;
    $('round-message').textContent = t.incorrect.replace('{n}', round.next);
    if (priorState === 'ready') tick();
    if (result === 'complete') complete();
  }
  updateStats();
});

$('board').addEventListener('keydown', event => {
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
  const cells = [...$('board').querySelectorAll('button')];
  let index = cells.indexOf(event.target);
  if (index === -1) return;
  const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -data.size, ArrowDown: data.size }[event.key];
  event.preventDefault();
  for (let attempt = 0; attempt < cells.length; attempt++) {
    index = (index + step + cells.length) % cells.length;
    if (!cells[index].disabled) { cells[index].focus(); break; }
  }
});

function setView(nextView, updateHash = true) {
  if (!['practice', 'history', 'print'].includes(nextView)) return;
  if (nextView !== 'practice' && round.state === 'running') pause();
  view = nextView;
  document.querySelectorAll('[data-view]').forEach(button => {
    const active = button.dataset.view === view;
    button.setAttribute('aria-selected', active);
    button.tabIndex = active ? 0 : -1;
    $(`view-${button.dataset.view}`).hidden = !active;
  });
  if (view === 'history') { renderSummary(); renderHistory(); }
  if (view === 'print') renderSheets();
  if (updateHash) history.replaceState(null, '', `#${view}`);
}

document.querySelectorAll('[data-view]').forEach(button => {
  button.addEventListener('click', () => setView(button.dataset.view));
  button.addEventListener('keydown', event => {
    const tabs = [...document.querySelectorAll('[data-view]')];
    let index = tabs.indexOf(button);
    if (event.key === 'ArrowRight') index = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') index = (index + tabs.length - 1) % tabs.length;
    else if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = tabs.length - 1;
    else return;
    event.preventDefault();
    tabs[index].focus();
    setView(tabs[index].dataset.view);
  });
});

document.querySelectorAll('[data-size]').forEach(button => button.addEventListener('click', () => {
  const size = Number(button.dataset.size);
  if (data.size === size) return;
  data.size = size;
  save();
  restart();
}));
$('restart').addEventListener('click', restart);
$('again').addEventListener('click', restart);
$('pause').addEventListener('click', () => {
  if (round.state === 'running') pause();
  else if (round.state === 'paused') {
    round.resume();
    renderBoard();
    $('round-message').textContent = t.incorrect.replace('{n}', round.next);
    tick();
  }
});
$('theme').addEventListener('change', () => { data.theme = $('theme').value; applyTheme(); save(); });
$('goal').addEventListener('change', () => { data.goal = Number($('goal').value); save(); renderSummary(); });
$('language').addEventListener('change', () => { location.href = $('language').value + location.hash; });

function filteredRecords() {
  const size = $('history-filter').value;
  return data.records.filter(record => size === 'all' || record.size === Number(size));
}

function renderHistory() {
  const records = filteredRecords();
  page = Math.max(0, Math.min(page, Math.ceil(records.length / 20) - 1));
  $('history-empty').hidden = records.length > 0;
  $('history-table').hidden = records.length === 0;
  $('history-pager').hidden = records.length <= 20;
  $('previous').disabled = page === 0;
  $('more').disabled = (page + 1) * 20 >= records.length;
  $('page-count').textContent = `${page + 1} / ${Math.max(1, Math.ceil(records.length / 20))}`;
  $('export').disabled = records.length === 0;
  $('clear').disabled = data.records.length === 0;
  $('history-rows').replaceChildren(...records.slice(page * 20, (page + 1) * 20).map(record => {
    const row = document.createElement('tr');
    for (const value of [new Date(record.date).toLocaleString(lang), `${record.size}×${record.size}`, timeText(record.seconds), record.mistakes]) {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.append(cell);
    }
    const actionCell = document.createElement('td');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'icon-button';
    button.innerHTML = icon('trash-2');
    button.title = t.delete;
    button.setAttribute('aria-label', t.delete);
    button.addEventListener('click', () => {
      const stored = readStored();
      data.records = (stored?.records || data.records).filter(item => item.id !== record.id);
      save(); renderHistory(); renderSummary();
    });
    actionCell.append(button);
    row.append(actionCell);
    return row;
  }));
}

$('history-filter').addEventListener('change', () => { page = 0; renderHistory(); });
$('previous').addEventListener('click', () => { page--; renderHistory(); });
$('more').addEventListener('click', () => { page++; renderHistory(); });
$('clear').addEventListener('click', () => {
  if (!confirm(t.clearConfirm)) return;
  data.records = [];
  save(); renderHistory(); renderSummary();
});
$('export').addEventListener('click', () => {
  const csv = [['date', 'grid_size', 'seconds', 'mistakes'].join(','), ...filteredRecords().map(record =>
    [record.date, `${record.size}x${record.size}`, record.seconds.toFixed(3), record.mistakes].join(','))].join('\r\n');
  const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'schulte-grid-history.csv';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

function sheetContent(grid, index) {
  const holder = document.createElement('section');
  holder.className = 'print-sheet';
  const title = document.createElement('h2');
  title.textContent = `${t.sheet} ${index + 1} · ${printSize}×${printSize}`;
  const sub = document.createElement('p');
  sub.textContent = `${t.practice} · 1 → ${printSize * printSize}`;
  const board = document.createElement('div');
  board.className = 'paper-grid';
  board.style.setProperty('--size', printSize);
  grid.forEach(number => { const cell = document.createElement('span'); cell.textContent = number; board.append(cell); });
  const meta = document.createElement('div');
  meta.className = 'paper-meta';
  for (const text of [`${t.name}: ______________`, `${t.paperTime}: __________`, 'schulte-grid.luopeike.com']) {
    const label = document.createElement('span'); label.textContent = text; meta.append(label);
  }
  holder.append(title, sub, board, meta);
  return holder;
}

function sheetCount() {
  const count = Math.max(1, Math.min(20, Math.floor(Number($('sheet-count').value) || 1)));
  $('sheet-count').value = count;
  return count;
}

function renderSheets(refresh = false) {
  const count = sheetCount();
  if (refresh || sheets.length !== count || sheets[0]?.length !== printSize * printSize) sheets = createSheets(printSize, count);
  $('sheet-preview').replaceChildren(sheetContent(sheets[0], 0));
  $('print-output').replaceChildren(...sheets.map(sheetContent));
  document.querySelectorAll('[data-print-size]').forEach(button => button.setAttribute('aria-pressed', Number(button.dataset.printSize) === printSize));
}

document.querySelectorAll('[data-print-size]').forEach(button => button.addEventListener('click', () => {
  printSize = Number(button.dataset.printSize); renderSheets(true);
}));
$('sheet-count').addEventListener('change', () => renderSheets(true));
$('refresh-sheets').addEventListener('click', () => renderSheets(true));
$('print-now').addEventListener('click', () => { renderSheets(); window.print(); });
$('quick-print').addEventListener('click', () => { printSize = data.size; setView('print'); $('tab-print').focus(); });
window.addEventListener('beforeprint', () => {
  if (round.state === 'running') pause();
  if (view !== 'print') printSize = data.size;
  renderSheets();
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden && round.state === 'running') pause();
  if (!document.hidden) renderSummary();
});
window.addEventListener('storage', event => {
  if (event.key !== storageKey && event.key !== null) return;
  const stored = readStored();
  if (!stored) return;
  data.records = stored.records;
  data.goal = stored.goal;
  renderSummary();
  if (view === 'history') renderHistory();
});
window.addEventListener('hashchange', () => setView(location.hash.slice(1), false));
applyTheme();
renderBoard();
$('round-message').textContent = t.ready;
$('retry-load').hidden = true;
renderSummary();
renderSheets();
$('local-note').textContent = persistent ? t.local : t.storageError;
setView(location.hash.slice(1), false);
