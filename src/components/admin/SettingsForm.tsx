'use client';

import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { GlassInput, GlassTextarea } from '../ui/GlassInput';
import { GlassButton } from '../ui/GlassButton';
import { toast } from 'sonner';
import { Save, Sparkles, Globe, ShieldCheck } from 'lucide-react';

export const SettingsForm: React.FC<{ initialSettings: Record<string, string> }> = ({
  initialSettings,
}) => {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error('Save failed');
      toast.success('Site settings updated successfully');
    } catch {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Site Configuration & SEO
          </h1>
          <p className="text-xs sm:text-sm text-white/50">
            Brand name, social channels, and legal disclaimers.
          </p>
        </div>

        <GlassButton
          type="submit"
          variant="primary"
          size="sm"
          isLoading={saving}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save Settings
        </GlassButton>
      </div>

      <GlassCard className="p-6 sm:p-8 border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white tracking-tight border-b border-white/10 pb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-400" />
          General Branding & Meta
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/80">Site Name</label>
            <GlassInput
              value={settings.site_name || ''}
              onChange={(e) =>
                setSettings({ ...settings, site_name: e.target.value })
              }
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/80">Tagline</label>
            <GlassInput
              value={settings.site_tagline || ''}
              onChange={(e) =>
                setSettings({ ...settings, site_tagline: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white/80">
            Default SEO Meta Description
          </label>
          <GlassTextarea
            value={settings.site_description || ''}
            onChange={(e) =>
              setSettings({ ...settings, site_description: e.target.value })
            }
            rows={2}
          />
        </div>
      </GlassCard>

      <GlassCard className="p-6 sm:p-8 border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white tracking-tight border-b border-white/10 pb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Social & Community Links
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/80">
              Discord Server URL
            </label>
            <GlassInput
              value={settings.discord_url || ''}
              onChange={(e) =>
                setSettings({ ...settings, discord_url: e.target.value })
              }
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/80">
              Telegram Channel
            </label>
            <GlassInput
              value={settings.telegram_url || ''}
              onChange={(e) =>
                setSettings({ ...settings, telegram_url: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white/80">
            Official Support Email
          </label>
          <GlassInput
            value={settings.contact_email || ''}
            onChange={(e) =>
              setSettings({ ...settings, contact_email: e.target.value })
            }
          />
        </div>
      </GlassCard>

      <GlassCard className="p-6 sm:p-8 border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white tracking-tight border-b border-white/10 pb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          Third-Party Disclaimer Content
        </h3>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white/80">
            Disclaimer Statement
          </label>
          <GlassTextarea
            value={settings.terms_content || ''}
            onChange={(e) =>
              setSettings({ ...settings, terms_content: e.target.value })
            }
            rows={4}
          />
        </div>
      </GlassCard>
    </form>
  );
};
