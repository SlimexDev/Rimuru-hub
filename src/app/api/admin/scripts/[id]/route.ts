import { NextRequest, NextResponse } from 'next/server';
import { getScripts, getScriptById } from '@/lib/data';
import { saveDataFile } from '@/lib/github-sync';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const script = getScriptById(params.id);
    if (!script) {
      return NextResponse.json({ error: 'Script not found' }, { status: 404 });
    }
    return NextResponse.json({ script });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const scripts = getScripts();
    const index = scripts.findIndex((s) => s.id === params.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Script not found' }, { status: 404 });
    }

    const updatedScript = {
      ...scripts[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    scripts[index] = updatedScript;

    const syncResult = await saveDataFile({
      fileName: 'scripts.json',
      data: scripts,
      commitMessage: `chore(scripts): update script "${updatedScript.title}"`,
    });

    return NextResponse.json({
      script: updatedScript,
      success: true,
      sync: syncResult,
    });
  } catch (error: any) {
    console.error('Update script error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const scripts = getScripts();
    const targetScript = scripts.find((s) => s.id === params.id);
    const filteredScripts = scripts.filter((s) => s.id !== params.id);

    const syncResult = await saveDataFile({
      fileName: 'scripts.json',
      data: filteredScripts,
      commitMessage: `chore(scripts): delete script "${targetScript?.title || params.id}"`,
    });

    return NextResponse.json({
      success: true,
      message: 'Script deleted successfully',
      sync: syncResult,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
