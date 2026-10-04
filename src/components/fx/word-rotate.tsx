/**
 * @kit name: WordRotate
 * @kit group: text
 * @kit use: A heading that swaps through a list of words with a slide-fade transition; choose it for a rotating value word inside a headline.
 * @kit props: words (string[], required), duration (2500 ms), motionProps, className
 * @kit example: <WordRotate words={['Fast', 'Simple', 'Beautiful']} className="text-4xl font-bold" />
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/word-rotate
 */
import { cn } from '@/lib/utils';
import { AnimatePresence, motion, useReducedMotion, type MotionProps } from 'motion/react';
import { useEffect, useState } from 'react';

interface WordRotateProps {
  words: string[];
  duration?: number;
  motionProps?: MotionProps;
  className?: string;
}

export function WordRotate({
  words,
  duration = 2500,
  motionProps = {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
    transition: { duration: 0.25, ease: 'easeOut' }
  },
  className
}: WordRotateProps) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || words.length < 2) return;
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [words, duration, reduceMotion]);

  return (
    <div className="overflow-hidden py-2">
      <AnimatePresence mode="wait">
        <motion.h1 key={words[index]} className={cn(className)} {...motionProps}>
          {words[index]}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}
