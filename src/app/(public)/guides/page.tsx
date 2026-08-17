import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPublishedGuides } from '@/lib/data';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassBadge } from '@/components/ui/GlassBadge';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Roblox Executor Guides & Anti-Ban Protocols',
  description: 'Master Roblox scripting safely on PC (Solara, Wave) and Mobile (Delta, Codex) with our verified guides.',
};

export default function GuidesPage() {
  const guides = getPublishedGuides();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <GlassBadge variant="cyan" size="md">
          <BookOpen className="w-3.5 h-3.5 mr-1" />
          Knowledge Base
        </GlassBadge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Execution <span className="text-sky-400">Guides</span> & Safety
        </h1>
        <p className="text-sm sm:text-base text-white/60">
          Everything you need to know about injecting scripts safely, fixing executor crashes, and preventing account flags.
        </p>
      </div>

      {/* Guide Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {guides.map((guide) => (
          <Link key={guide.id} href={`/guides/${guide.slug}`} className="block group">
            <GlassCard
              hoverEffect
              className="h-full flex flex-col justify-between border-sky-500/15 hover:border-sky-500/40"
            >
              <div className="space-y-4">
                {/* Thumbnail */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/40 rounded-t-3xl">
                  <Image
                    src={guide.banner}
                    alt={guide.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-3.5 left-3.5">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-sky-300 border border-sky-500/30">
                      {guide.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-2 leading-snug">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-white/60 line-clamp-3 leading-relaxed">
                    {guide.excerpt}
                  </p>
                </div>
              </div>

              {/* Meta Footer */}
              <div className="p-6 pt-0 border-t border-sky-500/10 mt-auto flex items-center justify-between text-xs text-white/50">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    {guide.readTime}
                  </span>
                  <span>•</span>
                  <span>{formatDate(guide.createdAt)}</span>
                </div>
                <div className="text-sky-400 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Read</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
