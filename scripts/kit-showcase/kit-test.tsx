import { Android } from '@/components/fx/android';
import { AnimatedBeam } from '@/components/fx/animated-beam';
import { AnimatedCircularProgressBar } from '@/components/fx/animated-circular-progress-bar';
import { AnimatedGradientText } from '@/components/fx/animated-gradient-text';
import { AnimatedGridPattern } from '@/components/fx/animated-grid-pattern';
import { AnimatedList } from '@/components/fx/animated-list';
import { AnimatedShinyText } from '@/components/fx/animated-shiny-text';
import { AnimatedThemeToggler } from '@/components/fx/animated-theme-toggler';
import { AuroraText } from '@/components/fx/aurora-text';
import { AvatarCircles } from '@/components/fx/avatar-circles';
import { Backlight } from '@/components/fx/backlight';
import { BentoCard, BentoGrid } from '@/components/fx/bento-grid';
import { BlurFade } from '@/components/fx/blur-fade';
import { BorderBeam } from '@/components/fx/border-beam';
import { ClientTweetCard } from '@/components/fx/client-tweet-card';
import { CodeComparison } from '@/components/fx/code-comparison';
import { ComicText } from '@/components/fx/comic-text';
import { ConfettiButton } from '@/components/fx/confetti';
import { CoolMode } from '@/components/fx/cool-mode';
import { DiaTextReveal } from '@/components/fx/dia-text-reveal';
import { Dock, DockIcon } from '@/components/fx/dock';
import { DotPattern } from '@/components/fx/dot-pattern';
import { DottedMap } from '@/components/fx/dotted-map';
import { File, Folder, Tree } from '@/components/fx/file-tree';
import { FlickeringGrid } from '@/components/fx/flickering-grid';
import { Floating3DParticles } from '@/components/fx/floating-3d-particles';
import { GlareHover } from '@/components/fx/glare-hover';
import { Globe } from '@/components/fx/globe';
import { GlyphMatrix } from '@/components/fx/glyph-matrix';
import { GridPattern } from '@/components/fx/grid-pattern';
import { HeroVideoDialog } from '@/components/fx/hero-video-dialog';
import { HexagonPattern } from '@/components/fx/hexagon-pattern';
import { Highlighter } from '@/components/fx/highlighter';
import { HyperText } from '@/components/fx/hyper-text';
import { IconCloud } from '@/components/fx/icon-cloud';
import { InteractiveGridPattern } from '@/components/fx/interactive-grid-pattern';
import { InteractiveHoverButton } from '@/components/fx/interactive-hover-button';
import { Iphone } from '@/components/fx/iphone';
import { KineticText } from '@/components/fx/kinetic-text';
import { Lens } from '@/components/fx/lens';
import { LightRays } from '@/components/fx/light-rays';
import { LineShadowText } from '@/components/fx/line-shadow-text';
import { MagicCard } from '@/components/fx/magic-card';
import { Marquee } from '@/components/fx/marquee';
import { Meteors } from '@/components/fx/meteors';
import { MorphingText } from '@/components/fx/morphing-text';
import { NeonGradientCard } from '@/components/fx/neon-gradient-card';
import { NoiseTexture } from '@/components/fx/noise-texture';
import { NumberTicker } from '@/components/fx/number-ticker';
import { OrbitingCircles } from '@/components/fx/orbiting-circles';
import { Particles } from '@/components/fx/particles';
import { PixelImage } from '@/components/fx/pixel-image';
import { Pointer } from '@/components/fx/pointer';
import { ProgressiveBlur } from '@/components/fx/progressive-blur';
import { PulsatingButton } from '@/components/fx/pulsating-button';
import { RainbowButton } from '@/components/fx/rainbow-button';
import { RetroGrid } from '@/components/fx/retro-grid';
import { RippleButton } from '@/components/fx/ripple-button';
import { Ripple } from '@/components/fx/ripple';
import { Safari } from '@/components/fx/safari';
import { ScrollVelocityContainer, ScrollVelocityRow } from '@/components/fx/scroll-based-velocity';
import { ScrollProgress } from '@/components/fx/scroll-progress';
import { ShimmerButton } from '@/components/fx/shimmer-button';
import { ShineBorder } from '@/components/fx/shine-border';
import { ShinyButton } from '@/components/fx/shiny-button';
import { SmoothCursor } from '@/components/fx/smooth-cursor';
import { SparklesText } from '@/components/fx/sparkles-text';
import { SpinningText } from '@/components/fx/spinning-text';
import { StripedPattern } from '@/components/fx/striped-pattern';
import { AnimatedSpan, Terminal, TypingAnimation as TermTyping } from '@/components/fx/terminal';
import { Text3DFlip } from '@/components/fx/text-3d-flip';
import { TextAnimate } from '@/components/fx/text-animate';
import { TextReveal } from '@/components/fx/text-reveal';
import { TweetCard } from '@/components/fx/tweet-card';
import { TypingAnimation } from '@/components/fx/typing-animation';
import { VideoText } from '@/components/fx/video-text';
import { WarpBackground } from '@/components/fx/warp-background';
import { WordRotate } from '@/components/fx/word-rotate';
import { Button } from '@/components/ui/button';
import { CTA } from '@/components/kit/cta';
import { FAQ } from '@/components/kit/faq';
import { FeatureGrid, FeatureRows } from '@/components/kit/features';
import { Footer } from '@/components/kit/footer';
import { ContactForm } from '@/components/kit/contact-form';
import { HeroCentered, HeroSplit } from '@/components/kit/hero';
import { Container, Section, SectionHeading } from '@/components/kit/layout';
import { LogoCloud } from '@/components/kit/logo-cloud';
import { Navbar } from '@/components/kit/navbar';
import { Photo } from '@/components/kit/photo';
import { Pricing } from '@/components/kit/pricing';
import { Enter, Reveal } from '@/components/kit/reveal';
import { Stats } from '@/components/kit/stats';
import { Testimonials } from '@/components/kit/testimonials';
import { ErrorState, NotFoundState, PendingState } from '@/components/kit/route-states';
import { createFileRoute } from '@tanstack/react-router';
import { HomeIcon, Zap } from 'lucide-react';
import { type ReactNode, useRef } from 'react';

export const Route = createFileRoute('/kit-test')({
  validateSearch: (search: Record<string, unknown>) => ({ only: typeof search.only === 'string' ? search.only : undefined }),
  component: KitTest
});

const IMG = '/og.png';
const CODE_A = 'const total = items.reduce((s, i) => s + i.price, 0);';
const CODE_B = 'const total = items.reduce((s, i) => s + i.price * i.qty, 0);';
const TREE = [
  { id: '1', isSelectable: true, name: 'src', children: [{ id: '2', isSelectable: true, name: 'index.tsx' }, { id: '3', isSelectable: true, name: 'app.css' }] },
  { id: '4', isSelectable: true, name: 'package.json' }
];

function Demo({ name, children, tall }: { name: string; children: ReactNode; tall?: boolean }) {
  const { only } = Route.useSearch();
  if (only && only !== name) return null;
  return (
    <section data-demo={name} className="border-border bg-card relative overflow-hidden rounded-xl border p-4">
      <h3 className="text-muted-foreground mb-3 font-mono text-xs">{name}</h3>
      <div className={tall ? 'relative h-72' : 'relative'}>{children}</div>
    </section>
  );
}

function Beams() {
  const box = useRef<HTMLDivElement>(null);
  const a = useRef<HTMLDivElement>(null);
  const b = useRef<HTMLDivElement>(null);
  return (
    <div ref={box} className="relative flex h-40 items-center justify-between px-10">
      <div ref={a} className="bg-primary size-10 rounded-full" />
      <div ref={b} className="bg-accent size-10 rounded-full" />
      <AnimatedBeam containerRef={box} fromRef={a} toRef={b} />
    </div>
  );
}

function KitTest() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <h1 className="font-heading text-3xl font-semibold">Kit test</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <Demo name="Android"><Android src={IMG} className="w-40" /></Demo>
        <Demo name="AnimatedBeam"><Beams /></Demo>
        <Demo name="AnimatedCircularProgressBar"><AnimatedCircularProgressBar value={72} /></Demo>
        <Demo name="AnimatedGradientText"><AnimatedGradientText>Introducing v2</AnimatedGradientText></Demo>
        <Demo name="AnimatedGridPattern" tall><AnimatedGridPattern numSquares={30} maxOpacity={0.15} /></Demo>
        <Demo name="AnimatedList"><AnimatedList delay={800}>{['One', 'Two', 'Three'].map((n) => <div key={n} className="bg-muted rounded p-3">{n}</div>)}</AnimatedList></Demo>
        <Demo name="AnimatedShinyText"><AnimatedShinyText>New: dark mode is here</AnimatedShinyText></Demo>
        <Demo name="AnimatedThemeToggler"><AnimatedThemeToggler className="border-border size-9 rounded-full border" /></Demo>
        <Demo name="AuroraText"><h2 className="text-4xl font-bold">Build <AuroraText>faster</AuroraText></h2></Demo>
        <Demo name="AvatarCircles"><AvatarCircles numPeople={99} avatarUrls={[{ imageUrl: IMG, profileUrl: '#', name: 'Ada' }]} /></Demo>
        <Demo name="Backlight"><Backlight blur={30}><img src={IMG} alt="Cover" width={300} height={157} className="rounded-xl" /></Backlight></Demo>
        <Demo name="BentoGrid"><BentoGrid><BentoCard name="Fast" description="Loads instantly." Icon={Zap} href="#" cta="Learn more" background={<div />} className="lg:col-span-3" /></BentoGrid></Demo>
        <Demo name="BlurFade"><BlurFade delay={0.1}><h2 className="text-2xl">Features</h2></BlurFade></Demo>
        <Demo name="BorderBeam"><div className="border-border relative rounded-xl border p-6">Content<BorderBeam size={120} duration={8} /></div></Demo>
        <Demo name="ClientTweetCard"><ClientTweetCard id="1628832338187636740" /></Demo>
        <Demo name="CodeComparison"><CodeComparison beforeCode={CODE_A} afterCode={CODE_B} language="tsx" filename="cart.tsx" /></Demo>
        <Demo name="ComicText"><ComicText fontSize={6}>Boom!</ComicText></Demo>
        <Demo name="ConfettiButton"><ConfettiButton options={{ particleCount: 80 }}>Celebrate</ConfettiButton></Demo>
        <Demo name="CoolMode"><CoolMode><Button>Hold me</Button></CoolMode></Demo>
        <Demo name="DiaTextReveal"><DiaTextReveal text="Ship something great" className="text-4xl font-semibold" /></Demo>
        <Demo name="Dock"><Dock><DockIcon><HomeIcon className="size-full" /></DockIcon><DockIcon><Zap className="size-full" /></DockIcon></Dock></Demo>
        <Demo name="DotPattern" tall><DotPattern glow /></Demo>
        <Demo name="DottedMap"><DottedMap markers={[{ lat: 40.7, lng: -74 }]} pulse className="text-muted-foreground" /></Demo>
        <Demo name="Tree (file-tree)"><div className="h-48"><Tree elements={TREE} initialSelectedId="1"><Folder element="src" value="1"><File value="2"><span>index.tsx</span></File><File value="3"><span>app.css</span></File></Folder><File value="4"><span>package.json</span></File></Tree></div></Demo>
        <Demo name="FlickeringGrid" tall><FlickeringGrid className="absolute inset-0" color="var(--chart-1)" maxOpacity={0.4} /></Demo>
        <Demo name="Floating3DParticles" tall><Floating3DParticles className="absolute inset-0" color="var(--primary)" /></Demo>
        <Demo name="GlareHover"><GlareHover width="280px" height="160px" className="rounded-xl"><p className="text-on-scrim">Hover me</p></GlareHover></Demo>
        <Demo name="Globe" tall><Globe /></Demo>
        <Demo name="GlyphMatrix" tall><GlyphMatrix className="absolute inset-0" /></Demo>
        <Demo name="GridPattern" tall><GridPattern squares={[[4, 4], [5, 1]]} /></Demo>
        <Demo name="HeroVideoDialog"><HeroVideoDialog videoSrc="https://www.youtube.com/embed/dQw4w9WgXcQ" thumbnailSrc={IMG} className="w-full" /></Demo>
        <Demo name="HexagonPattern" tall><HexagonPattern hexagons={[[1, 1], [2, 3]]} /></Demo>
        <Demo name="Highlighter"><p>Make it <Highlighter action="underline">memorable</Highlighter>.</p></Demo>
        <Demo name="HyperText"><HyperText className="text-3xl">Hello world</HyperText></Demo>
        <Demo name="IconCloud" tall><IconCloud images={[IMG, IMG, IMG, IMG, IMG, IMG]} /></Demo>
        <Demo name="InteractiveGridPattern" tall><InteractiveGridPattern /></Demo>
        <Demo name="InteractiveHoverButton"><InteractiveHoverButton>Explore</InteractiveHoverButton></Demo>
        <Demo name="Iphone"><Iphone src={IMG} className="w-40" /></Demo>
        <Demo name="KineticText"><KineticText text="Hover me" className="text-5xl" /></Demo>
        <Demo name="Lens"><Lens zoomFactor={2}><img src={IMG} alt="Product" width={300} height={157} /></Lens></Demo>
        <Demo name="LightRays" tall><LightRays /></Demo>
        <Demo name="LineShadowText"><LineShadowText className="text-5xl font-bold italic">Launch</LineShadowText></Demo>
        <Demo name="MagicCard"><MagicCard className="rounded-xl p-6">Card content</MagicCard></Demo>
        <Demo name="Marquee"><Marquee pauseOnHover>{['Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli'].map((l) => <span key={l} className="text-xl font-semibold">{l}</span>)}</Marquee></Demo>
        <Demo name="Meteors" tall><Meteors number={20} /></Demo>
        <Demo name="MorphingText"><MorphingText texts={['Design', 'Build', 'Ship']} /></Demo>
        <Demo name="NeonGradientCard"><NeonGradientCard className="max-w-sm">Content</NeonGradientCard></Demo>
        <Demo name="NoiseTexture"><div className="relative h-24"><NoiseTexture /><h2 className="relative">Hello</h2></div></Demo>
        <Demo name="NumberTicker"><NumberTicker value={1200} className="text-4xl font-bold" /></Demo>
        <Demo name="OrbitingCircles" tall><OrbitingCircles radius={90}><Zap className="size-5" /><HomeIcon className="size-5" /></OrbitingCircles></Demo>
        <Demo name="Particles" tall><Particles className="absolute inset-0" quantity={80} color="var(--chart-1)" /></Demo>
        <Demo name="PixelImage"><PixelImage src={IMG} alt="Product shot" grid="6x4" /></Demo>
        <Demo name="Pointer"><div className="relative h-24"><Pointer />Content under a custom pointer</div></Demo>
        <Demo name="ProgressiveBlur" tall><img src={IMG} alt="" width={600} height={315} /><ProgressiveBlur position="bottom" height="40%" /></Demo>
        <Demo name="PulsatingButton"><PulsatingButton>Join the waitlist</PulsatingButton></Demo>
        <Demo name="RainbowButton"><RainbowButton>Get Unlimited Access</RainbowButton></Demo>
        <Demo name="RetroGrid" tall><RetroGrid /></Demo>
        <Demo name="RippleButton"><RippleButton>Click me</RippleButton></Demo>
        <Demo name="Ripple" tall><Ripple /></Demo>
        <Demo name="Safari"><Safari url="example.com" imageSrc={IMG} className="w-full" /></Demo>
        <Demo name="ScrollVelocity"><ScrollVelocityContainer><ScrollVelocityRow baseVelocity={3}><span className="mx-4 text-3xl font-bold">Keep going</span></ScrollVelocityRow></ScrollVelocityContainer></Demo>
        <Demo name="ScrollProgress"><ScrollProgress /></Demo>
        <Demo name="ShimmerButton"><ShimmerButton>Get started</ShimmerButton></Demo>
        <Demo name="ShineBorder"><div className="relative rounded-xl p-6">Content<ShineBorder shineColor={['var(--chart-1)', 'var(--chart-2)']} /></div></Demo>
        <Demo name="ShinyButton"><ShinyButton>Get unlimited access</ShinyButton></Demo>
        <Demo name="SmoothCursor"><SmoothCursor /></Demo>
        <Demo name="SparklesText"><SparklesText>Magic</SparklesText></Demo>
        <Demo name="SpinningText"><SpinningText>learn more • earn more • </SpinningText></Demo>
        <Demo name="StripedPattern" tall><StripedPattern className="text-foreground/15" /></Demo>
        <Demo name="Terminal"><Terminal><TermTyping>$ npm create app</TermTyping><AnimatedSpan>Done.</AnimatedSpan></Terminal></Demo>
        <Demo name="Text3DFlip"><Text3DFlip className="text-2xl font-semibold">Get started</Text3DFlip></Demo>
        <Demo name="TextAnimate"><TextAnimate animation="blurInUp" by="word">Welcome to the future</TextAnimate></Demo>
        <Demo name="TextReveal"><TextReveal>We build calm software for busy teams.</TextReveal></Demo>
        <Demo name="TweetCard"><TweetCard id="1628832338187636740" /></Demo>
        <Demo name="TypingAnimation"><TypingAnimation>Build something people love.</TypingAnimation></Demo>
        <Demo name="VideoText"><div className="relative h-40"><VideoText src="/none.mp4">OCEAN</VideoText></div></Demo>
        <Demo name="WarpBackground"><WarpBackground className="p-10"><div className="bg-card rounded-xl p-6">Content</div></WarpBackground></Demo>
        <Demo name="WordRotate"><WordRotate words={['Fast', 'Simple', 'Beautiful']} className="text-3xl font-bold" /></Demo>
      </div>

      <h2 className="font-heading pt-10 text-2xl font-semibold">Sections</h2>
      <Demo name="Navbar"><Navbar brand={<span className="font-heading font-semibold">Plum</span>} links={[{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }]} cta={{ label: 'Start free', href: '#pricing' }} /></Demo>
      <Demo name="HeroCentered"><HeroCentered eyebrow="New in v2" title="Payroll, time off and hiring, sorted." description="HR software for small teams." primary={{ label: 'Start free', href: '#pricing' }} secondary={{ label: 'See how it works', href: '#features' }} note="No card needed" media={<Photo src={IMG} alt="Dashboard" width={1200} height={630} rounded priority />} /></Demo>
      <Demo name="HeroSplit"><HeroSplit eyebrow="Roasted to order" title="Coffee roasted slow." description="Small lots from farms we have visited." primary={{ label: 'Shop', href: '#' }} media={<Photo src={IMG} alt="Beans" width={1200} height={630} rounded />} /></Demo>
      <Demo name="FeatureGrid"><FeatureGrid title="Everything in one place" items={[{ icon: Zap, title: 'Fast', description: 'Runs in seconds.' }, { icon: HomeIcon, title: 'Simple', description: 'No training needed.' }, { title: 'Safe', description: 'Backed up every night.' }]} /></Demo>
      <Demo name="FeatureRows"><FeatureRows title="Built for teams" items={[{ title: 'Payroll that files itself', description: 'We calculate, pay and file.', bullets: ['Direct deposit', 'Quarterly filings'], media: <Photo src={IMG} alt="Payroll" width={1200} height={630} rounded /> }]} /></Demo>
      <Demo name="Stats"><Stats items={[{ value: '12k', label: 'teams' }, { value: '99.9%', label: 'uptime' }, { value: '40', label: 'countries' }]} /></Demo>
      <Demo name="LogoCloud"><LogoCloud title="Trusted by teams at" logos={[{ name: 'Acme' }, { name: 'Globex' }, { name: 'Initech' }]} /></Demo>
      <Demo name="Pricing"><Pricing title="Simple pricing" tiers={[{ name: 'Free', price: '$0', features: ['1 project'], cta: { label: 'Start', href: '#' } }, { name: 'Pro', price: '$19', period: '/mo', features: ['Unlimited projects', 'Priority support'], cta: { label: 'Go Pro', href: '#' }, highlighted: true, badge: 'Popular' }, { name: 'Team', price: '$49', period: '/mo', features: ['Everything in Pro', 'SSO'], cta: { label: 'Contact', href: '#' } }]} /></Demo>
      <Demo name="Testimonials"><Testimonials title="Loved by teams" items={[{ quote: 'It just works.', name: 'Ada Lovelace', role: 'CTO, Acme' }, { quote: 'Payday takes four minutes now.', name: 'Grace Hopper', role: 'Ops, Globex' }]} /></Demo>
      <Demo name="FAQ"><FAQ title="Questions" items={[{ question: 'Is there a free plan?', answer: 'Yes, for one project.' }, { question: 'Can I cancel anytime?', answer: 'Yes.' }]} /></Demo>
      <Demo name="CTA"><CTA title="Ready to start?" description="Create your account in a minute." primary={{ label: 'Create account', href: '#' }} secondary={{ label: 'Talk to us', href: '#' }} /></Demo>
      <Demo name="Footer"><Footer brand={<b>Plum</b>} description="HR for small teams." columns={[{ title: 'Product', links: [{ label: 'Pricing', href: '#pricing' }] }, { title: 'Company', links: [{ label: 'About', href: '#' }] }]} legal="© 2027 Plum" /></Demo>
      <Demo name="ContactForm"><ContactForm /></Demo>
      <Demo name="Section/Container/SectionHeading"><Section tone="muted" pad="sm"><Container><SectionHeading eyebrow="Eyebrow" title="Heading" description="A description." align="center" /></Container></Section></Demo>
      <Demo name="Reveal/Enter"><Enter><p>Enter</p></Enter><Reveal><p>Reveal</p></Reveal></Demo>
      <Demo name="Photo (broken src)"><Photo src="/missing.webp" alt="Missing" width={400} height={200} rounded /></Demo>
      <Demo name="ErrorState"><div className="h-80 overflow-hidden"><ErrorState error={new Error('Example failure')} /></div></Demo>
      <Demo name="NotFoundState"><div className="h-80 overflow-hidden"><NotFoundState /></div></Demo>
      <Demo name="PendingState"><div className="h-40 overflow-hidden"><PendingState /></div></Demo>
    </div>
  );
}
