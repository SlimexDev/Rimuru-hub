'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GlassCard } from '../ui/GlassCard';
import { GlassBadge } from '../ui/GlassBadge';
import { GlassButton } from '../ui/GlassButton';
import { GlassDialog } from '../ui/Dialog';
import { Plus, Edit, Trash2, ExternalLink, BookOpen, Clock, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export interface GuideItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  banner: string;
  author: string;
  readTime: string;
  isPublished: boolean;
  createdAt: string | Date;
}

export const GuidesTable: React.FC<{ initialGuides: GuideItem[] }> = ({
  initialGuides,
}) => {
  const [guides, setGuides] = useState<GuideItem[]>(initialGuides);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [guideToDelete, setGuideToDelete] = useState<GuideItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!guideToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/guides/${guideToDelete.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      setGuides((prev) => prev.filter((g) => g.id !== guideToDelete.id));
      toast.success('Guide deleted successfully');
      setDeleteModalOpen(false);
    } catch {
      toast.error('Failed to delete guide');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Manage Execution Guides
          </h1>
          <p className="text-xs sm:text-sm text-white/50">
            Tutorials, anti-ban checklists, and bypass setup articles.
          </p>
        </div>

        <Link href="/rimurudev.vn/guides/new">
          <GlassButton variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Write Guide
          </GlassButton>
        </Link>
      </div>

      <GlassCard className="p-0 border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.04] border-b border-white/10 text-white/50 uppercase tracking-wider font-mono">
              <tr>
                <th className="px-6 py-4">Guide Article</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Read Time</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {guides.map((guide) => (
                <tr key={guide.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
                        <Image
                          src={guide.banner}
                          alt={guide.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 max-w-sm">
                        <span className="font-bold text-white block truncate text-sm">
                          {guide.title}
                        </span>
                        <span className="text-[11px] text-white/40 font-mono truncate block">
                          /guides/{guide.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <GlassBadge variant="emerald" size="sm">
                      {guide.category}
                    </GlassBadge>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-white/60">
                    {guide.readTime}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-white/40">
                    {formatDate(guide.createdAt)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    <Link
                      href={`/guides/${guide.slug}`}
                      target="_blank"
                      className="inline-flex p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                      title="Preview public guide"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/rimurudev.vn/guides/${guide.id}`}
                      className="inline-flex p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                      title="Edit guide"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => {
                        setGuideToDelete(guide);
                        setDeleteModalOpen(true);
                      }}
                      className="inline-flex p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                      title="Delete guide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Delete Confirmation Dialog */}
      <GlassDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Guide Article"
        description="Are you sure you want to permanently delete this guide article?"
      >
        {guideToDelete && (
          <div className="space-y-4 pt-2">
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
              Target: <strong>{guideToDelete.title}</strong>
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
