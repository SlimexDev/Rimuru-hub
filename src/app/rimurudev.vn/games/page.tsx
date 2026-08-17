import React from 'react';
import { prisma } from '@/lib/prisma';
import { GamesManager } from '@/components/admin/GamesManager';

export const dynamic = 'force-dynamic';

export default async function AdminGamesPage() {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: { scripts: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  return <GamesManager initialGames={games as any} />;
}
