import { useEffect, useState } from 'react';

// Canvas and WebGL components (particles, globe, confetti) cannot read a CSS variable. These
// resolve a theme token, or any CSS colour, to the colour it has on screen right now, so those
// components follow the project's palette and its dark mode like everything else does.

let probe: CanvasRenderingContext2D | null = null;

const getProbe = (): CanvasRenderingContext2D | null => {
  if (typeof document === 'undefined') return null;
  if (!probe) {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    probe = canvas.getContext('2d', { willReadFrequently: true });
  }
  return probe;
};

// A variable reference such as "var(--chart-1)" or "var(--primary)" is resolved against `element`
// (the document root by default); anything else is returned unchanged.
export const resolveCssColor = (color: string, element?: Element | null): string => {
  if (typeof document === 'undefined') return color;
  const match = /^var\(\s*(--[\w-]+)\s*(?:,[^)]*)?\)$/.exec(color.trim());
  if (!match) return color;
  const value = getComputedStyle(element ?? document.documentElement)
    .getPropertyValue(match[1]!)
    .trim();
  return value || color;
};

// Any CSS colour (oklch, hex, rgb, color-mix, a variable) as [r, g, b] bytes in sRGB, by painting
// one pixel. Falls back to mid grey when the colour cannot be read (server render, bad value).
export const colorToRgb = (color: string, element?: Element | null): [number, number, number] => {
  const ctx = getProbe();
  if (!ctx) return [128, 128, 128];
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = '#808080';
  ctx.fillStyle = resolveCssColor(color, element);
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r ?? 128, g ?? 128, b ?? 128];
};

export const colorToRgbUnit = (
  color: string,
  element?: Element | null
): [number, number, number] => {
  const [r, g, b] = colorToRgb(color, element);
  return [r / 255, g / 255, b / 255];
};

// Changes whenever the page switches between light and dark (the class on <html>), so a canvas
// can resolve its colours again.
export const useThemeVersion = (): number => {
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const observer = new MutationObserver(() => setVersion((v) => v + 1));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return version;
};
