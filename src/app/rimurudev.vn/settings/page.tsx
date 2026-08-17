import React from 'react';
import { getSiteSettings } from '@/lib/data';
import { SettingsForm } from '@/components/admin/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const settings = getSiteSettings();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
