/**
 * @kit name: AuroraText
 * @kit group: text
 * @kit use: Text filled with a slowly drifting multi-colour gradient; choose it to highlight a key word inside a headline.
 * @kit props: children, colors (['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)']), speed (1), className
 * @kit example: <h1>Build <AuroraText>faster</AuroraText></h1>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/aurora-text
 */
import { cn } from '@/lib/utils';
import { memo, type CSSProperties, type ReactNode } from 'react';

interface AuroraTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  speed?: number;
}

const DEFAULT_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)'];

export const AuroraText = memo(
  ({ children, className = '', colors = DEFAULT_COLORS, speed = 1 }: AuroraTextProps) => {
    const gradientStyle: CSSProperties = {
      backgroundImage: `linear-gradient(135deg, ${colors.join(', ')}, ${colors[0] ?? 'var(--chart-1)'})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      animationDuration: `${10 / speed}s`
    };

    return (
      <span className={cn('relative inline-block', className)}>
        <span className="sr-only">{children}</span>
        <span
          className="kit-aurora-text relative bg-size-[200%_auto] bg-clip-text text-transparent"
          style={gradientStyle}
          aria-hidden="true"
        >
          {children}
        </span>
      </span>
    );
  }
);

AuroraText.displayName = 'AuroraText';
