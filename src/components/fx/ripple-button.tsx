/**
 * @kit name: RippleButton
 * @kit group: buttons
 * @kit use: An outlined button that spawns a ripple where it is clicked; choose it for tactile secondary actions.
 * @kit props: rippleColor ('var(--primary)'), duration ('600ms'), className, plus button props
 * @kit example: <RippleButton>Click me</RippleButton>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/ripple-button
 */
import { cn } from '@/lib/utils';
import React, { useEffect, useState, type MouseEvent } from 'react';

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  rippleColor?: string;
  duration?: string;
}

export const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(
  (
    { className, children, rippleColor = 'var(--primary)', duration = '600ms', onClick, ...props },
    ref
  ) => {
    const [buttonRipples, setButtonRipples] = useState<
      Array<{ x: number; y: number; size: number; key: number }>
    >([]);

    const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      const newRipple = { x, y, size, key: Date.now() };
      setButtonRipples((prevRipples) => [...prevRipples, newRipple]);
    };

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      createRipple(event);
      onClick?.(event);
    };

    useEffect(() => {
      let timeout: ReturnType<typeof setTimeout> | null = null;

      const lastRipple = buttonRipples[buttonRipples.length - 1];
      if (lastRipple) {
        timeout = setTimeout(
          () => {
            setButtonRipples((prevRipples) =>
              prevRipples.filter((ripple) => ripple.key !== lastRipple.key)
            );
          },
          parseInt(duration, 10)
        );
      }

      return () => {
        if (timeout !== null) {
          clearTimeout(timeout);
        }
      };
    }, [buttonRipples, duration]);

    return (
      <button
        className={cn(
          'bg-background text-primary border-border focus-visible:ring-ring/50 relative flex min-h-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 px-4 py-2 text-center outline-none focus-visible:ring-3',
          className
        )}
        onClick={handleClick}
        ref={ref}
        {...props}
      >
        <div className="relative z-10">{children}</div>
        <span aria-hidden="true" className="pointer-events-none absolute inset-0">
          {buttonRipples.map((ripple) => (
            <span
              className="kit-ripple absolute rounded-full opacity-30"
              key={ripple.key}
              style={
                {
                  width: `${ripple.size}px`,
                  height: `${ripple.size}px`,
                  top: `${ripple.y}px`,
                  left: `${ripple.x}px`,
                  backgroundColor: rippleColor,
                  transform: `scale(0)`,
                  '--duration': duration
                } as React.CSSProperties
              }
            />
          ))}
        </span>
      </button>
    );
  }
);

RippleButton.displayName = 'RippleButton';
