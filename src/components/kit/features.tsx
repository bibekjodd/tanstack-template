import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Container, Section, SectionHeading } from './layout';
import { Reveal } from './reveal';

/**
 * @kit name: FeatureGrid, FeatureRows
 * @kit group: layout
 * @kit use: Explain what the product does. FeatureGrid: a grid of icon cards (3 columns on desktop, 1 on a phone). FeatureRows: alternating text and visual rows for the two or three features that deserve a picture. Reveal on scroll is built in.
 * @kit props: FeatureGrid { eyebrow, title, description, items [{ icon, title, description }], columns: 2|3|4 }, FeatureRows { items [{ title, description, bullets, media }], eyebrow, title, description }
 * @kit example: <FeatureGrid title="Everything in one place" items={[{ icon: Zap, title: 'Fast', description: 'Runs in seconds.' }]} />
 */
export type FeatureItem = { icon?: LucideIcon; title: string; description: string };

const COLUMNS = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4'
} as const;

export function FeatureGrid({
  eyebrow,
  title,
  description,
  items,
  columns = 3,
  id,
  className
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  items: FeatureItem[];
  columns?: keyof typeof COLUMNS;
  id?: string;
  className?: string;
}) {
  return (
    <Section id={id} className={className}>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <ul className={cn('grid gap-4 sm:gap-6', COLUMNS[columns])}>
          {items.map((item, i) => (
            <li key={item.title}>
              <Reveal delay={(i % 3) * 80} className="h-full">
                <div className="border-border bg-card hover:border-foreground/20 h-full rounded-2xl border p-6 transition-colors">
                  {item.icon ? (
                    <span className="bg-accent text-accent-foreground mb-5 inline-flex size-10 items-center justify-center rounded-xl">
                      <item.icon className="size-5" aria-hidden="true" />
                    </span>
                  ) : null}
                  <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

export type FeatureRow = {
  title: string;
  description: string;
  bullets?: string[];
  media: ReactNode;
};

export function FeatureRows({
  eyebrow,
  title,
  description,
  items,
  id,
  className
}: {
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  items: FeatureRow[];
  id?: string;
  className?: string;
}) {
  return (
    <Section id={id} className={className}>
      <Container>
        {title ? (
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        ) : null}
        <div className="flex flex-col gap-16 sm:gap-24">
          {items.map((item, i) => (
            <div key={item.title} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
              <Reveal className={cn(i % 2 === 1 && 'lg:order-2')}>
                <h3 className="font-heading text-2xl font-semibold sm:text-3xl">{item.title}</h3>
                <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                  {item.description}
                </p>
                {item.bullets ? (
                  <ul className="mt-6 space-y-2.5 text-sm">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span
                          className="bg-primary mt-2 size-1.5 shrink-0 rounded-full"
                          aria-hidden="true"
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Reveal>
              <Reveal delay={100}>{item.media}</Reveal>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
