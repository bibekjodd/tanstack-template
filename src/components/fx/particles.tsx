/**
 * @kit name: Particles
 * @kit group: backgrounds
 * @kit use: A canvas field of tiny drifting dots that gently follow the cursor; choose it for a starry or dusty ambient backdrop behind a hero.
 * @kit props: quantity=100, staticity=50, ease=50, size=0.4, color="var(--foreground)", vx=0, vy=0, refresh=false, className
 * @kit example: <div className="relative h-96"><Particles className="absolute inset-0" quantity={120} color="var(--chart-1)" /></div>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/particles
 */
import { colorToRgb, useThemeVersion } from '@/lib/css-color';
import { cn } from '@/lib/utils';
import { useReducedMotion } from 'motion/react';
import React, { useEffect, useRef, type ComponentPropsWithoutRef } from 'react';

interface ParticlesProps extends ComponentPropsWithoutRef<'div'> {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

type Circle = {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
};

const remapValue = (
  value: number,
  start1: number,
  end1: number,
  start2: number,
  end2: number
): number => {
  const remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
  return remapped > 0 ? remapped : 0;
};

export const Particles: React.FC<ParticlesProps> = ({
  className = '',
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = 'var(--foreground)',
  vx = 0,
  vy = 0,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const rgbRef = useRef<[number, number, number]>([128, 128, 128]);
  const themeVersion = useThemeVersion();
  const reducedMotion = useReducedMotion();
  // A still field has to be painted again when the theme changes; a moving one repaints itself.
  const staticVersion = reducedMotion ? themeVersion : 0;

  // The colour is resolved in an effect, so it follows the palette and the light/dark switch.
  // The animation reads it on every frame and so is not restarted by a theme change.
  useEffect(() => {
    rgbRef.current = colorToRgb(color, canvasContainerRef.current);
  }, [color, themeVersion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvasContainerRef.current;
    const context = canvas?.getContext('2d') ?? null;
    if (!canvas || !container || !context) return;

    const dpr = window.devicePixelRatio || 1;
    const circles: Circle[] = [];
    const mouse = { x: 0, y: 0 };
    const canvasSize = { w: 0, h: 0 };
    let rafId: number | null = null;
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

    const circleParams = (): Circle => {
      const x = Math.floor(Math.random() * canvasSize.w);
      const y = Math.floor(Math.random() * canvasSize.h);
      const pSize = Math.floor(Math.random() * 2) + size;
      const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
      const dx = (Math.random() - 0.5) * 0.1;
      const dy = (Math.random() - 0.5) * 0.1;
      const magnetism = 0.1 + Math.random() * 4;
      return {
        x,
        y,
        translateX: 0,
        translateY: 0,
        size: pSize,
        alpha: reducedMotion ? targetAlpha : 0,
        targetAlpha,
        dx,
        dy,
        magnetism
      };
    };

    const drawCircle = (circle: Circle, update = false) => {
      const { x, y, translateX, translateY, size, alpha } = circle;
      context.translate(translateX, translateY);
      context.beginPath();
      context.arc(x, y, size, 0, 2 * Math.PI);
      context.fillStyle = `rgba(${rgbRef.current.join(', ')}, ${alpha})`;
      context.fill();
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.push(circle);
      }
    };

    const clearContext = () => {
      context.clearRect(0, 0, canvasSize.w, canvasSize.h);
    };

    const initCanvas = () => {
      canvasSize.w = container.offsetWidth;
      canvasSize.h = container.offsetHeight;

      canvas.width = canvasSize.w * dpr;
      canvas.height = canvasSize.h * dpr;
      canvas.style.width = `${canvasSize.w}px`;
      canvas.style.height = `${canvasSize.h}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Clear existing particles and create new ones with exact quantity
      circles.length = 0;
      clearContext();
      for (let i = 0; i < quantity; i++) {
        drawCircle(circleParams());
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const { w, h } = canvasSize;
      const x = event.clientX - rect.left - w / 2;
      const y = event.clientY - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouse.x = x;
        mouse.y = y;
      }
    };

    const animate = () => {
      clearContext();
      circles.forEach((circle, i) => {
        // Handle the alpha value
        const edge = [
          circle.x + circle.translateX - circle.size, // distance from left edge
          canvasSize.w - circle.x - circle.translateX - circle.size, // distance from right edge
          circle.y + circle.translateY - circle.size, // distance from top edge
          canvasSize.h - circle.y - circle.translateY - circle.size // distance from bottom edge
        ];
        const closestEdge = edge.reduce((a, b) => Math.min(a, b));
        const remapClosestEdge = parseFloat(remapValue(closestEdge, 0, 20, 0, 1).toFixed(2));
        if (remapClosestEdge > 1) {
          circle.alpha += 0.02;
          if (circle.alpha > circle.targetAlpha) {
            circle.alpha = circle.targetAlpha;
          }
        } else {
          circle.alpha = circle.targetAlpha * remapClosestEdge;
        }
        circle.x += circle.dx + vx;
        circle.y += circle.dy + vy;
        circle.translateX += (mouse.x / (staticity / circle.magnetism) - circle.translateX) / ease;
        circle.translateY += (mouse.y / (staticity / circle.magnetism) - circle.translateY) / ease;

        drawCircle(circle, true);

        // circle gets out of the canvas
        if (
          circle.x < -circle.size ||
          circle.x > canvasSize.w + circle.size ||
          circle.y < -circle.size ||
          circle.y > canvasSize.h + circle.size
        ) {
          // remove the circle from the array and create a new one
          circles.splice(i, 1);
          drawCircle(circleParams());
        }
      });
      rafId = window.requestAnimationFrame(animate);
    };

    // With reduced motion the dots are painted once, still and fully visible.
    const clearContextAndPaintStatic = () => {
      clearContext();
      circles.forEach((circle) => drawCircle(circle, true));
    };

    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        initCanvas();
        if (reducedMotion) clearContextAndPaintStatic();
      }, 200);
    };

    initCanvas();
    window.addEventListener('resize', handleResize);
    if (reducedMotion) {
      clearContextAndPaintStatic();
    } else {
      window.addEventListener('mousemove', onMouseMove);
      rafId = window.requestAnimationFrame(animate);
    }

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [quantity, staticity, ease, size, refresh, vx, vy, reducedMotion, staticVersion]);

  return (
    <div
      className={cn('pointer-events-none', className)}
      ref={canvasContainerRef}
      aria-hidden="true"
      {...props}
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
};
