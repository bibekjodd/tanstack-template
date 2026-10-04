/**
 * @kit name: BentoGrid, BentoCard
 * @kit group: layout
 * @kit use: A three-column bento layout of feature cards with a background visual, icon, text and a call-to-action link that appears on hover; use it for feature showcases.
 * @kit props: BentoGrid: className (set grid-cols / auto-rows). BentoCard: name, description, Icon (component), background (node), href, cta, className (set col-span / row-span, required)
 * @kit example: <BentoGrid><BentoCard name="Fast" description="Loads instantly." Icon={ZapIcon} href="/fast" cta="Learn more" background={<div />} className="lg:col-span-1" /></BentoGrid>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/bento-grid
 */
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { type ComponentPropsWithoutRef, type ReactNode } from 'react';

interface BentoGridProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<'div'> {
  name: string;
  className: string;
  background: ReactNode;
  Icon: React.ElementType;
  description: string;
  href: string;
  cta: string;
}

const ctaLinkClass = cn(
  buttonVariants({ variant: 'link', size: 'sm' }),
  'pointer-events-auto h-10 p-0'
);

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div className={cn('grid w-full auto-rows-[22rem] grid-cols-3 gap-4', className)} {...props}>
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => (
  <div
    className={cn(
      'group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl',
      // light styles
      'bg-background [box-shadow:0_0_0_1px_color-mix(in_oklab,var(--foreground)_4%,transparent),0_2px_4px_color-mix(in_oklab,var(--foreground)_6%,transparent),0_12px_24px_color-mix(in_oklab,var(--foreground)_6%,transparent)]',
      // dark styles
      'border-foreground/0 transform-gpu dark:[box-shadow:0_-20px_80px_-20px_color-mix(in_oklab,var(--foreground)_12%,transparent)_inset] dark:[border:1px_solid_color-mix(in_oklab,var(--foreground)_10%,transparent)]',
      className
    )}
    {...props}
  >
    <div>{background}</div>
    <div className="p-4">
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 transition-all duration-300 lg:group-focus-within:-translate-y-10 lg:group-hover:-translate-y-10">
        <Icon className="text-foreground/80 h-12 w-12 origin-left transform-gpu transition-all duration-300 ease-in-out group-hover:scale-75" />
        <h3 className="text-foreground text-xl font-semibold">{name}</h3>
        <p className="text-muted-foreground max-w-lg">{description}</p>
      </div>

      <div className="pointer-events-none flex w-full translate-y-0 transform-gpu flex-row items-center transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:hidden">
        <a href={href} className={ctaLinkClass}>
          {cta}
          <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
        </a>
      </div>
    </div>

    <div className="pointer-events-none absolute bottom-0 hidden w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 lg:flex">
      <a href={href} className={ctaLinkClass}>
        {cta}
        <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
      </a>
    </div>

    <div
      aria-hidden="true"
      className="group-hover:bg-foreground/5 pointer-events-none absolute inset-0 transform-gpu transition-all duration-300"
    />
  </div>
);

export { BentoCard, BentoGrid };
