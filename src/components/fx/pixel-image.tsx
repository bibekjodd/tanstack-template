/**
 * @kit name: PixelImage
 * @kit group: media
 * @kit use: An image that assembles itself from a grid of pixel blocks that fade in at random, then turns from greyscale to colour; use it for a hero or feature image reveal.
 * @kit props: src, alt (""), grid ("6x4" | "8x8" | "8x3" | "4x6" | "3x8"), customGrid ({rows, cols} up to 16), grayscaleAnimation (true), pixelFadeInDuration (1000 ms), maxAnimationDelay (1200 ms), colorRevealDelay (1300 ms)
 * @kit example: <PixelImage src="/hero.jpg" alt="Product shot" grid="8x8" />
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/pixel-image
 */
import { cn } from '@/lib/utils';
import { useEffect, useMemo, useState } from 'react';

type Grid = {
  rows: number;
  cols: number;
};

const DEFAULT_GRIDS: Record<string, Grid> = {
  '6x4': { rows: 4, cols: 6 },
  '8x8': { rows: 8, cols: 8 },
  '8x3': { rows: 3, cols: 8 },
  '4x6': { rows: 6, cols: 4 },
  '3x8': { rows: 8, cols: 3 }
};

type PredefinedGridKey = keyof typeof DEFAULT_GRIDS;

interface PixelImageProps {
  src: string;
  alt?: string;
  grid?: PredefinedGridKey;
  customGrid?: Grid;
  grayscaleAnimation?: boolean;
  pixelFadeInDuration?: number; // in ms
  maxAnimationDelay?: number; // in ms
  colorRevealDelay?: number; // in ms
}

export const PixelImage = ({
  src,
  alt = '',
  grid = '6x4',
  grayscaleAnimation = true,
  pixelFadeInDuration = 1000,
  maxAnimationDelay = 1200,
  colorRevealDelay = 1300,
  customGrid
}: PixelImageProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showColor, setShowColor] = useState(false);
  // Random fade-in delays are chosen on the client, after mount: a random number in the render
  // would differ between the server HTML and the first client render.
  const [delays, setDelays] = useState<number[]>([]);

  const MIN_GRID = 1;
  const MAX_GRID = 16;

  const { rows, cols } = useMemo(() => {
    const isValidGrid = (grid?: Grid): grid is Grid => {
      if (!grid) return false;
      const { rows, cols } = grid;
      return (
        Number.isInteger(rows) &&
        Number.isInteger(cols) &&
        rows >= MIN_GRID &&
        cols >= MIN_GRID &&
        rows <= MAX_GRID &&
        cols <= MAX_GRID
      );
    };

    return isValidGrid(customGrid) ? customGrid : (DEFAULT_GRIDS[grid] ?? DEFAULT_GRIDS['6x4']!);
  }, [customGrid, grid]);

  useEffect(() => {
    setDelays(Array.from({ length: rows * cols }, () => Math.random() * maxAnimationDelay));
    setIsVisible(true);
    const colorTimeout = setTimeout(() => {
      setShowColor(true);
    }, colorRevealDelay);
    return () => clearTimeout(colorTimeout);
  }, [colorRevealDelay, rows, cols, maxAnimationDelay]);

  const pieces = useMemo(() => {
    const total = rows * cols;
    return Array.from({ length: total }, (_, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;

      const clipPath = `polygon(
        ${col * (100 / cols)}% ${row * (100 / rows)}%,
        ${(col + 1) * (100 / cols)}% ${row * (100 / rows)}%,
        ${(col + 1) * (100 / cols)}% ${(row + 1) * (100 / rows)}%,
        ${col * (100 / cols)}% ${(row + 1) * (100 / rows)}%
      )`;

      return { clipPath };
    });
  }, [rows, cols]);

  return (
    <div className="relative h-72 w-72 select-none md:h-96 md:w-96">
      {pieces.map((piece, index) => (
        <div
          key={index}
          className={cn(
            'absolute inset-0 transition-all ease-out',
            isVisible ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            clipPath: piece.clipPath,
            transitionDelay: `${delays[index] ?? 0}ms`,
            transitionDuration: `${pixelFadeInDuration}ms`
          }}
        >
          <img
            src={src}
            alt={index === 0 ? alt : ''}
            className={cn(
              'z-1 rounded-[2.5rem] object-cover',
              grayscaleAnimation && (showColor ? 'grayscale-0' : 'grayscale')
            )}
            style={{
              transition: grayscaleAnimation
                ? `filter ${pixelFadeInDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`
                : 'none'
            }}
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
};
