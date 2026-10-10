# Schulte Grid website

Static multilingual site and browser practice tool. Cloudflare Pages publishes the repository root. No production server, external JavaScript service, or build dependency is needed.

## Development

- `npm run build`: generate the eight homepages, their Markdown versions, and homepage sitemap dates from `content/locales.mjs`.
- `npm start`: local clean-URL server at `http://127.0.0.1:4187`. Set `PORT` to use another port.
- `npm test`: check timing, independent rounds, puzzle uniqueness, and localization coverage.

Edit localized copy and its `contentUpdated` date in `content/locales.mjs`, then build and commit the generated HTML and Markdown together. Runtime behavior lives in `js/practice.mjs`; pure game logic lives in `js/practice-core.mjs`.

Canonical pages use clean URLs because Cloudflare Pages redirects `.html` paths. Keep sitemap, hreflang, structured data, and internal links consistent with those final URLs. `llms.txt` summarizes actual product facts and links to Markdown generated from the same copy as the visible pages. It is optional agent documentation, not a ranking guarantee.

The website is an experience-only demo. Only the active round and controls live in page memory, and a new round or refresh discards the result. It does not create browser history records, daily progress, localStorage/sessionStorage entries, or server-side practice records. Startup removes the legacy `schulte-grid-web-v1` localStorage key without reading it; other browser keys are untouched. Storage being unavailable does not prevent practice or printing.

App Store links are direct links without campaign parameters. Website conversion tracking is deferred and no tracking code is added.

The native app currently retains the latest 100 results in JSON stored in device-local UserDefaults, plus daily goals and progress. It has no implemented iCloud synchronization. Marketing and FAQs must reflect that distinction; device backups are not a cross-device cloud sync feature.

Lucide icons are vendored as a small SVG sprite with their license in `images/LUCIDE-LICENSE.txt`.
