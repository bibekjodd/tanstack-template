/**
 * @kit name: StripedPattern
 * @kit group: backgrounds
 * @kit use: Diagonal hairline stripes as an SVG fill; choose it for a subtle hatched backdrop or to mark an empty or disabled area.
 * @kit props: direction="left"|"right" (default "left"), width=10, height=10, className (colour follows text colour)
 * @kit example: <StripedPattern className="text-foreground/15 mask-[linear-gradient(to_bottom,var(--foreground),transparent)]" />
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/striped-pattern
 */
import { cn } from '@/lib/utils';
import { useId } from 'react';

interface StripedPatternProps extends React.SVGProps<SVGSVGElement> {
  direction?: 'left' | 'right';
}

export function StripedPattern({
  direction = 'left',
  className,
  width = 10,
  height = 10,
  ...props
}: StripedPatternProps) {
  const id = useId();
  const w = Number(width);
  const h = Number(height);

  return (
    <svg
      aria-hidden="true"
      className={cn(
        'text-foreground/20 pointer-events-none absolute inset-0 z-10 h-full w-full stroke-[0.5]',
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <pattern id={id} width={w} height={h} patternUnits="userSpaceOnUse">
          {direction === 'left' ? (
            <>
              <line x1="0" y1={h} x2={w} y2="0" stroke="currentColor" />
              <line x1={-w} y1={h} x2="0" y2="0" stroke="currentColor" />
              <line x1={w} y1={h} x2={w * 2} y2="0" stroke="currentColor" />
            </>
          ) : (
            <>
              <line x1="0" y1="0" x2={w} y2={h} stroke="currentColor" />
              <line x1={-w} y1="0" x2="0" y2={h} stroke="currentColor" />
              <line x1={w} y1="0" x2={w * 2} y2={h} stroke="currentColor" />
            </>
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
