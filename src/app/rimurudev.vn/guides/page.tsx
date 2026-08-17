import React from 'react';
import { getGuides } from '@/lib/data';
import { GuidesTable } from '@/components/admin/GuidesTable';

export const dynamic = 'force-dynamic';

export default async function AdminGuidesPage() {
  const guides = getGuides();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <GuidesTable initialGuides={guides as any} />
    </div>
  );
}
