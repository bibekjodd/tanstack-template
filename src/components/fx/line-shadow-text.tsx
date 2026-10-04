/**
 * @kit name: LineShadowText
 * @kit group: text
 * @kit use: Headline text with an animated diagonal line-hatched shadow behind it; choose it for bold hero titles that need a graphic, print-like feel.
 * @kit props: children (string), shadowColor ('var(--foreground)'), as ('span'), className
 * @kit example: <LineShadowText className="text-6xl font-bold italic">Launch</LineShadowText>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/line-shadow-text
 */
import { cn } from '@/lib/utils';
import { motion, type DOMMotionComponents, type MotionProps } from 'motion/react';
import { type CSSProperties, type HTMLAttributes } from 'react';

const motionElements = {
  article: motion.article,
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  li: motion.li,
  p: motion.p,
  section: motion.section,
  span: motion.span
} as const;

type MotionElementType = Extract<keyof DOMMotionComponents, keyof typeof motionElements>;

interface LineShadowTextProps
  extends Omit<HTMLAttributes<HTMLElement>, keyof MotionProps>, MotionProps {
  children: string;
  shadowColor?: string;
  as?: MotionElementType;
}

export function LineShadowText({
  children,
  shadowColor = 'var(--foreground)',
  className,
  as: Component = 'span',
  ...props
}: LineShadowTextProps) {
  const MotionComponent = motionElements[Component];

  return (
    <MotionComponent
      style={{ '--shadow-color': shadowColor } as CSSProperties}
      className={cn(
        'kit-line-shadow-text relative z-0 inline-flex',
        'after:absolute after:top-[0.04em] after:left-[0.04em] after:content-[attr(data-text)]',
        'after:bg-[linear-gradient(45deg,transparent_45%,var(--shadow-color)_45%,var(--shadow-color)_55%,transparent_0)]',
        'after:-z-10 after:bg-size-[0.06em_0.06em] after:bg-clip-text after:text-transparent',
        className
      )}
      data-text={children}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}
