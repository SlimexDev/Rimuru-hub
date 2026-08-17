import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const stepSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  description: z.string().default(''),
  targetUrl: z.string().min(1, 'Target URL is required'),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

export async function GET() {
  try {
    const steps = await prisma.unlockStep.findMany({
      where: { scriptId: null },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ steps });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = stepSchema.parse(body);

    const step = await prisma.unlockStep.create({
      data: {
        label: validated.label,
        description: validated.description,
        targetUrl: validated.targetUrl,
        order: validated.order,
        isActive: validated.isActive,
        scriptId: null,
      },
    });

    return NextResponse.json({ step, success: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (Array.isArray(body.steps)) {
      for (let i = 0; i < body.steps.length; i++) {
        const s = body.steps[i];
        await prisma.unlockStep.update({
          where: { id: s.id },
          data: {
            order: i + 1,
            label: s.label,
            description: s.description,
            targetUrl: s.targetUrl,
            isActive: s.isActive ?? true,
          },
        });
      }
      return NextResponse.json({ success: true });
    } else if (body.id) {
      const updated = await prisma.unlockStep.update({
        where: { id: body.id },
        data: {
          label: body.label,
          description: body.description,
          targetUrl: body.targetUrl,
          isActive: body.isActive,
          order: body.order,
        },
      });
      return NextResponse.json({ step: updated, success: true });
    }
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.unlockStep.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
