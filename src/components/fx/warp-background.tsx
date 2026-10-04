/**
 * @kit name: WarpBackground
 * @kit group: backgrounds
 * @kit use: A 3D tunnel of grid walls with coloured beams racing toward the viewer, wrapping its children; choose it for a bold, sci-fi hero or feature card.
 * @kit props: perspective=100, beamsPerSide=3, beamSize=5, beamDelayMax=3, beamDelayMin=0, beamDuration=3, gridColor="var(--border)", className, children
 * @kit example: <WarpBackground className="p-10"><div className="rounded-xl bg-card p-6">Content</div></WarpBackground>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/warp-background
 */
import { cn } from '@/lib/utils';
import { motion, useReducedMotion } from 'motion/react';
import React, { useCallback, useEffect, useMemo, useState, type HTMLAttributes } from 'react';

interface WarpBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  perspective?: number;
  beamsPerSide?: number;
  beamSize?: number;
  beamDelayMax?: number;
  beamDelayMin?: number;
  beamDuration?: number;
  gridColor?: string;
}

const Beam = ({
  width,
  x,
  delay,
  duration
}: {
  width: string | number;
  x: string | number;
  delay: number;
  duration: number;
}) => {
  const reducedMotion = useReducedMotion();
  // Chosen once per beam, on the client only (beams are not rendered on the server).
  const [{ accent, ar }] = useState(() => ({
    accent: Math.floor(Math.random() * 5) + 1,
    ar: Math.floor(Math.random() * 10) + 1
  }));

  // Beams only exist in motion: with reduced motion the grid walls stay and the beams are left out.
  if (reducedMotion) return null;

  return (
    <motion.div
      style={
        {
          '--x': `${x}`,
          '--width': `${width}`,
          '--aspect-ratio': `${ar}`,
          '--background': `linear-gradient(var(--chart-${accent}), transparent)`
        } as React.CSSProperties
      }
      className={`absolute top-0 left-(--x) aspect-[1/var(--aspect-ratio)] w-(--width) [background:var(--background)]`}
      initial={{ y: '100cqmax', x: '-50%' }}
      animate={{ y: '-100%', x: '-50%' }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  );
};

export const WarpBackground: React.FC<WarpBackgroundProps> = ({
  children,
  perspective = 100,
  className,
  beamsPerSide = 3,
  beamSize = 5,
  beamDelayMax = 3,
  beamDelayMin = 0,
  beamDuration = 3,
  gridColor = 'var(--border)',
  ...props
}) => {
  const generateBeams = useCallback(() => {
    const beams = [];
    const cellsPerSide = Math.floor(100 / beamSize);
    const step = cellsPerSide / beamsPerSide;

    for (let i = 0; i < beamsPerSide; i++) {
      const x = Math.floor(i * step);
      const delay = Math.random() * (beamDelayMax - beamDelayMin) + beamDelayMin;
      beams.push({ x, delay });
    }
    return beams;
  }, [beamsPerSide, beamSize, beamDelayMax, beamDelayMin]);

  // The beams are random, so they are drawn after mount: the server HTML and the first client
  // render both have the grid and no beams, and nothing mismatches on hydration.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const topBeams = useMemo(() => generateBeams(), [generateBeams]);
  const rightBeams = useMemo(() => generateBeams(), [generateBeams]);
  const bottomBeams = useMemo(() => generateBeams(), [generateBeams]);
  const leftBeams = useMemo(() => generateBeams(), [generateBeams]);

  return (
    <div className={cn('relative rounded border p-20', className)} {...props}>
      <div
        style={
          {
            '--perspective': `${perspective}px`,
            '--grid-color': gridColor,
            '--beam-size': `${beamSize}%`
          } as React.CSSProperties
        }
        className={
          '@container-[size] pointer-events-none absolute top-0 left-0 size-full overflow-hidden [clipPath:inset(0)] perspective-(--perspective) transform-3d'
        }
      >
        {/* top side */}
        <div className="@container absolute z-20 h-[100cqmax] w-[100cqi] origin-[50%_0%] transform-[rotateX(-90deg)] bg-size-[var(--beam-size)_var(--beam-size)] [background:linear-gradient(var(--grid-color)_0_1px,transparent_1px_var(--beam-size))_50%_-0.5px_/var(--beam-size)_var(--beam-size),linear-gradient(90deg,var(--grid-color)_0_1px,transparent_1px_var(--beam-size))_50%_50%_/var(--beam-size)_var(--beam-size)] transform-3d">
          {mounted &&
            topBeams.map((beam, index) => (
              <Beam
                key={`top-${index}`}
                width={`${beamSize}%`}
                x={`${beam.x * beamSize}%`}
                delay={beam.delay}
                duration={beamDuration}
              />
            ))}
        </div>
        {/* bottom side */}
        <div className="@container absolute top-full h-[100cqmax] w-[100cqi] origin-[50%_0%] transform-[rotateX(-90deg)] bg-size-[var(--beam-size)_var(--beam-size)] [background:linear-gradient(var(--grid-color)_0_1px,transparent_1px_var(--beam-size))_50%_-0.5px_/var(--beam-size)_var(--beam-size),linear-gradient(90deg,var(--grid-color)_0_1px,transparent_1px_var(--beam-size))_50%_50%_/var(--beam-size)_var(--beam-size)] transform-3d">
          {mounted &&
            bottomBeams.map((beam, index) => (
              <Beam
                key={`bottom-${index}`}
                width={`${beamSize}%`}
                x={`${beam.x * beamSize}%`}
                delay={beam.delay}
                duration={beamDuration}
              />
            ))}
        </div>
        {/* left side */}
        <div className="@container absolute top-0 left-0 h-[100cqmax] w-[100cqh] origin-[0%_0%] transform-[rotate(90deg)_rotateX(-90deg)] bg-size-[var(--beam-size)_var(--beam-size)] [background:linear-gradient(var(--grid-color)_0_1px,transparent_1px_var(--beam-size))_50%_-0.5px_/var(--beam-size)_var(--beam-size),linear-gradient(90deg,var(--grid-color)_0_1px,transparent_1px_var(--beam-size))_50%_50%_/var(--beam-size)_var(--beam-size)] transform-3d">
          {mounted &&
            leftBeams.map((beam, index) => (
              <Beam
                key={`left-${index}`}
                width={`${beamSize}%`}
                x={`${beam.x * beamSize}%`}
                delay={beam.delay}
                duration={beamDuration}
              />
            ))}
        </div>
        {/* right side */}
        <div className="@container absolute top-0 right-0 h-[100cqmax] w-[100cqh] origin-[100%_0%] transform-[rotate(-90deg)_rotateX(-90deg)] bg-size-[var(--beam-size)_var(--beam-size)] [background:linear-gradient(var(--grid-color)_0_1px,transparent_1px_var(--beam-size))_50%_-0.5px_/var(--beam-size)_var(--beam-size),linear-gradient(90deg,var(--grid-color)_0_1px,transparent_1px_var(--beam-size))_50%_50%_/var(--beam-size)_var(--beam-size)] transform-3d">
          {mounted &&
            rightBeams.map((beam, index) => (
              <Beam
                key={`right-${index}`}
                width={`${beamSize}%`}
                x={`${beam.x * beamSize}%`}
                delay={beam.delay}
                duration={beamDuration}
              />
            ))}
        </div>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
};
