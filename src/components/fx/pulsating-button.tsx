/**
 * @kit name: PulsatingButton
 * @kit group: buttons
 * @kit use: A solid primary button with a soft halo that pulses outward; choose it to draw the eye to a single urgent call to action.
 * @kit props: pulseColor (defaults to the button's own colour), duration ('1.5s'), distance ('8px'), variant ('pulse' | 'ripple')
 * @kit example: <PulsatingButton>Join the waitlist</PulsatingButton>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/pulsating-button
 */
import { cn } from '@/lib/utils';
import React, { useImperativeHandle, useLayoutEffect, useRef } from 'react';

interface PulsatingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pulseColor?: string;
  duration?: string;
  distance?: string;
  variant?: 'pulse' | 'ripple';
}

export const PulsatingButton = React.forwardRef<HTMLButtonElement, PulsatingButtonProps>(
  (
    {
      className,
      children,
      pulseColor,
      duration = '1.5s',
      distance = '8px',
      variant = 'pulse',
      style,
      ...props
    },
    ref
  ) => {
    const innerRef = useRef<HTMLButtonElement>(null);
    useImperativeHandle(ref, () => innerRef.current as HTMLButtonElement);

    useLayoutEffect(() => {
      const button = innerRef.current;
      if (!button) return;

      if (pulseColor) {
        button.style.removeProperty('--bg');
        return;
      }

      let animationFrameId = 0;
      let currentBg = '';

      const updateBg = () => {
        animationFrameId = 0;

        const nextBg = getComputedStyle(button).backgroundColor;
        if (nextBg === currentBg) return;

        currentBg = nextBg;
        button.style.setProperty('--bg', nextBg);
      };

      const scheduleBgUpdate = () => {
        if (animationFrameId) return;
        animationFrameId = window.requestAnimationFrame(updateBg);
      };

      updateBg();

      const themeObserver = new MutationObserver(scheduleBgUpdate);
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });

      const buttonObserver = new MutationObserver(scheduleBgUpdate);
      buttonObserver.observe(button, {
        attributes: true
      });

      const syncEvents = ['blur', 'focus', 'pointerenter', 'pointerleave'] as const;

      for (const eventName of syncEvents) {
        button.addEventListener(eventName, scheduleBgUpdate);
      }

      return () => {
        if (animationFrameId) {
          window.cancelAnimationFrame(animationFrameId);
        }

        themeObserver.disconnect();
        buttonObserver.disconnect();

        for (const eventName of syncEvents) {
          button.removeEventListener(eventName, scheduleBgUpdate);
        }
      };
    }, [pulseColor]);

    return (
      <button
        ref={innerRef}
        className={cn(
          'bg-primary text-primary-foreground focus-visible:ring-ring/50 relative flex min-h-10 cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-center outline-none focus-visible:ring-3',
          className
        )}
        style={
          {
            ...(pulseColor && { '--pulse-color': pulseColor }),
            '--duration': duration,
            '--distance': distance,
            ...style
          } as React.CSSProperties
        }
        {...props}
      >
        <span className="relative z-10">{children}</span>
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 rounded-[inherit] bg-inherit',
            variant === 'pulse' ? 'kit-pulse' : 'kit-pulse-ripple'
          )}
        />
      </button>
    );
  }
);

PulsatingButton.displayName = 'PulsatingButton';
