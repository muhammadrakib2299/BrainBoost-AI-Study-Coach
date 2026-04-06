import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { reviewCard } from '@/lib/fsrs';
import type { CardRating } from '@/types';

const STATE_MAP = {
  learning: 'LEARNING' as const,
  review: 'REVIEW' as const,
  relearning: 'RELEARNING' as const,
  new: 'NEW' as const,
};

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { cardId, rating } = (await request.json()) as { cardId: string; rating: CardRating };

    if (!cardId || !['again', 'hard', 'good', 'easy'].includes(rating)) {
      return NextResponse.json(
        { success: false, error: 'Valid card ID and rating required' },
        { status: 400 }
      );
    }

    const card = await db.flashcard.findFirst({
      where: { id: cardId },
      include: { deck: true },
    });

    if (!card || card.deck.userId !== user.id) {
      return NextResponse.json({ success: false, error: 'Card not found' }, { status: 404 });
    }

    // Run FSRS algorithm
    const result = reviewCard(
      {
        stability: card.stability,
        difficulty: card.difficulty,
        state: card.state.toLowerCase() as 'new' | 'learning' | 'review' | 'relearning',
        reviewCount: card.reviewCount,
        lapseCount: card.lapseCount,
      },
      rating
    );

    // Update card
    const updated = await db.flashcard.update({
      where: { id: cardId },
      data: {
        stability: result.stability,
        difficulty: result.difficulty,
        dueDate: result.dueDate,
        lastReviewDate: new Date(),
        reviewCount: { increment: 1 },
        lapseCount: result.lapseCount,
        state: STATE_MAP[result.state],
      },
    });

    // Track weak spot if card was forgotten
    if (rating === 'again') {
      await db.weakSpot.upsert({
        where: {
          id: `${user.id}-${card.deckId}-${card.id}`.slice(0, 25),
        },
        create: {
          userId: user.id,
          deckId: card.deckId,
          concept: card.question.slice(0, 100),
          mistakeCount: 1,
          mistakePattern: 'forgotten_in_review',
        },
        update: {
          mistakeCount: { increment: 1 },
          lastMistakeAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        cardId: updated.id,
        nextDue: result.dueDate,
        stability: result.stability,
        difficulty: result.difficulty,
        state: result.state,
      },
    });
  } catch (error) {
    console.error('Review rate error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process rating' },
      { status: 500 }
    );
  }
}
