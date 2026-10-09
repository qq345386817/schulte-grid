# Schulte Grid website

Static multilingual site and browser practice tool. Cloudflare Pages publishes the repository root. No production server, external JavaScript service, or build dependency is needed.

## Development

- `npm run build`: generate the eight homepages, their Markdown versions, and homepage sitemap dates from `content/locales.mjs`.
- `npm start`: local clean-URL server at `http://127.0.0.1:4187`. Set `PORT` to use another port.
- `npm test`: check timing, storage validation, daily progress, puzzle uniqueness, and localization coverage.

Edit localized copy and its `contentUpdated` date in `content/locales.mjs`, then build and commit the generated HTML and Markdown together. Runtime behavior lives in `js/practice.mjs`; pure game logic lives in `js/practice-core.mjs`.

Canonical pages use clean URLs because Cloudflare Pages redirects `.html` paths. Keep sitemap, hreflang, structured data, and internal links consistent with those final URLs. `llms.txt` summarizes actual product facts and links to Markdown generated from the same copy as the visible pages. It is optional agent documentation, not a ranking guarantee.

Practice history (up to 500 rounds), goals, and settings are stored under `schulte-grid-web-v1` in localStorage. No web practice results are sent to the app analytics API. Clearing browser data clears practice data; app history is separate.

App Store links use placement-specific `ct=web_*` campaign names. App Store Connect campaign reporting also needs a valid provider token (`pt`); none is invented here. Measure website visits and outbound clicks with existing Cloudflare analytics if configured, and supply the real provider token before relying on App Store campaign attribution.

Lucide icons are vendored as a small SVG sprite with their license in `images/LUCIDE-LICENSE.txt`.
