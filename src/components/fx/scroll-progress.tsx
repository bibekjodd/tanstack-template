/**
 * @kit name: ScrollProgress
 * @kit group: interaction
 * @kit use: A thin gradient bar fixed to the top of the page that fills as the visitor scrolls; use it on long articles and landing pages.
 * @kit props: className (override colour, height or position)
 * @kit example: <ScrollProgress />
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/scroll-progress
 */
import { cn } from '@/lib/utils';
import { motion, useScroll, type MotionProps } from 'motion/react';

interface ScrollProgressProps extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps> {
  ref?: React.Ref<HTMLDivElement>;
}

export function ScrollProgress({ className, ref, ...props }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className={cn(
        'from-chart-1 via-chart-2 to-chart-3 pointer-events-none fixed inset-x-0 top-0 z-50 h-px origin-left bg-linear-to-r',
        className
      )}
      style={{
        scaleX: scrollYProgress
      }}
      {...props}
    />
  );
}
