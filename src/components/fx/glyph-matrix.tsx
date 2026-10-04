/**
 * @kit name: GlyphMatrix
 * @kit group: backgrounds
 * @kit use: A canvas background of a grid of subtly shifting glyphs (code-like texture) that fades toward the bottom; use behind hero or developer-tool sections. Static when the visitor prefers reduced motion.
 * @kit props: glyphs, cellSize (14), mutationRate (0.04), interval (ms, 90), fadeBottom (0.6), color ('var(--muted-foreground)')
 * @kit example: <div className="relative h-96"><GlyphMatrix className="absolute inset-0" /></div>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/glyph-matrix
 */
import { colorToRgb, useThemeVersion } from '@/lib/css-color';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

interface GlyphMatrixProps extends React.HTMLAttributes<HTMLCanvasElement> {
  /** Characters to randomly pick from */
  glyphs?: string;
  /** Cell size in px (also font size) */
  cellSize?: number;
  /** Probability (0-1) a cell mutates each tick */
  mutationRate?: number;
  /** Tick interval in ms */
  interval?: number;
  /** Fade out toward bottom (0 = no fade) */
  fadeBottom?: number;
  /** Glyph colour: any CSS colour or a theme variable such as var(--primary). */
  color?: string;
}

const randomGlyph = (glyphs: string) => glyphs[Math.floor(Math.random() * glyphs.length)] ?? ' ';

/**
 * GlyphMatrix: an animated grid of subtly shifting glyphs. The colour follows the page's
 * light and dark theme when it is a theme variable.
 */
export function GlyphMatrix({
  glyphs = '01·•+*/\\<>=',
  cellSize = 14,
  mutationRate = 0.04,
  interval = 90,
  className,
  fadeBottom = 0.6,
  color = 'var(--muted-foreground)',
  style,
  ...props
}: GlyphMatrixProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rgbRef = useRef<[number, number, number]>([128, 128, 128]);
  const redrawRef = useRef<(() => void) | null>(null);
  const themeVersion = useThemeVersion();

  // Resolve the colour again when it or the theme changes; the next frame (or a redraw) uses it.
  useEffect(() => {
    rgbRef.current = colorToRgb(color);
    redrawRef.current?.();
  }, [color, themeVersion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let cols = 0;
    let rows = 0;
    let cells: string[] = [];
    let alphas: number[] = [];
    let raf = 0;
    let last = 0;
    let stopped = false;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { clientWidth: w, clientHeight: h } = canvas;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(w / cellSize);
      rows = Math.ceil(h / cellSize);

      cells = new Array<string>(cols * rows).fill('').map(() => randomGlyph(glyphs));
      alphas = new Array<number>(cols * rows).fill(0).map(() => 0.05 + Math.random() * 0.35);
    };

    const draw = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      ctx.clearRect(0, 0, w, h);

      ctx.font = `${cellSize - 2}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textBaseline = 'top';

      const [r, g, b] = rgbRef.current;
      for (let y = 0; y < rows; y++) {
        const fade = fadeBottom > 0 ? 1 - (y / rows) * fadeBottom : 1;
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const a = (alphas[i] ?? 0) * fade;
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
          ctx.fillText(cells[i] ?? ' ', x * cellSize, y * cellSize);
        }
      }
    };

    const tick = (t: number) => {
      if (stopped) return;

      if (t - last >= interval) {
        last = t;

        const total = cols * rows;
        const mutations = Math.max(1, Math.floor(total * mutationRate));

        for (let n = 0; n < mutations; n++) {
          const i = Math.floor(Math.random() * total);
          cells[i] = randomGlyph(glyphs);
          alphas[i] = 0.05 + Math.random() * 0.45;
        }

        draw();
      }

      raf = requestAnimationFrame(tick);
    };

    resize();
    draw();
    redrawRef.current = draw;
    if (!reduceMotion) raf = requestAnimationFrame(tick);

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);

    return () => {
      stopped = true;
      redrawRef.current = null;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [glyphs, cellSize, mutationRate, interval, fadeBottom]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('pointer-events-none', className)}
      style={{ width: '100%', height: '100%', display: 'block', ...style }}
      aria-hidden="true"
      {...props}
    />
  );
}
