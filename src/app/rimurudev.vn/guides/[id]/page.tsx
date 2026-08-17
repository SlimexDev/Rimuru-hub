import React from 'react';
import { notFound } from 'next/navigation';
import { getGuideById } from '@/lib/data';
import { GuideForm } from '@/components/admin/GuideForm';

export const dynamic = 'force-dynamic';

export default async function EditGuidePage({
  params,
}: {
  params: { id: string };
}) {
  const guide = getGuideById(params.id);

  if (!guide) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <GuideForm initialData={guide} isEditing />
    </div>
  );
}
