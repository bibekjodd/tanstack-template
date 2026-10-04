/**
 * @kit name: BorderBeam
 * @kit group: cards
 * @kit use: A light beam that travels around the border of its relatively positioned parent; drop it inside any rounded card or input to add motion.
 * @kit props: size (50), duration (6), delay (0), colorFrom ('var(--chart-1)'), colorTo ('var(--chart-2)'), borderWidth (1), reverse (false), initialOffset (0)
 * @kit example: <div className="relative rounded-xl border p-6">Content<BorderBeam size={120} duration={8} /></div>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/border-beam
 */
import { cn } from '@/lib/utils';
import { motion, useReducedMotion, type MotionStyle, type Transition } from 'motion/react';

interface BorderBeamProps {
  /** The size of the border beam. */
  size?: number;
  /** The duration of the border beam. */
  duration?: number;
  /** The delay of the border beam. */
  delay?: number;
  /** The color of the border beam from. */
  colorFrom?: string;
  /** The color of the border beam to. */
  colorTo?: string;
  /** The motion transition of the border beam. */
  transition?: Transition;
  /** The class name of the border beam. */
  className?: string;
  /** The style of the border beam. */
  style?: React.CSSProperties;
  /** Whether to reverse the animation direction. */
  reverse?: boolean;
  /** The initial offset position (0-100). */
  initialOffset?: number;
  /** The border width of the beam. */
  borderWidth?: number;
}

export const BorderBeam = ({
  className,
  size = 50,
  delay = 0,
  duration = 6,
  colorFrom = 'var(--chart-1)',
  colorTo = 'var(--chart-2)',
  transition,
  style,
  reverse = false,
  initialOffset = 0,
  borderWidth = 1
}: BorderBeamProps) => {
  const reducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[inherit] border-(length:--border-beam-width) border-transparent mask-[linear-gradient(transparent,transparent),linear-gradient(var(--foreground),var(--foreground))] mask-intersect [mask-clip:padding-box,border-box]"
      style={
        {
          '--border-beam-width': `${borderWidth}px`
        } as React.CSSProperties
      }
    >
      <motion.div
        className={cn(
          'absolute aspect-square',
          'bg-linear-to-l from-(--color-from) via-(--color-to) to-transparent',
          className
        )}
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            '--color-from': colorFrom,
            '--color-to': colorTo,
            ...style
          } as MotionStyle
        }
        initial={{ offsetDistance: `${initialOffset}%` }}
        animate={
          reducedMotion
            ? { offsetDistance: `${initialOffset}%` }
            : {
                offsetDistance: reverse
                  ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
                  : [`${initialOffset}%`, `${100 + initialOffset}%`]
              }
        }
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration,
          delay: -delay,
          ...transition
        }}
      />
    </div>
  );
};
