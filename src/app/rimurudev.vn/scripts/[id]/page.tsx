import React from 'react';
import { notFound } from 'next/navigation';
import { getScriptById, getGames } from '@/lib/data';
import { ScriptForm } from '@/components/admin/ScriptForm';

export const dynamic = 'force-dynamic';

export default async function EditScriptPage({
  params,
}: {
  params: { id: string };
}) {
  const [script, games] = await Promise.all([
    getScriptById(params.id),
    getGames(),
  ]);

  if (!script) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <ScriptForm initialData={script} games={games} isEditing />
    </div>
  );
}
