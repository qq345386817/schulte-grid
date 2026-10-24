# Schulte Grid website

Static multilingual site and browser practice tool. Cloudflare Pages publishes the repository root. No production server, external JavaScript service, or build dependency is needed.

## Development

- `npm run build`: generate the eight homepages, their Markdown versions, and homepage sitemap dates from `content/locales.mjs`.
- `npm start`: local clean-URL server at `http://127.0.0.1:4187`. Set `PORT` to use another port.
- `npm test`: check timing, independent rounds, puzzle uniqueness, and localization coverage.
- `npm run check:seo`: validate sitemap canonicals, reciprocal hreflang, local references, JSON-LD, and the 404 page (requires Python 3.9+).

Edit localized copy and its `contentUpdated` date in `content/locales.mjs`, then build and commit the generated HTML and Markdown together. Runtime behavior lives in `js/practice.mjs`; pure game logic lives in `js/practice-core.mjs`.

Canonical pages use clean URLs because Cloudflare Pages redirects `.html` paths. Keep sitemap, hreflang, structured data, and internal links consistent with those final URLs. `llms.txt` summarizes actual product facts and links to Markdown generated from the same copy as the visible pages. It is optional agent documentation, not a ranking guarantee.

Keep the root `404.html`: Cloudflare Pages otherwise assumes SPA routing and serves the homepage with HTTP 200 for nonexistent URLs. Error-page assets and navigation use absolute paths so nested invalid URLs also work. Old `.html` URLs redirecting to their clean canonical URLs are expected, not indexing failures requiring removal.

The website is an experience-only demo. Only the active round and controls live in page memory, and a new round or refresh discards the result. It does not create browser history records, daily progress, localStorage/sessionStorage entries, or server-side practice records. Startup removes the legacy `schulte-grid-web-v1` localStorage key without reading it; other browser keys are untouched. Storage being unavailable does not prevent practice or printing.

App Store links are direct links without campaign parameters. Website conversion tracking is deferred and no tracking code is added.

The native app retains the latest 100 results locally, plus daily goals and progress. Version 1.6.0 adds optional iCloud synchronization; earlier versions are local-only. Marketing must qualify this feature by version while App Store availability changes. Device backups and live iCloud synchronization are distinct mechanisms.

Lucide icons are vendored as a small SVG sprite with their license in `images/LUCIDE-LICENSE.txt`.

## Visual System

`style/tokens.json` owns the shared light/dark colors, type scale, spacing, and radii. `npm run build` compiles `style/tokens.css`; commit both the source and generated CSS. `scripts/design-tokens.mjs` has no third-party dependencies. Theme choices remain memory-only. The practice screen stays the homepage, with a compact number board, icon commands with localized labels, an explicit unsaved browser-demo note, and native HTML FAQ disclosures. Article pages share the same colors and controls.

`npm test` also checks token contrast, reproducible CSS, and the eight generated homepage contracts. Visual release checks should include 320px and 390px mobile widths, tablet and desktop, all eight languages, every theme, keyboard use, and white A4 print output.

`npm run build:social` optionally refreshes the committed 1200×630 share image from the same color tokens. Authoring requires ImageMagick and a local Trebuchet font; set `SCHULTE_PREVIEW_FONT` to a local font file on another machine. It is not part of normal site building or deployment and removes its own temporary files.
