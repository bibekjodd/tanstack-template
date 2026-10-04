import { Toaster } from '@/components/ui/toast';
import { TooltipProvider } from '@/components/ui/tooltip';
import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    // reducedMotion="user": every motion component honours the visitor's reduced-motion setting.
    <MotionConfig reducedMotion="user">
      <TooltipProvider delay={150}>
        {children}
        <Toaster />
      </TooltipProvider>
    </MotionConfig>
  );
}
