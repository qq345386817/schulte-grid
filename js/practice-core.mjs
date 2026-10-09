export const SIZES = [3, 4, 5, 6];
export const HISTORY_LIMIT = 500;

export function createGrid(size, random = Math.random) {
  if (!SIZES.includes(size)) throw new RangeError('Unsupported grid size');
  const numbers = Array.from({ length: size * size }, (_, i) => i + 1);
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  return numbers;
}

export function createSheets(size, count, random = Math.random) {
  if (!Number.isInteger(count) || count < 1 || count > 20) throw new RangeError('Invalid sheet count');
  const signatures = new Set();
  return Array.from({ length: count }, () => {
    const grid = createGrid(size, random);
    // Walk permutations on a collision, so even a constant random source terminates.
    while (signatures.has(grid.join(','))) {
      let pivot = grid.length - 2;
      while (pivot >= 0 && grid[pivot] >= grid[pivot + 1]) pivot--;
      if (pivot < 0) grid.reverse();
      else {
        let successor = grid.length - 1;
        while (grid[successor] <= grid[pivot]) successor--;
        [grid[pivot], grid[successor]] = [grid[successor], grid[pivot]];
        grid.splice(pivot + 1, grid.length, ...grid.slice(pivot + 1).reverse());
      }
    }
    signatures.add(grid.join(','));
    return grid;
  });
}

export function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function normalizeData(raw) {
  const data = raw && typeof raw === 'object' ? raw : {};
  const records = Array.isArray(data.records) ? data.records.filter(record =>
    record && typeof record.id === 'string' && record.id.length <= 100 &&
    SIZES.includes(record.size) && Number.isFinite(record.seconds) && record.seconds >= 0 &&
    Number.isInteger(record.mistakes) && record.mistakes >= 0 &&
    typeof record.date === 'string' && Number.isFinite(Date.parse(record.date))
  ).sort((a, b) => Date.parse(b.date) - Date.parse(a.date)).slice(0, HISTORY_LIMIT) : [];
  return {
    size: SIZES.includes(data.size) ? data.size : 5,
    goal: [1, 2, 3, 4, 5].includes(data.goal) ? data.goal : 1,
    theme: ['system', 'paper', 'mint', 'sand', 'night', 'ink'].includes(data.theme) ? data.theme : 'system',
    records
  };
}

export function dailyProgress(records, date = new Date()) {
  const today = dayKey(date);
  const counts = new Map();
  for (const record of records) {
    const key = dayKey(new Date(record.date));
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  let streak = 0;
  const cursor = new Date(date);
  if (!counts.has(today)) cursor.setDate(cursor.getDate() - 1);
  while (counts.has(dayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return { today: counts.get(today) || 0, streak };
}

export class Round {
  constructor(size, now = () => performance.now()) {
    this.size = size;
    this.numbers = createGrid(size);
    this.next = 1;
    this.mistakes = 0;
    this.state = 'ready';
    this.offset = 0;
    this.started = 0;
    this.now = now;
  }

  get elapsed() {
    return this.offset + (this.state === 'running' ? Math.max(0, this.now() - this.started) : 0);
  }

  choose(number) {
    if (this.state === 'paused' || this.state === 'complete' || number < this.next) return 'ignored';
    if (number !== this.next) {
      this.mistakes++;
      return 'incorrect';
    }
    if (this.state === 'ready') {
      this.started = this.now();
      this.state = 'running';
    }
    this.next++;
    if (this.next > this.size * this.size) {
      this.offset = this.elapsed;
      this.state = 'complete';
      return 'complete';
    }
    return 'correct';
  }

  pause() {
    if (this.state !== 'running') return;
    this.offset = this.elapsed;
    this.state = 'paused';
  }

  resume() {
    if (this.state !== 'paused') return;
    this.started = this.now();
    this.state = 'running';
  }
}
