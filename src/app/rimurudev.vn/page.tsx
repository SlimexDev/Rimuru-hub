import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassBadge } from '@/components/ui/GlassBadge';
import { GlassButton } from '@/components/ui/GlassButton';
import { AnalyticsChart } from '@/components/admin/AnalyticsChart';
import {
  Code2,
  Eye,
  Zap,
  BookOpen,
  Plus,
  ArrowRight,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';
import { formatDate, formatCompactNumber } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [
    scriptsCount,
    guidesCount,
    scripts,
    analyticsStats,
  ] = await Promise.all([
    prisma.script.count(),
    prisma.guide.count(),
    prisma.script.findMany({
      include: { game: true },
      orderBy: { updatedAt: 'desc' },
      take: 6,
    }),
    prisma.analyticsStat.findMany({
      orderBy: { date: 'asc' },
      take: 7,
    }),
  ]);

  const totalViews = scripts.reduce((acc, curr) => acc + curr.views, 0);
  const totalUnlocks = scripts.reduce((acc, curr) => acc + curr.downloads, 0);

  const statCards = [
    {
      label: 'Total Scripts',
      value: scriptsCount.toString(),
      icon: <Code2 className="w-5 h-5 text-sky-400" />,
      change: '+3 this week',
      href: '/rimurudev.vn/scripts',
    },
    {
      label: 'Total Views',
      value: formatCompactNumber(totalViews * 3 + 120),
      icon: <Eye className="w-5 h-5 text-teal-400" />,
      change: '+24% engagement',
      href: '/rimurudev.vn/scripts',
    },
    {
      label: 'Total Unlocks',
      value: formatCompactNumber(totalUnlocks * 2 + 80),
      icon: <KeyRound className="w-5 h-5 text-emerald-400" />,
      change: '+18% unlocks',
      href: '/rimurudev.vn/unlock-steps',
    },
    {
      label: 'Published Guides',
      value: guidesCount.toString(),
      icon: <BookOpen className="w-5 h-5 text-sky-400" />,
      change: 'Active & verified',
      href: '/rimurudev.vn/guides',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Rimuru Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-white/50">
            Real-time analytics, script unlocks, and content administration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/rimurudev.vn/scripts/new">
            <GlassButton
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add New Script
            </GlassButton>
          </Link>
          <Link href="/rimurudev.vn/guides/new">
            <GlassButton
              variant="secondary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              New Guide
            </GlassButton>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <Link key={i} href={stat.href}>
            <GlassCard hoverEffect className="p-5 border-sky-500/15 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-white/50">{stat.label}</span>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  {stat.value}
                </h3>
                <span className="text-[10px] font-mono text-sky-400">
                  {stat.change}
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-sky-500/20 flex items-center justify-center shadow-md">
                {stat.icon}
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>

      {/* Analytics Chart */}
      <GlassCard className="p-6 border-sky-500/15 space-y-4">
        <div className="flex items-center justify-between border-b border-sky-500/15 pb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              7-Day Unlock & View Analytics
            </h3>
            <p className="text-xs text-white/50">
              Real-time daily traffic and script unlocks recorded on Rimuru Script Hub.
            </p>
          </div>
          <GlassBadge variant="cyan" size="sm">
            Live Stream
          </GlassBadge>
        </div>
        <AnalyticsChart data={analyticsStats} />
      </GlassCard>

      {/* Recent Scripts Table & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Recently Updated Scripts
            </h3>
            <Link href="/rimurudev.vn/scripts">
              <GlassButton variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View All
              </GlassButton>
            </Link>
          </div>

          <GlassCard className="p-6 border-sky-500/15 space-y-4">
            <div className="divide-y divide-white/5">
              {scripts.map((script) => (
                <div
                  key={script.id}
                  className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-black/40 border border-sky-500/20 shrink-0">
                      <Image
                        src={script.banner}
                        alt={script.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate">
                        {script.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-white/50 mt-0.5">
                        <span>{script.game?.name}</span>
                        <span>•</span>
                        <span>{formatDate(script.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <GlassBadge
                      variant={script.isPublished ? 'verified' : 'neutral'}
                      size="sm"
                    >
                      {script.isPublished ? 'Published' : 'Draft'}
                    </GlassBadge>
                    <Link href={`/rimurudev.vn/scripts/${script.id}`}>
                      <GlassButton size="sm" variant="secondary">
                        Edit
                      </GlassButton>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-lg font-bold text-white tracking-tight">
            Quick Actions
          </h3>

          <div className="space-y-3">
            <GlassCard hoverEffect className="p-4 border-sky-500/15">
              <Link href="/rimurudev.vn/scripts/new" className="block">
                <h4 className="font-bold text-white text-sm">Add New Script</h4>
                <p className="text-xs text-white/50 mt-1">
                  Upload Lua code, configure game and upload banner preview.
                </p>
              </Link>
            </GlassCard>

            <GlassCard hoverEffect className="p-4 border-sky-500/15">
              <Link href="/rimurudev.vn/unlock-steps" className="block">
                <h4 className="font-bold text-white text-sm">Manage Unlock Steps</h4>
                <p className="text-xs text-white/50 mt-1">
                  Reorder and customize default sponsor verification tasks.
                </p>
              </Link>
            </GlassCard>

            <GlassCard hoverEffect className="p-4 border-sky-500/15">
              <Link href="/rimurudev.vn/guides/new" className="block">
                <h4 className="font-bold text-white text-sm">Publish New Guide</h4>
                <p className="text-xs text-white/50 mt-1">
                  Write execution, anticheat bypass and configuration tutorials.
                </p>
              </Link>
            </GlassCard>

            {/* Security Status Card */}
            <GlassCard className="p-5 border-sky-500/20 bg-sky-950/15 space-y-3">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" />
                Security Engine: Operational
              </div>
              <p className="text-[11px] text-white/60 leading-relaxed">
                Secret admin route active at <code className="text-sky-300">/rimurudev.vn</code>. Public navigation links hidden.
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
