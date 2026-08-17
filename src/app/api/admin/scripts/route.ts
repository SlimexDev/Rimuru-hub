import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const scriptSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug is required'),
  gameId: z.string().min(1, 'Game is required'),
  banner: z.string().min(1, 'Banner is required'),
  videoUrl: z.string().optional().nullable(),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  code: z.string().min(5, 'Code is required'),
  executors: z.array(z.string()).or(z.string()),
  features: z.array(z.string()).or(z.string()),
  isPublished: z.boolean().default(true),
  isVerified: z.boolean().default(true),
  isKeyless: z.boolean().default(true),
  author: z.string().default('Verified Dev'),
  version: z.string().default('v1.0.0'),
  unlockSteps: z.array(
    z.object({
      label: z.string(),
      description: z.string(),
      targetUrl: z.string(),
      order: z.number().default(0),
      isActive: z.boolean().default(true),
    })
  ).optional(),
});

export async function GET() {
  try {
    const scripts = await prisma.script.findMany({
      include: {
        game: true,
        unlockSteps: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
    return NextResponse.json({ scripts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = scriptSchema.parse(body);

    const executorsString = typeof validated.executors === 'string'
      ? validated.executors
      : JSON.stringify(validated.executors);

    const featuresString = typeof validated.features === 'string'
      ? validated.features
      : JSON.stringify(validated.features);

    // Check slug collision
    const existing = await prisma.script.findUnique({
      where: { slug: validated.slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: 'A script with this slug already exists.' },
        { status: 400 }
      );
    }

    const script = await prisma.script.create({
      data: {
        title: validated.title,
        slug: validated.slug,
        gameId: validated.gameId,
        banner: validated.banner,
        videoUrl: validated.videoUrl || '',
        excerpt: validated.excerpt,
        content: validated.content,
        code: validated.code,
        executors: executorsString,
        features: featuresString,
        isPublished: validated.isPublished,
        isVerified: validated.isVerified,
        isKeyless: validated.isKeyless,
        author: validated.author,
        version: validated.version,
        unlockSteps: validated.unlockSteps && validated.unlockSteps.length > 0
          ? {
              create: validated.unlockSteps.map((step, idx) => ({
                label: step.label,
                description: step.description,
                targetUrl: step.targetUrl,
                order: step.order ?? idx + 1,
                isActive: step.isActive ?? true,
              })),
            }
          : undefined,
      },
    });

    return NextResponse.json({ script, success: true }, { status: 201 });
  } catch (error: any) {
    console.error('Create script error:', error);
    return NextResponse.json(
      { error: error.message || 'Validation error' },
      { status: 400 }
    );
  }
}
