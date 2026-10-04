/**
 * @kit name: SpinningText
 * @kit group: text
 * @kit use: Text laid out on a circle that rotates continuously; choose it for badges, stamps and circular logos.
 * @kit props: children (string | string[], required), duration (10 s), reverse (false), radius (5, in ch), transition, variants
 * @kit example: <SpinningText>learn more • earn more • </SpinningText>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/spinning-text
 */
import { cn } from '@/lib/utils';
import { motion, useReducedMotion, type Transition, type Variants } from 'motion/react';
import { type ComponentPropsWithoutRef, type CSSProperties } from 'react';

interface SpinningTextProps extends ComponentPropsWithoutRef<'div'> {
  children: string | string[];
  duration?: number;
  reverse?: boolean;
  radius?: number;
  transition?: Transition;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
}

const BASE_TRANSITION: Transition = {
  repeat: Infinity,
  ease: 'linear'
};

const BASE_ITEM_VARIANTS: Variants = {
  hidden: {
    opacity: 1
  },
  visible: {
    opacity: 1
  }
};

export function SpinningText({
  children,
  duration = 10,
  reverse = false,
  radius = 5,
  transition,
  variants,
  className,
  style
}: SpinningTextProps) {
  const reduceMotion = useReducedMotion();

  if (typeof children !== 'string' && !Array.isArray(children)) {
    throw new Error('children must be a string or an array of strings');
  }

  if (Array.isArray(children)) {
    // Validate all elements are strings
    if (!children.every((child) => typeof child === 'string')) {
      throw new Error('all elements in children array must be strings');
    }
  }

  const text = Array.isArray(children) ? children.join('') : children;
  const letters = text.split('');
  letters.push(' ');

  const finalTransition: Transition = {
    ...BASE_TRANSITION,
    ...transition,
    duration: (transition as { duration?: number })?.duration ?? duration
  };

  const containerVariants: Variants = {
    visible: { rotate: reverse ? -360 : 360 },
    ...variants?.container
  };

  const itemVariants: Variants = {
    ...BASE_ITEM_VARIANTS,
    ...variants?.item
  };

  return (
    <motion.div
      className={cn('relative', className)}
      style={{
        ...style
      }}
      initial="hidden"
      animate={reduceMotion ? 'hidden' : 'visible'}
      variants={containerVariants}
      transition={finalTransition}
    >
      {letters.map((letter, index) => (
        <motion.span
          aria-hidden="true"
          key={`${index}-${letter}`}
          variants={itemVariants}
          className="absolute top-1/2 left-1/2 inline-block"
          style={
            {
              '--index': index,
              '--total': letters.length,
              '--radius': radius,
              transform: `
                  translate(-50%, -50%)
                  rotate(calc(360deg / var(--total) * var(--index)))
                  translateY(calc(var(--radius, 5) * -1ch))
                `,
              transformOrigin: 'center'
            } as CSSProperties
          }
        >
          {letter}
        </motion.span>
      ))}
      <span className="sr-only">{text}</span>
    </motion.div>
  );
}
