import { cn } from '@/lib/utils';
import { Container, Section } from './layout';
import { Reveal } from './reveal';

/**
 * @kit name: Stats
 * @kit group: layout
 * @kit use: A row of big numbers with labels (customers, uptime, countries). Use real figures from the brief; never invent them.
 * @kit props: items [{ value, label }], tone ('default'|'muted'|'inverse')
 * @kit example: <Stats items={[{ value: '12k', label: 'teams' }, { value: '99.9%', label: 'uptime' }]} />
 */
export function Stats({
  items,
  tone = 'default',
  className
}: {
  items: { value: string; label: string }[];
  tone?: 'default' | 'muted' | 'inverse';
  className?: string;
}) {
  return (
    <Section tone={tone} pad="sm" className={className}>
      <Container>
        <dl
          className={cn(
            'grid gap-8 text-center',
            items.length === 3 ? 'sm:grid-cols-3' : 'grid-cols-2 lg:grid-cols-4'
          )}
        >
          {items.map((item, i) => (
            <Reveal key={item.label} delay={i * 80}>
              <dd className="font-heading text-4xl font-semibold sm:text-5xl">{item.value}</dd>
              <dt
                className={cn(
                  'mt-2 text-sm',
                  tone === 'inverse' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                )}
              >
                {item.label}
              </dt>
            </Reveal>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
