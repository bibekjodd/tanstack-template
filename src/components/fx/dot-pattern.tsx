/**
 * @kit name: DotPattern
 * @kit group: backgrounds
 * @kit use: A field of dots that fills its container, optionally twinkling; choose it for a soft dotted backdrop behind a hero or section.
 * @kit props: width=16, height=16 (spacing), x=0, y=0, cx=1, cy=1, cr=1 (dot radius), glow=false, className (dot colour follows text colour)
 * @kit example: <DotPattern glow className="mask-[radial-gradient(400px_circle_at_center,var(--foreground),transparent)]" />
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/dot-pattern
 */
import { cn } from '@/lib/utils';
import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useId, useRef, useState } from 'react';

/**
 * DotPattern props
 *
 * @param {number} [width=16] - The horizontal spacing between dots
 * @param {number} [height=16] - The vertical spacing between dots
 * @param {number} [x=0] - The x-offset of the entire pattern
 * @param {number} [y=0] - The y-offset of the entire pattern
 * @param {number} [cx=1] - The x-offset of individual dots
 * @param {number} [cy=1] - The y-offset of individual dots
 * @param {number} [cr=1] - The radius of each dot
 * @param {string} [className] - Additional CSS classes to apply to the SVG container
 * @param {boolean} [glow=false] - Whether dots should have a glowing animation effect
 */
interface DotPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  cr?: number;
  className?: string;
  glow?: boolean;
  [key: string]: unknown;
}

/**
 * A dot pattern background in SVG. It fills its container, follows size changes, and with
 * `glow` the dots pulse with random delays and durations (not when reduced motion is requested).
 * The dot colour is the text colour, so set it with a `text-*` class.
 */
export function DotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  glow = false,
  ...props
}: DotPatternProps) {
  const id = useId();
  const containerRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const reducedMotion = useReducedMotion();
  const animate = glow && !reducedMotion;

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const dots = Array.from(
    {
      length: Math.ceil(dimensions.width / width) * Math.ceil(dimensions.height / height)
    },
    (_, i) => {
      const col = i % Math.ceil(dimensions.width / width);
      const row = Math.floor(i / Math.ceil(dimensions.width / width));
      return {
        x: col * width + cx + x,
        y: row * height + cy + y,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2
      };
    }
  );

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        'text-muted-foreground/60 pointer-events-none absolute inset-0 h-full w-full',
        className
      )}
      {...props}
    >
      <defs>
        <radialGradient id={`${id}-gradient`}>
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      {dots.map((dot) => (
        <motion.circle
          key={`${dot.x}-${dot.y}`}
          cx={dot.x}
          cy={dot.y}
          r={cr}
          fill={glow ? `url(#${id}-gradient)` : 'currentColor'}
          initial={animate ? { opacity: 0.4, scale: 1 } : {}}
          animate={
            animate
              ? {
                  opacity: [0.4, 1, 0.4],
                  scale: [1, 1.5, 1]
                }
              : {}
          }
          transition={
            animate
              ? {
                  duration: dot.duration,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: dot.delay,
                  ease: 'easeInOut'
                }
              : {}
          }
        />
      ))}
    </svg>
  );
}
