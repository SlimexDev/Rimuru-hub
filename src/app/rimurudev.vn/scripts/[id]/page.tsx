import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ScriptForm } from '@/components/admin/ScriptForm';

interface Props {
  params: { id: string };
}

export const dynamic = 'force-dynamic';

export default async function EditScriptAdminPage({ params }: Props) {
  const [script, games] = await Promise.all([
    prisma.script.findUnique({
      where: { id: params.id },
      include: {
        game: true,
        unlockSteps: {
          orderBy: { order: 'asc' },
        },
      },
    }),
    prisma.game.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  if (!script) {
    notFound();
  }

  return <ScriptForm initialData={script} games={games} isEditing={true} />;
}
