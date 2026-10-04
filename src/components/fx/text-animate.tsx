/**
 * @kit name: TextAnimate
 * @kit group: text
 * @kit use: Animates text in by word, character, line or whole text with presets like blurIn, slideUp, scaleUp; choose it for scroll-triggered headline and paragraph entrances.
 * @kit props: children (string, required), by ('word' | 'character' | 'line' | 'text'), animation ('fadeIn' | 'blurIn' | 'blurInUp' | 'slideUp' | 'scaleUp' ...), delay, duration (0.3), startOnView (true), once (false), as ('p')
 * @kit example: <TextAnimate animation="blurInUp" by="word">Welcome to the future</TextAnimate>
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/text-animate
 */
import { cn } from '@/lib/utils';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type DOMMotionComponents,
  type MotionProps,
  type Variants
} from 'motion/react';
import { memo } from 'react';

type AnimationType = 'text' | 'word' | 'character' | 'line';
type AnimationVariant =
  | 'fadeIn'
  | 'blurIn'
  | 'blurInUp'
  | 'blurInDown'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleUp'
  | 'scaleDown';

const motionElements = {
  article: motion.article,
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  li: motion.li,
  p: motion.p,
  section: motion.section,
  span: motion.span
} as const;

type MotionElementType = Extract<keyof DOMMotionComponents, keyof typeof motionElements>;

interface TextAnimateProps extends Omit<MotionProps, 'children'> {
  /**
   * The text content to animate
   */
  children: string;
  /**
   * The class name to be applied to the component
   */
  className?: string;
  /**
   * The class name to be applied to each segment
   */
  segmentClassName?: string;
  /**
   * The delay before the animation starts
   */
  delay?: number;
  /**
   * The duration of the animation
   */
  duration?: number;
  /**
   * Custom motion variants for the animation
   */
  variants?: Variants;
  /**
   * The element type to render
   */
  as?: MotionElementType;
  /**
   * How to split the text ("text", "word", "character")
   */
  by?: AnimationType;
  /**
   * Whether to start animation when component enters viewport
   */
  startOnView?: boolean;
  /**
   * Whether to animate only once
   */
  once?: boolean;
  /**
   * The animation preset to use
   */
  animation?: AnimationVariant;
  /**
   * Whether to enable accessibility features (default: true)
   */
  accessible?: boolean;
}

const staggerTimings: Record<AnimationType, number> = {
  text: 0.06,
  word: 0.05,
  character: 0.03,
  line: 0.06
};

const defaultContainerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0,
      staggerChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1
  },
  exit: {
    opacity: 0
  }
};

const defaultItemAnimationVariants: Record<
  AnimationVariant,
  { container: Variants; item: Variants }
> = {
  fadeIn: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.3
        }
      },
      exit: {
        opacity: 0,
        y: 20,
        transition: { duration: 0.3 }
      }
    }
  },
  blurIn: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: 'blur(10px)' },
      show: {
        opacity: 1,
        filter: 'blur(0px)',
        transition: {
          duration: 0.3
        }
      },
      exit: {
        opacity: 0,
        filter: 'blur(10px)',
        transition: { duration: 0.3 }
      }
    }
  },
  blurInUp: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: 'blur(10px)', y: 20 },
      show: {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        transition: {
          y: { duration: 0.3 },
          opacity: { duration: 0.4 },
          filter: { duration: 0.3 }
        }
      },
      exit: {
        opacity: 0,
        filter: 'blur(10px)',
        y: 20,
        transition: {
          y: { duration: 0.3 },
          opacity: { duration: 0.4 },
          filter: { duration: 0.3 }
        }
      }
    }
  },
  blurInDown: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: 'blur(10px)', y: -20 },
      show: {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        transition: {
          y: { duration: 0.3 },
          opacity: { duration: 0.4 },
          filter: { duration: 0.3 }
        }
      }
    }
  },
  slideUp: {
    container: defaultContainerVariants,
    item: {
      hidden: { y: 20, opacity: 0 },
      show: {
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.3
        }
      },
      exit: {
        y: -20,
        opacity: 0,
        transition: {
          duration: 0.3
        }
      }
    }
  },
  slideDown: {
    container: defaultContainerVariants,
    item: {
      hidden: { y: -20, opacity: 0 },
      show: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.3 }
      },
      exit: {
        y: 20,
        opacity: 0,
        transition: { duration: 0.3 }
      }
    }
  },
  slideLeft: {
    container: defaultContainerVariants,
    item: {
      hidden: { x: 20, opacity: 0 },
      show: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.3 }
      },
      exit: {
        x: -20,
        opacity: 0,
        transition: { duration: 0.3 }
      }
    }
  },
  slideRight: {
    container: defaultContainerVariants,
    item: {
      hidden: { x: -20, opacity: 0 },
      show: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.3 }
      },
      exit: {
        x: 20,
        opacity: 0,
        transition: { duration: 0.3 }
      }
    }
  },
  scaleUp: {
    container: defaultContainerVariants,
    item: {
      hidden: { scale: 0.5, opacity: 0 },
      show: {
        scale: 1,
        opacity: 1,
        transition: {
          duration: 0.3,
          scale: {
            type: 'spring',
            damping: 15,
            stiffness: 300
          }
        }
      },
      exit: {
        scale: 0.5,
        opacity: 0,
        transition: { duration: 0.3 }
      }
    }
  },
  scaleDown: {
    container: defaultContainerVariants,
    item: {
      hidden: { scale: 1.5, opacity: 0 },
      show: {
        scale: 1,
        opacity: 1,
        transition: {
          duration: 0.3,
          scale: {
            type: 'spring',
            damping: 15,
            stiffness: 300
          }
        }
      },
      exit: {
        scale: 1.5,
        opacity: 0,
        transition: { duration: 0.3 }
      }
    }
  }
};

const TextAnimateBase = ({
  children,
  delay = 0,
  duration = 0.3,
  variants,
  className,
  segmentClassName,
  as: Component = 'p',
  startOnView = true,
  once = false,
  by = 'word',
  animation = 'fadeIn',
  accessible = true,
  ...props
}: TextAnimateProps) => {
  const MotionComponent = motionElements[Component];
  const reduceMotion = useReducedMotion();

  let segments: string[] = [];
  switch (by) {
    case 'word':
      segments = children.split(/(\s+)/);
      break;
    case 'character':
      segments = children.split('');
      break;
    case 'line':
      segments = children.split('\n');
      break;
    case 'text':
    default:
      segments = [children];
      break;
  }

  const finalVariants = variants
    ? {
        container: {
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              opacity: { duration: 0.01, delay },
              delayChildren: delay,
              staggerChildren: duration / segments.length
            }
          },
          exit: {
            opacity: 0,
            transition: {
              staggerChildren: duration / segments.length,
              staggerDirection: -1
            }
          }
        },
        item: variants
      }
    : animation
      ? {
          container: {
            ...defaultItemAnimationVariants[animation].container,
            show: {
              ...defaultItemAnimationVariants[animation].container.show,
              transition: {
                delayChildren: delay,
                staggerChildren: duration / segments.length
              }
            },
            exit: {
              ...defaultItemAnimationVariants[animation].container.exit,
              transition: {
                staggerChildren: duration / segments.length,
                staggerDirection: -1
              }
            }
          },
          item: defaultItemAnimationVariants[animation].item
        }
      : { container: defaultContainerVariants, item: defaultItemVariants };

  return (
    <AnimatePresence mode="popLayout">
      <MotionComponent
        variants={finalVariants.container as Variants}
        initial={reduceMotion ? 'show' : 'hidden'}
        whileInView={startOnView ? 'show' : undefined}
        animate={startOnView ? undefined : 'show'}
        exit="exit"
        className={cn('whitespace-pre-wrap', className)}
        viewport={{ once }}
        aria-label={accessible ? children : undefined}
        {...props}
      >
        {accessible && <span className="sr-only">{children}</span>}
        {segments.map((segment, i) => (
          <motion.span
            key={`${by}-${segment}-${i}`}
            variants={finalVariants.item}
            custom={i * staggerTimings[by]}
            className={cn(
              by === 'line' ? 'block' : 'inline-block whitespace-pre',
              by === 'character' && '',
              segmentClassName
            )}
            aria-hidden={accessible ? true : undefined}
          >
            {segment}
          </motion.span>
        ))}
      </MotionComponent>
    </AnimatePresence>
  );
};

// Export the memoized version
export const TextAnimate = memo(TextAnimateBase);
