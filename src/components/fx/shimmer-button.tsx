/**
 * @kit name: ShimmerButton
 * @kit group: buttons
 * @kit use: A dark pill button with a light that circles its edge; choose it for a primary call to action on a calm page.
 * @kit props: shimmerColor ('var(--background)'), shimmerSize ('0.05em'), shimmerDuration ('3s'), borderRadius ('100px'), background ('var(--foreground)'), className, plus button props
 * @kit example: <ShimmerButton>Get started</ShimmerButton>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/shimmer-button
 */
import { cn } from '@/lib/utils';
import React, { type ComponentPropsWithoutRef, type CSSProperties } from 'react';

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<'button'> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = 'var(--background)',
      shimmerSize = '0.05em',
      shimmerDuration = '3s',
      borderRadius = '100px',
      background = 'var(--foreground)',
      className,
      children,
      style,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={
          {
            '--spread': '90deg',
            '--shimmer-color': shimmerColor,
            '--radius': borderRadius,
            '--speed': shimmerDuration,
            '--cut': shimmerSize,
            '--bg': background,
            ...style
          } as CSSProperties
        }
        className={cn(
          'group border-background/10 text-background relative z-0 flex min-h-10 cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)] border px-6 py-3 whitespace-nowrap [background:var(--bg)]',
          'transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px',
          'focus-visible:ring-ring/50 outline-none focus-visible:ring-3',
          className
        )}
        ref={ref}
        {...props}
      >
        {/* spark container */}
        <div
          aria-hidden="true"
          className={cn('-z-30 blur-[2px]', '@container-[size] absolute inset-0 overflow-visible')}
        >
          {/* spark */}
          <div className="kit-shimmer-slide absolute inset-0 aspect-[1] h-[100cqh] rounded-none [mask:none]">
            {/* spark before */}
            <div className="kit-shimmer-spin absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
          </div>
        </div>
        {children}

        {/* Highlight */}
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 size-full',

            'rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_color-mix(in_oklab,var(--background)_12%,transparent)]',

            // transition
            'transform-gpu transition-all duration-300 ease-in-out',

            // on hover
            'group-hover:shadow-[inset_0_-6px_10px_color-mix(in_oklab,var(--background)_25%,transparent)]',

            // on click
            'group-active:shadow-[inset_0_-10px_10px_color-mix(in_oklab,var(--background)_25%,transparent)]'
          )}
        />

        {/* backdrop */}
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-(--cut) -z-20 [border-radius:var(--radius)] [background:var(--bg)]'
          )}
        />
      </button>
    );
  }
);

ShimmerButton.displayName = 'ShimmerButton';
