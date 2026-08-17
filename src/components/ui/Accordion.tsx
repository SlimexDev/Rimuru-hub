'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItem {
  id: string;
  question: string;
  answer: string | React.ReactNode;
  icon?: React.ReactNode;
}

export interface GlassAccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export const GlassAccordion: React.FC<GlassAccordionProps> = ({
  items,
  allowMultiple = false,
  className,
}) => {
  const [openIds, setOpenIds] = useState<string[]>([items[0]?.id || '']);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={cn('space-y-3.5', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div
            key={item.id}
            className={cn(
              'glass-card rounded-2xl md:rounded-3xl border border-white/10 transition-all duration-300 overflow-hidden',
              isOpen && 'border-emerald-500/30 shadow-glass bg-white/[0.07]'
            )}
          >
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer select-none transition-colors"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3.5 pr-4">
                {item.icon && (
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                    {item.icon}
                  </div>
                )}
                <span className="font-semibold text-white/95 text-base md:text-lg tracking-tight">
                  {item.question}
                </span>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-white/70 border border-white/10"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="px-5 pb-6 md:px-6 md:pb-6 text-white/70 text-sm md:text-base leading-relaxed border-t border-white/5 pt-4">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
