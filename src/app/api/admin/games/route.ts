import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const gameSchema = z.object({
  name: z.string().min(2, 'Game name must be at least 2 characters'),
  slug: z.string().optional(),
  icon: z.string().optional(),
  banner: z.string().optional(),
});

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      include: {
        _count: {
          select: { scripts: true },
        },
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ games });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = gameSchema.parse(body);

    const slug =
      validated.slug && validated.slug.trim() !== ''
        ? validated.slug
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
        : validated.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

    // Check if slug exists
    const existing = await prisma.game.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A game with this name or slug already exists.' },
        { status: 400 }
      );
    }

    const defaultBanner =
      validated.banner && validated.banner.trim() !== ''
        ? validated.banner
        : 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80';

    const defaultIcon =
      validated.icon && validated.icon.trim() !== ''
        ? validated.icon
        : 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=150&auto=format&fit=crop&q=80';

    const game = await prisma.game.create({
      data: {
        name: validated.name.trim(),
        slug,
        icon: defaultIcon,
        banner: defaultBanner,
      },
    });

    return NextResponse.json({ game, success: true }, { status: 201 });
  } catch (error: any) {
    console.error('Create game error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create game' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Game ID required' }, { status: 400 });

    await prisma.game.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Game deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
