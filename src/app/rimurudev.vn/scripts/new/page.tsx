import React from 'react';
import { prisma } from '@/lib/prisma';
import { ScriptForm } from '@/components/admin/ScriptForm';

export const dynamic = 'force-dynamic';

export default async function NewScriptAdminPage() {
  const games = await prisma.game.findMany({
    orderBy: { name: 'asc' },
  });

  return <ScriptForm games={games} isEditing={false} />;
}
