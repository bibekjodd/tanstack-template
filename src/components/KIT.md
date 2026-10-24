# Project helpers

Small parts every project can use, and the fonts that are installed. Write everything else for the
site you are building; nothing here is a page or a style you have to adopt.

- **`Photo`** (`@/components/kit/photo`): use it for every picture. A reserved box (no layout shift), lazy loading, a calm placeholder while it loads and a tidy fallback if the file is missing, instead of the browser's broken-image icon. Props: `src`, `alt` (required), `width`, `height` (the rendered size, required), `aspect`, `priority` (set it on the first big image of a page), `rounded`, `fit`. Example: `<Photo src="/images/hero.webp" alt="Roasting beans" width={1200} height={800} priority aspect="3/2" rounded />`
- **`Enter`** and **`Reveal`** (`@/components/kit/reveal`): optional entrance motion. `Enter` is CSS only and runs at first paint: for content at the top of the page. `Reveal` fades content in as the visitor scrolls to it, and is visible in the server HTML: for sections below the fold. Props: `delay` (ms), `y` (px), `as`. Skip both for a plain or retro site.
- **`ErrorState`, `NotFoundState`, `PendingState`** (`@/components/kit/route-states`): the error, not-found and loading screens. Already wired into the root route and the router; reuse them for a route's own `errorComponent`, `notFoundComponent` or `pendingComponent`.
- **`seo({ title, description })`** (`@/lib/seo`): the head of a page. Give every route its own `head()`, and set `SITE` once in `src/lib/seo.ts`.
- **`useTheme()`** (`@/lib/use-theme`): `{ theme: 'light' | 'dark', setTheme, toggle }` for a theme switch.
- **Colour comes from tokens** in `src/styles/app.css` (`bg-background`, `text-foreground`, `bg-primary`, `border-border`, `bg-scrim` / `text-on-scrim` over photos, `chart-1` … `chart-5` for accents). Set the palette once, light and dark. The linter rejects literal colours in `src/components` and `src/routes`.
- **Shadows, display type and motion are tokens too**: `shadow-xs` … `shadow-xl`, `text-display` for the hero headline and `text-display-sm` for section titles (size, line height, tracking and weight in one class), `ease-brand` for transitions, and `bg-(image:--gradient-scrim)` behind text laid over a photo. A design direction sets their values.
- **Fonts are self-hosted.** Add `@import '@fontsource-variable/<name>';` at the top of `src/styles/app.css` for each family used (all listed below are installed), then set `--font-sans` and `--font-heading` in `@theme`. No Google Fonts link is needed.

## Fonts (installed)

Variable families (`@fontsource-variable/<name>`): fraunces, playfair-display, cormorant-garamond, newsreader, bricolage-grotesque, syne, unbounded, outfit, sora, familjen-grotesk, geist, inter, dm-sans, hanken-grotesk, instrument-sans, jost, nunito, figtree, manrope, plus-jakarta-sans, geist-mono, jetbrains-mono. Static: `@fontsource/instrument-serif`, `@fontsource/dm-serif-display`. CSS family names are the title-cased name with " Variable" (for example `'Fraunces Variable'`); the two static ones are `'Instrument Serif'` and `'DM Serif Display'`.

Choose fonts for this app, not from a fixed pairing: when the build has a design direction, its fonts are already applied; otherwise pick a heading face with character and a readable body face that fit this request.
