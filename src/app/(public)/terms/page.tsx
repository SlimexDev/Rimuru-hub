import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassBadge } from '@/components/ui/GlassBadge';
import { FileText, ShieldAlert, Lock, AlertTriangle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service, Privacy Policy & Disclaimer',
  description: 'Read the terms of service, privacy practices, and third-party software disclaimer for Rimuru Script Hub.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <GlassBadge variant="neutral" size="md">
          <FileText className="w-3.5 h-3.5 mr-1" />
          Legal Information
        </GlassBadge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Terms & <span className="text-emerald-400">Policies</span>
        </h1>
        <p className="text-sm text-white/60">
          Last updated: August 2026. Please read our operational terms and safety disclaimers carefully.
        </p>
      </div>

      {/* Third Party Disclaimer Alert */}
      <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
        <div className="space-y-1 text-xs sm:text-sm text-amber-200/90 leading-relaxed">
          <strong className="text-white block font-bold">Disclaimer Regarding Roblox Corporation:</strong>
          Rimuru Script Hub is an independent research and script discovery portal. We are NOT associated, authorized, endorsed by, or in any way officially connected with Roblox Corporation or any of its subsidiaries.
        </div>
      </div>

      <GlassCard className="p-8 sm:p-12 border-white/15 space-y-8">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">1. Educational & Research Purpose</h2>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
            All code, Lua snippets, and executor documentation provided on Rimuru Script Hub are published solely for educational, security analysis, and software development testing purposes. Users are solely responsible for their actions when executing third-party code in online game environments.
          </p>
        </section>

        <section className="space-y-3 pt-6 border-t border-white/10" id="privacy">
          <h2 className="text-xl font-bold text-white tracking-tight">2. Privacy & Data Collection</h2>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
            We value your digital privacy. We do not require accounts, phone numbers, or personal identifying data to browse or unlock scripts. Basic non-identifying telemetry (such as page views and script copy counts) is recorded anonymously to calculate trending rankings.
          </p>
        </section>

        <section className="space-y-3 pt-6 border-t border-white/10">
          <h2 className="text-xl font-bold text-white tracking-tight">3. User Responsibility & Risk of Account Bans</h2>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
            Roblox Terms of Service prohibit the unauthorized modification of client binaries and running external automation. While we audit all scripts for anti-ban hygiene, using exploits in multiplayer games carries intrinsic risk. We strongly encourage testing exclusively on secondary accounts.
          </p>
        </section>

        <section className="space-y-3 pt-6 border-t border-white/10">
          <h2 className="text-xl font-bold text-white tracking-tight">4. DMCA & Intellectual Property</h2>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
            We respect the rights of digital creators. If you believe your original script or material is distributed without permission, please file a takedown notice via our Contact form. We will remove the infringing entry within 24 business hours.
          </p>
        </section>
      </GlassCard>
    </div>
  );
}
