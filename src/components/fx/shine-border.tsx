/**
 * @kit name: ShineBorder
 * @kit group: cards
 * @kit use: An animated shimmering border that fills a relatively positioned parent; use it to frame cards, forms or callouts.
 * @kit props: borderWidth (1), duration (14, seconds), shineColor ('var(--primary)', string or array of colours)
 * @kit example: <div className="relative rounded-xl p-6">Content<ShineBorder shineColor={['var(--chart-1)', 'var(--chart-2)']} /></div>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/shine-border
 */
import { cn } from '@/lib/utils';
import * as React from 'react';

interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width of the border in pixels */
  borderWidth?: number;
  /** Duration of the animation in seconds */
  duration?: number;
  /** Color of the border, can be a single color or an array of colors */
  shineColor?: string | string[];
}

/**
 * Shine Border
 *
 * An animated background border effect component with configurable properties.
 */
export function ShineBorder({
  borderWidth = 1,
  duration = 14,
  shineColor = 'var(--primary)',
  className,
  style,
  ...props
}: ShineBorderProps) {
  return (
    <div
      aria-hidden="true"
      style={
        {
          '--border-width': `${borderWidth}px`,
          '--duration': `${duration}s`,
          backgroundImage: `radial-gradient(transparent,transparent, ${
            Array.isArray(shineColor) ? shineColor.join(',') : shineColor
          },transparent,transparent)`,
          backgroundSize: '300% 300%',
          mask: `linear-gradient(var(--foreground) 0 0) content-box, linear-gradient(var(--foreground) 0 0)`,
          WebkitMask: `linear-gradient(var(--foreground) 0 0) content-box, linear-gradient(var(--foreground) 0 0)`,
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: 'var(--border-width)',
          ...style
        } as React.CSSProperties
      }
      className={cn(
        'kit-shine-border pointer-events-none absolute inset-0 size-full rounded-[inherit] will-change-[background-position]',
        className
      )}
      {...props}
    />
  );
}
