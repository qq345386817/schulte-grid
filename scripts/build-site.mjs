import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { contentUpdated, locales, uiKeys } from '../content/locales.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://schulte-grid.luopeike.com';
const appUrl = 'https://apps.apple.com/app/id6547865783';
const languages = { en: 'English', 'zh-Hans': '简体中文', 'zh-Hant': '繁體中文', ja: '日本語', ko: '한국어', de: 'Deutsch', fr: 'Français', es: 'Español' };
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const json = value => JSON.stringify(value).replaceAll('<', '\\u003c');

for (const [lang, copy] of Object.entries(locales)) {
  if (copy.ui.length !== uiKeys.length) throw new Error(`${lang}: expected ${uiKeys.length} labels, got ${copy.ui.length}`);
  const t = Object.fromEntries(uiKeys.map((key, index) => [key, copy.ui[index]]));
  const folder = lang === 'en' ? '' : `${lang}/`;
  const asset = lang === 'en' ? '' : '../';
  const url = `${origin}/${folder}`;
  const icon = name => `<svg class="icon" aria-hidden="true"><use href="${asset}images/lucide.svg#${name}"></use></svg>`;
  const app = context => `${appUrl}?ct=web_${context}&mt=8`;
  const download = context => `<a class="app-link" href="${app(context)}"><img class="store-icon" width="24" height="24" src="${asset}images/app-store-icon.svg" alt="">${escape(t.download)}</a>`;
  const sizes = (kind, initial) => [3, 4, 5, 6].map(n => `<button type="button" data-${kind}="${n}" aria-pressed="${n === initial}">${n}×${n}</button>`).join('');
  const label = key => escape(t[key]);
  const structured = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${origin}/#website`, name: 'Schulte Grid', url: `${origin}/`, inLanguage: Object.keys(locales) },
      { '@type': 'WebPage', '@id': `${url}#page`, url, name: copy.title, description: copy.description, inLanguage: lang,
        isPartOf: { '@id': `${origin}/#website` }, mainEntity: { '@id': `${url}#webapp` } },
      { '@type': 'WebApplication', '@id': `${url}#webapp`, name: copy.brand, url, inLanguage: lang,
        applicationCategory: 'EducationalApplication', operatingSystem: 'Any', browserRequirements: 'Requires JavaScript',
        isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description: copy.description,
        featureList: [t.practice, t.time, t.daily, t.history, t.print] },
      { '@type': 'FAQPage', '@id': `${url}#faq`, inLanguage: lang, mainEntity: copy.faq.map(([name, text]) => ({
        '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text }
      })) }
    ]
  };
  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escape(copy.title)}</title>
  <meta name="description" content="${escape(copy.description)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${url}">
  ${Object.keys(locales).map(key => `<link rel="alternate" hreflang="${key}" href="${origin}/${key === 'en' ? '' : `${key}/`}">`).join('\n  ')}
  <link rel="alternate" hreflang="x-default" href="${origin}/">
  <link rel="describedby" href="${asset}llms.txt" type="text/plain">
  <link rel="alternate" type="text/markdown" href="index.md">
  <meta property="og:title" content="${escape(copy.title)}">
  <meta property="og:description" content="${escape(copy.description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${origin}/og-image.png">
  <meta property="og:image:alt" content="${escape(copy.brand)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escape(copy.title)}">
  <meta name="twitter:description" content="${escape(copy.description)}">
  <meta name="twitter:image" content="${origin}/og-image.png">
  <meta name="theme-color" content="#2563eb">
  <link rel="apple-touch-icon" sizes="180x180" href="${asset}favicon/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="${asset}favicon/favicon-32x32.png">
  <link rel="manifest" href="${asset}favicon/site.webmanifest">
  <link rel="stylesheet" href="${asset}style/base.css">
  <link rel="stylesheet" href="${asset}style/practice.css">
  <script type="application/ld+json">${json(structured)}</script>
  <script id="practice-copy" type="application/json">${json(t)}</script>
  <script type="module" src="${asset}js/practice.mjs"></script>
</head>
<body class="practice-page">
<div class="page"><div class="container">
  <header class="topbar">
    <a class="brand" href="./"><img src="${asset}favicon/apple-touch-icon.png" width="38" height="38" alt=""><span>${escape(copy.brand)}</span></a>
    <nav class="nav" aria-label="${escape(copy.nav[0])}">
      <a href="#practice">${escape(copy.nav[0])}</a><a href="help">${escape(copy.nav[1])}</a><a href="support">${escape(copy.nav[2])}</a><a href="privacy-policy">${escape(copy.nav[3])}</a>
      <a class="download-link" href="${app('nav')}"><img class="store-icon" width="20" height="20" src="${asset}images/app-store-icon.svg" alt="">${label('download')}</a>
      <select class="language-switch" id="language" aria-label="${escape(copy.nav[4])}">${Object.entries(languages).map(([code, name]) => `<option value="${asset}${code === 'en' ? './' : `${code}/`}"${code === lang ? ' selected' : ''}>${name}</option>`).join('')}</select>
    </nav>
  </header>
  <main>
    <div class="practice-intro"><h1>${escape(copy.brand)}</h1><p>${escape(copy.intro)}</p></div>
    <noscript><p>${label('noscript')}</p></noscript>
    <div class="practice-tabs" role="tablist" aria-label="${label('practice')}">
      ${['practice', 'history', 'print'].map(view => `<button id="tab-${view}" type="button" role="tab" data-view="${view}" aria-controls="view-${view}" aria-selected="${view === 'practice'}" tabindex="${view === 'practice' ? 0 : -1}">${label(view)}</button>`).join('')}
    </div>
    <section id="view-practice" role="tabpanel" aria-labelledby="tab-practice" tabindex="0">
      <div class="workspace">
        <div class="board-column">
          <div class="controls"><div class="size-controls" role="group" aria-label="${label('size')}">${sizes('size', 5)}</div>
            <label class="control-field"><span>${label('theme')}</span><select id="theme">${['system', 'paper', 'mint', 'sand', 'night', 'ink'].map(theme => `<option value="${theme}">${label(theme)}</option>`).join('')}</select></label>
          </div>
          <div class="round-stats">
            <dl><dt>${label('time')}</dt><dd id="timer">0.00 s</dd></dl>
            <dl><dt>${label('next')}</dt><dd id="next-number">1</dd></dl>
            <dl><dt>${label('mistakes')}</dt><dd id="mistakes">0</dd></dl>
          </div>
          <div id="board" class="game-board" role="group" aria-label="${label('practice')}" style="--size:5"></div>
          <div class="round-actions">
            <button type="button" class="button" id="restart">${icon('rotate-ccw')}${label('restart')}</button>
            <button type="button" class="icon-button" id="pause" title="${label('pause')}" aria-label="${label('pause')}" disabled>${icon('pause')}</button>
            <button type="button" class="icon-button" id="quick-print" title="${label('print')}" aria-label="${label('print')}">${icon('printer')}</button>
          </div>
          <p class="round-message" id="round-message" role="status">${label('ready')}</p>
          <section class="result" id="result" hidden><h2>${label('complete')}</h2><p id="result-time"></p><p>${label('saved')}</p><button class="button primary" type="button" id="again">${icon('rotate-ccw')}${label('again')}</button><p>${download('complete')}</p></section>
        </div>
        <aside class="practice-side">
          <section><h2>${label('daily')}</h2><div class="daily-count" id="daily-count">0 / 1</div><progress class="daily-progress" id="daily-progress" max="1" value="0" aria-label="${label('daily')}"></progress>
            <label class="control-field">${label('goal')}<select id="goal">${[1, 2, 3, 4, 5].map(n => `<option value="${n}">${n} ${label('rounds')}</option>`).join('')}</select></label><p><span>${label('streak')}</span>: <strong id="streak">0</strong> ${label('days')}</p>
          </section>
          <section><h2>${label('bests')}</h2><div id="bests">${[3, 4, 5, 6].map(n => `<div class="best-row"><span>${n}×${n}</span><span>—</span></div>`).join('')}</div></section>
          <section><h2>${label('app')}</h2><p>${label('appText')}</p>${download('daily')}</section>
        </aside>
      </div>
    </section>
    <section id="view-history" role="tabpanel" aria-labelledby="tab-history" class="history-view" tabindex="0" hidden>
      <div class="history-summary"><dl><dt>${label('total')}</dt><dd id="history-total">0</dd></dl><dl><dt>${label('daily')}</dt><dd id="history-today">0</dd></dl></div>
      <div class="history-actions"><label class="control-field">${label('size')}<select id="history-filter"><option value="all">${label('allSizes')}</option>${[3, 4, 5, 6].map(n => `<option value="${n}">${n}×${n}</option>`).join('')}</select></label>
        <div><button type="button" class="icon-button" id="export" title="${label('export')}" aria-label="${label('export')}">${icon('download')}</button> <button type="button" class="icon-button" id="clear" title="${label('clear')}" aria-label="${label('clear')}">${icon('trash-2')}</button></div>
      </div>
      <p class="empty-state" id="history-empty">${label('empty')}</p>
      <div class="history-scroll" id="history-table" hidden><table><thead><tr><th scope="col">${label('date')}</th><th scope="col">${label('size')}</th><th scope="col">${label('time')}</th><th scope="col">${label('mistakes')}</th><th scope="col">${label('delete')}</th></tr></thead><tbody id="history-rows"></tbody></table></div>
      <div class="history-actions" id="history-pager" hidden><button type="button" class="icon-button" id="previous" title="${label('previous')}" aria-label="${label('previous')}">${icon('chevron-left')}</button><span id="page-count"></span><button type="button" class="icon-button" id="more" title="${label('more')}" aria-label="${label('more')}">${icon('chevron-right')}</button></div>
    </section>
    <section id="view-print" role="tabpanel" aria-labelledby="tab-print" class="print-view" tabindex="0" hidden>
      <div class="print-controls"><div class="size-controls" role="group" aria-label="${label('size')}">${sizes('print-size', 5)}</div><label class="control-field">${label('sheets')}<input id="sheet-count" type="number" min="1" max="20" step="1" value="1"></label><button class="icon-button" type="button" id="refresh-sheets" title="${label('refresh')}" aria-label="${label('refresh')}">${icon('rotate-ccw')}</button><button class="button primary" type="button" id="print-now">${icon('printer')}${label('printNow')}</button></div>
      <div class="sheet-preview" id="sheet-preview" aria-label="${label('preview')}"></div>
    </section>
    <p class="local-note" id="local-note" role="status">${label('local')}</p>
    <section class="seo-content"><h2>${escape(copy.heading)}</h2><p>${escape(copy.overview)}</p>
      <div id="faq"><h2>${escape(copy.faqHeading)}</h2>${copy.faq.map(([question, answer]) => `<h3>${escape(question)}</h3><p>${escape(answer)}</p>`).join('\n      ')}</div>
      <nav class="seo-links" aria-label="${escape(copy.faqHeading)}">${['what-is-schulte-grid', 'printable-schulte-grid', 'focus-training-app'].map((path, i) => `<a href="${asset}${path}"${lang === 'en' ? '' : ' hreflang="en"'}>${escape(copy.links[i])}</a>`).join('')}</nav>
    </section>
  </main>
  <footer class="footer">${escape(copy.brand)} · <a href="privacy-policy">${escape(copy.nav[3])}</a> · <a href="support">${escape(copy.nav[2])}</a></footer>
</div></div>
<div class="print-output" id="print-output"></div>
</body>
</html>
`;
  await mkdir(`${root}${folder}`, { recursive: true });
  await writeFile(`${root}${folder}index.html`, html);
  const markdown = `# ${copy.brand}\n\n${copy.intro}\n\n${copy.overview}\n\nCanonical page: ${url}\n\n## ${copy.faqHeading}\n\n${copy.faq.map(([q, a]) => `### ${q}\n\n${a}`).join('\n\n')}\n\n## ${t.app}\n\n${t.appText}\n\n- [${t.practice}](${url})\n- [${t.download}](${appUrl})\n- [${copy.nav[1]}](${url}help)\n- [${copy.nav[3]}](${url}privacy-policy)\n`;
  await writeFile(`${root}${folder}index.md`, markdown);

  const privacyFile = `${root}${folder}privacy-policy.html`;
  let privacy = await readFile(privacyFile, 'utf8');
  const startMarker = '<!-- Browser practice privacy -->';
  const endMarker = '<!-- End browser practice privacy -->';
  const privacySection = `${startMarker}\n<section><h2>${escape(copy.heading)}</h2><p>${escape(copy.faq[3][1])}</p></section>\n${endMarker}\n`;
  const start = privacy.indexOf(startMarker);
  if (start !== -1) {
    const end = privacy.indexOf(endMarker, start);
    if (end === -1) throw new Error(`Missing privacy end marker: ${lang}`);
    privacy = privacy.slice(0, start) + privacySection + privacy.slice(end + endMarker.length).replace(/^\n/, '');
  } else {
    privacy = privacy.replace('</main>', `${privacySection}</main>`);
  }
  await writeFile(privacyFile, privacy);
}

const sitemap = await readFile(`${root}sitemap.xml`, 'utf8');
const homeUrls = Object.keys(locales).map(lang => `${origin}/${lang === 'en' ? '' : `${lang}/`}`);
const changedUrls = [...homeUrls, ...homeUrls.map(url => `${url}privacy-policy`)];
const updated = sitemap.replace(/<url><loc>([^<]+)<\/loc><lastmod>[^<]+<\/lastmod><\/url>/g, (entry, url) =>
  changedUrls.includes(url) ? `<url><loc>${url}</loc><lastmod>${contentUpdated}</lastmod></url>` : entry);
await writeFile(`${root}sitemap.xml`, updated);
console.log(`Built ${Object.keys(locales).length} localized practice pages and Markdown summaries.`);
