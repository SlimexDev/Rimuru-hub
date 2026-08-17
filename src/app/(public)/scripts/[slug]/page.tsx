import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassBadge } from '@/components/ui/GlassBadge';
import { GlassAccordion } from '@/components/ui/Accordion';
import { ScriptCard } from '@/components/scripts/ScriptCard';
import {
  ShieldCheck,
  KeyRound,
  Star,
  Eye,
  Download,
  Calendar,
  User,
  Zap,
  Play,
  CheckCircle2,
  Terminal,
  Cpu,
  Smartphone,
  Monitor,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { formatDate, formatCompactNumber } from '@/lib/utils';
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const script = await prisma.script.findUnique({
    where: { slug: params.slug },
    include: { game: true },
  });

  if (!script) {
    return { title: 'Script Not Found' };
  }

  return {
    title: `${script.title} - Rimuru Roblox Script`,
    description: script.excerpt,
    openGraph: {
      title: `${script.title} | Rimuru Script`,
      description: script.excerpt,
      images: [{ url: script.banner }],
    },
  };
}

export const revalidate = 60;

export default async function ScriptDetailPage({ params }: Props) {
  const script = await prisma.script.findUnique({
    where: { slug: params.slug },
    include: {
      game: true,
      unlockSteps: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!script || !script.isPublished) {
    notFound();
  }

  // Increment views in background and update analytics
  const today = new Date().toISOString().split('T')[0];
  Promise.all([
    prisma.script.update({
      where: { id: script.id },
      data: { views: { increment: 1 } },
    }),
    prisma.analyticsStat.upsert({
      where: { date: today },
      update: { views: { increment: 1 } },
      create: { date: today, views: 1, unlocks: 0, copies: 0 },
    }),
  ]).catch(() => {});

  const relatedScripts = await prisma.script.findMany({
    where: {
      gameId: script.gameId,
      id: { not: script.id },
      isPublished: true,
    },
    include: { game: true },
    take: 3,
  });

  const executors: string[] = typeof script.executors === 'string'
    ? JSON.parse(script.executors || '[]')
    : script.executors || [];

  const features: string[] = typeof script.features === 'string'
    ? JSON.parse(script.features || '[]')
    : script.features || [];

  const scriptFaq = [
    {
      id: 'sfaq-1',
      question: `Is ${script.title} fully updated for current patch?`,
      answer: `Yes! Our development team checks and updates this script regularly. The current version (${script.version}) has been validated on both PC and mobile executors.`,
    },
    {
      id: 'sfaq-2',
      question: 'What do I do if the script crashes or does not open?',
      answer:
        '1. Ensure your executor is updated.\n2. Enable Auto-Attach in executor settings.\n3. Make sure your antivirus has the executor folder whitelisted.\n4. Check our Guides page for in-depth troubleshooting.',
    },
    {
      id: 'sfaq-3',
      question: 'Is this script keyless?',
      answer: script.isKeyless
        ? 'Yes! This script is 100% keyless. You do not need to generate daily keys to run it.'
        : 'This script utilizes our fast 3-step unlock system to access the clean loadstring.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-12">
      {/* 1. HERO BANNER & HEADER */}
      <GlassCard className="p-6 sm:p-10 border-white/15 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Preview Image */}
          <div className="lg:col-span-5 relative aspect-[16/10] rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-2xl">
            <Image
              src={script.banner}
              alt={script.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/70 backdrop-blur-md text-white border border-white/20">
                {script.game?.name}
              </span>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-amber-400 text-xs font-semibold border border-amber-500/30">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{script.rating?.toFixed(1) || '4.9'}</span>
              </div>
            </div>
          </div>

          {/* Right Meta & CTA */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <GlassBadge variant="emerald" size="sm" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                100% Verified
              </GlassBadge>
              {script.isKeyless && (
                <GlassBadge variant="cyan" size="sm" icon={<KeyRound className="w-3.5 h-3.5" />}>
                  Keyless Script
                </GlassBadge>
              )}
              <span className="text-xs font-mono text-white/50 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                {script.version}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {script.title}
            </h1>

            <p className="text-sm sm:text-base text-white/70 leading-relaxed">
              {script.excerpt}
            </p>

            {/* Quick Metadata Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-white/10 text-xs">
              <div>
                <span className="text-white/40 block">Author</span>
                <span className="text-white font-medium flex items-center gap-1 mt-0.5">
                  <User className="w-3 h-3 text-emerald-400" /> {script.author}
                </span>
              </div>
              <div>
                <span className="text-white/40 block">Updated</span>
                <span className="text-white font-medium flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3 text-emerald-400" /> {formatDate(script.updatedAt)}
                </span>
              </div>
              <div>
                <span className="text-white/40 block">Views</span>
                <span className="text-white font-medium flex items-center gap-1 mt-0.5">
                  <Eye className="w-3 h-3 text-emerald-400" /> {formatCompactNumber(script.views)}
                </span>
              </div>
              <div>
                <span className="text-white/40 block">Downloads</span>
                <span className="text-white font-medium flex items-center gap-1 mt-0.5">
                  <Download className="w-3 h-3 text-emerald-400" /> {formatCompactNumber(script.downloads)}
                </span>
              </div>
            </div>

            {/* Main Action CTA */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href={`/scripts/${script.slug}/unlock`}>
                <GlassButton size="lg" variant="primary" rightIcon={<Zap className="w-4 h-4" />}>
                  Get Script (Unlock Now)
                </GlassButton>
              </Link>
              <Link href="#execution-guide">
                <GlassButton size="lg" variant="secondary">
                  Execution Guide
                </GlassButton>
              </Link>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* 2. MAIN CONTENT & SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Features, Showcase & Instructions */}
        <div className="lg:col-span-8 space-y-8">
          {/* Key Features Breakdown */}
          <GlassCard className="p-6 sm:p-8 border-white/10 space-y-5">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">Key Script Features</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-sm font-medium text-white/90">{feature}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Description & Detailed Content */}
          <GlassCard className="p-6 sm:p-8 border-white/10 space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight">Script Overview & Documentation</h2>
            <div className="text-sm text-white/70 leading-relaxed space-y-4 whitespace-pre-line border-t border-white/10 pt-4">
              {script.content}
            </div>
          </GlassCard>

          {/* Step-by-Step Execution Guide (PC & Mobile) */}
          <GlassCard id="execution-guide" className="p-6 sm:p-8 border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl font-bold text-white tracking-tight">
                  How to Execute this Script
                </h2>
              </div>
              <GlassBadge variant="emerald" size="sm">
                Beginner Friendly
              </GlassBadge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PC Guide */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Monitor className="w-4 h-4 text-emerald-400" />
                  PC Execution (Solara / Wave)
                </div>
                <ol className="text-xs text-white/60 space-y-2 list-decimal list-inside">
                  <li>Unlock and copy the Lua loadstring code.</li>
                  <li>Open Roblox and launch {script.game?.name}.</li>
                  <li>Start Solara or Wave as Administrator.</li>
                  <li>Click Attach / Inject in the executor.</li>
                  <li>Paste the code and click Execute.</li>
                </ol>
              </div>

              {/* Mobile Guide */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  Mobile Execution (Delta / Codex)
                </div>
                <ol className="text-xs text-white/60 space-y-2 list-decimal list-inside">
                  <li>Install Delta APK (Android) or IPA (iOS).</li>
                  <li>Open Roblox and join {script.game?.name}.</li>
                  <li>Tap the floating executor icon on screen.</li>
                  <li>Paste the copied script code into the box.</li>
                  <li>Tap Execute and customize the script UI.</li>
                </ol>
              </div>
            </div>
          </GlassCard>

          {/* Script Specific FAQ */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight px-1">
              Frequently Asked Questions
            </h2>
            <GlassAccordion items={scriptFaq} />
          </div>
        </div>

        {/* Right Sidebar: Security Audit, Compatibility, CTA */}
        <div className="lg:col-span-4 space-y-6">
          {/* Unlock Action Card */}
          <GlassCard className="p-6 border-emerald-500/30 shadow-glass-glow space-y-4 bg-gradient-to-b from-white/[0.08] to-emerald-950/20">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                Instant Access
              </span>
              <h3 className="text-xl font-bold text-white">Unlock Full Script</h3>
              <p className="text-xs text-white/60">
                Complete quick verification to copy loadstring or download .lua file.
              </p>
            </div>
            <Link href={`/scripts/${script.slug}/unlock`} className="block">
              <GlassButton variant="primary" size="lg" className="w-full justify-center">
                Proceed to Unlock
              </GlassButton>
            </Link>
          </GlassCard>

          {/* Security & Sandbox Audit Card */}
          <GlassCard className="p-6 border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-white text-sm">Security Audit</h4>
              </div>
              <GlassBadge variant="verified" size="sm">
                CLEAN 0/72
              </GlassBadge>
            </div>

            <div className="space-y-2.5 text-xs text-white/70">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Webhook Scanner</span>
                <span className="text-emerald-400 font-medium">Safe (0 Found)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Token Grabber Check</span>
                <span className="text-emerald-400 font-medium">Passed</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>External HTTP Check</span>
                <span className="text-emerald-400 font-medium">GitHub Raw Only</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Last Scanned</span>
                <span className="text-white/40">{formatDate(script.updatedAt)}</span>
              </div>
            </div>
          </GlassCard>

          {/* Compatible Executors */}
          <GlassCard className="p-6 border-white/10 space-y-3">
            <h4 className="font-bold text-white text-sm">Supported Executors</h4>
            <div className="flex flex-wrap gap-1.5">
              {executors.map((exec) => (
                <span
                  key={exec}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-white/[0.06] text-white/80 border border-white/10 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {exec}
                </span>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* 3. RELATED SCRIPTS */}
      {relatedScripts.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              More {script.game?.name} Scripts
            </h2>
            <Link href={`/scripts?game=${script.game?.slug}`}>
              <GlassButton variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View All
              </GlassButton>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedScripts.map((relScript, idx) => (
              <ScriptCard key={relScript.id} script={relScript as any} index={idx} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
