import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    const script = await prisma.script.findUnique({
      where: { slug },
      select: { id: true, downloads: true },
    });

    if (!script) {
      return NextResponse.json({ error: 'Script not found' }, { status: 404 });
    }

    // Increment downloads in real-time
    const updated = await prisma.script.update({
      where: { id: script.id },
      data: {
        downloads: { increment: 1 },
      },
    });

    // Update today's analytics
    const today = new Date().toISOString().split('T')[0];
    await prisma.analyticsStat
      .upsert({
        where: { date: today },
        update: { unlocks: { increment: 1 }, copies: { increment: 1 } },
        create: { date: today, views: 1, unlocks: 1, copies: 1 },
      })
      .catch(() => {});

    return NextResponse.json({
      success: true,
      downloads: updated.downloads,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
