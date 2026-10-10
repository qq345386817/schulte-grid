export const SIZES = [3, 4, 5, 6];

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
