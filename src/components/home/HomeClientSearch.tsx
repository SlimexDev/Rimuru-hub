'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { GlassInput } from '../ui/GlassInput';
import { GlassButton } from '../ui/GlassButton';

export interface GameItem {
  id: string;
  name: string;
  slug: string;
}

export const HomeClientSearch: React.FC<{ games: GameItem[] }> = ({ games }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      router.push('/scripts');
    } else {
      router.push(`/scripts?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <div className="flex items-center gap-2 p-1.5 rounded-3xl md:rounded-full bg-white/[0.07] border border-white/20 backdrop-blur-2xl shadow-glass">
        <div className="flex-1 flex items-center pl-4">
          <Search className="w-5 h-5 text-white/50 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search scripts (e.g. Blox Fruits, Auto Parry, Fisch, MM2)..."
            className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder-white/40 outline-none"
          />
        </div>
        <GlassButton
          type="submit"
          variant="primary"
          size="md"
          className="shrink-0"
        >
          Search
        </GlassButton>
      </div>
    </form>
  );
};
