import { readFile, access, mkdtemp, rename, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Optional authoring command; the static website does not need ImageMagick or a font download.
const tokens = JSON.parse(await readFile(new URL('../style/tokens.json', import.meta.url), 'utf8'));
const color = Object.fromEntries(tokens.color.tokens.map(token => [token.name, token.value.light]));
const font = process.env.SCHULTE_PREVIEW_FONT || '/System/Library/Fonts/Supplemental/Trebuchet MS.ttf';
await access(font);
const temporary = await mkdtemp(join(tmpdir(), 'schulte-social-'));
try {
  const output = join(temporary, 'preview.png');
  const args = ['-size', '1200x630', `xc:${color.bg}`, '-font', font];
  const text = (x, y, value, size, ink = color.text) => args.push('-fill', ink, '-stroke', 'none', '-pointsize', `${size}`, '-annotate', `+${x}+${y}`, value);
  const box = (x, y, width, height, fill, stroke = 'none') => args.push('-fill', fill, '-stroke', stroke, '-strokewidth', '1', '-draw', `roundrectangle ${x},${y} ${x + width},${y + height} 6,6`);
  text(64, 106, 'SCHULTE GRID', 16, color.primary);
  text(64, 220, 'Schulte Grid', 64);
  text(64, 286, 'Online practice.', 30, color.muted);
  text(64, 330, 'Printable worksheets.', 30, color.muted);
  text(64, 416, '3×3 to 6×6 · Timer · A4 / PDF', 23, color.mint);
  text(64, 507, 'Web demo. Your results are not saved.', 16, color.muted);
  text(64, 548, 'schulte-grid.luopeike.com', 16, color.muted);
  box(780, 100, 106, 72, color['surface-soft']);
  box(894, 100, 104, 72, color['next-bg']);
  box(1006, 100, 106, 72, color['surface-soft']);
  text(794, 123, 'Time', 13, color.muted);
  text(794, 153, '0.00 s', 23);
  text(908, 123, 'Next', 13, color['next-ink']);
  text(908, 153, '1', 23, color['next-ink']);
  text(1020, 123, 'Mistakes', 13, color.muted);
  text(1020, 153, '0', 23);
  const numbers = [17, 4, 21, 9, 1, 12, 25, 6, 14, 19, 3, 16, 8, 23, 11, 20, 5, 13, 2, 24, 7, 18, 10, 22, 15];
  for (const [index, number] of numbers.entries()) {
    const x = 780 + index % 5 * 68;
    const y = 196 + Math.floor(index / 5) * 68;
    box(x, y, 60, 60, color['surface-strong'], color['control-border']);
    text(x + (number > 9 ? 17 : 24), y + 39, `${number}`, 24);
  }
  args.push('-strip', '-define', 'png:compression-level=9', output);
  const result = spawnSync('magick', args, { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || result.error?.message || 'ImageMagick failed');
  const png = await readFile(output);
  if (png.readUInt32BE(16) !== 1200 || png.readUInt32BE(20) !== 630) throw new Error('Invalid social image dimensions');
  await rename(output, fileURLToPath(new URL('../og-image.png', import.meta.url)));
  console.log(`Rendered 1200×630 social preview (${png.length} bytes).`);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
