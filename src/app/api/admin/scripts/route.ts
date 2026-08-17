import { NextRequest, NextResponse } from 'next/server';
import { getScripts, ScriptItem } from '@/lib/data';
import { saveDataFile } from '@/lib/github-sync';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const scripts = getScripts();
    return NextResponse.json({ scripts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const scripts = getScripts();

    const newId = `script-${Date.now()}`;
    const now = new Date().toISOString();

    const newScript: ScriptItem = {
      id: newId,
      slug: body.slug,
      title: body.title,
      gameId: body.gameId,
      banner: body.banner,
      videoUrl: body.videoUrl || null,
      excerpt: body.excerpt,
      content: body.content,
      code: body.code,
      executors: body.executors || ['Delta', 'Solara', 'Wave', 'Codex'],
      features: body.features || ['Auto Farm', 'Fast Attack'],
      isPublished: body.isPublished ?? true,
      isVerified: body.isVerified ?? true,
      isKeyless: body.isKeyless ?? true,
      views: 0,
      downloads: 0,
      rating: 4.9,
      author: body.author || 'Rimuru Team',
      version: body.version || 'v1.0.0',
      createdAt: now,
      updatedAt: now,
      unlockSteps: body.unlockSteps || [],
    };

    scripts.unshift(newScript);

    // Save to scripts.json and trigger GitHub sync
    const syncResult = await saveDataFile({
      fileName: 'scripts.json',
      data: scripts,
      commitMessage: `feat(scripts): add new script "${newScript.title}"`,
    });

    return NextResponse.json({
      script: newScript,
      success: true,
      sync: syncResult,
    });
  } catch (error: any) {
    console.error('Create script error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
