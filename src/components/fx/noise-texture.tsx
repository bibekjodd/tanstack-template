/**
 * @kit name: NoiseTexture
 * @kit group: backgrounds
 * @kit use: A film-grain noise overlay (SVG feTurbulence) that adds tactile texture to a flat surface; choose it to take the digital sheen off a card, hero or gradient.
 * @kit props: frequency=0.4, octaves=6, slope=0.15 (contrast), noiseOpacity=0.6, className
 * @kit example: <div className="relative"><NoiseTexture /><h2>Hello</h2></div>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/noise-texture
 */
import { cn } from '@/lib/utils';
import { useId, type ComponentProps } from 'react';

export interface NoiseTextureProps extends ComponentProps<'svg'> {
  /** Extra classes merged onto the root `svg` element. */
  className?: string;
  /**
   * `baseFrequency` for `feTurbulence`; higher values yield finer-grained noise.
   * @default 0.4
   */
  frequency?: number;
  /**
   * `numOctaves` for `feTurbulence`; more octaves add detail at smaller scales.
   * @default 6
   */
  octaves?: number;
  /**
   * Linear slope on each channel after desaturation; adjusts contrast of the noise.
   * @default 0.15
   */
  slope?: number;
  /**
   * Opacity of the filled noise layer (`rect`).
   * @default 0.6
   */
  noiseOpacity?: number;
}

export const NoiseTexture = ({
  className,
  frequency = 0.4,
  octaves = 6,
  slope = 0.15,
  noiseOpacity = 0.6,
  ...props
}: NoiseTextureProps) => {
  const filterId = useId();

  return (
    <svg
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 z-0 size-full opacity-50 select-none dark:opacity-[0.75]',
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <filter id={filterId}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency={frequency}
          numOctaves={octaves}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncR type="linear" slope={slope} />
          <feFuncG type="linear" slope={slope} />
          <feFuncB type="linear" slope={slope} />
        </feComponentTransfer>
      </filter>
      <rect
        className="fill-foreground"
        width="100%"
        height="100%"
        filter={`url(#${filterId})`}
        opacity={noiseOpacity}
      />
    </svg>
  );
};
