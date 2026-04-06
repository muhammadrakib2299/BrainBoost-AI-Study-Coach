import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';

// Create a single flashcard manually
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { deckId, question, answer, explanation } = await request.json();

    // Verify deck ownership
    const deck = await db.deck.findFirst({ where: { id: deckId, userId: user.id } });
    if (!deck) {
      return NextResponse.json({ success: false, error: 'Deck not found' }, { status: 404 });
    }

    const card = await db.flashcard.create({
      data: { deckId, question, answer, explanation },
    });

    await db.deck.update({
      where: { id: deckId },
      data: { cardCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true, data: card });
  } catch (error) {
    console.error('Create flashcard error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create flashcard' }, { status: 500 });
  }
}

// Update a flashcard
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id, question, answer, explanation } = await request.json();

    const card = await db.flashcard.findFirst({
      where: { id },
      include: { deck: true },
    });

    if (!card || card.deck.userId !== user.id) {
      return NextResponse.json({ success: false, error: 'Card not found' }, { status: 404 });
    }

    const updated = await db.flashcard.update({
      where: { id },
      data: { question, answer, explanation },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update flashcard error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update flashcard' }, { status: 500 });
  }
}

// Delete a flashcard
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id, deckId } = await request.json();

    const card = await db.flashcard.findFirst({
      where: { id },
      include: { deck: true },
    });

    if (!card || card.deck.userId !== user.id) {
      return NextResponse.json({ success: false, error: 'Card not found' }, { status: 404 });
    }

    await db.flashcard.delete({ where: { id } });

    await db.deck.update({
      where: { id: deckId },
      data: { cardCount: { decrement: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete flashcard error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete flashcard' }, { status: 500 });
  }
}
