import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { Container, Section, SectionHeading } from './layout';
import { SmartLink } from './link';
import { Reveal } from './reveal';

/**
 * @kit name: Pricing
 * @kit group: layout
 * @kit use: Plans side by side, one of them highlighted. Prices are text you pass in, so any currency or period works. Use the prices the user gave; if none were given, say so in the summary instead of inventing numbers.
 * @kit props: tiers [{ name, price, period, description, features, cta { label, href }, highlighted, badge }], eyebrow, title, description
 * @kit example: <Pricing title="Simple pricing" tiers={[{ name: 'Free', price: '$0', features: ['1 project'], cta: { label: 'Start', href: '#' } }]} />
 */
export type PricingTier = {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  cta: { label: string; href: string };
  highlighted?: boolean;
  badge?: string;
};

export function Pricing({
  eyebrow,
  title,
  description,
  tiers,
  id,
  className
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  tiers: PricingTier[];
  id?: string;
  className?: string;
}) {
  return (
    <Section id={id} tone="muted" className={className}>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} align="center" />
        <div
          className={cn(
            'mx-auto grid max-w-5xl gap-5',
            tiers.length === 2 && 'max-w-3xl md:grid-cols-2',
            tiers.length >= 3 && 'md:grid-cols-3'
          )}
        >
          {tiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 80} className="h-full">
              <div
                className={cn(
                  'relative flex h-full flex-col rounded-2xl border p-7',
                  tier.highlighted
                    ? 'border-primary bg-primary text-primary-foreground shadow-lg'
                    : 'border-border bg-card'
                )}
              >
                {tier.badge ? (
                  <span className="bg-accent text-accent-foreground absolute -top-3 left-7 rounded-full px-3 py-0.5 text-xs font-medium">
                    {tier.badge}
                  </span>
                ) : null}
                <h3 className="font-heading text-lg font-semibold">{tier.name}</h3>
                {tier.description ? (
                  <p
                    className={cn(
                      'mt-1 text-sm',
                      tier.highlighted ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}
                  >
                    {tier.description}
                  </p>
                ) : null}
                <p className="mt-6 flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-semibold">{tier.price}</span>
                  {tier.period ? (
                    <span
                      className={cn(
                        'text-sm',
                        tier.highlighted ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      )}
                    >
                      {tier.period}
                    </span>
                  ) : null}
                </p>
                <ul className="mt-6 flex-1 space-y-3 text-sm">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <SmartLink
                  href={tier.cta.href}
                  className={cn(
                    'mt-8 inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-medium transition-colors',
                    tier.highlighted
                      ? 'bg-primary-foreground text-primary hover:bg-primary-foreground/90'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                >
                  {tier.cta.label}
                </SmartLink>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
