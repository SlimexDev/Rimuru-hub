'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GlassCard } from '../ui/GlassCard';
import { GlassInput } from '../ui/GlassInput';
import { GlassButton } from '../ui/GlassButton';
import { GlassDialog } from '../ui/Dialog';
import { Plus, Trash2, Search, ExternalLink, Code2 } from 'lucide-react';
import { toast } from 'sonner';

export interface GameItem {
  id: string;
  name: string;
  slug: string;
  icon: string;
  banner: string;
  _count?: {
    scripts: number;
  };
}

export const GamesManager: React.FC<{ initialGames: GameItem[] }> = ({
  initialGames,
}) => {
  const [games, setGames] = useState<GameItem[]>(initialGames);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [banner, setBanner] = useState('');
  const [loading, setLoading] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<GameItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filteredGames = games.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/admin/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          icon: icon.trim() || undefined,
          banner: banner.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create game');

      setGames((prev) => [...prev, data.game]);
      toast.success(`Game "${data.game.name}" created successfully!`);
      setName('');
      setIcon('');
      setBanner('');
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Error creating game');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!gameToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/games?id=${gameToDelete.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');

      setGames((prev) => prev.filter((g) => g.id !== gameToDelete.id));
      toast.success('Game deleted successfully');
      setDeleteModalOpen(false);
      setGameToDelete(null);
    } catch {
      toast.error('Error deleting game');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Game Categories Management
          </h1>
          <p className="text-xs sm:text-sm text-white/50">
            Add new Roblox games and monitor script counts per category.
          </p>
        </div>

        <GlassButton
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Game
        </GlassButton>
      </div>

      {/* Search Input */}
      <GlassCard className="p-4 border-sky-500/20">
        <GlassInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search games..."
          leftIcon={<Search className="w-4 h-4 text-white/50" />}
        />
      </GlassCard>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGames.map((game) => (
          <GlassCard
            key={game.id}
            hoverEffect
            className="p-5 border-sky-500/20 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-black/40 border border-sky-400/20 shrink-0">
                  <Image src={game.icon} alt={game.name} fill className="object-cover" />
                </div>
                <button
                  onClick={() => {
                    setGameToDelete(game);
                    setDeleteModalOpen(true);
                  }}
                  className="p-2 rounded-xl hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                  title="Delete game"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="font-bold text-white text-base">{game.name}</h3>
                <span className="text-[11px] text-white/40 font-mono">/{game.slug}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-sky-500/15 flex items-center justify-between text-xs text-white/60">
              <span className="flex items-center gap-1 text-sky-400 font-medium">
                <Code2 className="w-3.5 h-3.5" />
                {game._count?.scripts ?? 0} Scripts
              </span>
              <a
                href={`/scripts?game=${game.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white flex items-center gap-1"
              >
                View <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Add Game Modal */}
      <GlassDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Game"
        description="Enter game information to add into Rimuru Script hub."
      >
        <form onSubmit={handleCreate} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/80">Game Name *</label>
            <GlassInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Anime Vanguards, Rivals, Deepwoken..."
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/80">Icon Image URL (Optional)</label>
            <GlassInput
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/80">Banner Image URL (Optional)</label>
            <GlassInput
              value={banner}
              onChange={(e) => setBanner(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <GlassButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </GlassButton>
            <GlassButton
              type="submit"
              variant="primary"
              size="sm"
              isLoading={loading}
            >
              Create Game
            </GlassButton>
          </div>
        </form>
      </GlassDialog>

      {/* Delete Confirmation Modal */}
      <GlassDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Game"
        description="Are you sure you want to remove this game category?"
      >
        {gameToDelete && (
          <div className="space-y-4 pt-2">
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
              Game: <strong>{gameToDelete.name}</strong>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <GlassButton
                variant="secondary"
                size="sm"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </GlassButton>
              <GlassButton
                variant="danger"
                size="sm"
                isLoading={deleting}
                onClick={confirmDelete}
              >
                Confirm Delete
              </GlassButton>
            </div>
          </div>
        )}
      </GlassDialog>
    </div>
  );
};
