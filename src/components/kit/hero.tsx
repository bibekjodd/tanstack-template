import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { SmartLink } from './link';
import { Enter } from './reveal';

/**
 * @kit name: HeroCentered, HeroSplit
 * @kit group: layout
 * @kit use: The top of a landing page. HeroCentered: a centred headline, subhead and two buttons, with a wide visual below. HeroSplit: text on one side and a visual on the other (stacks on a phone). Both enter on load with CSS only, so the headline is never invisible. Put an fx background behind them for atmosphere.
 * @kit props: eyebrow (node), title (node), description (node), primary { label, href }, secondary { label, href }, media (node), note (small text under the buttons), reverse (HeroSplit: media on the left)
 * @kit example: <HeroCentered eyebrow="New" title="Payroll, sorted." description="Pay your people on time." primary={{ label: 'Start free', href: '#pricing' }} media={<Photo .../>} />
 */
type Cta = { label: string; href: string };

type HeroProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  primary?: Cta;
  secondary?: Cta;
  note?: ReactNode;
  media?: ReactNode;
  className?: string;
};

function Buttons({
  primary,
  secondary,
  centered
}: {
  primary?: Cta;
  secondary?: Cta;
  centered?: boolean;
}) {
  if (!primary && !secondary) return null;
  return (
    <div className={cn('flex flex-wrap gap-3', centered && 'justify-center')}>
      {primary ? (
        <SmartLink
          href={primary.href}
          className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring/50 inline-flex h-11 items-center rounded-lg px-6 text-sm font-medium transition-colors outline-none focus-visible:ring-3"
        >
          {primary.label}
        </SmartLink>
      ) : null}
      {secondary ? (
        <SmartLink
          href={secondary.href}
          className="border-border hover:bg-muted focus-visible:ring-ring/50 inline-flex h-11 items-center rounded-lg border px-6 text-sm font-medium transition-colors outline-none focus-visible:ring-3"
        >
          {secondary.label}
        </SmartLink>
      ) : null}
    </div>
  );
}

export function HeroCentered({
  eyebrow,
  title,
  description,
  primary,
  secondary,
  note,
  media,
  className
}: HeroProps) {
  return (
    <section className={cn('relative overflow-hidden pt-16 pb-12 sm:pt-24 sm:pb-20', className)}>
      <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
        <div className="mx-auto max-w-3xl">
          {eyebrow ? (
            <Enter>
              <p className="border-border bg-surface text-muted-foreground mx-auto mb-6 inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium">
                {eyebrow}
              </p>
            </Enter>
          ) : null}
          <Enter delay={80}>
            <h1 className="font-heading text-4xl font-semibold sm:text-6xl lg:text-7xl">{title}</h1>
          </Enter>
          {description ? (
            <Enter delay={160}>
              <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-base sm:text-xl">
                {description}
              </p>
            </Enter>
          ) : null}
          <Enter delay={240} className="mt-9">
            <Buttons primary={primary} secondary={secondary} centered />
            {note ? <p className="text-muted-foreground mt-4 text-sm">{note}</p> : null}
          </Enter>
        </div>
        {media ? (
          <Enter delay={340} y={28} className="mx-auto mt-14 max-w-5xl sm:mt-20">
            {media}
          </Enter>
        ) : null}
      </div>
    </section>
  );
}

export function HeroSplit({
  eyebrow,
  title,
  description,
  primary,
  secondary,
  note,
  media,
  reverse = false,
  className
}: HeroProps & { reverse?: boolean }) {
  return (
    <section className={cn('relative overflow-hidden py-14 sm:py-24', className)}>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <div className={cn(reverse && 'lg:order-2')}>
          {eyebrow ? (
            <Enter>
              <p className="border-border bg-surface text-muted-foreground mb-6 inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium">
                {eyebrow}
              </p>
            </Enter>
          ) : null}
          <Enter delay={80}>
            <h1 className="font-heading text-4xl font-semibold sm:text-5xl lg:text-6xl">{title}</h1>
          </Enter>
          {description ? (
            <Enter delay={160}>
              <p className="text-muted-foreground mt-6 max-w-xl text-base sm:text-lg">
                {description}
              </p>
            </Enter>
          ) : null}
          <Enter delay={240} className="mt-8">
            <Buttons primary={primary} secondary={secondary} />
            {note ? <p className="text-muted-foreground mt-4 text-sm">{note}</p> : null}
          </Enter>
        </div>
        {media ? (
          <Enter delay={200} y={28}>
            {media}
          </Enter>
        ) : null}
      </div>
    </section>
  );
}
