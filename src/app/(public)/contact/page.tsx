import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassBadge } from '@/components/ui/GlassBadge';
import { ContactForm } from '@/components/contact/ContactForm';
import { Mail, Disc as Discord, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact & DMCA Takedown Requests',
  description: 'Reach out to the Rimuru Script Hub team for developer submissions, DMCA copyright takedowns, or bug reports.',
};

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <GlassBadge variant="emerald" size="md">
          <Mail className="w-3.5 h-3.5 mr-1" />
          Get In Touch
        </GlassBadge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Contact & <span className="text-emerald-400">Support</span>
        </h1>
        <p className="text-sm sm:text-base text-white/60">
          Have a question, want to submit a script, report a dead link, or request a copyright takedown? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Container */}
        <div className="lg:col-span-7">
          <GlassCard className="p-6 sm:p-10 border-white/15">
            <h2 className="text-xl font-bold text-white mb-6">Send Us a Message</h2>
            <ContactForm />
          </GlassCard>
        </div>

        {/* Info & Community Channels */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="p-6 border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              Community & Discord
            </h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Join 50,000+ members in our official Discord server for instant script announcements, executor bypass releases, and 24/7 technical support.
            </p>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#5865F2]/20 hover:bg-[#5865F2]/30 text-[#5865F2] border border-[#5865F2]/40 text-xs font-semibold transition-colors"
            >
              <Discord className="w-4 h-4" />
              Join Discord Server
            </a>
          </GlassCard>

          <GlassCard className="p-6 border-white/10 space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              DMCA & Copyright Policy
            </h3>
            <p className="text-xs text-white/60 leading-relaxed">
              We respect intellectual property rights. If you are a copyright owner or an authorized agent and wish to request removal of your script or asset, please select "DMCA / Copyright Takedown" in the form with proof of ownership, and we will process it within 24 hours.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
