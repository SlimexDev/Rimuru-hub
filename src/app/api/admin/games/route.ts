import { NextRequest, NextResponse } from 'next/server';
import { getGames, GameItem } from '@/lib/data';
import { saveDataFile } from '@/lib/github-sync';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const games = getGames();
    return NextResponse.json({ games });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const games = getGames();

    if (!body.name) {
      return NextResponse.json({ error: 'Game name is required' }, { status: 400 });
    }

    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const existing = games.find((g) => g.slug === slug);
    if (existing) {
      return NextResponse.json(
        { error: 'Game with this slug already exists', game: existing },
        { status: 400 }
      );
    }

    const newGame: GameItem = {
      id: `game-${Date.now()}`,
      name: body.name,
      slug,
      icon:
        body.icon ||
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80',
      banner:
        body.banner ||
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
    };

    games.unshift(newGame);

    const syncResult = await saveDataFile({
      fileName: 'games.json',
      data: games,
      commitMessage: `feat(games): add new game category "${newGame.name}"`,
    });

    return NextResponse.json({
      game: newGame,
      success: true,
      sync: syncResult,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Game ID required' }, { status: 400 });
    }

    const games = getGames();
    const targetGame = games.find((g) => g.id === id);
    const filteredGames = games.filter((g) => g.id !== id);

    const syncResult = await saveDataFile({
      fileName: 'games.json',
      data: filteredGames,
      commitMessage: `chore(games): delete game category "${targetGame?.name || id}"`,
    });

    return NextResponse.json({
      success: true,
      message: 'Game category deleted',
      sync: syncResult,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
