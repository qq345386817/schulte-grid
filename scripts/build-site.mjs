import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { availabilityLabels, contentUpdated, experienceLabels, loadingLabels, retryLabels, locales, uiKeys } from '../content/locales.mjs';
import { buildTokens } from './design-tokens.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://schulte-grid.luopeike.com';
const appUrl = 'https://apps.apple.com/app/id6547865783';
const languages = { en: 'English', 'zh-Hans': '简体中文', 'zh-Hant': '繁體中文', ja: '日本語', ko: '한국어', de: 'Deutsch', fr: 'Français', es: 'Español' };
const themes = ['system', 'paper', 'mint', 'sand', 'night', 'ink'];
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const json = value => JSON.stringify(value).replaceAll('<', '\\u003c');

await writeFile(`${root}style/tokens.css`, await buildTokens());
const changedUrls = new Set();

const workspaceIcons = new Set([
  'grid-2x2', 'history', 'calendar-days', 'chart-no-axes-combined', 'plus',
  'sparkles', 'crosshair', 'eye', 'smartphone', 'laptop', 'cloud',
  'shield-check', 'arrow-right', 'check', 'minus', 'palette', 'timer',
  'book-open', 'coffee', 'zap'
]);

for (const [lang, copy] of Object.entries(locales)) {
  if (copy.ui.length !== uiKeys.length) throw new Error(`${lang}: expected ${uiKeys.length} labels, got ${copy.ui.length}`);
  const t = Object.fromEntries(uiKeys.map((key, index) => [key, copy.ui[index]]));
  const L = copy.landing;
  const runtimeCopy = {
    ...t,
    demoBtn: L.studio.demoBtn,
    demoStop: L.studio.demoStop,
    demoStatus: L.studio.demoStatus,
    sheetStack: L.studio.sheetStack
  };
  const folder = lang === 'en' ? '' : `${lang}/`;
  const asset = lang === 'en' ? '' : '../';
  const url = `${origin}/${folder}`;
  changedUrls.add(url);
  const icon = name => `<svg class="icon" aria-hidden="true"><use href="${asset}images/${workspaceIcons.has(name) ? 'workspace' : 'lucide'}.svg#${name}"></use></svg>`;
  const download = () => `<a class="app-link" href="${appUrl}"><img class="store-icon" width="24" height="24" src="${asset}images/app-store-icon.svg" alt="">${escape(t.download)}</a>`;
  const sizes = (kind, initial) => [3, 4, 5, 6].map(n => `<button type="button" data-${kind}="${n}" aria-pressed="${n === initial}">${n}×${n}</button>`).join('');
  const label = key => escape(t[key]);
  const themeSwatches = () => themes.map(theme => `<button type="button" class="theme-chip" data-theme-choice="${theme}" data-theme-group="studio" aria-pressed="${theme === 'system'}" title="${label(theme)}"><span class="theme-dot theme-dot-${theme}" aria-hidden="true"></span><span>${label(theme)}</span></button>`).join('');
  const sampleTiles = [1, 2, 3, 4, 5, 6].map(n => `<span>${n}</span>`).join('');
  const themeMiniCards = () => themes.map(theme => `<button type="button" class="theme-preview-card theme-preview-${theme}" data-theme-choice="${theme}" data-theme-group="bento" aria-pressed="${theme === 'system'}"><span class="mini-grid" aria-hidden="true">${sampleTiles}</span><span class="mini-name">${label(theme)}</span></button>`).join('');
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
        featureList: [t.practice, t.time, t.print] },
      { '@type': 'FAQPage', '@id': `${url}#faq`, inLanguage: lang, mainEntity: copy.faq.map(([name, text]) => ({
        '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text }
      })) }
    ]
  };
  const stepIllustrations = [
    `<div class="step-visual step-visual-center" aria-hidden="true"><span></span><span></span><span></span><span></span><span class="is-core"></span><span></span><span></span><span></span><span></span></div>`,
    `<div class="step-visual step-visual-scan" aria-hidden="true"><span>8</span><span class="is-one">1</span><span>5</span><span class="is-two">2</span><span class="is-three">3</span><span>7</span><span>4</span><span>9</span><span>6</span></div>`,
    `<div class="step-visual step-visual-time" aria-hidden="true"><span class="time-pill">18.42 s</span><span class="bar-track"><span class="bar-fill"></span></span></div>`
  ];
  const mockNumbers = [22, 19, 2, 13, 4, 8, 24, 7, 21, 1, 6, 15, 20, 17, 16, 23, 10, 12, 3, 9, 11, 18, 5, 14, 25];
  const mockMacNumbers = [14, 3, 11, 8, 6, 13, 2, 16, 9, 1, 15, 5, 12, 7, 4, 10];
  const comparisonRows = column => L.compare.rows.map(row => {
    const available = row[column];
    const status = availabilityLabels[lang][available ? 0 : 1];
    return `<li class="${available ? 'is-included' : 'is-excluded'}">${icon(available ? 'check' : 'minus')}<span class="visually-hidden">${escape(status)}: </span><span>${escape(row[0])}</span></li>`;
  }).join('');
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
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
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
  <link rel="modulepreload" href="${asset}js/practice-core.mjs">
  <link rel="modulepreload" href="${asset}js/practice.mjs">
  <link rel="modulepreload" href="${asset}js/motion.mjs">
  <script type="application/ld+json">${json(structured)}</script>
  <script id="practice-copy" type="application/json">${json(runtimeCopy)}</script>
  <script type="module" src="${asset}js/practice.mjs"></script>
  <script type="module" src="${asset}js/motion.mjs"></script>
</head>
<body class="practice-page">
<div class="ambient-backdrop" aria-hidden="true"></div>
<header class="site-header" id="site-header">
  <div class="container">
    <div class="topbar">
      <a class="brand" href="./"><img src="${asset}favicon/apple-touch-icon.png" width="34" height="34" alt=""><span>${escape(copy.brand)}</span></a>
      <nav class="nav" aria-label="${escape(copy.nav[0])}">
        <a href="#practice">${escape(copy.nav[0])}</a>
        <a class="anchor-nav" href="#features">${escape(L.navAnchors[0])}</a>
        <a class="anchor-nav" href="#print" data-jump-print>${escape(L.navAnchors[1])}</a>
        <a class="anchor-nav" href="#faq">${escape(L.navAnchors[2])}</a>
        <a class="secondary-nav" href="help">${escape(copy.nav[1])}</a>
        <a class="secondary-nav" href="support">${escape(copy.nav[2])}</a>
        <a class="secondary-nav" href="privacy-policy">${escape(copy.nav[3])}</a>
        <a class="download-link" href="${appUrl}"><img class="store-icon" width="19" height="19" src="${asset}images/app-store-icon.svg" alt="">${label('download')}</a>
      </nav>
      <select class="language-switch" id="language" aria-label="${escape(copy.nav[4])}">${Object.entries(languages).map(([code, name]) => `<option value="${asset}${code === 'en' ? './' : `${code}/`}"${code === lang ? ' selected' : ''}>${name}</option>`).join('')}</select>
    </div>
  </div>
</header>
<div class="page">
  <main>
    <section class="hero">
      <div class="container">
        <p class="hero-badge"><span class="badge-dot" aria-hidden="true"></span>${escape(L.hero.badge)}</p>
        <h1>${escape(L.hero.headline)}</h1>
        <p class="hero-subhead">${escape(L.hero.subhead)}</p>
        <div class="hero-actions">
          <a class="button primary" href="#practice" data-focus-board data-start-size="5">${icon('grid-2x2')}${escape(L.hero.ctaPrimary)}</a>
          <a class="button secondary" href="${appUrl}"><img class="store-icon" width="19" height="19" src="${asset}images/app-store-icon.svg" alt="">${escape(L.hero.ctaSecondary)}</a>
        </div>
        <ul class="hero-pills" aria-label="${escape(experienceLabels[lang])}">
          ${L.hero.pills.map((pill, i) => `<li>${icon(['sparkles', 'shield-check', 'printer'][i])}<span>${escape(pill)}</span></li>`).join('')}
        </ul>
      </div>
    </section>

    <section class="studio-band" id="practice" aria-label="${label('practice')}">
      <div class="container">
        <noscript><p class="noscript-banner">${label('noscript')}</p></noscript>
        <div class="studio-shell" id="print">
          <div class="studio-bar">
            <div class="studio-bar-left">
              <div class="window-dots" aria-hidden="true"><span></span><span></span><span></span></div>
              <div class="practice-tabs" role="tablist" aria-label="${label('practice')}">
                ${['practice', 'print'].map(view => `<button id="tab-${view}" type="button" role="tab" data-view="${view}" aria-controls="view-${view}" aria-selected="${view === 'practice'}" tabindex="${view === 'practice' ? 0 : -1}">${icon(view === 'practice' ? 'grid-2x2' : 'printer')}<span>${label(view)}</span></button>`).join('')}
              </div>
            </div>
            <div class="studio-bar-right">
              <div class="theme-swatches" role="group" aria-label="${label('theme')}">${themeSwatches()}</div>
              <label class="control-field theme-select-field"><span>${label('theme')}</span><select id="theme">${themes.map(theme => `<option value="${theme}">${label(theme)}</option>`).join('')}</select></label>
            </div>
          </div>

          <div id="view-practice" role="tabpanel" aria-labelledby="tab-practice" tabindex="0">
            <div class="workspace">
              <div class="board-column">
                <div class="controls">
                  <div class="size-controls" role="group" aria-label="${label('size')}">${sizes('size', 5)}</div>
                  <div class="board-toggles">
                    <button type="button" class="pill-toggle" id="demo-scan" aria-pressed="false">${icon('sparkles')}<span>${escape(L.studio.demoBtn)}</span></button>
                    <button type="button" class="pill-toggle" id="fixation-toggle" aria-pressed="false">${icon('crosshair')}<span>${escape(L.studio.fixation)}</span></button>
                  </div>
                </div>
                <div class="board-stage">
                  <div id="board" class="game-board" role="group" aria-label="${label('practice')}" aria-busy="true" style="--size:5">${[17, 4, 21, 9, 1, 12, 25, 6, 14, 19, 3, 16, 8, 23, 11, 20, 5, 13, 2, 24, 7, 18, 10, 22, 15].map(n => `<button type="button" disabled>${n}</button>`).join('')}</div>
                  <div class="fixation-dot" aria-hidden="true"></div>
                  <svg class="demo-path-layer" id="demo-path-layer" aria-hidden="true"></svg>
                </div>
                <div class="board-footer">
                  <div class="round-actions">
                    <button type="button" class="icon-button" id="restart" title="${label('restart')}" aria-label="${label('restart')}">${icon('rotate-ccw')}</button>
                    <button type="button" class="icon-button" id="pause" title="${label('pause')}" aria-label="${label('pause')}" disabled>${icon('pause')}</button>
                    <button type="button" class="icon-button" id="quick-print" title="${label('print')}" aria-label="${label('print')}">${icon('printer')}</button>
                  </div>
                  <p class="round-message" id="round-message" role="status">${escape(loadingLabels[lang])}</p>
                </div>
                <button class="button" type="button" id="retry-load" hidden>${icon('rotate-ccw')}${escape(retryLabels[lang][1])}</button>
              </div>

              <aside class="practice-side">
                <div class="telemetry-panel">
                  <div class="round-stats">
                    <dl class="stat-time"><dt>${label('time')}</dt><dd id="timer">0.00 s</dd></dl>
                    <dl class="next-stat"><dt>${label('next')}</dt><dd id="next-number">1</dd></dl>
                    <dl><dt>${label('mistakes')}</dt><dd id="mistakes">0</dd></dl>
                  </div>
                  <div class="progress-meta">
                    <span>${escape(L.studio.progress)}</span>
                    <span id="progress-label">0 / 25</span>
                  </div>
                  <div class="progress-track" aria-hidden="true"><div class="progress-fill" id="progress-fill"></div></div>
                </div>

                <section class="result" id="result" hidden>
                  <p class="result-badge">${icon('circle-check')}<span>${label('complete')}</span></p>
                  <p class="result-metric" id="result-time"></p>
                  <p class="result-note">${label('local')}</p>
                  <div class="result-actions">
                    <button class="button primary" type="button" id="again">${icon('rotate-ccw')}${label('again')}</button>
                    ${download()}
                  </div>
                </section>

                <section class="app-offer">
                  <div class="app-offer-head">
                    <img class="app-mark" width="52" height="52" src="${asset}favicon/apple-touch-icon.png" alt="">
                    <div>
                      <p class="platforms">iPhone · iPad · Mac</p>
                      <h2>${label('app')}</h2>
                    </div>
                  </div>
                  <p>${label('appText')}</p>
                  <ul class="app-benefits">${['history', 'daily', 'bests'].map((key, i) => `<li>${icon(['history', 'calendar-days', 'chart-no-axes-combined'][i])}<span>${label(key)}</span></li>`).join('')}</ul>
                  <a class="button primary app-offer-cta" href="${appUrl}">${icon('download')}${label('download')}</a>
                </section>

                <div class="experience-note">
                  <h3>${icon('shield-check')}<span>${escape(experienceLabels[lang])}</span></h3>
                  <p>${label('local')}</p>
                </div>
              </aside>
            </div>
          </div>

          <div id="view-print" role="tabpanel" aria-labelledby="tab-print" class="print-view" tabindex="0" hidden>
            <div class="print-toolbar">
              <div class="print-controls">
                <div class="size-controls" role="group" aria-label="${label('size')}">${sizes('print-size', 5)}</div>
                <label class="control-field"><span>${label('sheets')}</span><input id="sheet-count" type="number" min="1" max="20" step="1" value="1"></label>
                <button class="icon-button" type="button" id="refresh-sheets" title="${label('refresh')}" aria-label="${label('refresh')}">${icon('rotate-ccw')}</button>
                <button class="button primary" type="button" id="print-now">${icon('printer')}${label('printNow')}</button>
              </div>
              <p class="sheet-stack-meta" id="sheet-stack-meta" role="status"></p>
            </div>
            <div class="print-desk">
              <div class="sheet-stack" id="sheet-stack" data-sheets="1">
                <div class="sheet-preview" id="sheet-preview" aria-label="${label('preview')}"></div>
              </div>
            </div>
          </div>
        </div>
        <p class="local-note" id="local-note" role="status">${label('local')}</p>
      </div>
    </section>

    <section class="band steps-section" data-reveal>
      <div class="container">
        <div class="section-head">
          <p class="section-eyebrow">${escape(L.steps.eyebrow)}</p>
          <h2>${escape(L.steps.heading)}</h2>
        </div>
        <ol class="steps-grid" data-stagger>
          ${L.steps.items.map(([title, desc], index) => `<li class="step-card" data-reveal-item>
            <div class="step-top"><span class="step-num">0${index + 1}</span>${stepIllustrations[index]}</div>
            <h3>${escape(title)}</h3>
            <p>${escape(desc)}</p>
          </li>`).join('')}
        </ol>
      </div>
    </section>

    <section class="band bento-section" id="features" data-reveal>
      <div class="container">
        <div class="section-head">
          <p class="section-eyebrow">${escape(L.bento.eyebrow)}</p>
          <h2>${escape(L.bento.heading)}</h2>
        </div>
        <div class="bento-grid" data-stagger>
          <article class="bento-card bento-native" data-reveal-item>
            <div class="bento-copy">
              <span class="bento-tag">${icon('smartphone')}${escape(L.bento.native.tag)}</span>
              <h3>${escape(L.bento.native.title)}</h3>
              <p>${escape(L.bento.native.desc)}</p>
              <div class="bento-native-footer">
                <span class="sync-pill">${icon('cloud')}${escape(L.bento.native.syncBadge)}</span>
                <a class="text-cta" href="${appUrl}">${label('download')}${icon('arrow-right')}</a>
              </div>
            </div>
            <div class="device-showcase" aria-hidden="true">
              <div class="mock-mac">
                <div class="mock-mac-bar"><span></span><span></span><span></span><strong>${escape(copy.brand)}</strong></div>
                <div class="mock-mac-body">
                  <div class="mock-mac-grid">${mockMacNumbers.map(n => `<span${n === 1 ? ' class="is-done"' : ''}>${n}</span>`).join('')}</div>
                </div>
              </div>
              <div class="mock-iphone">
                <div class="mock-iphone-notch"></div>
                <div class="mock-iphone-head">
                  <div><small>${label('time')}</small><strong>13.88s</strong></div>
                  <div class="mock-iphone-right"><span><small>${label('next')}</small><b>2</b></span><span><small>${escape(L.bento.native.mockBest)}</small><b>18.42s</b></span></div>
                </div>
                <div class="mock-iphone-seg"><span>3×3</span><span>4×4</span><span class="is-active">5×5</span><span>6×6</span></div>
                <div class="mock-iphone-grid">${mockNumbers.map(n => `<span${n === 1 ? ' class="is-done"' : ''}>${n}</span>`).join('')}</div>
                <div class="mock-iphone-actions">${icon('pause')}${icon('rotate-ccw')}</div>
                <div class="mock-iphone-daily">
                  <div><strong>${escape(L.bento.native.mockDaily)}</strong><span>${escape(L.bento.native.mockStreak)}</span></div>
                  <div class="mock-bar"><span></span></div>
                </div>
                <div class="mock-iphone-tabs">
                  ${L.bento.native.mockTabs.map((tab, i) => `<span${i === 0 ? ' class="is-active"' : ''}>${icon(['grid-2x2', 'history', 'palette'][i])}${escape(tab)}</span>`).join('')}
                </div>
              </div>
            </div>
          </article>

          <article class="bento-card bento-themes" data-reveal-item>
            <span class="bento-tag">${icon('palette')}${escape(L.bento.themes.tag)}</span>
            <h3>${escape(L.bento.themes.title)}</h3>
            <p>${escape(L.bento.themes.desc)}</p>
            <div class="theme-preview-grid" role="group" aria-label="${label('theme')}">${themeMiniCards()}</div>
          </article>

          <article class="bento-card bento-print" data-reveal-item>
            <span class="bento-tag">${icon('printer')}${escape(L.bento.print.tag)}</span>
            <h3>${escape(L.bento.print.title)}</h3>
            <p>${escape(L.bento.print.desc)}</p>
            <div class="mini-paper-stack" aria-hidden="true">
              <div class="mini-paper">
                <div class="mini-paper-head"><span>A4 · 5×5</span><span>1 → 25</span></div>
                <div class="mini-paper-grid">${mockNumbers.map(n => `<span>${n}</span>`).join('')}</div>
              </div>
            </div>
            <a class="text-cta" href="#print" data-open-print>${escape(L.bento.print.action)}${icon('arrow-right')}</a>
          </article>

          <article class="bento-card bento-privacy" data-reveal-item>
            <span class="bento-tag">${icon('shield-check')}${escape(L.bento.privacy.tag)}</span>
            <h3>${escape(L.bento.privacy.title)}</h3>
            <p>${escape(L.bento.privacy.desc)}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="band cases-section" data-reveal>
      <div class="container">
        <div class="section-head">
          <p class="section-eyebrow">${escape(L.useCases.eyebrow)}</p>
          <h2>${escape(L.useCases.heading)}</h2>
        </div>
        <div class="cases-grid" data-stagger>
          ${L.useCases.items.map(([iconName, title, desc]) => `<article class="case-card" data-reveal-item>
            <div class="case-icon">${icon(iconName)}</div>
            <h3>${escape(title)}</h3>
            <p>${escape(desc)}</p>
          </article>`).join('')}
        </div>
      </div>
    </section>

    <section class="band compare-section" data-reveal>
      <div class="container">
        <div class="section-head">
          <p class="section-eyebrow">${escape(L.compare.eyebrow)}</p>
          <h2>${escape(L.compare.heading)}</h2>
        </div>
        <div class="compare-grid">
          <article class="compare-card">
            <div class="compare-head">
              <h3>${escape(L.compare.webTitle)}</h3>
              <p>${escape(L.compare.webNote)}</p>
            </div>
            <ul class="compare-list">
              ${comparisonRows(1)}
            </ul>
          </article>
          <article class="compare-card compare-card-app">
            <div class="compare-head">
              <div>
                <h3>${escape(L.compare.appTitle)}</h3>
                <p>${escape(L.compare.appNote)}</p>
              </div>
              <img class="compare-icon" width="44" height="44" src="${asset}favicon/apple-touch-icon.png" alt="">
            </div>
            <ul class="compare-list">
              ${comparisonRows(2)}
            </ul>
            <a class="button primary compare-cta" href="${appUrl}"><img class="store-icon" width="19" height="19" src="${asset}images/app-store-icon.svg" alt="">${label('download')}</a>
          </article>
        </div>
      </div>
    </section>

    <section class="band seo-content" data-reveal>
      <div class="container">
        <div class="overview-card">
          <h2>${escape(copy.heading)}</h2>
          <p>${escape(copy.overview)}</p>
        </div>
        <div id="faq">
          <h2>${escape(copy.faqHeading)}</h2>
          <div class="faq-list">
            ${copy.faq.map(([question, answer]) => `<details><summary><span>${escape(question)}</span>${icon('plus')}</summary><p>${escape(answer)}</p></details>`).join('\n            ')}
          </div>
        </div>
        <nav class="seo-links" aria-label="${escape(copy.faqHeading)}">${['what-is-schulte-grid', 'printable-schulte-grid', 'focus-training-app'].map((path, i) => `<a class="guide-card" href="${asset}${path}"${lang === 'en' ? '' : ' hreflang="en"'}><span>${escape(copy.links[i])}</span>${icon('arrow-right')}</a>`).join('')}</nav>
      </div>
    </section>

    <section class="band final-cta-band" data-reveal>
      <div class="container">
        <div class="final-cta-card">
          <img class="final-cta-icon" width="60" height="60" src="${asset}favicon/apple-touch-icon.png" alt="">
          <h2>${escape(L.finalCta.title)}</h2>
          <p>${escape(L.finalCta.desc)}</p>
          <div class="hero-actions">
            <a class="button primary" href="${appUrl}"><img class="store-icon" width="19" height="19" src="${asset}images/app-store-icon.svg" alt="">${escape(L.finalCta.primary)}</a>
            <a class="button secondary" href="#practice" data-focus-board>${escape(L.finalCta.secondary)}</a>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container">
      <p>${escape(copy.brand)} · <a href="help">${escape(copy.nav[1])}</a> · <a href="support">${escape(copy.nav[2])}</a> · <a href="privacy-policy">${escape(copy.nav[3])}</a></p>
    </div>
  </footer>
</div>
<div class="print-output" id="print-output"></div>
<script>
  document.getElementById('retry-load').addEventListener('click', function () { location.reload(); });
  setTimeout(function () {
    if (document.getElementById('board').getAttribute('aria-busy') === 'true') {
      document.getElementById('round-message').textContent = ${json(retryLabels[lang][0])};
      document.getElementById('retry-load').hidden = false;
    }
  }, 15000);
</script>
</body>
</html>
`;
  await mkdir(`${root}${folder}`, { recursive: true });
  await writeFile(`${root}${folder}index.html`, html);
  const markdown = `# ${copy.brand}\n\n${copy.intro}\n\n${copy.overview}\n\nCanonical page: ${url}\n\n## ${copy.faqHeading}\n\n${copy.faq.map(([q, a]) => `### ${q}\n\n${a}`).join('\n\n')}\n\n## ${t.app}\n\n${t.appText}\n\n- [${t.practice}](${url})\n- [${t.download}](${appUrl})\n- [${copy.nav[1]}](${url}help)\n- [${copy.nav[3]}](${url}privacy-policy)\n`;
  await writeFile(`${root}${folder}index.md`, markdown);

  const privacyFile = `${root}${folder}privacy-policy.html`;
  let privacy = await readFile(privacyFile, 'utf8');
  const originalPrivacy = privacy;
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
  if (privacy !== originalPrivacy) {
    changedUrls.add(`${url}privacy-policy`);
    await writeFile(privacyFile, privacy);
  }
}

const sitemap = await readFile(`${root}sitemap.xml`, 'utf8');
const updated = sitemap.replace(/<url><loc>([^<]+)<\/loc><lastmod>[^<]+<\/lastmod><\/url>/g, (entry, url) =>
  changedUrls.has(url) ? `<url><loc>${url}</loc><lastmod>${contentUpdated}</lastmod></url>` : entry);
await writeFile(`${root}sitemap.xml`, updated);
console.log(`Built ${Object.keys(locales).length} localized practice pages and Markdown summaries.`);
