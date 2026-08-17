import React, { Suspense } from 'react';
import { getPublishedScripts, getGames } from '@/lib/data';
import { ScriptsExplorer } from '@/components/scripts/ScriptsExplorer';
import { GlassBadge } from '@/components/ui/GlassBadge';
import { Sparkles, Loader2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Roblox Scripts Catalogue',
  description: 'Browse hundreds of verified, keyless, and safe Roblox scripts for Blox Fruits, Blade Ball, Fisch, Pet Simulator 99, and more.',
};

export default function ScriptsPage() {
  const scripts = getPublishedScripts();
  const games = getGames();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <GlassBadge variant="emerald" size="md">
          <Sparkles className="w-3.5 h-3.5 mr-1" />
          Verified Database
        </GlassBadge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Roblox Scripts <span className="text-emerald-400">Hub</span>
        </h1>
        <p className="text-sm sm:text-base text-white/60">
          Discover, filter, and unlock high-performance loadstrings with zero key bypasses and verified anti-malware clearance.
        </p>
      </div>

      {/* Explorer wrapped in Suspense */}
      <Suspense
        fallback={
          <div className="p-12 text-center glass-card rounded-3xl">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-400" />
            <p className="text-xs text-white/50 mt-2">Loading scripts catalog...</p>
          </div>
        }
      >
        <ScriptsExplorer initialScripts={scripts as any} games={games} />
      </Suspense>
    </div>
  );
}
