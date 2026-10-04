/**
 * @kit name: OrbitingCircles
 * @kit group: motion
 * @kit use: Icons or badges that orbit a centre point along a circular path; put it in a relatively positioned square and place a hero element in the middle.
 * @kit props: radius (160), duration (20, seconds), speed (1), reverse (false), path (true), iconSize (30), delay (0), children (the orbiting items)
 * @kit example: <div className="relative size-96"><OrbitingCircles radius={120}><Icon /><Icon /></OrbitingCircles></div>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/orbiting-circles
 */
import { cn } from '@/lib/utils';
import React from 'react';

export interface OrbitingCirclesProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  iconSize?: number;
  speed?: number;
}

export function OrbitingCircles({
  className,
  children,
  reverse,
  duration = 20,
  delay = 0,
  radius = 160,
  path = true,
  iconSize = 30,
  speed = 1,
  style,
  ...props
}: OrbitingCirclesProps) {
  const calculatedDuration = duration / speed;
  const count = React.Children.count(children);
  return (
    <>
      {path && (
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <circle
            className="stroke-foreground/10 stroke-1"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
          />
        </svg>
      )}
      {React.Children.map(children, (child, index) => {
        const angle = (360 / count) * index;
        return (
          <div
            style={
              {
                '--duration': calculatedDuration,
                '--radius': radius,
                '--angle': angle,
                '--icon-size': `${iconSize}px`,
                animationDelay: delay ? `${-delay}s` : undefined,
                ...style
              } as React.CSSProperties
            }
            className={cn(
              // inset-0 + m-auto centres each icon in the nearest relative box, so the orbit turns around the
              // middle of it without the parent having to be a flex container.
              'kit-orbit absolute inset-0 m-auto flex size-(--icon-size) transform-gpu items-center justify-center rounded-full',
              { '[animation-direction:reverse]': reverse },
              className
            )}
            {...props}
          >
            {child}
          </div>
        );
      })}
    </>
  );
}
