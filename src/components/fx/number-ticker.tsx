/**
 * @kit name: NumberTicker
 * @kit group: text
 * @kit use: A number that counts up (or down) with a spring once it scrolls into view; choose it for stats and metrics.
 * @kit props: value (number, required), startValue (0), direction ('up' | 'down'), delay (s), decimalPlaces (0), className
 * @kit example: <NumberTicker value={1200} className="text-5xl font-bold" />
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/number-ticker
 */
import { cn } from '@/lib/utils';
import { useInView, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { useEffect, useRef, type ComponentPropsWithoutRef } from 'react';

interface NumberTickerProps extends ComponentPropsWithoutRef<'span'> {
  value: number;
  startValue?: number;
  direction?: 'up' | 'down';
  delay?: number;
  decimalPlaces?: number;
}

const formatNumber = (n: number, decimalPlaces: number) =>
  Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  }).format(Number(n.toFixed(decimalPlaces)));

export function NumberTicker({
  value,
  startValue = 0,
  direction = 'up',
  delay = 0,
  className,
  decimalPlaces = 0,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const motionValue = useMotionValue(direction === 'down' ? value : startValue);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100
  });
  const isInView = useInView(ref, { once: true, margin: '0px' });

  useEffect(() => {
    if (reduceMotion) return;
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (isInView) {
      timer = setTimeout(() => {
        motionValue.set(direction === 'down' ? startValue : value);
      }, delay * 1000);
    }

    return () => {
      if (timer !== null) {
        clearTimeout(timer);
      }
    };
  }, [motionValue, isInView, delay, value, direction, startValue, reduceMotion]);

  useEffect(
    () =>
      springValue.on('change', (latest) => {
        if (ref.current) {
          ref.current.textContent = formatNumber(latest, decimalPlaces);
        }
      }),
    [springValue, decimalPlaces]
  );

  // The server HTML carries the final number, so nothing is empty before the count starts.
  const finalValue = direction === 'down' ? startValue : value;

  return (
    <span
      ref={ref}
      className={cn('text-foreground inline-block tracking-wider tabular-nums', className)}
      {...props}
    >
      {formatNumber(finalValue, decimalPlaces)}
    </span>
  );
}
