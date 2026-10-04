/**
 * @kit name: InteractiveGridPattern
 * @kit group: backgrounds
 * @kit use: A grid of squares that light up under the cursor and fade out slowly; choose it for a playful, reactive hero backdrop.
 * @kit props: width=40, height=40, squares=[24, 24] ([columns, rows]), className, squaresClassName
 * @kit example: <InteractiveGridPattern className="mask-[radial-gradient(400px_circle_at_center,var(--foreground),transparent)]" />
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/interactive-grid-pattern
 */
import { cn } from '@/lib/utils';
import { useState } from 'react';

/**
 * InteractiveGridPattern renders a grid pattern with interactive squares.
 *
 * @param width - The width of each square.
 * @param height - The height of each square.
 * @param squares - The number of squares in the grid: [horizontal, vertical].
 * @param className - The class name of the grid.
 * @param squaresClassName - The class name of the squares.
 */
interface InteractiveGridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  squares?: [number, number]; // [horizontal, vertical]
  className?: string;
  squaresClassName?: string;
}

export function InteractiveGridPattern({
  width = 40,
  height = 40,
  squares = [24, 24],
  className,
  squaresClassName,
  ...props
}: InteractiveGridPatternProps) {
  const [horizontal, vertical] = squares;
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null);

  return (
    <svg
      aria-hidden="true"
      width={width * horizontal}
      height={height * vertical}
      className={cn('border-foreground/15 absolute inset-0 h-full w-full border', className)}
      {...props}
    >
      {Array.from({ length: horizontal * vertical }).map((_, index) => {
        const x = (index % horizontal) * width;
        const y = Math.floor(index / horizontal) * height;
        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={width}
            height={height}
            className={cn(
              'stroke-foreground/15 transition-all duration-100 ease-in-out not-[&:hover]:duration-1000',
              hoveredSquare === index ? 'fill-foreground/15' : 'fill-transparent',
              squaresClassName
            )}
            onMouseEnter={() => setHoveredSquare(index)}
            onMouseLeave={() => setHoveredSquare(null)}
          />
        );
      })}
    </svg>
  );
}
