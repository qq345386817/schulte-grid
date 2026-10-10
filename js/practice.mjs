import { Round, createSheets } from './practice-core.mjs';

const t = JSON.parse(document.getElementById('practice-copy').textContent);
const lang = document.documentElement.lang;
const $ = id => document.getElementById(id);
const iconUrl = new URL('../images/lucide.svg', import.meta.url).href;
// Remove records left by the previous version; this version keeps no saved practice data.
try {
  localStorage.removeItem('schulte-grid-web-v1');
} catch { /* Practice also works when browser storage is blocked. */ }
const data = { size: 5, theme: 'system' };
let round = new Round(data.size);
let animation;
let view = 'practice';
let printSize = data.size;
let sheets = [];
let wrongTimer;
const numberFormat = new Intl.NumberFormat(lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const timeText = seconds => `${numberFormat.format(seconds)} s`;
const icon = name => `<svg class="icon" aria-hidden="true"><use href="${iconUrl}#${name}"></use></svg>`;

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
  $('result-time').textContent = '';
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

function complete() {
  stopAnimation();
  $('round-message').textContent = t.complete;
  $('result-time').textContent = `${data.size}×${data.size} · ${timeText(round.elapsed / 1000)} · ${t.mistakes}: ${round.mistakes}`;
  $('result').hidden = false;
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
  if (nextView === 'history') { nextView = 'practice'; updateHash = true; }
  if (!['practice', 'print'].includes(nextView)) return;
  if (nextView !== 'practice' && round.state === 'running') pause();
  view = nextView;
  document.querySelectorAll('[data-view]').forEach(button => {
    const active = button.dataset.view === view;
    button.setAttribute('aria-selected', active);
    button.tabIndex = active ? 0 : -1;
    $(`view-${button.dataset.view}`).hidden = !active;
  });
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
$('theme').addEventListener('change', () => { data.theme = $('theme').value; applyTheme(); });
$('language').addEventListener('change', () => { location.href = $('language').value + location.hash; });

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
});
window.addEventListener('hashchange', () => setView(location.hash.slice(1), false));
window.addEventListener('pagehide', restart);
applyTheme();
renderBoard();
$('round-message').textContent = t.ready;
$('retry-load').hidden = true;
renderSheets();
setView(location.hash.slice(1), false);
