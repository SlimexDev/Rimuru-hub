import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const guideSchema = z.object({
  title: z.string().min(3, 'Title required'),
  slug: z.string().min(3, 'Slug required'),
  category: z.string().min(1, 'Category required'),
  excerpt: z.string().min(10, 'Excerpt required'),
  content: z.string().min(20, 'Content required'),
  banner: z.string().min(1, 'Banner required'),
  author: z.string().default('Liquid Security Team'),
  readTime: z.string().default('4 min read'),
  isPublished: z.boolean().default(true),
});

export async function GET() {
  try {
    const guides = await prisma.guide.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ guides });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = guideSchema.parse(body);

    const guide = await prisma.guide.create({
      data: validated,
    });
    return NextResponse.json({ guide, success: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
