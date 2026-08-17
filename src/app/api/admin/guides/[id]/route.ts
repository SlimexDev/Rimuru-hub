import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const guide = await prisma.guide.findUnique({
      where: { id: params.id },
    });
    if (!guide) return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
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
    const guide = await prisma.guide.update({
      where: { id: params.id },
      data: {
        title: body.title,
        slug: body.slug,
        category: body.category,
        excerpt: body.excerpt,
        content: body.content,
        banner: body.banner,
        author: body.author,
        readTime: body.readTime,
        isPublished: body.isPublished,
      },
    });
    return NextResponse.json({ guide, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.guide.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
