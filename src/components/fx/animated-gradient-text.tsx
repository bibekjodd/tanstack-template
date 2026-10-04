/**
 * @kit name: AnimatedGradientText
 * @kit group: text
 * @kit use: Inline text filled with a two-colour gradient that slides endlessly; choose it for a highlighted word or a badge label.
 * @kit props: speed (1), colorFrom ('var(--chart-1)'), colorTo ('var(--chart-2)'), className
 * @kit example: <AnimatedGradientText>Introducing v2</AnimatedGradientText>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/animated-gradient-text
 */
import { cn } from '@/lib/utils';
import { type ComponentPropsWithoutRef, type CSSProperties } from 'react';

export interface AnimatedGradientTextProps extends ComponentPropsWithoutRef<'div'> {
  speed?: number;
  colorFrom?: string;
  colorTo?: string;
}

export function AnimatedGradientText({
  children,
  className,
  speed = 1,
  colorFrom = 'var(--chart-1)',
  colorTo = 'var(--chart-2)',
  ...props
}: AnimatedGradientTextProps) {
  return (
    <span
      style={
        {
          '--bg-size': `${speed * 300}%`,
          '--color-from': colorFrom,
          '--color-to': colorTo
        } as CSSProperties
      }
      className={cn(
        'kit-gradient-text inline bg-linear-to-r from-(--color-from) via-(--color-to) to-(--color-from) bg-size-[var(--bg-size)_100%] bg-clip-text text-transparent',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
