import type { ReactNode } from 'react';
import { Container, Section, SectionHeading } from './layout';
import { Reveal } from './reveal';

/**
 * @kit name: Testimonials
 * @kit group: layout
 * @kit use: Customer quotes in a grid. Use quotes the user supplied or that came from a source you fetched; do not invent named customers. With no real quotes, leave the section out.
 * @kit props: items [{ quote, name, role, avatar }], eyebrow, title, description
 * @kit example: <Testimonials title="Loved by teams" items={[{ quote: 'It just works.', name: 'Ada', role: 'CTO, Acme' }]} />
 */
export type Testimonial = { quote: string; name: string; role?: string; avatar?: string };

export function Testimonials({
  eyebrow,
  title,
  description,
  items,
  id
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  items: Testimonial[];
  id?: string;
}) {
  return (
    <Section id={id}>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <li key={item.name + item.quote.slice(0, 12)}>
              <Reveal delay={(i % 3) * 80} className="h-full">
                <figure className="border-border bg-card flex h-full flex-col justify-between gap-6 rounded-2xl border p-6">
                  <blockquote className="text-base leading-relaxed">“{item.quote}”</blockquote>
                  <figcaption className="flex items-center gap-3">
                    {item.avatar ? (
                      <img
                        src={item.avatar}
                        alt=""
                        width={40}
                        height={40}
                        loading="lazy"
                        className="size-10 rounded-full object-cover"
                      />
                    ) : (
                      <span
                        className="bg-accent text-accent-foreground flex size-10 items-center justify-center rounded-full text-sm font-semibold"
                        aria-hidden="true"
                      >
                        {item.name.slice(0, 1)}
                      </span>
                    )}
                    <span>
                      <span className="block text-sm font-medium">{item.name}</span>
                      {item.role ? (
                        <span className="text-muted-foreground block text-xs">{item.role}</span>
                      ) : null}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
