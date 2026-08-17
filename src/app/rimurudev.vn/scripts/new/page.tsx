import React from 'react';
import { getGames, getUnlockSteps } from '@/lib/data';
import { ScriptForm } from '@/components/admin/ScriptForm';

export const dynamic = 'force-dynamic';

export default async function NewScriptPage() {
  const games = getGames();
  const defaultSteps = getUnlockSteps();

  return (
    <div className="space-y-6">
      <ScriptForm games={games} defaultSteps={defaultSteps} />
    </div>
  );
}
