'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glowEffect?: boolean;
  specularHighlight?: boolean;
  interactive?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      className,
      hoverEffect = false,
      glowEffect = false,
      specularHighlight = true,
      interactive = false,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        initial={interactive ? { opacity: 0, y: 15 } : undefined}
        animate={interactive ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'glass-card rounded-3xl relative overflow-hidden transition-all duration-300',
          specularHighlight && 'specular-top',
          hoverEffect && 'glass-card-hover cursor-pointer',
          glowEffect && 'shadow-glass-glow border-emerald-500/30',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
