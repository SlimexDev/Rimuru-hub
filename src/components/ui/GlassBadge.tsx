import React from 'react';
import { cn } from '@/lib/utils';

export interface GlassBadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'sky' | 'emerald' | 'purple' | 'amber' | 'neutral' | 'verified';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const GlassBadge: React.FC<GlassBadgeProps> = ({
  children,
  variant = 'cyan',
  size = 'md',
  icon,
  className,
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1',
    md: 'text-xs px-3.5 py-1 gap-1.5',
  };

  const variantStyles = {
    cyan:
      'bg-cyan-500/15 text-cyan-300 border-cyan-400/30 shadow-[0_0_12px_rgba(6,182,212,0.25)]',
    sky:
      'bg-sky-500/15 text-sky-300 border-sky-400/30 shadow-[0_0_12px_rgba(56,189,248,0.25)]',
    emerald:
      'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
    purple:
      'bg-purple-500/15 text-purple-300 border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.2)]',
    amber:
      'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]',
    neutral:
      'bg-white/10 text-white/90 border-white/15',
    verified:
      'bg-sky-500/20 text-sky-300 border-sky-400/40 font-medium shadow-[0_0_12px_rgba(56,189,248,0.3)]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium border backdrop-blur-md transition-all select-none',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
