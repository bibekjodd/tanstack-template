/**
 * @kit name: RainbowButton, rainbowButtonVariants
 * @kit group: buttons
 * @kit use: A button with an animated gradient border and glow in the palette's five accent colours; choose it for the one standout call to action.
 * @kit props: variant ('default' | 'outline'), size ('default' | 'sm' | 'lg' | 'icon'), href (renders an anchor instead of a button), className
 * @kit example: <RainbowButton>Get Unlimited Access</RainbowButton>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/rainbow-button
 */
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

const rainbowButtonVariants = cva(
  cn(
    'kit-rainbow group cursor-pointer transition-all',
    'inline-flex shrink-0 items-center justify-center gap-2',
    'rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive',
    'text-sm font-medium whitespace-nowrap',
    'disabled:pointer-events-none disabled:opacity-50',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
  ),
  {
    variants: {
      variant: {
        default: 'kit-rainbow-default',
        outline: 'kit-rainbow-outline'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-xl px-3 text-xs',
        lg: 'h-11 rounded-xl px-8',
        icon: 'size-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

type RainbowButtonProps = VariantProps<typeof rainbowButtonVariants> &
  (
    | (Omit<ComponentProps<'button'>, 'href'> & { href?: undefined })
    | (ComponentProps<'a'> & { href: string })
  );

function RainbowButton(props: RainbowButtonProps) {
  if (props.href !== undefined) {
    const { className, variant, size, ...anchorProps } = props;
    return (
      <a
        data-slot="button"
        className={cn(rainbowButtonVariants({ variant, size, className }))}
        {...anchorProps}
      />
    );
  }

  const { className, variant, size, ...buttonProps } = props;
  return (
    <button
      data-slot="button"
      className={cn(rainbowButtonVariants({ variant, size, className }))}
      {...buttonProps}
    />
  );
}

export { RainbowButton, rainbowButtonVariants, type RainbowButtonProps };
