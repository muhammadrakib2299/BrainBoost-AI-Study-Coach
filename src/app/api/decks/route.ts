import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decks = await db.deck.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      select: { id: true, title: true, cardCount: true, masteryPercent: true, sourceType: true },
    });

    return NextResponse.json({ success: true, data: decks });
  } catch (error) {
    console.error('Fetch decks error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch decks' }, { status: 500 });
  }
}
