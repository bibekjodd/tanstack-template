/**
 * @kit name: Highlighter
 * @kit group: text
 * @kit use: Hand-drawn marker highlight, underline, box, circle, strike-through or bracket around inline text (rough-notation); choose it to emphasise a phrase inside a sentence.
 * @kit props: children, action ('highlight' | 'underline' | 'box' | 'circle' | 'strike-through' | 'crossed-off' | 'bracket'), color ('var(--chart-1)'), strokeWidth (1.5), animationDuration (600), iterations (2), padding (2), isView (false)
 * @kit example: <p>Make it <Highlighter action="underline">memorable</Highlighter>.</p>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/highlighter
 */
import { colorToRgb, useThemeVersion } from '@/lib/css-color';
import { useInView, useReducedMotion } from 'motion/react';
import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { annotate } from 'rough-notation';
import { type RoughAnnotation } from 'rough-notation/lib/model';

type AnnotationAction =
  'highlight' | 'underline' | 'box' | 'circle' | 'strike-through' | 'crossed-off' | 'bracket';

interface HighlighterProps {
  children: ReactNode;
  action?: AnnotationAction;
  /** A CSS colour or theme token such as `var(--chart-1)` */
  color?: string;
  strokeWidth?: number;
  animationDuration?: number;
  iterations?: number;
  padding?: number;
  multiline?: boolean;
  isView?: boolean;
}

export function Highlighter({
  children,
  action = 'highlight',
  color = 'var(--chart-1)',
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = true,
  isView = false
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const themeVersion = useThemeVersion();
  const reduceMotion = useReducedMotion();

  const isInView = useInView(elementRef, {
    once: true,
    margin: '-10%'
  });

  // If isView is false, always show. If isView is true, wait for inView
  const shouldShow = !isView || isInView;

  useLayoutEffect(() => {
    const element = elementRef.current;
    let annotation: RoughAnnotation | null = null;
    let resizeObserver: ResizeObserver | null = null;

    if (shouldShow && element) {
      // rough-notation draws with a plain colour string, so the theme token is resolved here.
      const [r, g, b] = colorToRgb(color, element);

      const currentAnnotation = annotate(element, {
        type: action,
        color: `rgb(${r}, ${g}, ${b})`,
        strokeWidth,
        animationDuration,
        animate: !reduceMotion,
        iterations,
        padding,
        multiline
      });
      annotation = currentAnnotation;
      currentAnnotation.show();

      resizeObserver = new ResizeObserver(() => {
        currentAnnotation.hide();
        currentAnnotation.show();
      });

      resizeObserver.observe(element);
      resizeObserver.observe(document.body);
    }

    return () => {
      annotation?.remove();
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [
    shouldShow,
    action,
    color,
    strokeWidth,
    animationDuration,
    iterations,
    padding,
    multiline,
    reduceMotion,
    themeVersion
  ]);

  return (
    <span ref={elementRef} className="relative inline-block bg-transparent">
      {children}
    </span>
  );
}
