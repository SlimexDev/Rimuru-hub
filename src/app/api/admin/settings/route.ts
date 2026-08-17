import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/data';
import { saveDataFile } from '@/lib/github-sync';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = getSiteSettings();
    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const currentSettings = getSiteSettings();
    const updatedSettings = { ...currentSettings, ...body };

    const syncResult = await saveDataFile({
      fileName: 'site-settings.json',
      data: updatedSettings,
      commitMessage: 'chore(settings): update site configuration',
    });

    return NextResponse.json({
      settings: updatedSettings,
      success: true,
      sync: syncResult,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
