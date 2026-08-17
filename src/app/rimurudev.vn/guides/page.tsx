import React from 'react';
import { prisma } from '@/lib/prisma';
import { GuidesTable } from '@/components/admin/GuidesTable';

export const dynamic = 'force-dynamic';

export default async function AdminGuidesPage() {
  const guides = await prisma.guide.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <GuidesTable initialGuides={guides as any} />;
}
