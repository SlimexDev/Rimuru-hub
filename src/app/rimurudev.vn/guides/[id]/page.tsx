import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { GuideForm } from '@/components/admin/GuideForm';

interface Props {
  params: { id: string };
}

export const dynamic = 'force-dynamic';

export default async function EditGuideAdminPage({ params }: Props) {
  const guide = await prisma.guide.findUnique({
    where: { id: params.id },
  });

  if (!guide) {
    notFound();
  }

  return <GuideForm initialData={guide} isEditing={true} />;
}
