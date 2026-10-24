import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildTokens } from '../scripts/design-tokens.mjs';
import { experienceLabels, locales } from '../content/locales.mjs';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const luminance = hex => {
  const channels = hex.slice(1).match(/../g).map(channel => parseInt(channel, 16) / 255)
    .map(channel => channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4);
  return channels.reduce((sum, channel, index) => sum + channel * [.2126, .7152, .0722][index], 0);
};
const contrast = (a, b) => {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + .05) / (values[1] + .05);
};

test('design tokens use unique names and accessible color pairings in both modes', async () => {
  const tokens = JSON.parse(await read('style/tokens.json'));
  const names = ['color', 'spacing', 'radius'].flatMap(family => tokens[family].tokens.map(token => token.name));
  assert.equal(new Set(names).size, names.length);
  for (const theme of tokens.color.themes) {
    const colors = Object.fromEntries(tokens.color.tokens.map(token => [token.name, token.value[theme.id]]));
    for (const [ink, background] of [['text', 'bg'], ['muted', 'bg'], ['muted', 'surface-strong'], ['muted', 'surface-soft'], ['on-primary', 'primary'], ['mint', 'mint-soft'], ['next-ink', 'next-bg']]) {
      assert.ok(contrast(colors[ink], colors[background]) >= 4.5, `${theme.id}: ${ink}/${background}`);
    }
    assert.ok(contrast(colors['control-border'], colors['surface-strong']) >= 3, theme.id);
  }
});

test('published CSS is reproducible from the source tokens', async () => {
  assert.equal(await read('style/tokens.css'), await buildTokens());
});

test('all localized homepages retain an accessible practice tool and expandable real FAQs', async () => {
  for (const [lang, copy] of Object.entries(locales)) {
    assert.ok(experienceLabels[lang], lang);
    const html = await read(`${lang === 'en' ? '' : `${lang}/`}index.html`);
    assert.equal((html.match(/<h1>/g) || []).length, 1, lang);
    assert.equal((html.match(/<details>/g) || []).length, copy.faq.length, lang);
    assert.match(html, /id="restart"[^>]*aria-label="[^"]+"/, lang);
    assert.match(html, /id="board"[^>]*aria-busy="true"/, lang);
    assert.match(html, /class="experience-note"/, lang);
    assert.match(html, /href="https:\/\/apps.apple.com\/app\/id6547865783"/, lang);
    assert.ok(!/googletag|analytics\.js|campaign=/i.test(html), lang);
  }
});

test('share image is a compact 1200 by 630 PNG', async () => {
  const png = await readFile(new URL('../og-image.png', import.meta.url));
  assert.equal(png.subarray(1, 4).toString(), 'PNG');
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  assert.ok(png.length < 250_000);
});
