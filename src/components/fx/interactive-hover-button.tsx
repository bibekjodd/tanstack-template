/**
 * @kit name: InteractiveHoverButton
 * @kit group: buttons
 * @kit use: A pill button with a dot that expands to fill it and reveals an arrow on hover; choose it for friendly navigation calls to action.
 * @kit props: children, className, plus button props
 * @kit example: <InteractiveHoverButton>Explore</InteractiveHoverButton>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/interactive-hover-button
 */
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export function InteractiveHoverButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'group bg-background border-border focus-visible:ring-ring/50 relative min-h-10 w-auto cursor-pointer overflow-hidden rounded-full border p-2 px-6 text-center font-semibold outline-none focus-visible:ring-3',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        <div className="bg-primary h-2 w-2 rounded-full transition-all duration-300 group-hover:scale-[100.8] group-focus-visible:scale-[100.8]"></div>
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0 group-focus-visible:translate-x-12 group-focus-visible:opacity-0">
          {children}
        </span>
      </div>
      <div
        aria-hidden="true"
        className="text-primary-foreground absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100 group-focus-visible:-translate-x-5 group-focus-visible:opacity-100"
      >
        <span>{children}</span>
        <ArrowRight className="size-4" />
      </div>
    </button>
  );
}
