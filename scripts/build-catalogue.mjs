// Builds src/components/CATALOGUE.md from the `@kit` headers at the top of every component in
// src/components/fx and src/components/kit, so the catalogue the agent reads can never drift from
// the code. `node scripts/build-catalogue.mjs` writes it; `--check` fails if it is stale or a
// component has no header (CI runs this).
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const OUT = join(ROOT, 'src/components/CATALOGUE.md');
const DIRS = ['src/components/kit', 'src/components/fx'];
// Helpers the sections import, not components to build with.
const INTERNAL = new Set(['link.tsx']);
const GROUPS = {
  layout: 'Page sections and layout',
  motion: 'Motion helpers',
  backgrounds: 'Backgrounds and patterns',
  text: 'Text effects',
  cards: 'Cards and borders',
  buttons: 'Buttons',
  media: 'Media, maps and code',
  devices: 'Device mockups',
  interaction: 'Interaction and feedback',
  data: 'Data and numbers'
};

const read = (file) => readFileSync(file, 'utf8');
const problems = [];
const entries = [];

for (const dir of DIRS) {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) continue;
  for (const file of readdirSync(abs)
    .filter((f) => f.endsWith('.tsx') && !INTERNAL.has(f))
    .sort()) {
    const text = read(join(abs, file));
    const blocks = [...text.matchAll(/\/\*\*([\s\S]*?)\*\//g)]
      .map((m) => m[1])
      .filter((b) => b.includes('@kit '));
    if (blocks.length === 0) {
      problems.push(`${dir}/${file} has no @kit header`);
      continue;
    }
    for (const block of blocks) {
      const field = (key) => {
        const match = new RegExp(`@kit ${key}:\\s*([\\s\\S]*?)(?=\\n\\s*\\*\\s*@kit |$)`).exec(
          block
        );
        return match ? match[1].replace(/\n\s*\*\s*/g, ' ').trim() : '';
      };
      const entry = {
        names: field('name'),
        group: field('group'),
        use: field('use'),
        props: field('props'),
        example: field('example'),
        path: `@/${dir.replace(/^src\//, '')}/${file.replace(/\.tsx$/, '')}`
      };
      for (const required of ['names', 'group', 'use', 'example']) {
        if (!entry[required])
          problems.push(
            `${dir}/${file}: @kit ${required === 'names' ? 'name' : required} is empty`
          );
      }
      if (entry.group && !GROUPS[entry.group])
        problems.push(`${dir}/${file}: unknown group "${entry.group}"`);
      entries.push(entry);
    }
  }
}

const FONT_PAIRS = [
  ['Editorial, warm', 'Fraunces', 'Hanken Grotesk', 'fraunces, hanken-grotesk'],
  ['Luxury, fashion', 'Cormorant Garamond', 'Jost', 'cormorant-garamond, jost'],
  ['Modern product', 'Geist', 'Geist', 'geist (already imported), geist-mono'],
  [
    'Friendly SaaS',
    'Bricolage Grotesque',
    'Instrument Sans',
    'bricolage-grotesque, instrument-sans'
  ],
  ['Magazine, long reads', 'Newsreader', 'Inter', 'newsreader, inter'],
  ['Bold agency', 'Syne', 'DM Sans', 'syne, dm-sans'],
  ['Tech, developer', 'Sora', 'Inter + JetBrains Mono', 'sora, inter, jetbrains-mono'],
  ['Craft, food, boutique', 'DM Serif Display', 'Figtree', '@fontsource/dm-serif-display, figtree'],
  ['Playful', 'Unbounded', 'Nunito', 'unbounded, nunito'],
  ['Fintech, clean', 'Manrope', 'Inter', 'manrope, inter'],
  [
    'Elegant, minimal',
    'Instrument Serif',
    'Plus Jakarta Sans',
    '@fontsource/instrument-serif, plus-jakarta-sans'
  ],
  ['Geometric', 'Outfit', 'Familjen Grotesk', 'outfit, familjen-grotesk']
];

const lines = [
  '# Component catalogue',
  '',
  'Generated from the `@kit` headers in `src/components/kit` and `src/components/fx` by `node scripts/build-catalogue.mjs`. Do not edit by hand.',
  '',
  '## How to use this kit',
  '',
  '- **Build pages from these first.** `kit/` has page sections (navbar, hero, features, pricing, testimonials, FAQ, CTA, footer, contact form) and `fx/` has 78 effect and UI components. Write a new component only when nothing here fits.',
  '- Import by path, one file per component: `import { Marquee } from "@/components/fx/marquee"`. There is no barrel file.',
  '- **Colour comes from tokens.** Components use `bg-background`, `text-foreground`, `bg-primary`, `border-border`, `bg-scrim` / `text-on-scrim` over photos, and `chart-1` … `chart-5` for accent colours. Set the project palette once in `src/styles/app.css` (light and dark); every component follows it. Never write a literal colour: the linter rejects it.',
  '- **Effects take their colours from `--chart-1..5`**, so set those five tokens to the project accents (for example a brand colour and its neighbours) and every glow, beam and gradient matches.',
  '- **Entrances.** For anything at the top of the page use `Enter` (CSS only, never leaves content invisible). For sections below the fold use `Reveal`. `BlurFade` and the other motion-library components start hidden until the page has hydrated: fine below the fold, not for a hero headline.',
  '- **Images.** Use `Photo` for every picture (reserved size, lazy loading, a fallback instead of a broken icon). Give the first large image on a page `priority`.',
  "- **Fonts are self-hosted.** Add `@import '@fontsource-variable/<name>';` at the top of `src/styles/app.css` for each family used (all listed below are installed), then set `--font-sans` and `--font-heading` in `@theme`. No Google Fonts link is needed.",
  '- Keep to a few effects per page, each with a reason; most sections need none.',
  '',
  '## Fonts (installed)',
  '',
  "Variable families (`@fontsource-variable/<name>`): fraunces, playfair-display, cormorant-garamond, newsreader, bricolage-grotesque, syne, unbounded, outfit, sora, familjen-grotesk, geist, inter, dm-sans, hanken-grotesk, instrument-sans, jost, nunito, figtree, manrope, plus-jakarta-sans, geist-mono, jetbrains-mono. Static: `@fontsource/instrument-serif`, `@fontsource/dm-serif-display`. CSS family names are the title-cased name with \" Variable\" (for example `'Fraunces Variable'`); the two static ones are `'Instrument Serif'` and `'DM Serif Display'`.",
  '',
  '| Feel | Heading | Body | Packages |',
  '|---|---|---|---|',
  ...FONT_PAIRS.map(
    ([feel, heading, body, pkgs]) => `| ${feel} | ${heading} | ${body} | ${pkgs} |`
  ),
  ''
];

// The first sentence of a description, cut to a line: the full text, the props and an example are
// in the component's own @kit header, which is a read_file away.
const oneLine = (text) => {
  const sentences = text.split(/(?<=[.!?])\s+/);
  let line = sentences[0] ?? text;
  for (const next of sentences.slice(1)) {
    if (line.length + next.length + 1 > 150) break;
    line += ` ${next}`;
  }
  return line.length > 160 ? `${line.slice(0, 157).trimEnd()}…` : line;
};

lines.push(
  '## Index',
  '',
  'One line each. Open the file to see its `@kit` header with the props and a usage example before using a component you have not used.',
  ''
);
for (const [group, title] of Object.entries(GROUPS)) {
  const inGroup = entries.filter((e) => e.group === group);
  if (inGroup.length === 0) continue;
  lines.push(`### ${title}`, '');
  for (const e of inGroup) {
    lines.push(
      `- **${e.names}** (\`${e.path.replace(/^@\/components\//, '')}\`): ${oneLine(e.use)}`
    );
  }
  lines.push('');
}
lines.push(
  '---',
  '',
  'The effect components in `src/components/fx` are adapted from [Magic UI](https://magicui.design) (MIT licence, © Magic UI). See `NOTICE` at the project root.',
  ''
);
const output = lines.join('\n');

if (process.argv.includes('--check')) {
  if (!existsSync(OUT) || read(OUT) !== output)
    problems.push('src/components/CATALOGUE.md is stale: run node scripts/build-catalogue.mjs');
  if (problems.length > 0) {
    console.error(problems.join('\n'));
    process.exit(1);
  }
  console.log(`Catalogue is current (${entries.length} entries).`);
} else {
  if (problems.length > 0) {
    console.error(problems.join('\n'));
    process.exit(1);
  }
  writeFileSync(OUT, output);
  console.log(
    `Wrote src/components/CATALOGUE.md (${entries.length} entries, ${output.length} characters).`
  );
}
