import React from 'react';
import { prisma } from '@/lib/prisma';
import { UnlockStepsManager } from '@/components/admin/UnlockStepsManager';

export const dynamic = 'force-dynamic';

export default async function AdminUnlockStepsPage() {
  const steps = await prisma.unlockStep.findMany({
    where: { scriptId: null },
    orderBy: { order: 'asc' },
  });

  return <UnlockStepsManager initialSteps={steps as any} />;
}
