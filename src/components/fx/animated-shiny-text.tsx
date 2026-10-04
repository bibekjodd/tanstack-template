/**
 * @kit name: AnimatedShinyText
 * @kit group: text
 * @kit use: Muted text with a light shimmer sweeping across it; choose it for small announcement pills and badges.
 * @kit props: shimmerWidth (100, px), className
 * @kit example: <AnimatedShinyText className="text-sm">New: dark mode is here</AnimatedShinyText>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/animated-shiny-text
 */
import { cn } from '@/lib/utils';
import { type ComponentPropsWithoutRef, type CSSProperties, type FC } from 'react';

export interface AnimatedShinyTextProps extends ComponentPropsWithoutRef<'span'> {
  shimmerWidth?: number;
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
  ...props
}) => {
  return (
    <span
      style={{ '--shiny-width': `${shimmerWidth}px` } as CSSProperties}
      className={cn(
        'text-muted-foreground/70 mx-auto max-w-md',

        // Shine effect
        'kit-shiny-text bg-size-[var(--shiny-width)_100%] bg-clip-text bg-position-[0_0] bg-no-repeat',

        // Shine gradient
        'via-foreground/80 bg-linear-to-r from-transparent via-50% to-transparent',

        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
