/**
 * @kit name: Marquee
 * @kit group: layout
 * @kit use: An endless scrolling strip of any content, horizontal or vertical; use for logo walls, testimonials and tag rows. Pauses on hover when asked, and under reduced motion it stops and shows the content once.
 * @kit props: reverse (false), pauseOnHover (false), vertical (false), repeat (4), className ([--duration:40s] [--gap:1rem] can be overridden)
 * @kit example: <Marquee pauseOnHover className="[--duration:30s]">{logos}</Marquee>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/marquee
 */
import { cn } from '@/lib/utils';
import { type ComponentPropsWithoutRef } from 'react';

interface MarqueeProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Optional CSS class name to apply custom styles
   */
  className?: string;
  /**
   * Whether to reverse the animation direction
   * @default false
   */
  reverse?: boolean;
  /**
   * Whether to pause the animation on hover
   * @default false
   */
  pauseOnHover?: boolean;
  /**
   * Content to be displayed in the marquee
   */
  children: React.ReactNode;
  /**
   * Whether to animate vertically instead of horizontally
   * @default false
   */
  vertical?: boolean;
  /**
   * Number of times to repeat the content
   * @default 4
   */
  repeat?: number;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        'kit-marquee flex gap-(--gap) overflow-hidden p-2 [--duration:40s] [--gap:1rem]',
        pauseOnHover && 'kit-marquee-pausable',
        vertical ? 'flex-col' : 'flex-row',
        className
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            aria-hidden={i > 0 ? true : undefined}
            className={cn(
              'kit-marquee-track flex shrink-0 justify-around gap-(--gap)',
              vertical ? 'kit-marquee-track-vertical flex-col' : 'flex-row',
              reverse && 'kit-marquee-track-reverse'
            )}
          >
            {children}
          </div>
        ))}
    </div>
  );
}
