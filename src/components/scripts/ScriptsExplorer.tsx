'use client';

import React, { useState, useMemo } from 'react';
import { ScriptCard, ScriptCardData } from './ScriptCard';
import { GlassCard } from '../ui/GlassCard';
import { GlassInput } from '../ui/GlassInput';
import { GlassButton } from '../ui/GlassButton';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export interface GameFilterOption {
  id: string;
  name: string;
  slug: string;
}

export const ScriptsExplorer: React.FC<{
  initialScripts: ScriptCardData[];
  games: GameFilterOption[];
}> = ({ initialScripts, games }) => {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialGame = searchParams.get('game') || 'all';

  const [search, setSearch] = useState(initialQuery);
  const [selectedGame, setSelectedGame] = useState(initialGame);
  const [selectedExecutor, setSelectedExecutor] = useState('all');
  const [sortBy, setSortBy] = useState<'popular' | 'latest' | 'rating'>('popular');

  const executors = ['Solara', 'Delta', 'Wave', 'Codex', 'Hydrogen', 'Arceus X'];

  const filteredScripts = useMemo(() => {
    return initialScripts
      .filter((s) => {
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = s.title.toLowerCase().includes(q);
          const matchGame = s.game?.name.toLowerCase().includes(q);
          const matchExcerpt = s.excerpt.toLowerCase().includes(q);
          if (!matchTitle && !matchGame && !matchExcerpt) return false;
        }

        if (selectedGame !== 'all') {
          if (s.game?.slug !== selectedGame) return false;
        }

        if (selectedExecutor !== 'all') {
          const execList: string[] = typeof s.executors === 'string'
            ? JSON.parse(s.executors || '[]')
            : s.executors || [];
          if (!execList.includes(selectedExecutor)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.views - a.views;
        if (sortBy === 'latest') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [initialScripts, search, selectedGame, selectedExecutor, sortBy]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Header Bar */}
      <GlassCard className="p-5 md:p-6 border-sky-500/20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Box */}
          <div className="md:col-span-6">
            <GlassInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by script name, game or keyword..."
              leftIcon={<Search className="w-4 h-4 text-white/50" />}
              rightIcon={
                search ? (
                  <button
                    onClick={() => setSearch('')}
                    className="p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : undefined
              }
            />
          </div>

          {/* Game Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="w-full bg-white/[0.06] hover:bg-white/[0.09] text-white border border-sky-500/20 rounded-2xl md:rounded-full px-4 py-3 text-sm backdrop-blur-xl outline-none focus:ring-2 focus:ring-sky-500/20 cursor-pointer"
            >
              <option value="all" className="bg-[#050b14] text-white">All Games (All Categories)</option>
              {games.map((g) => (
                <option key={g.id} value={g.slug} className="bg-[#050b14] text-white">
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-white/[0.06] hover:bg-white/[0.09] text-white border border-sky-500/20 rounded-2xl md:rounded-full px-4 py-3 text-sm backdrop-blur-xl outline-none focus:ring-2 focus:ring-sky-500/20 cursor-pointer"
            >
              <option value="popular" className="bg-[#050b14] text-white">🔥 Most Popular</option>
              <option value="latest" className="bg-[#050b14] text-white">⚡ Recently Updated</option>
              <option value="rating" className="bg-[#050b14] text-white">⭐ Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Executor Quick Filter Pills */}
        <div className="mt-4 pt-4 border-t border-sky-500/15 flex flex-wrap items-center gap-2">
          <span className="text-xs text-white/50 font-medium mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-sky-400" /> Executor:
          </span>
          <button
            onClick={() => setSelectedExecutor('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              selectedExecutor === 'all'
                ? 'bg-sky-500/30 text-sky-300 border border-sky-400/40 shadow-sm'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            All Executors
          </button>
          {executors.map((exec) => (
            <button
              key={exec}
              onClick={() => setSelectedExecutor(exec)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedExecutor === exec
                  ? 'bg-sky-500/30 text-sky-300 border border-sky-400/40 shadow-sm'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {exec}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Results Count & Active Filters */}
      <div className="flex items-center justify-between text-xs text-white/60 px-1">
        <span>
          Showing <strong className="text-white font-semibold">{filteredScripts.length}</strong> scripts
        </span>
        {(selectedGame !== 'all' || selectedExecutor !== 'all' || search) && (
          <button
            onClick={() => {
              setSearch('');
              setSelectedGame('all');
              setSelectedExecutor('all');
            }}
            className="text-sky-400 hover:underline flex items-center gap-1"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Script Cards Grid */}
      {filteredScripts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScripts.map((script, idx) => (
            <ScriptCard key={script.id} script={script} index={idx} />
          ))}
        </div>
      ) : (
        <GlassCard className="p-12 text-center border-sky-500/15 space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/40">
            <Search className="w-8 h-8 text-sky-400/60" />
          </div>
          <h3 className="text-lg font-bold text-white">No scripts found</h3>
          <p className="text-sm text-white/60 max-w-md mx-auto">
            We couldn't find any scripts matching your search query or filters. Try adjusting your keywords.
          </p>
          <GlassButton
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearch('');
              setSelectedGame('all');
              setSelectedExecutor('all');
            }}
          >
            Reset Filters
          </GlassButton>
        </GlassCard>
      )}
    </div>
  );
};
