import { cn } from '@/lib/utils';
import {
  type CSSProperties,
  type ElementType,
  type ReactNode,
  useEffect,
  useRef,
  useState
} from 'react';

/**
 * @kit name: Reveal
 * @kit group: motion
 * @kit use: Fade and rise into view as the visitor scrolls to it. Visible in the server HTML and without JavaScript; only content below the fold is hidden, and only after the page has hydrated.
 * @kit props: delay (ms, for staggering), y (px), as (element), once
 * @kit example: <Reveal delay={i * 80}><Card /></Reveal>
 */
export function Reveal({
  as,
  delay = 0,
  y = 18,
  once = true,
  className,
  children
}: {
  as?: ElementType;
  delay?: number;
  y?: number;
  once?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const Tag = as ?? 'div';
  const ref = useRef<HTMLElement>(null);
  // "visible" until the client has looked at where the element is: the server render, a visitor
  // without JavaScript, and a page that is slow to hydrate all see the content.
  const [state, setState] = useState<'visible' | 'hidden' | 'shown'>('visible');

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Already on screen: leave it alone, so nothing flashes.
    if (element.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    setState('hidden');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setState('shown');
          if (once) observer.disconnect();
        } else if (!once) {
          setState('hidden');
        }
      },
      { rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      data-reveal={state}
      style={{ '--kit-delay': `${delay}ms`, '--kit-y': `${y}px` } as CSSProperties}
      className={cn('kit-reveal', className)}
    >
      {children}
    </Tag>
  );
}

/**
 * @kit name: Enter
 * @kit group: motion
 * @kit use: Fade and rise on page load for content at the top of the page (hero headline, buttons). Pure CSS, so it runs at first paint and cannot leave content invisible if scripts are slow.
 * @kit props: delay (ms, for staggering), y (px), as (element)
 * @kit example: <Enter delay={120}><h1>Headline</h1></Enter>
 */
export function Enter({
  as,
  delay = 0,
  y = 18,
  className,
  children
}: {
  as?: ElementType;
  delay?: number;
  y?: number;
  className?: string;
  children: ReactNode;
}) {
  const Tag = as ?? 'div';
  return (
    <Tag
      style={{ '--kit-delay': `${delay}ms`, '--kit-y': `${y}px` } as CSSProperties}
      className={cn('kit-enter', className)}
    >
      {children}
    </Tag>
  );
}
