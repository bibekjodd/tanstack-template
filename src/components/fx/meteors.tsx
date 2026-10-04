/**
 * @kit name: Meteors
 * @kit group: backgrounds
 * @kit use: Shooting-star streaks that fall diagonally across the nearest positioned parent; choose it for a night-sky or "launch" feel on a hero or card.
 * @kit props: number=20, minDelay=0.2, maxDelay=1.2, minDuration=2, maxDuration=10, angle=215, className
 * @kit example: <div className="relative h-96 overflow-hidden"><Meteors number={30} /></div>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/meteors
 */
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';

interface MeteorsProps {
  number?: number;
  minDelay?: number;
  maxDelay?: number;
  minDuration?: number;
  maxDuration?: number;
  angle?: number;
  className?: string;
}

export const Meteors = ({
  number = 20,
  minDelay = 0.2,
  maxDelay = 1.2,
  minDuration = 2,
  maxDuration = 10,
  angle = 215,
  className
}: MeteorsProps) => {
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>([]);

  useEffect(() => {
    const styles = [...new Array(number)].map(
      () =>
        ({
          '--angle': -angle + 'deg',
          top: '-5%',
          left: `calc(0% + ${Math.floor(Math.random() * window.innerWidth)}px)`,
          animationDelay: Math.random() * (maxDelay - minDelay) + minDelay + 's',
          animationDuration:
            Math.floor(Math.random() * (maxDuration - minDuration) + minDuration) + 's'
        }) as React.CSSProperties
    );
    setMeteorStyles(styles);
  }, [number, minDelay, maxDelay, minDuration, maxDuration, angle]);

  return (
    <>
      {meteorStyles.map((style, idx) => (
        // Meteor Head
        <span
          key={idx}
          aria-hidden="true"
          style={{ ...style }}
          className={cn(
            'kit-meteor bg-muted-foreground pointer-events-none absolute size-0.5 rotate-(--angle) rounded-full shadow-[0_0_0_1px_color-mix(in_oklab,var(--foreground)_10%,transparent)]',
            className
          )}
        >
          {/* Meteor Tail */}
          <div className="from-muted-foreground pointer-events-none absolute top-1/2 -z-10 h-px w-12.5 -translate-y-1/2 bg-linear-to-r to-transparent" />
        </span>
      ))}
    </>
  );
};
