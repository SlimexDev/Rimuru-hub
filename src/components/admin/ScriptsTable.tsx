'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassBadge } from '@/components/ui/GlassBadge';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassDialog } from '@/components/ui/Dialog';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  Download,
  CheckCircle,
} from 'lucide-react';
import { formatDate, formatCompactNumber } from '@/lib/utils';
import { toast } from 'sonner';

export interface AdminScriptItem {
  id: string;
  slug: string;
  title: string;
  banner: string;
  isPublished: boolean;
  isVerified: boolean;
  isKeyless: boolean;
  views: number;
  downloads: number;
  updatedAt: string | Date;
  game: {
    name: string;
    slug: string;
  };
}

export const ScriptsTable: React.FC<{
  initialScripts: AdminScriptItem[];
  games: { id: string; name: string; slug: string }[];
}> = ({ initialScripts, games }) => {
  const router = useRouter();
  const [scripts, setScripts] = useState<AdminScriptItem[]>(initialScripts);
  const [search, setSearch] = useState('');
  const [selectedGame, setSelectedGame] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [scriptToDelete, setScriptToDelete] = useState<AdminScriptItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredScripts = useMemo(() => {
    return scripts.filter((s) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!s.title.toLowerCase().includes(q) && !s.slug.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (selectedGame !== 'all' && s.game?.slug !== selectedGame) {
        return false;
      }
      if (selectedStatus === 'published' && !s.isPublished) return false;
      if (selectedStatus === 'draft' && s.isPublished) return false;
      return true;
    });
  }, [scripts, search, selectedGame, selectedStatus]);

  const handleTogglePublish = async (script: AdminScriptItem) => {
    const nextStatus = !script.isPublished;
    try {
      const res = await fetch(`/api/admin/scripts/${script.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...script, isPublished: nextStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');

      setScripts((prev) =>
        prev.map((s) => (s.id === script.id ? { ...s, isPublished: nextStatus } : s))
      );
      toast.success(
        nextStatus ? 'Script published to public hub' : 'Script moved to draft'
      );
    } catch {
      toast.error('Could not update publication status');
    }
  };

  const confirmDelete = async () => {
    if (!scriptToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/scripts/${scriptToDelete.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');

      setScripts((prev) => prev.filter((s) => s.id !== scriptToDelete.id));
      toast.success('Script deleted successfully');
      setDeleteModalOpen(false);
      setScriptToDelete(null);
    } catch {
      toast.error('Failed to delete script');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Manage Roblox Scripts
          </h1>
          <p className="text-xs sm:text-sm text-white/50">
            Create, edit, toggle visibility, and configure unlock steps.
          </p>
        </div>

        <Link href="/rimurudev.vn/scripts/new">
          <GlassButton variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Add New Script
          </GlassButton>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <GlassCard className="p-4 sm:p-5 border-sky-500/15">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <GlassInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search scripts by title or slug..."
              leftIcon={<Search className="w-4 h-4 text-white/50" />}
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="w-full bg-white/[0.06] hover:bg-white/[0.09] text-white border border-sky-500/20 rounded-2xl md:rounded-full px-4 py-3 text-xs backdrop-blur-xl outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="all" className="bg-[#050b14] text-white">All Games</option>
              {games.map((g) => (
                <option key={g.id} value={g.slug} className="bg-[#050b14] text-white">
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-white/[0.06] hover:bg-white/[0.09] text-white border border-sky-500/20 rounded-2xl md:rounded-full px-4 py-3 text-xs backdrop-blur-xl outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="all" className="bg-[#050b14] text-white">All Statuses</option>
              <option value="published" className="bg-[#050b14] text-white">Published Only</option>
              <option value="draft" className="bg-[#050b14] text-white">Drafts Only</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Scripts Table */}
      <GlassCard className="p-0 border-sky-500/15 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.04] border-b border-sky-500/15 text-white/50 uppercase tracking-wider font-mono">
              <tr>
                <th className="px-6 py-4">Script</th>
                <th className="px-6 py-4">Game</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Views / Unlocks</th>
                <th className="px-6 py-4">Updated</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-500/10">
              {filteredScripts.map((script) => (
                <tr
                  key={script.id}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  {/* Title & Thumbnail */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-black/40 border border-sky-500/20 shrink-0 shadow-md">
                        <Image
                          src={script.banner}
                          alt={script.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 max-w-xs sm:max-w-md">
                        <span className="font-bold text-white block truncate text-sm">
                          {script.title}
                        </span>
                        <span className="text-[11px] text-white/40 font-mono truncate block">
                          /{script.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Game */}
                  <td className="px-6 py-4 text-white/80 font-medium whitespace-nowrap">
                    {script.game?.name}
                  </td>

                  {/* Status Toggle */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleTogglePublish(script)}
                      className="cursor-pointer"
                      title="Click to toggle status"
                    >
                      <GlassBadge
                        variant={script.isPublished ? 'verified' : 'neutral'}
                        size="sm"
                      >
                        {script.isPublished ? 'Published' : 'Draft'}
                      </GlassBadge>
                    </button>
                  </td>

                  {/* Stats */}
                  <td className="px-6 py-4 whitespace-nowrap text-white/60">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-sky-400" />
                        {formatCompactNumber(script.views)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3 text-cyan-400" />
                        {formatCompactNumber(script.downloads)}
                      </span>
                    </div>
                  </td>

                  {/* Updated Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-white/40">
                    {formatDate(script.updatedAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    <Link
                      href={`/scripts/${script.slug}`}
                      target="_blank"
                      className="inline-flex p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                      title="Preview public page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/rimurudev.vn/scripts/${script.id}`}
                      className="inline-flex p-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 transition-colors"
                      title="Edit script"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => {
                        setScriptToDelete(script);
                        setDeleteModalOpen(true);
                      }}
                      className="inline-flex p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                      title="Delete script"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredScripts.length === 0 && (
          <div className="p-8 text-center text-white/40 text-xs">
            No scripts found matching your filters.
          </div>
        )}
      </GlassCard>

      {/* Delete Confirmation Modal */}
      <GlassDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Script"
        description="Are you sure you want to permanently delete this script? This action cannot be undone."
      >
        {scriptToDelete && (
          <div className="space-y-4 pt-2">
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
              Target: <strong>{scriptToDelete.title}</strong>
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
                isLoading={isDeleting}
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
