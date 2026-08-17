'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface GlassButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-4 py-1.5 text-xs rounded-full gap-1.5',
      md: 'px-6 py-2.5 text-sm rounded-full gap-2',
      lg: 'px-8 py-3.5 text-base rounded-full gap-2.5 font-medium',
      icon: 'p-2.5 rounded-full aspect-square justify-center',
    };

    const variantClasses = {
      primary: 'glass-btn-primary text-white font-semibold shadow-emerald-glow',
      secondary:
        'bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-xl shadow-glass',
      outline:
        'bg-transparent hover:bg-white/10 text-white/90 border border-white/25 backdrop-blur-md',
      ghost: 'bg-transparent hover:bg-white/10 text-white/80 hover:text-white',
      danger:
        'bg-red-500/80 hover:bg-red-500 text-white border border-red-400/30 backdrop-blur-md shadow-lg shadow-red-500/20',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.025 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.975 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center select-none font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

GlassButton.displayName = 'GlassButton';
