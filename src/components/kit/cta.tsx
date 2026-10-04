import type { ReactNode } from 'react';
import { Container, Section } from './layout';
import { SmartLink } from './link';
import { Reveal } from './reveal';

/**
 * @kit name: CTA
 * @kit group: layout
 * @kit use: A closing call-to-action band: one headline, one sentence and a button, on the primary colour. Put it just above the Footer.
 * @kit props: title, description, primary { label, href }, secondary { label, href }
 * @kit example: <CTA title="Ready to start?" primary={{ label: 'Create your account', href: '#' }} />
 */
export function CTA({
  title,
  description,
  primary,
  secondary,
  id
}: {
  title: ReactNode;
  description?: ReactNode;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  id?: string;
}) {
  return (
    <Section id={id} pad="sm">
      <Container>
        <Reveal>
          <div className="bg-primary text-primary-foreground rounded-3xl px-6 py-14 text-center sm:px-12 sm:py-20">
            <h2 className="font-heading mx-auto max-w-2xl text-3xl font-semibold sm:text-5xl">
              {title}
            </h2>
            {description ? (
              <p className="text-primary-foreground/75 mx-auto mt-4 max-w-xl text-base sm:text-lg">
                {description}
              </p>
            ) : null}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <SmartLink
                href={primary.href}
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 inline-flex h-11 items-center rounded-lg px-6 text-sm font-medium transition-colors"
              >
                {primary.label}
              </SmartLink>
              {secondary ? (
                <SmartLink
                  href={secondary.href}
                  className="border-primary-foreground/30 hover:bg-primary-foreground/10 inline-flex h-11 items-center rounded-lg border px-6 text-sm font-medium transition-colors"
                >
                  {secondary.label}
                </SmartLink>
              ) : null}
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
