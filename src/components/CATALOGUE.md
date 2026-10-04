# Component catalogue

Generated from the `@kit` headers in `src/components/kit` and `src/components/fx` by `node scripts/build-catalogue.mjs`. Do not edit by hand.

## How to use this kit

- **Build pages from these first.** `kit/` has page sections (navbar, hero, features, pricing, testimonials, FAQ, CTA, footer, contact form) and `fx/` has 78 effect and UI components. Write a new component only when nothing here fits.
- Import by path, one file per component: `import { Marquee } from "@/components/fx/marquee"`. There is no barrel file.
- **Colour comes from tokens.** Components use `bg-background`, `text-foreground`, `bg-primary`, `border-border`, `bg-scrim` / `text-on-scrim` over photos, and `chart-1` … `chart-5` for accent colours. Set the project palette once in `src/styles/app.css` (light and dark); every component follows it. Never write a literal colour: the linter rejects it.
- **Effects take their colours from `--chart-1..5`**, so set those five tokens to the project accents (for example a brand colour and its neighbours) and every glow, beam and gradient matches.
- **Entrances.** For anything at the top of the page use `Enter` (CSS only, never leaves content invisible). For sections below the fold use `Reveal`. `BlurFade` and the other motion-library components start hidden until the page has hydrated: fine below the fold, not for a hero headline.
- **Images.** Use `Photo` for every picture (reserved size, lazy loading, a fallback instead of a broken icon). Give the first large image on a page `priority`.
- **Fonts are self-hosted.** Add `@import '@fontsource-variable/<name>';` at the top of `src/styles/app.css` for each family used (all listed below are installed), then set `--font-sans` and `--font-heading` in `@theme`. No Google Fonts link is needed.
- Keep to a few effects per page, each with a reason; most sections need none.

## Fonts (installed)

Variable families (`@fontsource-variable/<name>`): fraunces, playfair-display, cormorant-garamond, newsreader, bricolage-grotesque, syne, unbounded, outfit, sora, familjen-grotesk, geist, inter, dm-sans, hanken-grotesk, instrument-sans, jost, nunito, figtree, manrope, plus-jakarta-sans, geist-mono, jetbrains-mono. Static: `@fontsource/instrument-serif`, `@fontsource/dm-serif-display`. CSS family names are the title-cased name with " Variable" (for example `'Fraunces Variable'`); the two static ones are `'Instrument Serif'` and `'DM Serif Display'`.

| Feel | Heading | Body | Packages |
|---|---|---|---|
| Editorial, warm | Fraunces | Hanken Grotesk | fraunces, hanken-grotesk |
| Luxury, fashion | Cormorant Garamond | Jost | cormorant-garamond, jost |
| Modern product | Geist | Geist | geist (already imported), geist-mono |
| Friendly SaaS | Bricolage Grotesque | Instrument Sans | bricolage-grotesque, instrument-sans |
| Magazine, long reads | Newsreader | Inter | newsreader, inter |
| Bold agency | Syne | DM Sans | syne, dm-sans |
| Tech, developer | Sora | Inter + JetBrains Mono | sora, inter, jetbrains-mono |
| Craft, food, boutique | DM Serif Display | Figtree | @fontsource/dm-serif-display, figtree |
| Playful | Unbounded | Nunito | unbounded, nunito |
| Fintech, clean | Manrope | Inter | manrope, inter |
| Elegant, minimal | Instrument Serif | Plus Jakarta Sans | @fontsource/instrument-serif, plus-jakarta-sans |
| Geometric | Outfit | Familjen Grotesk | outfit, familjen-grotesk |

## Index

One line each. Open the file to see its `@kit` header with the props and a usage example before using a component you have not used.

### Page sections and layout

- **ContactForm** (`kit/contact-form`): A contact or enquiry form with validation, a loading state and a real success state.
- **CTA** (`kit/cta`): A closing call-to-action band: one headline, one sentence and a button, on the primary colour. Put it just above the Footer.
- **FAQ** (`kit/faq`): Questions and answers in an accordion; the first opens by default so the section never looks empty. Keep answers short and specific to the business.
- **FeatureGrid, FeatureRows** (`kit/features`): Explain what the product does. FeatureGrid: a grid of icon cards (3 columns on desktop, 1 on a phone).
- **Footer** (`kit/footer`): The page foot: brand and one-line description, link columns, and a legal line.
- **HeroCentered, HeroSplit** (`kit/hero`): The top of a landing page. HeroCentered: a centred headline, subhead and two buttons, with a wide visual below.
- **Container, Section, SectionHeading** (`kit/layout`): The page frame every section sits in: a centred width with side padding, a vertical band with consistent spacing and an optional tone, and a heading block (e…
- **LogoCloud** (`kit/logo-cloud`): "Trusted by" strip of customer or partner names or logos, quiet and evenly spaced.
- **Navbar** (`kit/navbar`): A sticky top bar with a brand, links, an optional call-to-action and a mobile menu that opens below it.
- **Pricing** (`kit/pricing`): Plans side by side, one of them highlighted. Prices are text you pass in, so any currency or period works.
- **ErrorState, NotFoundState, PendingState** (`kit/route-states`): The screens for a route that failed to render, a page that does not exist, and a route that is still loading.
- **Stats** (`kit/stats`): A row of big numbers with labels (customers, uptime, countries). Use real figures from the brief; never invent them.
- **Testimonials** (`kit/testimonials`): Customer quotes in a grid. Use quotes the user supplied or that came from a source you fetched; do not invent named customers.
- **BentoGrid, BentoCard** (`fx/bento-grid`): A three-column bento layout of feature cards with a background visual, icon, text and a call-to-action link that appears on hover; use it for feature showcases.
- **Marquee** (`fx/marquee`): An endless scrolling strip of any content, horizontal or vertical; use for logo walls, testimonials and tag rows.

### Motion helpers

- **Reveal** (`kit/reveal`): Fade and rise into view as the visitor scrolls to it.
- **Enter** (`kit/reveal`): Fade and rise on page load for content at the top of the page (hero headline, buttons).
- **AnimatedList, AnimatedListItem** (`fx/animated-list`): Shows its children one by one at an interval, each new item springing in on top of the previous; use for notification feeds and activity streams in a hero or…
- **BlurFade** (`fx/blur-fade`): Fades and un-blurs its children into view, optionally when scrolled into view; invisible until hydrated, so for anything above the fold prefer Reveal/Enter i…
- **OrbitingCircles** (`fx/orbiting-circles`): Icons or badges that orbit a centre point along a circular path; put it in a relatively positioned square and place a hero element in the middle.

### Backgrounds and patterns

- **AnimatedGridPattern** (`fx/animated-grid-pattern`): A grid whose squares fade in and out at random cells; choose it for a living, slightly techy hero backdrop.
- **Backlight** (`fx/backlight`): Wraps one element and casts a saturated blurred glow of its own colours behind it; choose it to make an image or card look lit from behind.
- **DotPattern** (`fx/dot-pattern`): A field of dots that fills its container, optionally twinkling; choose it for a soft dotted backdrop behind a hero or section.
- **FlickeringGrid** (`fx/flickering-grid`): A canvas grid of small squares that randomly flicker in opacity; choose it for a digital, matrix-like backdrop (also works masked into shapes).
- **Floating3DParticles** (`fx/floating-3d-particles`): A canvas cloud of soft particles orbiting and rising in 3D perspective; choose it for a deep, floating-dust hero backdrop.
- **GlyphMatrix** (`fx/glyph-matrix`): A canvas background of a grid of subtly shifting glyphs (code-like texture) that fades toward the bottom; use behind hero or developer-tool sections.
- **GridPattern** (`fx/grid-pattern`): A static SVG grid of thin lines with optional highlighted squares; choose it for a quiet blueprint backdrop behind a hero or section.
- **HexagonPattern** (`fx/hexagon-pattern`): A honeycomb of thin hexagon outlines with optional highlighted cells; choose it for a technical or hive-like backdrop.
- **InteractiveGridPattern** (`fx/interactive-grid-pattern`): A grid of squares that light up under the cursor and fade out slowly; choose it for a playful, reactive hero backdrop.
- **LightRays** (`fx/light-rays`): Soft blurred beams of light that sway down from the top edge; choose it for a dreamy, atmospheric hero backdrop.
- **Meteors** (`fx/meteors`): Shooting-star streaks that fall diagonally across the nearest positioned parent; choose it for a night-sky or "launch" feel on a hero or card.
- **NoiseTexture** (`fx/noise-texture`): A film-grain noise overlay (SVG feTurbulence) that adds tactile texture to a flat surface; choose it to take the digital sheen off a card, hero or gradient.
- **Particles** (`fx/particles`): A canvas field of tiny drifting dots that gently follow the cursor; choose it for a starry or dusty ambient backdrop behind a hero.
- **ProgressiveBlur** (`fx/progressive-blur`): A blur that ramps up smoothly toward an edge of its parent using stacked backdrop-blur layers; choose it to fade scrolling content or an image into a header…
- **RetroGrid** (`fx/retro-grid`): A WebGL perspective floor of grid lines scrolling toward the viewer, fading into the page background; choose it for a synthwave or horizon-style hero backdrop.
- **Ripple** (`fx/ripple`): Concentric circles that gently pulse outward from the centre and fade toward the bottom; choose it as a calm hero or call-to-action backdrop.
- **StripedPattern** (`fx/striped-pattern`): Diagonal hairline stripes as an SVG fill; choose it for a subtle hatched backdrop or to mark an empty or disabled area.
- **WarpBackground** (`fx/warp-background`): A 3D tunnel of grid walls with coloured beams racing toward the viewer, wrapping its children; choose it for a bold, sci-fi hero or feature card.

### Text effects

- **AnimatedGradientText** (`fx/animated-gradient-text`): Inline text filled with a two-colour gradient that slides endlessly; choose it for a highlighted word or a badge label.
- **AnimatedShinyText** (`fx/animated-shiny-text`): Muted text with a light shimmer sweeping across it; choose it for small announcement pills and badges.
- **AuroraText** (`fx/aurora-text`): Text filled with a slowly drifting multi-colour gradient; choose it to highlight a key word inside a headline.
- **ComicText** (`fx/comic-text`): Comic-book style outlined, halftone-dotted text with a pop-in entrance; choose it for playful, loud headings (uses the Bangers font when the site loads it).
- **DiaTextReveal** (`fx/dia-text-reveal`): Text revealed by a soft multi-colour gradient band sweeping across it, optionally cycling through several phrases; choose it for a hero headline entrance.
- **Highlighter** (`fx/highlighter`): Hand-drawn marker highlight, underline, box, circle, strike-through or bracket around inline text (rough-notation); choose it to emphasise a phrase inside a…
- **HyperText** (`fx/hyper-text`): Text that scrambles through random letters and settles on the real text, on load, in view or on hover; choose it for techy headings.
- **KineticText** (`fx/kinetic-text`): A heading whose letters swell in weight and outline as the pointer moves across them; choose it for playful, interactive big type.
- **LineShadowText** (`fx/line-shadow-text`): Headline text with an animated diagonal line-hatched shadow behind it; choose it for bold hero titles that need a graphic, print-like feel.
- **MorphingText** (`fx/morphing-text`): Large text that melts from one phrase into the next in a loop; choose it for a hero line that cycles through short phrases.
- **NumberTicker** (`fx/number-ticker`): A number that counts up (or down) with a spring once it scrolls into view; choose it for stats and metrics.
- **ScrollVelocityContainer, ScrollVelocityRow** (`fx/scroll-based-velocity`): Marquee rows of text that speed up and reverse with the page scroll velocity; choose it for big scrolling word strips between sections.
- **SparklesText** (`fx/sparkles-text`): Bold text with little four-point stars twinkling around it; choose it for celebratory or premium headlines.
- **SpinningText** (`fx/spinning-text`): Text laid out on a circle that rotates continuously; choose it for badges, stamps and circular logos.
- **Terminal, AnimatedSpan, TypingAnimation** (`fx/terminal`): A terminal window that plays a scripted session: typed commands (TypingAnimation) and output lines (AnimatedSpan) appear one after another; use it to show a…
- **Text3DFlip** (`fx/text-3d-flip`): Text whose letters flip in 3D, staggered, when hovered; choose it for links, nav items and buttons labels with a tactile hover.
- **TextAnimate** (`fx/text-animate`): Animates text in by word, character, line or whole text with presets like blurIn, slideUp, scaleUp; choose it for scroll-triggered headline and paragraph ent…
- **TextReveal** (`fx/text-reveal`): A sticky paragraph whose words light up one by one as the visitor scrolls; choose it for a manifesto or key-message section.
- **TypingAnimation** (`fx/typing-animation`): Text typed out letter by letter with a blinking cursor, optionally cycling and deleting through several words; choose it for a hero tagline or terminal feel.
- **WordRotate** (`fx/word-rotate`): A heading that swaps through a list of words with a slide-fade transition; choose it for a rotating value word inside a headline.

### Cards and borders

- **BorderBeam** (`fx/border-beam`): A light beam that travels around the border of its relatively positioned parent; drop it inside any rounded card or input to add motion.
- **ClientTweetCard** (`fx/client-tweet-card`): A tweet card fetched in the browser from a tweet id, with a skeleton while loading and a not-found card on error; same output as TweetCard.
- **GlareHover** (`fx/glare-hover`): A wrapper that sweeps a diagonal glare across its content on hover; use it on image cards, logos or buttons for a glossy feel.
- **MagicCard** (`fx/magic-card`): A card whose border and surface glow follow the pointer; pick it for feature or pricing cards that should feel alive on hover.
- **NeonGradientCard** (`fx/neon-gradient-card`): A card wrapped in an animated, glowing two-colour gradient border; pick it to spotlight one hero card or offer.
- **ShineBorder** (`fx/shine-border`): An animated shimmering border that fills a relatively positioned parent; use it to frame cards, forms or callouts.
- **TweetCard, MagicTweet, TweetSkeleton, TweetNotFound** (`fx/tweet-card`): A card that shows a real tweet (avatar, text, photos or video) fetched from its id at runtime, with a skeleton while loading and a not-found card on error; u…

### Buttons

- **AnimatedThemeToggler** (`fx/animated-theme-toggler`): A light/dark toggle button that reveals the new theme with a growing shape (circle, star, ...) using the View Transitions API, falling back to an instant swi…
- **InteractiveHoverButton** (`fx/interactive-hover-button`): A pill button with a dot that expands to fill it and reveals an arrow on hover; choose it for friendly navigation calls to action.
- **PulsatingButton** (`fx/pulsating-button`): A solid primary button with a soft halo that pulses outward; choose it to draw the eye to a single urgent call to action.
- **RainbowButton, rainbowButtonVariants** (`fx/rainbow-button`): A button with an animated gradient border and glow in the palette's five accent colours; choose it for the one standout call to action.
- **RippleButton** (`fx/ripple-button`): An outlined button that spawns a ripple where it is clicked; choose it for tactile secondary actions.
- **ShimmerButton** (`fx/shimmer-button`): A dark pill button with a light that circles its edge; choose it for a primary call to action on a calm page.
- **ShinyButton** (`fx/shiny-button`): A subtle outlined button with a light sweep that repeats and a springy press; choose it for secondary calls to action.

### Media, maps and code

- **Photo** (`kit/photo`): An image with a reserved box (no layout shift), lazy loading, a calm placeholder while it loads and a tidy fallback if the file is missing, instead of the br…
- **AvatarCircles** (`fx/avatar-circles`): A row of overlapping round avatars with an optional "+N" count; use it for social proof such as "joined by 99 people".
- **HeroVideoDialog** (`fx/hero-video-dialog`): A thumbnail with a play button that opens a video (YouTube/Vimeo embed URL or a video file) in a full-screen overlay; use it for a product demo or hero video.
- **Lens** (`fx/lens`): A magnifier that zooms into whatever it wraps (an image, a screenshot, a card) under the pointer; use it to let people inspect product shots or details.
- **PixelImage** (`fx/pixel-image`): An image that assembles itself from a grid of pixel blocks that fade in at random, then turns from greyscale to colour; use it for a hero or feature image re…
- **VideoText** (`fx/video-text`): Big text that acts as a window onto a looping video; choose it for a hero word over footage (you supply the video URL).

### Device mockups

- **Android** (`fx/android`): An Android phone mockup in an SVG frame that shows an image or a looping video on its screen; use it to present a mobile app or a mobile page.
- **Iphone** (`fx/iphone`): An iPhone mockup in an SVG frame with a dynamic island that shows an image or a looping video on its screen; use it to present a mobile app or page.
- **Safari** (`fx/safari`): A Safari browser window mockup with traffic lights and an address bar that shows a website image or looping video; use it to present a web app or landing page.

### Interaction and feedback

- **Confetti, ConfettiButton** (`fx/confetti`): Confetti bursts in the theme's accent colours: a canvas you fire from code (Confetti) or a button that bursts from itself when clicked (ConfettiButton); use…
- **CoolMode** (`fx/cool-mode`): Wraps a button or any element so that pressing and holding it sprays particles (coloured dots, an emoji or an image) from the pointer; a playful touch for ca…
- **Dock, DockIcon** (`fx/dock`): A macOS-style dock whose icons magnify as the pointer nears them; use it for a floating toolbar, social links or a navigation bar.
- **Tree, Folder, File, CollapseButton** (`fx/file-tree`): An expandable file-and-folder tree with selection, built from nested Folder/File children or an elements array, plus a collapse/expand-all button; use it to…
- **IconCloud** (`fx/icon-cloud`): A draggable 3D sphere of icons or logos that spins toward the pointer and rotates to a clicked icon; use it for a tech-stack or integrations section.
- **Pointer** (`fx/pointer`): Replaces the system cursor with a custom pointer while the mouse is over the parent element; does nothing on touch devices or with reduced motion, and the no…
- **ScrollProgress** (`fx/scroll-progress`): A thin gradient bar fixed to the top of the page that fills as the visitor scrolls; use it on long articles and landing pages.
- **SmoothCursor** (`fx/smooth-cursor`): Replaces the system cursor on the whole page with a spring-smoothed arrow that rotates with movement; does nothing on touch devices or with reduced motion, a…

### Data and numbers

- **AnimatedBeam** (`fx/animated-beam`): An SVG line with a travelling gradient that connects two elements; use it to show integrations or data flow between icons.
- **AnimatedCircularProgressBar** (`fx/animated-circular-progress-bar`): A circular gauge that animates to a value and shows the percentage in its centre; use it for scores, goals or completion.
- **CodeComparison** (`fx/code-comparison`): A side-by-side before/after code diff with Shiki syntax highlighting, diff/focus/highlight line notations and a VS badge; use it to show a refactor or a feat…
- **DottedMap** (`fx/dotted-map`): A world map drawn as a field of dots, with optional pulsing markers at latitude/longitude points; use it to show where customers, offices or events are.
- **Globe** (`fx/globe`): An interactive, draggable 3D globe (WebGL) with glowing location markers that follows the theme colours; use it to show a worldwide audience or presence.

---

The effect components in `src/components/fx` are adapted from [Magic UI](https://magicui.design) (MIT licence, © Magic UI). See `NOTICE` at the project root.
