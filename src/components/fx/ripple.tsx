/**
 * @kit name: Ripple
 * @kit group: backgrounds
 * @kit use: Concentric circles that gently pulse outward from the centre and fade toward the bottom; choose it as a calm hero or call-to-action backdrop.
 * @kit props: mainCircleSize=210, mainCircleOpacity=0.24, numCircles=8, className
 * @kit example: <div className="relative h-96 overflow-hidden"><Ripple /></div>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/ripple
 */
import { cn } from '@/lib/utils';
import React, { type ComponentPropsWithoutRef, type CSSProperties } from 'react';

interface RippleProps extends ComponentPropsWithoutRef<'div'> {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
}

export const Ripple = React.memo(function Ripple({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 8,
  className,
  ...props
}: RippleProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 mask-[linear-gradient(to_bottom,var(--foreground),transparent)] select-none',
        className
      )}
      {...props}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70;
        const opacity = mainCircleOpacity - i * 0.03;
        const animationDelay = `${i * 0.06}s`;
        const borderStyle = 'solid';

        return (
          <div
            key={i}
            className="kit-ripple bg-foreground/25 absolute rounded-full border shadow-xl"
            style={
              {
                '--i': i,
                width: `${size}px`,
                height: `${size}px`,
                opacity,
                animationDelay,
                borderStyle,
                borderWidth: '1px',
                borderColor: 'var(--foreground)',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) scale(1)'
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
});

Ripple.displayName = 'Ripple';
