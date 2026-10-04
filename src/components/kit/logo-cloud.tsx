import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

/**
 * @kit name: LogoCloud
 * @kit group: layout
 * @kit use: "Trusted by" strip of customer or partner names or logos, quiet and evenly spaced. For a moving strip use the Marquee in src/components/fx/marquee.tsx.
 * @kit props: title (node), logos [{ name, src, href }] (without src the name is set as text)
 * @kit example: <LogoCloud title="Trusted by teams at" logos={[{ name: 'Acme' }, { name: 'Globex' }]} />
 */
export function LogoCloud({
  title,
  logos,
  className
}: {
  title?: ReactNode;
  logos: { name: string; src?: string }[];
  className?: string;
}) {
  return (
    <div className={cn('mx-auto max-w-6xl px-5 py-10 sm:px-8', className)}>
      {title ? <p className="text-muted-foreground mb-6 text-center text-sm">{title}</p> : null}
      <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
        {logos.map((logo) => (
          <li key={logo.name} className="text-muted-foreground/80 flex h-8 items-center">
            {logo.src ? (
              <img
                src={logo.src}
                alt={logo.name}
                width={120}
                height={32}
                loading="lazy"
                className="h-6 w-auto opacity-70 grayscale"
              />
            ) : (
              <span className="font-heading text-lg font-semibold tracking-tight">{logo.name}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
