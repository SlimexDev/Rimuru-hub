import React from 'react';
import { getGames } from '@/lib/data';
import { GamesManager } from '@/components/admin/GamesManager';

export const dynamic = 'force-dynamic';

export default async function AdminGamesPage() {
  const games = getGames();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <GamesManager initialGames={games as any} />
    </div>
  );
}
