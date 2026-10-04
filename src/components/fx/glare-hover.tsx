/**
 * @kit name: GlareHover
 * @kit group: cards
 * @kit use: A wrapper that sweeps a diagonal glare across its content on hover; use it on image cards, logos or buttons for a glossy feel.
 * @kit props: width, height, background ('var(--scrim)'), color ('var(--on-scrim)'), opacity (0.5), angle (-45), size (250), duration (650, ms), playOnce (false)
 * @kit example: <GlareHover width="320px" height="200px" className="rounded-xl"><p className="text-on-scrim">Hover me</p></GlareHover>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/glare-hover
 */
import { cn } from '@/lib/utils';
import type { ComponentProps, CSSProperties } from 'react';

export interface GlareHoverProps extends ComponentProps<'div'> {
  /** Optional CSS width on the root element (e.g. `"100%"`, `"320px"`). */
  width?: string;
  /** Optional CSS height on the root element (e.g. `"auto"`, `"200px"`). */
  height?: string;
  /** Background of the wrapper (any CSS colour or `var(--token)`). */
  background?: string;
  /** Glare highlight colour (any CSS colour or `var(--token)`); mixed with `opacity`. */
  color?: string;
  /** Opacity of the glare colour (0–1). */
  opacity?: number;
  /** Gradient angle in degrees (`--gh-angle`). */
  angle?: number;
  /** Glare tile size as a percentage of the element (`--gh-size`, `background-size`). */
  size?: number;
  /** Transition duration for the glare sweep in milliseconds (`--gh-duration`). */
  duration?: number;
  /** When `true`, the glare transition only runs on hover (no animation until pointer enters). */
  playOnce?: boolean;
}

function GlareHover({
  background = 'var(--scrim)',
  children,
  color = 'var(--on-scrim)',
  opacity = 0.5,
  angle = -45,
  size = 250,
  duration = 650,
  playOnce = false,
  className,
  style,
  width,
  height,
  ...props
}: GlareHoverProps) {
  const percent = Math.round(Math.min(Math.max(opacity, 0), 1) * 100);

  const cssVars = {
    '--gh-angle': `${angle}deg`,
    '--gh-duration': `${duration}ms`,
    '--gh-size': `${size}%`,
    '--gh-rgba': `color-mix(in oklab, ${color} ${percent}%, transparent)`,
    background,
    ...style,
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {})
  } as CSSProperties;

  return (
    <div
      {...props}
      className={cn(
        'relative grid size-fit cursor-pointer place-items-center overflow-hidden bg-transparent',
        // BEFORE ELEMENT
        "before:pointer-events-none before:absolute before:inset-0 before:z-10 before:bg-no-repeat before:content-['']",
        // GRADIENT
        'before:[background-image:linear-gradient(var(--gh-angle),transparent_60%,var(--gh-rgba)_70%,transparent,transparent_100%)]',
        // SIZE + POSITION
        'before:[background-size:var(--gh-size)_var(--gh-size),100%_100%]',
        'before:[background-position:-100%_-100%,0_0]',
        // TRANSITION
        !playOnce &&
          'before:transition-[background-position] before:duration-[var(--gh-duration)] before:ease-in-out motion-reduce:before:transition-none',
        playOnce &&
          'before:transition-none hover:before:transition-[background-position] hover:before:duration-[var(--gh-duration)] motion-reduce:hover:before:transition-none',
        // HOVER EFFECT
        'hover:before:[background-position:100%_100%,0_0]',
        className
      )}
      style={cssVars}
    >
      {children}
    </div>
  );
}

export { GlareHover };
