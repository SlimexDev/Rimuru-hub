import React from 'react';
import { getScripts, getGames } from '@/lib/data';
import { ScriptsTable } from '@/components/admin/ScriptsTable';

export const dynamic = 'force-dynamic';

export default async function AdminScriptsPage() {
  const scripts = getScripts();
  const games = getGames();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <ScriptsTable initialScripts={scripts as any} games={games} />
    </div>
  );
}
