/**
 * @kit name: NeonGradientCard
 * @kit group: cards
 * @kit use: A card wrapped in an animated, glowing two-colour gradient border; pick it to spotlight one hero card or offer.
 * @kit props: borderSize (2), borderRadius (20), neonColors ({ firstColor: 'var(--chart-1)', secondColor: 'var(--chart-2)' }), className
 * @kit example: <NeonGradientCard className="max-w-sm">Content</NeonGradientCard>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/neon-gradient-card
 */
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

interface NeonColorsProps {
  firstColor: string;
  secondColor: string;
}

interface NeonGradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The className of the card */
  className?: string;
  /** The children of the card */
  children?: ReactNode;
  /** The size of the border in pixels */
  borderSize?: number;
  /** The size of the radius in pixels */
  borderRadius?: number;
  /** The colors of the neon gradient (any CSS colour or var(--token)) */
  neonColors?: NeonColorsProps;
}

export const NeonGradientCard: React.FC<NeonGradientCardProps> = ({
  className,
  children,
  borderSize = 2,
  borderRadius = 20,
  neonColors = {
    firstColor: 'var(--chart-1)',
    secondColor: 'var(--chart-2)'
  },
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setDimensions({ width: offsetWidth, height: offsetHeight });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, [children]);

  return (
    <div
      ref={containerRef}
      style={
        {
          '--border-size': `${borderSize}px`,
          '--border-radius': `${borderRadius}px`,
          '--neon-first-color': neonColors.firstColor,
          '--neon-second-color': neonColors.secondColor,
          '--card-width': `${dimensions.width}px`,
          '--card-height': `${dimensions.height}px`,
          '--card-content-radius': `${borderRadius - borderSize}px`,
          '--pseudo-element-width': `${dimensions.width + borderSize * 2}px`,
          '--pseudo-element-height': `${dimensions.height + borderSize * 2}px`,
          '--after-blur': `${dimensions.width / 3}px`
        } as CSSProperties
      }
      className={cn('relative z-10 size-full rounded-(--border-radius)', className)}
      {...props}
    >
      <div
        className={cn(
          'kit-neon-card bg-card text-card-foreground relative size-full min-h-[inherit] rounded-(--card-content-radius) p-6',
          'before:absolute before:-top-(--border-size) before:-left-(--border-size) before:-z-10 before:block',
          "before:h-(--pseudo-element-height) before:w-(--pseudo-element-width) before:rounded-(--border-radius) before:content-['']",
          'before:bg-[linear-gradient(0deg,var(--neon-first-color),var(--neon-second-color))] before:bg-size-[100%_200%]',
          'after:absolute after:-top-(--border-size) after:-left-(--border-size) after:-z-10 after:block',
          "after:h-(--pseudo-element-height) after:w-(--pseudo-element-width) after:rounded-(--border-radius) after:blur-(--after-blur) after:content-['']",
          'after:bg-[linear-gradient(0deg,var(--neon-first-color),var(--neon-second-color))] after:bg-size-[100%_200%] after:opacity-80',
          'wrap-break-word'
        )}
      >
        {children}
      </div>
    </div>
  );
};
