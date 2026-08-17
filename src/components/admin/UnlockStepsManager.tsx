'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GlassCard } from '../ui/GlassCard';
import { GlassInput } from '../ui/GlassInput';
import { GlassButton } from '../ui/GlassButton';
import { GlassDialog } from '../ui/Dialog';
import { Plus, Trash2, Globe, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export interface DefaultUnlockStep {
  id: string;
  label: string;
  description: string;
  targetUrl: string;
  order: number;
  isActive: boolean;
}

export const UnlockStepsManager: React.FC<{
  initialSteps: DefaultUnlockStep[];
}> = ({ initialSteps }) => {
  const [steps, setSteps] = useState<DefaultUnlockStep[]>(initialSteps);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<DefaultUnlockStep | null>(null);

  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const openAddModal = (preset?: 'youtube' | 'discord') => {
    setEditingStep(null);
    if (preset === 'youtube') {
      setLabel('Subscribe to YouTube Channel');
      setDescription('Subscribe to Rimuru YouTube channel for daily script releases and showcases');
      setTargetUrl('https://youtube.com');
    } else if (preset === 'discord') {
      setLabel('Join Rimuru Discord Server');
      setDescription('Join our official community for fast executor support and bypass updates');
      setTargetUrl('https://discord.com');
    } else {
      setLabel('');
      setDescription('');
      setTargetUrl('');
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !targetUrl.trim()) {
      toast.error('Please fill in title and target URL');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/unlock-steps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingStep?.id,
          label: label.trim(),
          description: description.trim(),
          targetUrl: targetUrl.trim(),
          order: editingStep ? editingStep.order : steps.length + 1,
          isActive: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save step');

      if (editingStep) {
        setSteps((prev) =>
          prev.map((s) => (s.id === editingStep.id ? data.step : s))
        );
        toast.success('Unlock step updated successfully!');
      } else {
        setSteps((prev) => [...prev, data.step]);
        toast.success('New unlock step added successfully!');
      }

      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Error saving step');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this unlock step?')) return;
    try {
      const res = await fetch(`/api/admin/unlock-steps?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');

      setSteps((prev) => prev.filter((s) => s.id !== id));
      toast.success('Step deleted');
    } catch {
      toast.error('Error deleting step');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Default Unlock Steps Manager
          </h1>
          <p className="text-xs sm:text-sm text-white/50">
            These verification steps will automatically apply to scripts without custom steps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <GlassButton
            variant="secondary"
            size="sm"
            onClick={() => openAddModal('youtube')}
          >
            <Image src="/youtube.png" alt="YT" width={16} height={16} className="mr-1 inline-block" />
            + YouTube Preset
          </GlassButton>
          <GlassButton
            variant="secondary"
            size="sm"
            onClick={() => openAddModal('discord')}
          >
            <Image src="/discord.png" alt="Discord" width={16} height={16} className="mr-1 inline-block" />
            + Discord Preset
          </GlassButton>
          <GlassButton
            variant="primary"
            size="sm"
            onClick={() => openAddModal()}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Step
          </GlassButton>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const urlLower = (step.targetUrl || '').toLowerCase();
          const isYT = urlLower.includes('youtube.com') || urlLower.includes('youtu.be');
          const isDiscord = urlLower.includes('discord.com') || urlLower.includes('discord.gg');

          return (
            <GlassCard
              key={step.id}
              className="p-5 border-sky-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                    isYT
                      ? 'bg-red-500/15 border-red-500/30'
                      : isDiscord
                      ? 'bg-indigo-500/15 border-indigo-500/30'
                      : 'bg-sky-500/15 border-sky-400/30'
                  }`}
                >
                  {isYT ? (
                    <Image src="/youtube.png" alt="YouTube" width={28} height={28} className="object-contain" />
                  ) : isDiscord ? (
                    <Image src="/discord.png" alt="Discord" width={26} height={26} className="object-contain" />
                  ) : (
                    <Globe className="w-6 h-6 text-sky-400" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-white/40">Step #{index + 1}</span>
                    {isYT && (
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                        YOUTUBE
                      </span>
                    )}
                    {isDiscord && (
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        DISCORD
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-white text-base">{step.label}</h3>
                  <p className="text-xs text-white/60">{step.description}</p>
                  <a
                    href={step.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-sky-400 hover:underline flex items-center gap-1 pt-1"
                  >
                    {step.targetUrl} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => handleDelete(step.id)}
                  className="p-2 rounded-xl hover:bg-red-500/20 text-red-400 transition-colors"
                  title="Delete step"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      <GlassDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStep ? 'Edit Unlock Step' : 'Add Unlock Step'}
        description="Enter task information for users to complete before unlocking script."
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/80">Step Title *</label>
            <GlassInput
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Subscribe to YouTube Channel"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/80">Target URL *</label>
            <GlassInput
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://youtube.com/@channel or https://discord.gg/..."
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/80">Description</label>
            <GlassInput
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short instructions for users..."
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
              Save Step
            </GlassButton>
          </div>
        </form>
      </GlassDialog>
    </div>
  );
};
