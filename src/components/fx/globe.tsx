/**
 * @kit name: Globe
 * @kit group: data
 * @kit use: An interactive, draggable 3D globe (WebGL) with glowing location markers that follows the theme colours; use it to show a worldwide audience or presence.
 * @kit props: className, config (cobe options: markers, phi, theta, mapSamples, baseColor/markerColor/glowColor as [r,g,b] 0-1 arrays; the colours default to theme tokens)
 * @kit example: <div className="relative h-96 w-full"><Globe /></div>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/globe
 */
import { colorToRgbUnit, useThemeVersion } from '@/lib/css-color';
import { cn } from '@/lib/utils';
import createGlobe, { type COBEOptions } from 'cobe';
import { useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { useEffect, useRef } from 'react';

const MOVEMENT_DAMPING = 1400;

// Colours are theme tokens: they are read from the page when the globe is created and again when
// the theme switches, so a `config` only needs to set `baseColor`, `markerColor` or `glowColor`
// to override them.
type GlobeConfig = Omit<
  COBEOptions,
  'dark' | 'baseColor' | 'markerColor' | 'glowColor' | 'mapBrightness'
> &
  Partial<Pick<COBEOptions, 'dark' | 'baseColor' | 'markerColor' | 'glowColor' | 'mapBrightness'>>;

const GLOBE_CONFIG: GlobeConfig = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  diffuse: 0.4,
  mapSamples: 16000,
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 }
  ]
};

export function Globe({
  className,
  config = GLOBE_CONFIG
}: {
  className?: string;
  config?: GlobeConfig;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const widthRef = useRef(0);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  const themeVersion = useThemeVersion();
  const reduceMotion = useReducedMotion();

  const r = useMotionValue(0);
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100
  });

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? 'grabbing' : 'grab';
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      r.set(r.get() + delta / MOVEMENT_DAMPING);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onResize = () => {
      widthRef.current = canvas.offsetWidth;
    };

    window.addEventListener('resize', onResize);
    onResize();

    const isDark = document.documentElement.classList.contains('dark');
    const globe = createGlobe(canvas, {
      dark: isDark ? 1 : 0,
      // On a dark page the land dots need a brighter map over a mid-grey sphere to read at all.
      mapBrightness: isDark ? 6 : 1.2,
      baseColor: colorToRgbUnit(isDark ? 'var(--border)' : 'var(--muted)'),
      markerColor: colorToRgbUnit('var(--chart-1)'),
      glowColor: colorToRgbUnit('var(--background)'),
      ...config,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      onRender: (state) => {
        if (!pointerInteracting.current && !reduceMotion) phiRef.current += 0.005;
        state.phi = phiRef.current + rs.get();
        state.width = widthRef.current * 2;
        state.height = widthRef.current * 2;
      }
    });

    const showTimeout = setTimeout(() => {
      canvas.style.opacity = '1';
    }, 0);
    return () => {
      clearTimeout(showTimeout);
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, [rs, config, themeVersion, reduceMotion]);

  return (
    <div className={cn('absolute inset-0 mx-auto aspect-square w-full max-w-150', className)}>
      <canvas
        aria-hidden="true"
        className={cn(
          'size-full opacity-0 transition-opacity duration-500 contain-[layout_paint_size]'
        )}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          updatePointerInteraction(e.clientX);
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) => e.touches[0] && updateMovement(e.touches[0].clientX)}
      />
    </div>
  );
}
