import test from 'node:test';
import assert from 'node:assert/strict';
import { createGrid, createSheets, dailyProgress, normalizeData, Round } from '../js/practice-core.mjs';
import { locales, uiKeys } from '../content/locales.mjs';

test('all sizes contain every number exactly once; unsupported sizes fail', () => {
  for (const size of [3, 4, 5, 6]) {
    const expected = Array.from({ length: size * size }, (_, i) => i + 1);
    assert.deepEqual(createGrid(size).sort((a, b) => a - b), expected);
  }
  assert.throws(() => createGrid(7), RangeError);
});

test('timing begins at 1, ignores completed cells, and excludes pauses', () => {
  let clock = 100;
  const round = new Round(3, () => clock);
  assert.equal(round.choose(2), 'incorrect');
  assert.equal(round.state, 'ready');
  assert.equal(round.elapsed, 0);
  assert.equal(round.choose(1), 'correct');
  clock = 1100;
  assert.equal(round.choose(1), 'ignored');
  round.pause();
  clock = 10100;
  assert.equal(round.elapsed, 1000);
  assert.equal(round.choose(2), 'ignored');
  round.resume();
  clock = 11100;
  for (let n = 2; n <= 8; n++) assert.equal(round.choose(n), 'correct');
  assert.equal(round.choose(9), 'complete');
  assert.equal(round.elapsed, 2000);
  clock = 21100;
  assert.equal(round.elapsed, 2000);
  assert.equal(round.choose(9), 'ignored');
  assert.equal(round.mistakes, 1);
});

test('print batches have unique valid puzzles and bounded counts', () => {
  for (const size of [3, 4, 5, 6]) {
    const sheets = createSheets(size, 20);
    assert.equal(new Set(sheets.map(grid => grid.join(','))).size, 20);
    for (const grid of sheets) assert.equal(new Set(grid).size, size * size);
  }
  for (const count of [0, 21, 1.5, NaN]) assert.throws(() => createSheets(5, count), RangeError);
  assert.equal(new Set(createSheets(3, 20, () => 0).map(grid => grid.join(','))).size, 20);
});

test('local dates handle midnight and a streak continuing from yesterday', () => {
  const date = new Date(2026, 9, 10, 12);
  const records = [9, 8, 7].map(day => ({ date: new Date(2026, 9, day, 23, 59).toISOString() }));
  assert.deepEqual(dailyProgress(records, date), { today: 0, streak: 3 });
  records.push({ date: new Date(2026, 9, 10, 0, 1).toISOString() });
  assert.deepEqual(dailyProgress(records, date), { today: 1, streak: 4 });
});

test('untrusted storage cannot inject invalid records or preferences', () => {
  const data = normalizeData({ size: 9, goal: 30, theme: 'invalid', records: [null, {}, { seconds: '4' }] });
  assert.equal(data.size, 5);
  assert.equal(data.goal, 1);
  assert.equal(data.theme, 'system');
  assert.deepEqual(data.records, []);
});

test('every published language has complete controls and grounded content', () => {
  for (const [lang, copy] of Object.entries(locales)) {
    assert.equal(copy.ui.length, uiKeys.length, lang);
    assert.ok(copy.ui.every(label => typeof label === 'string' && label.length > 0), lang);
    assert.equal(copy.faq.length, 5, lang);
  }
});
