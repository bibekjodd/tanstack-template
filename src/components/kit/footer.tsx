import type { ReactNode } from 'react';
import { SmartLink } from './link';

/**
 * @kit name: Footer
 * @kit group: layout
 * @kit use: The page foot: brand and one-line description, link columns, and a legal line. Link only to pages that exist; a link to a page you did not build goes to the real address or is left out.
 * @kit props: brand (node), description, columns [{ title, links [{ label, href }] }], legal (node), social (node)
 * @kit example: <Footer brand={<b>Plum</b>} columns={[{ title: 'Product', links: [{ label: 'Pricing', href: '#pricing' }] }]} legal="© 2027 Plum" />
 */
export function Footer({
  brand,
  description,
  columns,
  legal,
  social
}: {
  brand: ReactNode;
  description?: ReactNode;
  columns: { title: string; links: { label: string; href: string }[] }[];
  legal?: ReactNode;
  social?: ReactNode;
}) {
  return (
    <footer className="border-border bg-muted/40 border-t">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="mb-3">{brand}</div>
            {description ? (
              <p className="text-muted-foreground max-w-xs text-sm">{description}</p>
            ) : null}
            {social ? <div className="mt-5">{social}</div> : null}
          </div>
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="mb-4 text-sm font-semibold">{column.title}</h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <SmartLink
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground inline-block py-1.5 text-sm transition-colors"
                    >
                      {link.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        {legal ? (
          <div className="border-border text-muted-foreground mt-12 border-t pt-6 text-sm">
            {legal}
          </div>
        ) : null}
      </div>
    </footer>
  );
}
