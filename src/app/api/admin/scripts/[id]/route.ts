import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const script = await prisma.script.findUnique({
      where: { id: params.id },
      include: {
        game: true,
        unlockSteps: {
          orderBy: { order: 'asc' },
        },
      },
    });

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

    const executorsString = typeof body.executors === 'string'
      ? body.executors
      : JSON.stringify(body.executors || []);

    const featuresString = typeof body.features === 'string'
      ? body.features
      : JSON.stringify(body.features || []);

    const script = await prisma.script.update({
      where: { id: params.id },
      data: {
        title: body.title,
        slug: body.slug,
        gameId: body.gameId,
        banner: body.banner,
        videoUrl: body.videoUrl ?? '',
        excerpt: body.excerpt,
        content: body.content,
        code: body.code,
        executors: executorsString,
        features: featuresString,
        isPublished: body.isPublished ?? true,
        isVerified: body.isVerified ?? true,
        isKeyless: body.isKeyless ?? true,
        author: body.author ?? 'Verified Dev',
        version: body.version ?? 'v1.0.0',
      },
    });

    if (Array.isArray(body.unlockSteps)) {
      await prisma.unlockStep.deleteMany({
        where: { scriptId: script.id },
      });

      for (let i = 0; i < body.unlockSteps.length; i++) {
        const s = body.unlockSteps[i];
        if (s.label && s.targetUrl) {
          await prisma.unlockStep.create({
            data: {
              scriptId: script.id,
              label: s.label,
              description: s.description || '',
              targetUrl: s.targetUrl,
              order: s.order ?? i + 1,
              isActive: s.isActive ?? true,
            },
          });
        }
      }
    }

    return NextResponse.json({ script, success: true });
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
    await prisma.script.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: 'Script deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
