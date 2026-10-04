/**
 * @kit name: Confetti, ConfettiButton
 * @kit group: interaction
 * @kit use: Confetti bursts in the theme's accent colours: a canvas you fire from code (Confetti) or a button that bursts from itself when clicked (ConfettiButton); use for success moments. Skipped when the visitor prefers reduced motion.
 * @kit props: Confetti: options, globalOptions, manualstart, ref.fire(); ConfettiButton: options plus all Button props
 * @kit example: <ConfettiButton options={{ particleCount: 120 }}>Celebrate</ConfettiButton>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/confetti
 */
import { Button } from '@/components/ui/button';
import { colorToRgb } from '@/lib/css-color';
import { cn } from '@/lib/utils';
import type {
  GlobalOptions as ConfettiGlobalOptions,
  CreateTypes as ConfettiInstance,
  Options as ConfettiOptions
} from 'canvas-confetti';
import confetti from 'canvas-confetti';
import type { ReactNode } from 'react';
import React, {
  createContext,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef
} from 'react';

export type ConfettiRef = {
  fire: (options?: ConfettiOptions) => Promise<void> | void;
};

type Props = Omit<React.ComponentPropsWithRef<'canvas'>, 'ref'> & {
  options?: ConfettiOptions;
  globalOptions?: ConfettiGlobalOptions;
  manualstart?: boolean;
  children?: ReactNode;
};

const ConfettiContext = createContext<ConfettiRef | null>(null);

const PALETTE = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)'
];

// canvas-confetti only reads hex strings, so the theme's colours are turned into hex at fire time.
const themeColors = (): string[] =>
  PALETTE.map((color) => {
    const [r, g, b] = colorToRgb(color);
    return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
  });

const ConfettiComponent = forwardRef<ConfettiRef, Props>((props, ref) => {
  const {
    options,
    globalOptions = { resize: true, useWorker: true },
    manualstart = false,
    children,
    className,
    ...rest
  } = props;

  const canvasNodeRef = useRef<HTMLCanvasElement | null>(null);
  const instanceRef = useRef<ConfettiInstance | null>(null);
  const optionsRef = useRef(options);
  const globalOptionsRef = useRef(globalOptions);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    globalOptionsRef.current = globalOptions;
  }, [globalOptions]);

  useEffect(() => {
    if (canvasNodeRef.current && !instanceRef.current) {
      instanceRef.current = confetti.create(canvasNodeRef.current, {
        resize: true,
        useWorker: true,
        disableForReducedMotion: true,
        ...globalOptionsRef.current
      });
    }

    return () => {
      instanceRef.current?.reset();
      instanceRef.current = null;
    };
  }, []);

  const fire = useCallback(async (opts: ConfettiOptions = {}) => {
    try {
      await instanceRef.current?.({
        colors: themeColors(),
        ...optionsRef.current,
        ...opts
      });
    } catch (error) {
      console.error('Confetti error:', error);
    }
  }, []);

  const api = useMemo<ConfettiRef>(() => ({ fire }), [fire]);

  useImperativeHandle(ref, () => api, [api]);

  useEffect(() => {
    if (!manualstart) {
      void fire();
    }
  }, [manualstart, fire]);

  return (
    <ConfettiContext.Provider value={api}>
      <canvas
        ref={canvasNodeRef}
        aria-hidden="true"
        className={cn('pointer-events-none', className)}
        {...rest}
      />
      {children}
    </ConfettiContext.Provider>
  );
});

ConfettiComponent.displayName = 'Confetti';

export const Confetti = ConfettiComponent;

export interface ConfettiButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  options?: ConfettiOptions & ConfettiGlobalOptions & { canvas?: HTMLCanvasElement };
}

export const ConfettiButton = forwardRef<HTMLButtonElement, ConfettiButtonProps>(
  ({ options, children, onClick, ...props }, ref) => {
    const handleClick: ConfettiButtonProps['onClick'] = async (event) => {
      try {
        onClick?.(event);
        if (event?.defaultPrevented) return;

        const target = event?.currentTarget;
        if (target && 'getBoundingClientRect' in target) {
          const rect = target.getBoundingClientRect();
          const origin = {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight
          };

          await confetti({
            zIndex: 9999,
            colors: themeColors(),
            disableForReducedMotion: true,
            ...options,
            origin
          });
        }
      } catch (error) {
        console.error('Confetti button error:', error);
      }
    };

    return (
      <Button ref={ref} type="button" onClick={handleClick} {...props}>
        {children}
      </Button>
    );
  }
);

ConfettiButton.displayName = 'ConfettiButton';
