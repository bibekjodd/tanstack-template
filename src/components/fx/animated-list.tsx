/**
 * @kit name: AnimatedList, AnimatedListItem
 * @kit group: motion
 * @kit use: Shows its children one by one at an interval, each new item springing in on top of the previous; use for notification feeds and activity streams in a hero or feature section.
 * @kit props: children, delay (ms between items, default 1000), className
 * @kit example: <AnimatedList delay={1500}>{notifications.map((n) => <Notification key={n.id} {...n} />)}</AnimatedList>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/animated-list
 */
import { cn } from '@/lib/utils';
import { AnimatePresence, motion, type MotionProps } from 'motion/react';
import React, { useEffect, useMemo, useState, type ComponentPropsWithoutRef } from 'react';

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const animations: MotionProps = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, originY: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: 'spring', stiffness: 350, damping: 40 }
  };

  return (
    <motion.div {...animations} layout className="mx-auto w-full">
      {children}
    </motion.div>
  );
}

export interface AnimatedListProps extends ComponentPropsWithoutRef<'div'> {
  children: React.ReactNode;
  delay?: number;
}

export const AnimatedList = React.memo(
  ({ children, className, delay = 1000, ...props }: AnimatedListProps) => {
    const [index, setIndex] = useState(0);
    const childrenArray = useMemo(() => React.Children.toArray(children), [children]);

    useEffect(() => {
      let timeout: ReturnType<typeof setTimeout> | null = null;

      if (index < childrenArray.length - 1) {
        timeout = setTimeout(() => {
          setIndex((prevIndex) => (prevIndex + 1) % childrenArray.length);
        }, delay);
      }

      return () => {
        if (timeout !== null) {
          clearTimeout(timeout);
        }
      };
    }, [index, delay, childrenArray.length]);

    const itemsToShow = useMemo(() => {
      const result = childrenArray.slice(0, index + 1).reverse();
      return result;
    }, [index, childrenArray]);

    return (
      <div className={cn(`flex flex-col items-center gap-4`, className)} {...props}>
        <AnimatePresence>
          {itemsToShow.map((item) => (
            <AnimatedListItem key={(item as React.ReactElement).key}>{item}</AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    );
  }
);

AnimatedList.displayName = 'AnimatedList';
