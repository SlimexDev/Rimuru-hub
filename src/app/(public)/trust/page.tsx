import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassBadge } from '@/components/ui/GlassBadge';
import { GlassButton } from '@/components/ui/GlassButton';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Search,
  Cpu,
  FileCode,
  AlertOctagon,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trust & Safety - Verification Protocols',
  description: 'Learn how Rimuru Script Hub ensures 100% virus-free, tested, and secure Roblox script execution.',
};

export default function TrustPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <GlassBadge variant="verified" size="md">
          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
          Security First
        </GlassBadge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Trust, Safety & <span className="text-emerald-400">Verification</span>
        </h1>
        <p className="text-sm sm:text-base text-white/60">
          Our rigorous audit pipeline inspects every line of Lua code and runtime behavior before publication.
        </p>
      </div>

      {/* Security Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-7 space-y-4 border-white/15">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">1. Static Lua AST Audit</h3>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
            We deobfuscate and inspect raw Lua scripts for suspicious HTTP requests (`request`, `http_request`, `syn.request`), hidden discord webhooks, and cookie stealers.
          </p>
        </GlassCard>

        <GlassCard className="p-7 space-y-4 border-white/15">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">2. Isolated Sandbox Execution</h3>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
            Every script is run in an air-gapped test environment for 2+ hours to verify memory utilization, FPS impact, and to ensure no background cryptocurrency miners or memory leaks exist.
          </p>
        </GlassCard>

        <GlassCard className="p-7 space-y-4 border-white/15">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">3. Zero Malicious Link Loops</h3>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
            We do not permit infinite URL shortener popups or shady survey traps. Our fast 3-step unlock gate is 100% clean and takes less than 15 seconds.
          </p>
        </GlassCard>
      </div>

      {/* Explaining Antivirus False Positives */}
      <GlassCard className="p-8 sm:p-12 border-white/15 space-y-6">
        <div className="flex items-center gap-3">
          <AlertOctagon className="w-7 h-7 text-amber-400" />
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Understanding Antivirus "False Positives"
          </h2>
        </div>
        <p className="text-sm sm:text-base text-white/70 leading-relaxed">
          When using Roblox executors (like Solara, Delta, or Wave), Windows Defender or third-party antivirus software might show alerts such as <code>Win32/Trojan:Generic</code> or <code>Injector.Hacktool</code>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Why does this happen?
            </h4>
            <p className="text-xs text-white/60 leading-relaxed">
              Executors work by injecting a dynamic link library (DLL) into the Roblox process memory to run custom Lua VM bytecode. Antivirus heuristics flag all process injection methods indiscriminately.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> How to stay safe?
            </h4>
            <p className="text-xs text-white/60 leading-relaxed">
              Only download executors from verified official discord servers, add exclusions for the folder rather than disabling your whole antivirus, and only run scripts from reputable hubs like Rimuru Script Hub.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* CTA to Contact/Report */}
      <GlassCard className="p-8 text-center border-emerald-500/30 space-y-4">
        <h3 className="text-xl font-bold text-white">Found a suspicious script or bug?</h3>
        <p className="text-xs sm:text-sm text-white/60 max-w-lg mx-auto">
          We reward community researchers who discover zero-day vulnerabilities or security flaws in scripts.
        </p>
        <Link href="/contact" className="inline-block">
          <GlassButton variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Submit Security Report
          </GlassButton>
        </Link>
      </GlassCard>
    </div>
  );
}
