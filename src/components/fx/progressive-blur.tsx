/**
 * @kit name: ProgressiveBlur
 * @kit group: backgrounds
 * @kit use: A blur that ramps up smoothly toward an edge of its parent using stacked backdrop-blur layers; choose it to fade scrolling content or an image into a header or footer.
 * @kit props: position="bottom"|"top"|"both" (default "bottom"), height="30%", blurLevels=[0.5,1,2,4,8,16,32,64] (px, 3 or more), className
 * @kit example: <div className="relative h-80 overflow-hidden"><img src="/cover.jpg" alt="" /><ProgressiveBlur position="bottom" height="40%" /></div>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/progressive-blur
 */
import { cn } from '@/lib/utils';
import React from 'react';

export interface ProgressiveBlurProps {
  className?: string;
  height?: string;
  position?: 'top' | 'bottom' | 'both';
  blurLevels?: number[];
  children?: React.ReactNode;
}

// Only the alpha of a mask matters, so the visible stop uses a token and the hidden one is transparent.
const SOLID = 'var(--foreground)';
const CLEAR = 'transparent';

const BOTH_MASK = `linear-gradient(${CLEAR} 0%, ${SOLID} 5%, ${SOLID} 95%, ${CLEAR} 100%)`;

// stops: [percent, visible] pairs, laid out from the blurred edge toward the clear side.
const maskFor = (position: ProgressiveBlurProps['position'], stops: Array<[number, boolean]>) => {
  if (position === 'both') return BOTH_MASK;
  const direction = position === 'top' ? 'to top' : 'to bottom';
  const list = stops.map(([percent, visible]) => `${visible ? SOLID : CLEAR} ${percent}%`);
  return `linear-gradient(${direction}, ${list.join(', ')})`;
};

export function ProgressiveBlur({
  className,
  height = '30%',
  position = 'bottom',
  blurLevels = [0.5, 1, 2, 4, 8, 16, 32, 64]
}: ProgressiveBlurProps) {
  // Create array with length equal to blurLevels.length - 2 (for the first and last layers)
  const divElements = Array(blurLevels.length - 2).fill(null);
  const first = maskFor(position, [
    [0, false],
    [12.5, true],
    [25, true],
    [37.5, false]
  ]);
  const last = maskFor(position, [
    [87.5, false],
    [100, true]
  ]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        'gradient-blur pointer-events-none absolute inset-x-0 z-10',
        className,
        position === 'top' ? 'top-0' : position === 'bottom' ? 'bottom-0' : 'inset-y-0'
      )}
      style={{
        height: position === 'both' ? '100%' : height
      }}
    >
      {/* First blur layer */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          backdropFilter: `blur(${blurLevels[0]}px)`,
          WebkitBackdropFilter: `blur(${blurLevels[0]}px)`,
          maskImage: first,
          WebkitMaskImage: first
        }}
      />

      {/* Middle blur layers */}
      {divElements.map((_, index) => {
        const blurIndex = index + 1;
        const startPercent = blurIndex * 12.5;
        const midPercent = (blurIndex + 1) * 12.5;
        const endPercent = (blurIndex + 2) * 12.5;

        const maskGradient = maskFor(position, [
          [startPercent, false],
          [midPercent, true],
          [endPercent, true],
          [endPercent + 12.5, false]
        ]);

        return (
          <div
            key={`blur-${index}`}
            className="absolute inset-0"
            style={{
              zIndex: index + 2,
              backdropFilter: `blur(${blurLevels[blurIndex]}px)`,
              WebkitBackdropFilter: `blur(${blurLevels[blurIndex]}px)`,
              maskImage: maskGradient,
              WebkitMaskImage: maskGradient
            }}
          />
        );
      })}

      {/* Last blur layer */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: blurLevels.length,
          backdropFilter: `blur(${blurLevels[blurLevels.length - 1]}px)`,
          WebkitBackdropFilter: `blur(${blurLevels[blurLevels.length - 1]}px)`,
          maskImage: last,
          WebkitMaskImage: last
        }}
      />
    </div>
  );
}
