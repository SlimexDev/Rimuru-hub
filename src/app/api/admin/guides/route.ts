import { NextRequest, NextResponse } from 'next/server';
import { getGuides, GuideItem } from '@/lib/data';
import { saveDataFile } from '@/lib/github-sync';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const guides = getGuides();
    return NextResponse.json({ guides });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const guides = getGuides();

    const newId = `guide-${Date.now()}`;
    const now = new Date().toISOString();

    const newGuide: GuideItem = {
      id: newId,
      slug: body.slug,
      title: body.title,
      category: body.category || 'PC Executors',
      excerpt: body.excerpt,
      content: body.content,
      banner:
        body.banner ||
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
      author: body.author || 'Rimuru Security Team',
      readTime: body.readTime || '4 min read',
      isPublished: body.isPublished ?? true,
      views: 0,
      createdAt: now,
      updatedAt: now,
    };

    guides.unshift(newGuide);

    const syncResult = await saveDataFile({
      fileName: 'guides.json',
      data: guides,
      commitMessage: `feat(guides): add new guide "${newGuide.title}"`,
    });

    return NextResponse.json({
      guide: newGuide,
      success: true,
      sync: syncResult,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
