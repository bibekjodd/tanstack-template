import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { SmartLink } from './link';

/**
 * @kit name: Navbar
 * @kit group: layout
 * @kit use: A sticky top bar with a brand, links, an optional call-to-action and a mobile menu that opens below it. Anchor links ("#pricing") scroll smoothly and clear the bar; page links ("/about") use the router.
 * @kit props: brand (node), links [{ label, href }], cta { label, href }, actions (node, e.g. a theme toggle), transparent (no background until scrolled is not needed: it is solid by default)
 * @kit example: <Navbar brand={<span className="font-heading font-semibold">Plum</span>} links={[{ label: 'Features', href: '#features' }]} cta={{ label: 'Start free', href: '#pricing' }} />
 */
export type NavLink = { label: string; href: string };

export function Navbar({
  brand,
  links,
  cta,
  actions,
  className
}: {
  brand: ReactNode;
  links: NavLink[];
  cta?: NavLink;
  actions?: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <header
      className={cn(
        'border-border bg-background/85 sticky top-0 z-40 border-b backdrop-blur-md',
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <SmartLink
          href="/"
          className="flex min-h-10 items-center gap-2"
          onClick={() => setOpen(false)}
        >
          {brand}
        </SmartLink>
        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <SmartLink
              key={link.href + link.label}
              href={link.href}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {link.label}
            </SmartLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {actions}
          {cta ? (
            <SmartLink
              href={cta.href}
              className="bg-primary text-primary-foreground hover:bg-primary/90 hidden h-9 items-center rounded-lg px-4 text-sm font-medium transition-colors sm:inline-flex"
            >
              {cta.label}
            </SmartLink>
          ) : null}
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="hover:bg-muted inline-flex size-10 items-center justify-center rounded-lg md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-border bg-background border-t px-5 py-4 md:hidden"
        >
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href + link.label}>
                <SmartLink
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="hover:bg-muted block rounded-lg px-3 py-3 text-base"
                >
                  {link.label}
                </SmartLink>
              </li>
            ))}
            {cta ? (
              <li className="pt-2">
                <SmartLink
                  href={cta.href}
                  onClick={() => setOpen(false)}
                  className="bg-primary text-primary-foreground flex h-11 items-center justify-center rounded-lg text-base font-medium"
                >
                  {cta.label}
                </SmartLink>
              </li>
            ) : null}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
