/**
 * @kit name: ShinyButton
 * @kit group: buttons
 * @kit use: A subtle outlined button with a light sweep that repeats and a springy press; choose it for secondary calls to action.
 * @kit props: children, className, plus motion.button props (onClick, disabled, type ...)
 * @kit example: <ShinyButton>Get unlimited access</ShinyButton>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/shiny-button
 */
import { cn } from '@/lib/utils';
import { motion, useReducedMotion, type MotionProps } from 'motion/react';
import React from 'react';

const animationProps: MotionProps = {
  initial: { '--x': '100%', scale: 0.8 },
  animate: { '--x': '-100%', scale: 1 },
  whileTap: { scale: 0.95 },
  transition: {
    repeat: Infinity,
    repeatType: 'loop',
    repeatDelay: 1,
    type: 'spring',
    stiffness: 20,
    damping: 15,
    mass: 2,
    scale: {
      type: 'spring',
      stiffness: 200,
      damping: 5,
      mass: 0.5
    }
  }
};

const reducedAnimationProps: MotionProps = {
  initial: { '--x': '-100%', scale: 1 },
  animate: { '--x': '-100%', scale: 1 },
  whileTap: { scale: 0.95 }
};

interface ShinyButtonProps
  extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps>, MotionProps {
  children: React.ReactNode;
  className?: string;
}

export const ShinyButton = React.forwardRef<HTMLButtonElement, ShinyButtonProps>(
  ({ children, className, ...props }, ref) => {
    const reducedMotion = useReducedMotion();

    return (
      <motion.button
        ref={ref}
        className={cn(
          'border-border focus-visible:ring-ring/50 relative min-h-10 cursor-pointer rounded-lg border px-6 py-2 font-medium backdrop-blur-xl transition-shadow duration-300 ease-in-out outline-none hover:shadow focus-visible:ring-3 dark:bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklab,var(--primary)_10%,transparent)_0%,transparent_60%)] dark:hover:shadow-[0_0_20px_color-mix(in_oklab,var(--primary)_10%,transparent)]',
          className
        )}
        {...(reducedMotion ? reducedAnimationProps : animationProps)}
        {...props}
      >
        <span
          className="text-foreground/65 dark:text-foreground/90 relative block size-full text-sm tracking-wide uppercase dark:font-light"
          style={{
            maskImage:
              'linear-gradient(-75deg,var(--foreground) calc(var(--x) + 20%),transparent calc(var(--x) + 30%),var(--foreground) calc(var(--x) + 100%))'
          }}
        >
          {children}
        </span>
        <span
          aria-hidden="true"
          style={{
            mask: 'linear-gradient(var(--foreground), var(--foreground)) content-box exclude,linear-gradient(var(--foreground), var(--foreground))',
            WebkitMask:
              'linear-gradient(var(--foreground), var(--foreground)) content-box exclude,linear-gradient(var(--foreground), var(--foreground))',
            backgroundImage:
              'linear-gradient(-75deg,color-mix(in oklab,var(--primary) 10%,transparent) calc(var(--x) + 20%),color-mix(in oklab,var(--primary) 50%,transparent) calc(var(--x) + 25%),color-mix(in oklab,var(--primary) 10%,transparent) calc(var(--x) + 100%))'
          }}
          className="pointer-events-none absolute inset-0 z-10 block rounded-[inherit] p-px"
        />
      </motion.button>
    );
  }
);

ShinyButton.displayName = 'ShinyButton';
