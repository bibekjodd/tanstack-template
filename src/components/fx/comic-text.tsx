/**
 * @kit name: ComicText
 * @kit group: text
 * @kit use: Comic-book style outlined, halftone-dotted text with a pop-in entrance; choose it for playful, loud headings (uses the Bangers font when the site loads it).
 * @kit props: children (string, required), fontSize (5, rem), className, style
 * @kit example: <ComicText fontSize={6}>Boom!</ComicText>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/comic-text
 */
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { type CSSProperties } from 'react';

type ComicTextProps = {
  children: string;
  className?: string;
  style?: CSSProperties;
  fontSize?: number;
};

export function ComicText({ children, className, style, fontSize = 5 }: ComicTextProps) {
  if (typeof children !== 'string') {
    throw new Error('children must be a string');
  }

  const dotColor = 'var(--destructive)';
  const backgroundColor = 'var(--warning)';
  const outlineColor = 'var(--scrim)';

  return (
    <motion.div
      className={cn('text-center select-none', className)}
      style={{
        fontSize: `${fontSize}rem`,
        fontFamily: "'Bangers', 'Comic Sans MS', 'Impact', sans-serif",
        fontWeight: '900',
        WebkitTextStroke: `${fontSize * 0.35}px ${outlineColor}`, // Thick dark outline
        transform: 'skewX(-10deg)',
        textTransform: 'uppercase',
        filter: `
          drop-shadow(5px 5px 0px ${outlineColor})
          drop-shadow(3px 3px 0px ${dotColor})
        `,
        backgroundColor: backgroundColor,
        backgroundImage: `radial-gradient(circle at 1px 1px, ${dotColor} 1px, transparent 0)`,
        backgroundSize: '8px 8px',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        ...style
      }}
      initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.175, 0.885, 0.32, 1.275],
        type: 'spring'
      }}
    >
      {children}
    </motion.div>
  );
}
