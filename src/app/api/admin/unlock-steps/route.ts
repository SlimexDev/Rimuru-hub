import { NextRequest, NextResponse } from 'next/server';
import { getUnlockSteps, UnlockStepItem } from '@/lib/data';
import { saveDataFile } from '@/lib/github-sync';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const steps = getUnlockSteps();
    return NextResponse.json({ steps });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const steps = getUnlockSteps();

    // If whole array is passed (reordering or batch update)
    if (Array.isArray(body.steps)) {
      const syncResult = await saveDataFile({
        fileName: 'unlock-steps.json',
        data: body.steps,
        commitMessage: 'chore(unlock): reorder and update unlock steps',
      });
      return NextResponse.json({ success: true, steps: body.steps, sync: syncResult });
    }

    // Creating single new step
    const newStep: UnlockStepItem = {
      id: `step-${Date.now()}`,
      label: body.label,
      description: body.description || '',
      targetUrl: body.targetUrl,
      order: body.order ?? steps.length + 1,
      isActive: body.isActive ?? true,
      createdAt: new Date().toISOString(),
    };

    steps.push(newStep);

    const syncResult = await saveDataFile({
      fileName: 'unlock-steps.json',
      data: steps,
      commitMessage: `feat(unlock): add unlock step "${newStep.label}"`,
    });

    return NextResponse.json({
      step: newStep,
      success: true,
      sync: syncResult,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Step ID required' }, { status: 400 });
    }

    const steps = getUnlockSteps();
    const filteredSteps = steps.filter((s) => s.id !== id);

    const syncResult = await saveDataFile({
      fileName: 'unlock-steps.json',
      data: filteredSteps,
      commitMessage: `chore(unlock): delete unlock step "${id}"`,
    });

    return NextResponse.json({
      success: true,
      message: 'Step deleted',
      sync: syncResult,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
