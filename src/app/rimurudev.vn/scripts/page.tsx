import React from 'react';
import { prisma } from '@/lib/prisma';
import { ScriptsTable } from '@/components/admin/ScriptsTable';

export const dynamic = 'force-dynamic';

export default async function AdminScriptsPage() {
  const [scripts, games] = await Promise.all([
    prisma.script.findMany({
      include: { game: true },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.game.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  return <ScriptsTable initialScripts={scripts as any} games={games} />;
}
