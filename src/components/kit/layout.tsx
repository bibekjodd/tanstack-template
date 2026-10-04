import { cn } from '@/lib/utils';
import type { ComponentProps, ReactNode } from 'react';

/**
 * @kit name: Container, Section, SectionHeading
 * @kit group: layout
 * @kit use: The page frame every section sits in: a centred width with side padding, a vertical band with consistent spacing and an optional tone, and a heading block (eyebrow, title, description). Build a page by stacking Sections.
 * @kit props: Container { size: 'narrow'|'default'|'wide' }, Section { id, tone: 'default'|'muted'|'inverse', pad: 'sm'|'md'|'lg' }, SectionHeading { eyebrow, title, description, align: 'left'|'center' }
 * @kit example: <Section id="features" tone="muted"><Container><SectionHeading eyebrow="Features" title="Everything you need" align="center" /></Container></Section>
 */
const SIZES = { narrow: 'max-w-3xl', default: 'max-w-6xl', wide: 'max-w-7xl' } as const;

export function Container({
  size = 'default',
  className,
  ...props
}: ComponentProps<'div'> & { size?: keyof typeof SIZES }) {
  return <div className={cn('mx-auto w-full px-5 sm:px-8', SIZES[size], className)} {...props} />;
}

const TONES = {
  default: '',
  muted: 'bg-muted/60',
  inverse: 'bg-primary text-primary-foreground'
} as const;
const PADS = { sm: 'py-12 sm:py-16', md: 'py-16 sm:py-24', lg: 'py-24 sm:py-32' } as const;

export function Section({
  tone = 'default',
  pad = 'md',
  className,
  ...props
}: ComponentProps<'section'> & { tone?: keyof typeof TONES; pad?: keyof typeof PADS }) {
  return <section className={cn(TONES[tone], PADS[pad], className)} {...props} />;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'mb-10 max-w-2xl sm:mb-14',
        align === 'center' && 'mx-auto text-center',
        className
      )}
    >
      {eyebrow ? (
        <p className="text-muted-foreground mb-3 font-mono text-xs tracking-widest uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-heading text-3xl font-semibold sm:text-4xl lg:text-5xl">{title}</h2>
      {description ? (
        <p className="text-muted-foreground mt-4 text-base sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
