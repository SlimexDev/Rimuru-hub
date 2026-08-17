import { NextRequest, NextResponse } from 'next/server';
import { getGuides, getGuideById } from '@/lib/data';
import { saveDataFile } from '@/lib/github-sync';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const guide = getGuideById(params.id);
    if (!guide) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
    }
    return NextResponse.json({ guide });
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
    const guides = getGuides();
    const index = guides.findIndex((g) => g.id === params.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
    }

    const updatedGuide = {
      ...guides[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    guides[index] = updatedGuide;

    const syncResult = await saveDataFile({
      fileName: 'guides.json',
      data: guides,
      commitMessage: `chore(guides): update guide "${updatedGuide.title}"`,
    });

    return NextResponse.json({
      guide: updatedGuide,
      success: true,
      sync: syncResult,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const guides = getGuides();
    const targetGuide = guides.find((g) => g.id === params.id);
    const filteredGuides = guides.filter((g) => g.id !== params.id);

    const syncResult = await saveDataFile({
      fileName: 'guides.json',
      data: filteredGuides,
      commitMessage: `chore(guides): delete guide "${targetGuide?.title || params.id}"`,
    });

    return NextResponse.json({
      success: true,
      message: 'Guide deleted',
      sync: syncResult,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
