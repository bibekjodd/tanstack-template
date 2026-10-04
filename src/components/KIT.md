# Project helpers

Small parts every project can use, and the fonts that are installed. Write everything else for the
site you are building; nothing here is a page or a style you have to adopt.

- **`Photo`** (`@/components/kit/photo`): use it for every picture. A reserved box (no layout shift), lazy loading, a calm placeholder while it loads and a tidy fallback if the file is missing, instead of the browser's broken-image icon. Props: `src`, `alt` (required), `width`, `height` (the rendered size, required), `aspect`, `priority` (set it on the first big image of a page), `rounded`, `fit`. Example: `<Photo src="/images/hero.webp" alt="Roasting beans" width={1200} height={800} priority aspect="3/2" rounded />`
- **`Enter`** and **`Reveal`** (`@/components/kit/reveal`): optional entrance motion. `Enter` is CSS only and runs at first paint: for content at the top of the page. `Reveal` fades content in as the visitor scrolls to it, and is visible in the server HTML: for sections below the fold. Props: `delay` (ms), `y` (px), `as`. Skip both for a plain or retro site.
- **`ErrorState`, `NotFoundState`, `PendingState`** (`@/components/kit/route-states`): the error, not-found and loading screens. Already wired into the root route and the router; reuse them for a route's own `errorComponent`, `notFoundComponent` or `pendingComponent`.
- **`seo({ title, description })`** (`@/lib/seo`): the head of a page. Give every route its own `head()`, and set `SITE` once in `src/lib/seo.ts`.
- **`useTheme()`** (`@/lib/use-theme`): `{ theme: 'light' | 'dark', setTheme, toggle }` for a theme switch.
- **Colour comes from tokens** in `src/styles/app.css` (`bg-background`, `text-foreground`, `bg-primary`, `border-border`, `bg-scrim` / `text-on-scrim` over photos, `chart-1` … `chart-5` for accents). Set the palette once, light and dark. The linter rejects literal colours in `src/components` and `src/routes`.
- **Fonts are self-hosted.** Add `@import '@fontsource-variable/<name>';` at the top of `src/styles/app.css` for each family used (all listed below are installed), then set `--font-sans` and `--font-heading` in `@theme`. No Google Fonts link is needed.

## Fonts (installed)

Variable families (`@fontsource-variable/<name>`): fraunces, playfair-display, cormorant-garamond, newsreader, bricolage-grotesque, syne, unbounded, outfit, sora, familjen-grotesk, geist, inter, dm-sans, hanken-grotesk, instrument-sans, jost, nunito, figtree, manrope, plus-jakarta-sans, geist-mono, jetbrains-mono. Static: `@fontsource/instrument-serif`, `@fontsource/dm-serif-display`. CSS family names are the title-cased name with " Variable" (for example `'Fraunces Variable'`); the two static ones are `'Instrument Serif'` and `'DM Serif Display'`.

| Feel                  | Heading             | Body                   | Packages                                        |
| --------------------- | ------------------- | ---------------------- | ----------------------------------------------- |
| Editorial, warm       | Fraunces            | Hanken Grotesk         | fraunces, hanken-grotesk                        |
| Luxury, fashion       | Cormorant Garamond  | Jost                   | cormorant-garamond, jost                        |
| Modern product        | Geist               | Geist                  | geist (already imported), geist-mono            |
| Friendly SaaS         | Bricolage Grotesque | Instrument Sans        | bricolage-grotesque, instrument-sans            |
| Magazine, long reads  | Newsreader          | Inter                  | newsreader, inter                               |
| Bold agency           | Syne                | DM Sans                | syne, dm-sans                                   |
| Tech, developer       | Sora                | Inter + JetBrains Mono | sora, inter, jetbrains-mono                     |
| Craft, food, boutique | DM Serif Display    | Figtree                | @fontsource/dm-serif-display, figtree           |
| Playful               | Unbounded           | Nunito                 | unbounded, nunito                               |
| Fintech, clean        | Manrope             | Inter                  | manrope, inter                                  |
| Elegant, minimal      | Instrument Serif    | Plus Jakarta Sans      | @fontsource/instrument-serif, plus-jakarta-sans |
| Geometric             | Outfit              | Familjen Grotesk       | outfit, familjen-grotesk                        |
