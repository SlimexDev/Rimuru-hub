import React from 'react';
import { notFound } from 'next/navigation';
import { getPublishedScripts, getScriptBySlug, getUnlockSteps } from '@/lib/data';
import { ScriptUnlockGate } from '@/components/scripts/ScriptUnlockGate';
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

// 100% SSG: Pre-generate all unlock pages
export function generateStaticParams() {
  const scripts = getPublishedScripts();
  return scripts.map((script) => ({
    slug: script.slug,
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const script = getScriptBySlug(params.slug);

  if (!script) {
    return { title: 'Script Not Found' };
  }

  return {
    title: `Unlock ${script.title} - Rimuru Roblox Script`,
    description: `Complete simple verification to instantly unlock the raw Lua loadstring for ${script.title}.`,
  };
}

export default function UnlockPage({ params }: Props) {
  const script = getScriptBySlug(params.slug);

  if (!script || !script.isPublished) {
    notFound();
  }

  const globalSteps = getUnlockSteps().filter((s) => s.isActive);
  const steps =
    script.unlockSteps && script.unlockSteps.length > 0
      ? script.unlockSteps.filter((s) => s.isActive)
      : globalSteps;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <ScriptUnlockGate script={script as any} steps={steps} />
    </div>
  );
}
