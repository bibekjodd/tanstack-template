/**
 * @kit name: Pointer
 * @kit group: interaction
 * @kit use: Replaces the system cursor with a custom pointer while the mouse is over the parent element; does nothing on touch devices or with reduced motion, and the normal cursor stays over text fields.
 * @kit props: children (custom pointer, default arrow), className, style
 * @kit example: <div className="relative"><Pointer /> ...content... </div>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/pointer
 */
import { cn } from '@/lib/utils';
import { AnimatePresence, motion, useMotionValue, type HTMLMotionProps } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

const FINE_POINTER_QUERY = '(any-hover: hover) and (any-pointer: fine)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const TEXT_FIELD_SELECTOR = 'input, textarea, select, [contenteditable="true"]';

/**
 * Add this as a child to any element to show a custom pointer while hovering it.
 * Pass custom children to render as the pointer.
 */
export function Pointer({
  className,
  style,
  children,
  ...props
}: HTMLMotionProps<'div'>): React.ReactNode {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parentElement = containerRef.current?.parentElement ?? null;
    if (!parentElement) return;
    if (
      !window.matchMedia(FINE_POINTER_QUERY).matches ||
      window.matchMedia(REDUCED_MOTION_QUERY).matches
    ) {
      return;
    }

    const track = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const overTextField = e.target instanceof Element && e.target.closest(TEXT_FIELD_SELECTOR);
      setIsActive(!overTextField);
    };

    const handleMouseLeave = () => {
      setIsActive(false);
    };

    parentElement.classList.add('kit-pointer-host');
    parentElement.addEventListener('mousemove', track);
    parentElement.addEventListener('mouseenter', track);
    parentElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      parentElement.classList.remove('kit-pointer-host');
      parentElement.removeEventListener('mousemove', track);
      parentElement.removeEventListener('mouseenter', track);
      parentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [x, y]);

  return (
    <>
      <div ref={containerRef} aria-hidden="true" className="hidden" />
      <AnimatePresence>
        {isActive && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed z-50 transform-[translate(-50%,-50%)]"
            style={{
              top: y,
              left: x,
              ...style
            }}
            initial={{
              scale: 0,
              opacity: 0
            }}
            animate={{
              scale: 1,
              opacity: 1
            }}
            exit={{
              scale: 0,
              opacity: 0
            }}
            {...props}
          >
            {children || (
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="1"
                viewBox="0 0 16 16"
                height="24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
                className={cn('stroke-background text-foreground rotate-[-70deg]', className)}
              >
                <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
              </svg>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
