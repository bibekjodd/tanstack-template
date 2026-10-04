/**
 * @kit name: VideoText
 * @kit group: media
 * @kit use: Big text that acts as a window onto a looping video; choose it for a hero word over footage (you supply the video URL).
 * @kit props: src (video URL, required), children (text), fontSize (20, vw), fontWeight ('bold'), fontFamily ('sans-serif'), autoPlay/muted/loop (true), className
 * @kit example: <div className="relative h-64"><VideoText src={videoUrl}>OCEAN</VideoText></div>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/video-text
 */
import { cn } from '@/lib/utils';
import { useReducedMotion } from 'motion/react';
import { Children, useMemo, type ElementType, type ReactNode } from 'react';

export interface VideoTextProps {
  /**
   * The video source URL (required: no default video is bundled)
   */
  src: string;
  /**
   * Additional className for the container
   */
  className?: string;
  /**
   * Whether to autoplay the video (never autoplays when the visitor prefers reduced motion)
   */
  autoPlay?: boolean;
  /**
   * Whether to mute the video
   */
  muted?: boolean;
  /**
   * Whether to loop the video
   */
  loop?: boolean;
  /**
   * Whether to preload the video
   */
  preload?: 'auto' | 'metadata' | 'none';
  /**
   * The content to display (will have the video "inside" it)
   */
  children: ReactNode;
  /**
   * Font size for the text mask (in viewport width units when a number)
   * @default 20
   */
  fontSize?: string | number;
  /**
   * Font weight for the text mask
   * @default "bold"
   */
  fontWeight?: string | number;
  /**
   * Text anchor for the text mask
   * @default "middle"
   */
  textAnchor?: string;
  /**
   * Dominant baseline for the text mask
   * @default "middle"
   */
  dominantBaseline?: string;
  /**
   * Font family for the text mask
   * @default "sans-serif"
   */
  fontFamily?: string;
  /**
   * The element type to render for the text
   * @default "div"
   */
  as?: ElementType;
}

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&apos;')
    .replace(/"/g, '&quot;');

export function VideoText({
  src,
  children,
  className = '',
  autoPlay = true,
  muted = true,
  loop = true,
  preload = 'auto',
  fontSize = 20,
  fontWeight = 'bold',
  textAnchor = 'middle',
  dominantBaseline = 'middle',
  fontFamily = 'sans-serif',
  as: Component = 'div'
}: VideoTextProps) {
  const reduceMotion = useReducedMotion();
  const content = Children.toArray(children).join('');

  const dataUrlMask = useMemo(() => {
    const responsiveFontSize = typeof fontSize === 'number' ? `${fontSize}vw` : fontSize;
    const svgMask = `<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'><text x='50%' y='50%' font-size='${escapeXml(responsiveFontSize)}' font-weight='${escapeXml(String(fontWeight))}' text-anchor='${escapeXml(textAnchor)}' dominant-baseline='${escapeXml(dominantBaseline)}' font-family='${escapeXml(fontFamily)}'>${escapeXml(content)}</text></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svgMask)}")`;
  }, [content, fontSize, fontWeight, textAnchor, dominantBaseline, fontFamily]);

  return (
    <Component className={cn('relative size-full', className)}>
      {/* Masks the video so it only shows inside the text */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center"
        style={{
          maskImage: dataUrlMask,
          WebkitMaskImage: dataUrlMask,
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center'
        }}
      >
        <video
          className="h-full w-full object-cover"
          autoPlay={autoPlay && !reduceMotion}
          muted={muted}
          loop={loop}
          preload={preload}
          playsInline
        >
          <source src={src} />
        </video>
      </div>

      {/* Real text for search engines and screen readers */}
      <span className="sr-only">{content}</span>
    </Component>
  );
}
