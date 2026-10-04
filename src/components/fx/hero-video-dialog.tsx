/**
 * @kit name: HeroVideoDialog
 * @kit group: media
 * @kit use: A thumbnail with a play button that opens a video (YouTube/Vimeo embed URL or a video file) in a full-screen overlay; use it for a product demo or hero video.
 * @kit props: videoSrc (embed URL or .mp4/.webm file), thumbnailSrc, thumbnailAlt, animationStyle ("from-center" | "from-bottom" | "from-top" | "from-left" | "from-right" | "fade" | "top-in-bottom-out" | "left-in-right-out"), className
 * @kit example: <HeroVideoDialog videoSrc="https://www.youtube.com/embed/dQw4w9WgXcQ" thumbnailSrc="/thumb.jpg" className="w-full" />
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/hero-video-dialog
 */
import { cn } from '@/lib/utils';
import { Play, XIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

type AnimationStyle =
  | 'from-bottom'
  | 'from-center'
  | 'from-top'
  | 'from-left'
  | 'from-right'
  | 'fade'
  | 'top-in-bottom-out'
  | 'left-in-right-out';

interface HeroVideoProps {
  animationStyle?: AnimationStyle;
  videoSrc: string;
  thumbnailSrc: string;
  thumbnailAlt?: string;
  className?: string;
}

const animationVariants = {
  'from-bottom': {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 }
  },
  'from-center': {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 }
  },
  'from-top': {
    initial: { y: '-100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '-100%', opacity: 0 }
  },
  'from-left': {
    initial: { x: '-100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 }
  },
  'from-right': {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 }
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  'top-in-bottom-out': {
    initial: { y: '-100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 }
  },
  'left-in-right-out': {
    initial: { x: '-100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 }
  }
};

const VIDEO_FILE = /\.(mp4|webm|ogg|mov)(\?.*)?$/i;

export function HeroVideoDialog({
  animationStyle = 'from-center',
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = 'Video thumbnail',
  className
}: HeroVideoProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const selectedAnimation = animationVariants[animationStyle];
  const isFile = VIDEO_FILE.test(videoSrc);

  const close = () => {
    setIsVideoOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!isVideoOpen) return;
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVideoOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isVideoOpen]);

  return (
    <div className={cn('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Play video"
        className="group focus-visible:ring-ring/50 relative cursor-pointer rounded-md border-0 bg-transparent p-0 outline-none focus-visible:ring-3"
        onClick={() => setIsVideoOpen(true)}
      >
        <img
          src={thumbnailSrc}
          alt={thumbnailAlt}
          width={1920}
          height={1080}
          className="border-border w-full rounded-md border shadow-lg transition-all duration-200 ease-out group-hover:brightness-[0.8]"
        />
        <div className="absolute inset-0 flex scale-[0.9] items-center justify-center rounded-2xl transition-all duration-200 ease-out group-hover:scale-100">
          <div className="bg-primary/10 flex size-28 items-center justify-center rounded-full backdrop-blur-md">
            <div className="from-primary/30 to-primary relative flex size-20 scale-100 items-center justify-center rounded-full bg-linear-to-b shadow-md transition-all duration-200 ease-out group-hover:scale-[1.2]">
              <Play
                aria-hidden="true"
                className="fill-primary-foreground text-primary-foreground size-8 scale-100 drop-shadow-md transition-transform duration-200 ease-out group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </button>
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Video player"
            onClick={close}
            className="bg-scrim/50 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
          >
            <motion.div
              {...selectedAnimation}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative mx-4 aspect-video w-full max-w-4xl md:mx-0"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                ref={closeRef}
                type="button"
                aria-label="Close video"
                onClick={close}
                onKeyDown={(e) => {
                  if (e.key === 'Tab') e.preventDefault();
                }}
                className="bg-scrim/50 text-on-scrim ring-on-scrim/40 focus-visible:ring-on-scrim absolute -top-16 right-0 cursor-pointer rounded-full p-2 text-xl ring-1 backdrop-blur-md outline-none focus-visible:ring-2"
              >
                <XIcon aria-hidden="true" className="size-5" />
              </button>
              <div className="border-on-scrim bg-scrim relative isolate z-1 size-full overflow-hidden rounded-2xl border-2">
                {isFile ? (
                  <video
                    src={videoSrc}
                    className="size-full rounded-2xl"
                    controls
                    autoPlay
                    playsInline
                  />
                ) : (
                  <iframe
                    src={videoSrc}
                    title="Hero Video player"
                    className="mt-0 size-full rounded-2xl"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  ></iframe>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
