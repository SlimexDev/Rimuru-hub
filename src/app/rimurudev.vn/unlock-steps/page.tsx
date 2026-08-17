import React from 'react';
import { getUnlockSteps } from '@/lib/data';
import { UnlockStepsManager } from '@/components/admin/UnlockStepsManager';

export const dynamic = 'force-dynamic';

export default async function AdminUnlockStepsPage() {
  const steps = getUnlockSteps();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <UnlockStepsManager initialSteps={steps} />
    </div>
  );
}
