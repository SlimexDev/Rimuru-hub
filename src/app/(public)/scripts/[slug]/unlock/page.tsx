import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ScriptUnlockGate } from '@/components/scripts/ScriptUnlockGate';
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const script = await prisma.script.findUnique({
    where: { slug: params.slug },
  });

  if (!script) {
    return { title: 'Script Not Found' };
  }

  return {
    title: `Unlock ${script.title} - Roblox Script Hub`,
    description: `Complete simple verification to instantly unlock the raw Lua loadstring for ${script.title}.`,
  };
}

export default async function UnlockPage({ params }: Props) {
  const script = await prisma.script.findUnique({
    where: { slug: params.slug },
    include: {
      game: true,
      unlockSteps: {
        where: { isActive: true },
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!script || !script.isPublished) {
    notFound();
  }

  // If script has no custom unlock steps, use global default steps
  let steps = script.unlockSteps;
  if (!steps || steps.length === 0) {
    steps = await prisma.unlockStep.findMany({
      where: { scriptId: null, isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <ScriptUnlockGate script={script} steps={steps} />
    </div>
  );
}
