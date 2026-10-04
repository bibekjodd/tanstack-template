import { cn } from '@/lib/utils';
import { ImageOff } from 'lucide-react';
import { type ComponentProps, useEffect, useRef, useState } from 'react';

/**
 * @kit name: Photo
 * @kit group: media
 * @kit use: An image with a reserved box (no layout shift), lazy loading, a calm placeholder while it loads and a tidy fallback if the file is missing, instead of the browser's broken-image icon. Use it for every photo and illustration; set priority on the first big image of a page.
 * @kit props: src, alt (required), width, height (the rendered size, required), aspect ('16/9', '4/3', '1/1', ...), priority, rounded, fit ('cover'|'contain')
 * @kit example: <Photo src="/images/hero.webp" alt="Roasting beans" width={1200} height={800} priority aspect="3/2" rounded />
 */
export function Photo({
  src,
  alt,
  width,
  height,
  aspect,
  priority = false,
  rounded = false,
  fit = 'cover',
  className,
  ...props
}: Omit<ComponentProps<'img'>, 'width' | 'height' | 'loading'> & {
  alt: string;
  width: number;
  height: number;
  aspect?: string;
  priority?: boolean;
  rounded?: boolean;
  fit?: 'cover' | 'contain';
}) {
  const [failed, setFailed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // A file that is missing can fail before React has attached onError (the server HTML is shown
  // first), so the image's own state is read once after mount and whenever src changes.
  useEffect(() => {
    const image = imageRef.current;
    setFailed(Boolean(image && image.complete && image.naturalWidth === 0));
  }, [src]);
  const frame = cn('bg-muted relative overflow-hidden', rounded && 'rounded-xl', className);
  const box = { aspectRatio: aspect ?? `${width} / ${height}` };

  if (failed || !src) {
    return (
      <div
        className={cn(frame, 'text-muted-foreground flex items-center justify-center')}
        style={box}
        role="img"
        aria-label={alt}
      >
        <ImageOff className="size-6 opacity-60" aria-hidden="true" />
      </div>
    );
  }
  return (
    <div className={frame} style={box}>
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        {...(priority ? { fetchPriority: 'high' as const } : {})}
        onError={() => setFailed(true)}
        className={cn('size-full', fit === 'cover' ? 'object-cover' : 'object-contain')}
        {...props}
      />
    </div>
  );
}
