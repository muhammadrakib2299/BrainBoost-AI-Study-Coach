import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const deckId = searchParams.get('deckId');

    const where = {
      deck: { userId: user.id, ...(deckId ? { id: deckId } : {}) },
      dueDate: { lte: new Date() },
    };

    const dueCards = await db.flashcard.findMany({
      where,
      orderBy: { dueDate: 'asc' },
      include: { deck: { select: { title: true } } },
    });

    // Also get new cards (never reviewed)
    const newCards = await db.flashcard.findMany({
      where: {
        deck: { userId: user.id, ...(deckId ? { id: deckId } : {}) },
        state: 'NEW',
      },
      orderBy: { createdAt: 'asc' },
      take: 10,
      include: { deck: { select: { title: true } } },
    });

    // Combine: due first, then new
    const allCards = [...dueCards, ...newCards.filter((c) => !dueCards.find((d) => d.id === c.id))];

    return NextResponse.json({
      success: true,
      data: {
        cards: allCards,
        dueCount: dueCards.length,
        newCount: newCards.length,
      },
    });
  } catch (error) {
    console.error('Due cards error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch due cards' },
      { status: 500 }
    );
  }
}
