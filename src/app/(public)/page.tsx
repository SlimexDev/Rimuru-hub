import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ScriptCard } from '@/components/scripts/ScriptCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassBadge } from '@/components/ui/GlassBadge';
import { GlassAccordion } from '@/components/ui/Accordion';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Smartphone,
  RefreshCw,
  Code2,
  Users,
  CheckCircle2,
  ArrowRight,
  Flame,
  KeyRound,
  FileCode,
  Lock,
  Cpu,
} from 'lucide-react';
import { HomeClientSearch } from '@/components/home/HomeClientSearch';

export const revalidate = 60; // ISR cache 60s

export default async function HomePage() {
  const [featuredScripts, popularScripts, games] = await Promise.all([
    prisma.script.findMany({
      where: { isPublished: true },
      include: { game: true },
      orderBy: { updatedAt: 'desc' },
      take: 6,
    }),
    prisma.script.findMany({
      where: { isPublished: true },
      include: { game: true },
      orderBy: { views: 'desc' },
      take: 6,
    }),
    prisma.game.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  const faqItems = [
    {
      id: 'faq-1',
      question: 'Are the scripts on Rimuru Script Hub free and safe?',
      answer:
        'Yes! Every script hosted on Rimuru Script Hub undergoes automated static analysis and sandbox runtime inspection to ensure zero IP loggers, token stealers, or malicious webhooks. Most scripts are completely keyless.',
      icon: <ShieldCheck className="w-4 h-4 text-sky-400" />,
    },
    {
      id: 'faq-2',
      question: 'Which Roblox executors are supported?',
      answer:
        'Our scripts are tested on both PC executors (Solara, Wave, Synapse Z) and Mobile executors (Delta, Codex, Hydrogen, Arceus X for iOS & Android). Compatibility tags are listed on each script page.',
      icon: <Cpu className="w-4 h-4 text-sky-400" />,
    },
    {
      id: 'faq-3',
      question: 'How do I execute a Lua script in Roblox?',
      answer:
        '1. Launch your preferred executor as Administrator.\n2. Open Roblox and join your target game.\n3. Click Attach/Inject.\n4. Copy the raw loadstring from our script page, paste it into your executor, and press Execute.',
      icon: <FileCode className="w-4 h-4 text-sky-400" />,
    },
    {
      id: 'faq-4',
      question: 'Will I get banned for using these scripts?',
      answer:
        'We specialize in anticheat-bypass scripts that utilize smooth tweening and safe packet rates rather than blatant coordinate teleportation. However, we always recommend testing on an alternative account first.',
      icon: <Lock className="w-4 h-4 text-sky-400" />,
    },
    {
      id: 'faq-5',
      question: 'How does the unlock step process work?',
      answer:
        'To support script developers and server costs, some scripts require a fast 3-step verification. Simply click the step link (opens in a new tab); when you return to the page, the system will automatically mark it as completed!',
      icon: <Zap className="w-4 h-4 text-sky-400" />,
    },
  ];

  const reviewSteps = [
    {
      step: '01',
      title: 'Static Code Deobfuscation',
      desc: 'We parse the Lua AST to detect hidden HTTP requests, webhook dispatchers, and unauthorized cookie scraping.',
      icon: <Code2 className="w-5 h-5 text-sky-400" />,
    },
    {
      step: '02',
      title: 'Sandbox Runtime Emulation',
      desc: 'Scripts are executed in an isolated virtual environment to monitor memory leaks, CPU spikes, and crash triggers.',
      icon: <Cpu className="w-5 h-5 text-cyan-400" />,
    },
    {
      step: '03',
      title: 'Anticheat & Telemetry Audit',
      desc: 'Verification against Roblox Hyperion / Byfron signatures to ensure no suspicious flags are triggered.',
      icon: <ShieldCheck className="w-5 h-5 text-sky-400" />,
    },
    {
      step: '04',
      title: 'Verified Stamp & Deployment',
      desc: 'Only scripts passing 100% of security checks receive our verified badge and are published to the public hub.',
      icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
    },
  ];

  return (
    <div className="space-y-24 md:space-y-32 pb-16">
      {/* 1. HERO SECTION (Clean, removed extra boxes/pills above headline) */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-4 md:pt-10 max-w-7xl mx-auto text-center">
        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
          The Ultimate{' '}
          <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Rimuru Roblox Scripts
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-white/65 max-w-2xl mx-auto leading-relaxed">
          Discover ultra-responsive, sandbox-tested, and keyless Roblox scripts with zero malware, fluid crystal glass aesthetics, and instant execution.
        </p>

        {/* Client Interactive Search Bar */}
        <div className="mt-10 max-w-2xl mx-auto">
          <HomeClientSearch games={games} />
        </div>

        {/* Quick Game Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
          <span className="text-xs text-white/40 font-medium mr-1">Trending:</span>
          {games.slice(0, 6).map((game) => (
            <Link
              key={game.id}
              href={`/scripts?game=${game.slug}`}
              className="glass-pill px-3.5 py-1 text-xs text-white/80 hover:text-sky-300 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
              {game.name}
            </Link>
          ))}
        </div>

        {/* Hero Metric Stats */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { label: 'Verified Scripts', value: '500+', icon: <Code2 className="w-4 h-4 text-sky-400" /> },
            { label: 'Sandbox Audited', value: '100%', icon: <ShieldCheck className="w-4 h-4 text-cyan-400" /> },
            { label: 'Community Unlocks', value: '1.2M+', icon: <Zap className="w-4 h-4 text-sky-400" /> },
            { label: 'Active Ban Rate', value: '0.0%', icon: <Lock className="w-4 h-4 text-blue-400" /> },
          ].map((stat, i) => (
            <GlassCard key={i} className="p-4 sm:p-5 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                {stat.icon}
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {stat.value}
                </span>
              </div>
              <span className="text-xs text-white/50">{stat.label}</span>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 2. LATEST & POPULAR SCRIPTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-sky-400 animate-pulse" />
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider font-mono">
                Curated Collection
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Featured & Popular Scripts
            </h2>
          </div>
          <Link href="/scripts">
            <GlassButton
              variant="secondary"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Explore All Scripts
            </GlassButton>
          </Link>
        </div>

        {/* Script Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredScripts.map((script, idx) => (
            <ScriptCard key={script.id} script={script} index={idx} />
          ))}
        </div>
      </section>

      {/* 3. WHY CHOOSE US SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider font-mono">
            Uncompromising Standards
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 tracking-tight">
            Why Choose Rimuru Script Hub
          </h2>
          <p className="text-sm sm:text-base text-white/60 mt-3">
            Say goodbye to malicious ad link shorteners, broken loadstrings, and suspicious DLLs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Zero Malware Guarantee',
              desc: 'Every single script is disassembled and tested in a clean virtual machine to prevent token logging or remote ratting.',
              icon: <ShieldCheck className="w-6 h-6 text-sky-400" />,
              badge: 'Malware-Free',
            },
            {
              title: '100% Keyless & Fast Unlock',
              desc: 'No frustrating 5-minute Linkvertise loops. Quick 3-step verification that auto-completes in seconds.',
              icon: <KeyRound className="w-6 h-6 text-cyan-400" />,
              badge: 'Instant Access',
            },
            {
              title: 'PC & Mobile Optimized',
              desc: 'Full support for Delta Mobile, Codex, and Hydrogen on Android & iOS, alongside Solara and Wave on PC.',
              icon: <Smartphone className="w-6 h-6 text-sky-400" />,
              badge: 'Cross Platform',
            },
            {
              title: 'Daily Anticheat Updates',
              desc: 'Our team monitors game patches and Roblox Hyperion updates daily to keep features 100% functional.',
              icon: <RefreshCw className="w-6 h-6 text-cyan-400" />,
              badge: 'Continuous Sync',
            },
            {
              title: 'High-FPS Clean Code',
              desc: 'Optimized Lua memory management prevents game freezing, FPS stutter, and disconnect errors during long farm sessions.',
              icon: <Zap className="w-6 h-6 text-sky-400" />,
              badge: 'Max Performance',
            },
            {
              title: 'Audited by 50K+ Gamers',
              desc: 'An active developer community constantly testing and providing real-time feedback on script performance.',
              icon: <Users className="w-6 h-6 text-cyan-400" />,
              badge: 'Community Backed',
            },
          ].map((item, idx) => (
            <GlassCard
              key={idx}
              hoverEffect
              className="p-7 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/25 flex items-center justify-center shadow-lg shadow-sky-500/15">
                    {item.icon}
                  </div>
                  <GlassBadge variant="cyan" size="sm">
                    {item.badge}
                  </GlassBadge>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 4. HOW WE REVIEW SCRIPTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GlassCard className="p-8 sm:p-12 border-sky-500/20 relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <GlassBadge variant="cyan" size="md" className="mb-3">
              Trust & Transparency
            </GlassBadge>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Our 4-Step Verification Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-white/60 mt-2">
              How we guarantee safety before any Lua code is released to the community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviewSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/[0.03] border border-sky-500/15 backdrop-blur-md relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-sky-400/25 font-mono">
                      {step.step}
                    </span>
                    <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20">
                      {step.icon}
                    </div>
                  </div>
                  <h4 className="font-bold text-white text-base mb-2">
                    {step.title}
                  </h4>
                  <p className="text-xs text-white/60 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      {/* 5. SAFETY CHECKLIST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <GlassBadge variant="cyan" size="md">
              Player Safety Guidelines
            </GlassBadge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Essential Safety Rules for Roblox Scripting
            </h2>
            <p className="text-sm text-white/60 leading-relaxed">
              Roblox anticheat systems look for anomalous server-side behavior. Follow our verified checklist to maintain an undetectable profile.
            </p>
            <div className="space-y-3">
              {[
                'Always run new scripts on a secondary test account for the first 24h.',
                'Use Tween teleport rather than instant CFrame warping in populated servers.',
                'Keep executors updated to the latest build to maintain engine hooks.',
                'Never paste obfuscated loadstrings from unknown Discord servers.',
              ].map((rule, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.04] border border-sky-500/15">
                  <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-white/85 font-medium">
                    {rule}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Card Visual */}
          <GlassCard className="p-8 border-sky-500/30 shadow-[0_0_40px_-10px_rgba(14,165,233,0.3)] space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-sky-400" />
                <div>
                  <h4 className="font-bold text-white text-base">Rimuru Shield Defense</h4>
                  <span className="text-xs text-sky-300">Active Real-Time Telemetry</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-sky-500/20 text-sky-400 border border-sky-500/40">
                PASS: 100%
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between text-white/70 py-1.5 border-b border-white/5">
                <span>Webhook Scanner</span>
                <span className="text-sky-400 font-semibold">0 Detected</span>
              </div>
              <div className="flex justify-between text-white/70 py-1.5 border-b border-white/5">
                <span>Memory Leak Profiler</span>
                <span className="text-sky-400 font-semibold">Stable (32MB)</span>
              </div>
              <div className="flex justify-between text-white/70 py-1.5 border-b border-white/5">
                <span>Hyperion Anticheat Bypass</span>
                <span className="text-sky-400 font-semibold">Verified Safe</span>
              </div>
              <div className="flex justify-between text-white/70 py-1.5">
                <span>Decompiler Cleanliness</span>
                <span className="text-sky-400 font-semibold">A+ Grade</span>
              </div>
            </div>

            <Link href="/trust" className="block pt-2">
              <GlassButton variant="primary" className="w-full justify-center">
                Read Detailed Security Report
              </GlassButton>
            </Link>
          </GlassCard>
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider font-mono">
            Got Questions?
          </span>
          <h2 className="text-3xl font-bold text-white mt-2 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>
        <GlassAccordion items={faqItems} />
      </section>

      {/* 7. BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GlassCard className="p-8 sm:p-14 text-center border-sky-500/30 relative overflow-hidden bg-gradient-to-b from-white/[0.08] to-sky-950/25">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Upgrade Your Roblox Experience?
            </h2>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed">
              Explore hundreds of verified scripts for Blox Fruits, Blade Ball, Fisch, and more. 100% free and keyless on Rimuru Script Hub.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link href="/scripts">
                <GlassButton size="lg" variant="primary">
                  Browse All Scripts
                </GlassButton>
              </Link>
              <Link href="/guides">
                <GlassButton size="lg" variant="secondary">
                  View Execution Guides
                </GlassButton>
              </Link>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
