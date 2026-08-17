import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassBadge } from '@/components/ui/GlassBadge';
import { GlassButton } from '@/components/ui/GlassButton';
import { ArrowLeft, Clock, User, Calendar, Sparkles, BookOpen, Share2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = await prisma.guide.findUnique({
    where: { slug: params.slug },
  });

  if (!guide) return { title: 'Guide Not Found' };

  return {
    title: `${guide.title} - Rimuru Roblox Guide`,
    description: guide.excerpt,
    openGraph: {
      title: `${guide.title} | Rimuru Script`,
      description: guide.excerpt,
      images: [{ url: guide.banner }],
    },
  };
}

export default async function SingleGuidePage({ params }: Props) {
  const guide = await prisma.guide.findUnique({
    where: { slug: params.slug },
  });

  if (!guide || !guide.isPublished) {
    notFound();
  }

  // Increment views
  prisma.guide
    .update({
      where: { id: guide.id },
      data: { views: { increment: 1 } },
    })
    .catch(() => {});

  const otherGuides = await prisma.guide.findMany({
    where: { id: { not: guide.id }, isPublished: true },
    take: 2,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-8">
      {/* Back navigation */}
      <Link
        href="/guides"
        className="inline-flex items-center gap-2 text-xs font-medium text-white/60 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to all guides
      </Link>

      {/* Guide Header Card */}
      <GlassCard className="p-6 sm:p-10 border-white/15 space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <GlassBadge variant="emerald" size="sm">
            {guide.category}
          </GlassBadge>
          <div className="flex items-center gap-4 text-xs text-white/50">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" /> {guide.readTime}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" /> {formatDate(guide.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-emerald-400" /> {guide.author}
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {guide.title}
        </h1>

        <p className="text-sm sm:text-base text-white/70 leading-relaxed border-l-2 border-emerald-400 pl-4">
          {guide.excerpt}
        </p>

        {/* Banner image */}
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-xl">
          <Image
            src={guide.banner}
            alt={guide.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 800px"
          />
        </div>

        {/* Content Body */}
        <div className="prose prose-invert max-w-none pt-6 border-t border-white/10 text-sm sm:text-base text-white/80 leading-relaxed space-y-4 whitespace-pre-line">
          {guide.content}
        </div>
      </GlassCard>

      {/* Explore More Guides */}
      {otherGuides.length > 0 && (
        <div className="pt-8 border-t border-white/10 space-y-4">
          <h3 className="text-lg font-bold text-white">Recommended Guides</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {otherGuides.map((og) => (
              <Link key={og.id} href={`/guides/${og.slug}`} className="block group">
                <GlassCard hoverEffect className="p-5 border-white/10">
                  <span className="text-xs text-emerald-400 font-medium">{og.category}</span>
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors mt-1 line-clamp-2">
                    {og.title}
                  </h4>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
