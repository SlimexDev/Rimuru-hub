'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, Download, Star, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GlassBadge } from '../ui/GlassBadge';
import { formatDate, formatCompactNumber } from '@/lib/utils';

export interface ScriptCardData {
  id: string;
  slug: string;
  title: string;
  banner: string;
  excerpt: string;
  executors: string | string[];
  features: string | string[];
  isVerified: boolean;
  isKeyless: boolean;
  views: number;
  downloads: number;
  rating: number;
  updatedAt: Date | string;
  game: {
    name: string;
    slug: string;
    icon: string;
  };
}

export const ScriptCard: React.FC<{ script: ScriptCardData; index?: number }> = ({
  script,
  index = 0,
}) => {
  const executorsList = typeof script.executors === 'string'
    ? JSON.parse(script.executors || '[]')
    : script.executors || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Link href={`/scripts/${script.slug}`} className="block group">
        <GlassCard
          hoverEffect
          className="h-full flex flex-col justify-between border-sky-500/15 hover:border-sky-400/40 group"
        >
          {/* Thumbnail Image Container */}
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/40 rounded-t-3xl">
            <Image
              src={script.banner}
              alt={script.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#041220] via-[#041220]/40 to-transparent" />

            {/* Badges on Top */}
            <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-1.5 z-10">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-sky-400/20 shadow-md">
                {script.game?.name || 'Roblox'}
              </span>
              {script.isVerified && (
                <GlassBadge variant="verified" size="sm" icon={<ShieldCheck className="w-3 h-3 text-sky-400" />}>
                  Verified
                </GlassBadge>
              )}
              {script.isKeyless && (
                <GlassBadge variant="cyan" size="sm" icon={<KeyRound className="w-3 h-3 text-cyan-400" />}>
                  Keyless
                </GlassBadge>
              )}
            </div>

            {/* Rating badge on top right */}
            <div className="absolute top-3.5 right-3.5 z-10">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-400 text-xs font-semibold border border-amber-500/30">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{script.rating?.toFixed(1) || '4.9'}</span>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-5 md:p-6 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <h3 className="text-base md:text-lg font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-2 leading-snug">
                {script.title}
              </h3>
              <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                {script.excerpt}
              </p>
            </div>

            {/* Executor Compatibility Chips */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap gap-1.5">
                {executorsList.slice(0, 3).map((exec: string) => (
                  <span
                    key={exec}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-200/80 border border-sky-500/20"
                  >
                    {exec}
                  </span>
                ))}
                {executorsList.length > 3 && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/50 border border-white/10">
                    +{executorsList.length - 3}
                  </span>
                )}
              </div>

              {/* Meta Stats & Date */}
              <div className="flex items-center justify-between pt-3 border-t border-sky-500/15 text-xs text-white/50">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-white/40" />
                    {formatCompactNumber(script.views)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="w-3.5 h-3.5 text-sky-400/70" />
                    {formatCompactNumber(script.downloads)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sky-400 font-medium group-hover:translate-x-0.5 transition-transform">
                  <span>Get Script</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
};
