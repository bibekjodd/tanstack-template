import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import type { ReactNode } from 'react';
import { Container, Section, SectionHeading } from './layout';

/**
 * @kit name: FAQ
 * @kit group: layout
 * @kit use: Questions and answers in an accordion; the first opens by default so the section never looks empty. Keep answers short and specific to the business.
 * @kit props: items [{ question, answer }], eyebrow, title, description
 * @kit example: <FAQ title="Questions" items={[{ question: 'Is there a free plan?', answer: 'Yes, for one project.' }]} />
 */
export function FAQ({
  eyebrow,
  title,
  description,
  items,
  id
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  items: { question: string; answer: ReactNode }[];
  id?: string;
}) {
  return (
    <Section id={id}>
      <Container size="narrow">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} align="center" />
        <Accordion
          defaultValue={items[0] ? [items[0].question] : []}
          className="border-border divide-border rounded-2xl border px-5"
        >
          {items.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger className="py-4 text-base">{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </Section>
  );
}
