import { AnimatedGradientText } from '@/components/fx/animated-gradient-text';
import { DotPattern } from '@/components/fx/dot-pattern';
import { Marquee } from '@/components/fx/marquee';
import { NumberTicker } from '@/components/fx/number-ticker';
import { Safari } from '@/components/fx/safari';
import { AnimatedThemeToggler } from '@/components/fx/animated-theme-toggler';
import { CTA } from '@/components/kit/cta';
import { FAQ } from '@/components/kit/faq';
import { FeatureGrid, FeatureRows } from '@/components/kit/features';
import { Footer } from '@/components/kit/footer';
import { HeroCentered } from '@/components/kit/hero';
import { Container, Section, SectionHeading } from '@/components/kit/layout';
import { Navbar } from '@/components/kit/navbar';
import { Photo } from '@/components/kit/photo';
import { Pricing } from '@/components/kit/pricing';
import { Reveal } from '@/components/kit/reveal';
import { Testimonials } from '@/components/kit/testimonials';
import { createFileRoute } from '@tanstack/react-router';
import { Calendar, Fingerprint, Landmark, ShieldCheck, Users, Zap } from 'lucide-react';

export const Route = createFileRoute('/kit-landing')({ component: Landing });

const IMG = '/og.png';

function Landing() {
  return (
    <div>
      <Navbar
        brand={<span className="font-heading text-lg font-semibold">Plum</span>}
        links={[
          { label: 'Features', href: '#features' },
          { label: 'Customers', href: '#customers' },
          { label: 'Pricing', href: '#pricing' },
          { label: 'FAQ', href: '#faq' }
        ]}
        cta={{ label: 'Start free', href: '#pricing' }}
        actions={<AnimatedThemeToggler className="border-border hover:bg-muted size-9 rounded-full border" />}
      />
      <main>
        <div className="relative">
          <DotPattern className="mask-[radial-gradient(600px_circle_at_center,var(--foreground),transparent)] opacity-40" />
          <HeroCentered
            eyebrow={<AnimatedGradientText>New: automatic quarterly filings</AnimatedGradientText>}
            title="Payroll, time off and hiring, sorted."
            description="Plum is the HR software that feels like a good office manager. Pay your people on time, answer leave requests in one tap, and welcome new hires without a pile of forms."
            primary={{ label: 'Start your free trial', href: '#pricing' }}
            secondary={{ label: 'See how it works', href: '#features' }}
            note="No card needed. Switch over in an afternoon."
            media={
              <Safari url="app.plum.hr/payroll" imageSrc={IMG} className="mx-auto w-full max-w-4xl" />
            }
          />
        </div>

        <Section pad="sm">
          <Container>
            <p className="text-muted-foreground mb-6 text-center text-sm">Trusted by 12,000 small teams</p>
            <Marquee pauseOnHover className="[--duration:28s]">
              {['Fernwood', 'Halcyon', 'Northform', 'Kuro', 'Cobalt', 'Mossback', 'Ember & Oak'].map((n) => (
                <span key={n} className="font-heading text-muted-foreground/80 mx-6 text-xl font-semibold">
                  {n}
                </span>
              ))}
            </Marquee>
          </Container>
        </Section>

        <FeatureGrid
          id="features"
          eyebrow="Features"
          title="Three jobs, done properly."
          description="We would rather do the three things small teams need every week really well than bolt on forty you will never open."
          items={[
            { icon: Landmark, title: 'Payroll that files itself', description: 'Run payroll in about four minutes. We calculate, pay and file federal, state and local taxes.' },
            { icon: Calendar, title: 'Time off, no spreadsheet', description: 'People ask in Plum, you approve in a tap. Balances update and clashes are spotted for you.' },
            { icon: Users, title: 'Hiring and onboarding', description: 'Offer letters, tax forms and equipment checklists go out the moment someone says yes.' },
            { icon: ShieldCheck, title: 'Compliance watching', description: 'We flag anything odd before it becomes a problem, and keep every record audit-ready.' },
            { icon: Fingerprint, title: 'Private by default', description: 'Salary data is visible only to the people who need it, with a full access log.' },
            { icon: Zap, title: 'Fast to switch', description: 'Bring your people in from a spreadsheet or your old provider in an afternoon.' }
          ]}
        />

        <Section tone="muted" pad="sm">
          <Container>
            <div className="grid gap-8 text-center sm:grid-cols-3">
              {[
                { value: 12000, suffix: '+', label: 'teams on Plum' },
                { value: 4, suffix: ' min', label: 'to run a payroll' },
                { value: 99, suffix: '.9%', label: 'on-time pay rate' }
              ].map((s, i) => (
                <Reveal key={s.label} delay={i * 80}>
                  <p className="font-heading text-5xl font-semibold">
                    <NumberTicker value={s.value} />
                    {s.suffix}
                  </p>
                  <p className="text-muted-foreground mt-2 text-sm">{s.label}</p>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>

        <FeatureRows
          items={[
            {
              title: 'Payday is a non-event',
              description: 'Review the run, approve, done. Plum checks for errors first and tells you plainly what it found.',
              bullets: ['Direct deposit, 2-day or next-day', 'Quarterly and year-end filings included', 'W-2s and 1099s sent for you'],
              media: <Photo src={IMG} alt="Payroll run" width={1200} height={630} rounded />
            },
            {
              title: 'Everyone knows who is out',
              description: 'A shared calendar shows leave, public holidays and coverage so shifts never clash.',
              bullets: ['Custom policies per role or location', 'Syncs with Google and Outlook'],
              media: <Photo src={IMG} alt="Team calendar" width={1200} height={630} rounded />
            }
          ]}
        />

        <Section id="customers" tone="muted">
          <Container>
            <SectionHeading eyebrow="Customers" title="Small teams, big relief." align="center" />
          </Container>
          <Testimonials
            title="What owners say"
            items={[
              { quote: 'I used to dread the first of the month. Now payroll takes me four minutes and a coffee.', name: 'Marisol Vega', role: 'Owner, Fernwood Bakery' },
              { quote: 'Leave requests used to live in my inbox. Now my team sorts it themselves.', name: 'Theo Brandt', role: 'Manager, Kuro' },
              { quote: 'We switched in an afternoon. The filings alone were worth it.', name: 'Anika Rao', role: 'Ops lead, Cobalt Homes' }
            ]}
          />
        </Section>

        <Pricing
          id="pricing"
          eyebrow="Pricing"
          title="Simple, per-person pricing"
          description="Every plan includes payroll, time off and onboarding. Switch or cancel anytime."
          tiers={[
            { name: 'Starter', price: '$6', period: '/person/mo', description: 'For teams of up to 10', features: ['Payroll and filings', 'Time off', 'Email support'], cta: { label: 'Start free', href: '#' } },
            { name: 'Team', price: '$9', period: '/person/mo', description: 'For growing teams', features: ['Everything in Starter', 'Hiring and onboarding', 'Priority support'], cta: { label: 'Start free trial', href: '#' }, highlighted: true, badge: 'Most popular' },
            { name: 'Business', price: 'Let’s talk', description: '50+ people', features: ['Everything in Team', 'Dedicated onboarding', 'Custom integrations'], cta: { label: 'Contact sales', href: '#' } }
          ]}
        />

        <FAQ
          id="faq"
          title="Questions, answered"
          items={[
            { question: 'How long does switching take?', answer: 'Most teams are live in an afternoon. We import your people from a spreadsheet or your old provider.' },
            { question: 'Do you file my taxes?', answer: 'Yes: federal, state and local payroll taxes, quarterly and year-end filings, W-2s and 1099s.' },
            { question: 'Is my data private?', answer: 'Salary data is visible only to people you choose, and every access is logged.' },
            { question: 'Can I cancel anytime?', answer: 'Yes. No contracts, and you can export everything.' }
          ]}
        />

        <CTA title="Ready for a calmer payday?" description="Start your free trial. No card, no contract." primary={{ label: 'Start free trial', href: '#pricing' }} secondary={{ label: 'Talk to us', href: '#' }} />
      </main>
      <Footer
        brand={<span className="font-heading text-lg font-semibold">Plum</span>}
        description="HR for small teams: payroll, time off and hiring."
        columns={[
          { title: 'Product', links: [{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }] },
          { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Contact', href: '#' }] },
          { title: 'Legal', links: [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }] }
        ]}
        legal="© 2027 Plum Software, Inc."
      />
    </div>
  );
}
