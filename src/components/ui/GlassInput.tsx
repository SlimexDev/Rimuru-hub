import React from 'react';
import { cn } from '@/lib/utils';

export interface GlassInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, leftIcon, rightIcon, type = 'text', ...props }, ref) => {
    return (
      <div className="relative w-full flex items-center">
        {leftIcon && (
          <div className="absolute left-4 text-white/50 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'w-full bg-white/[0.06] hover:bg-white/[0.09] focus:bg-white/[0.12] text-white placeholder-white/40 border border-white/15 focus:border-emerald-400/60 rounded-2xl md:rounded-full px-5 py-3 text-sm backdrop-blur-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed',
            leftIcon && 'pl-11',
            rightIcon && 'pr-11',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-4 text-white/50 flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';

export interface GlassTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const GlassTextarea = React.forwardRef<
  HTMLTextAreaElement,
  GlassTextareaProps
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        'w-full bg-white/[0.06] hover:bg-white/[0.09] focus:bg-white/[0.12] text-white placeholder-white/40 border border-white/15 focus:border-emerald-400/60 rounded-2xl p-4 text-sm backdrop-blur-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-emerald-500/20 resize-y min-h-[120px] disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  );
});

GlassTextarea.displayName = 'GlassTextarea';
