import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { anthropic } from '@/lib/claude';
import { db } from '@/lib/db';
import { FLASHCARD_GENERATION_PROMPT } from '@/lib/prompts';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { deckId } = await request.json();

    if (!deckId) {
      return NextResponse.json({ success: false, error: 'Deck ID required' }, { status: 400 });
    }

    const deck = await db.deck.findFirst({
      where: { id: deckId, userId: user.id },
    });

    if (!deck || !deck.sourceContent) {
      return NextResponse.json({ success: false, error: 'Deck not found or empty' }, { status: 404 });
    }

    // Truncate content if too long (keep under ~12k tokens)
    const content = deck.sourceContent.slice(0, 15000);

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: FLASHCARD_GENERATION_PROMPT + content,
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json(
        { success: false, error: 'Failed to generate flashcards' },
        { status: 500 }
      );
    }

    let flashcards: { question: string; answer: string; explanation?: string }[];
    try {
      flashcards = JSON.parse(textBlock.text);
    } catch {
      // Try to extract JSON from the response if it has markdown wrapping
      const jsonMatch = textBlock.text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        return NextResponse.json(
          { success: false, error: 'Failed to parse AI response' },
          { status: 500 }
        );
      }
      flashcards = JSON.parse(jsonMatch[0]);
    }

    // Save flashcards to database
    const created = await db.flashcard.createMany({
      data: flashcards.map((card) => ({
        deckId,
        question: card.question,
        answer: card.answer,
        explanation: card.explanation || null,
      })),
    });

    // Update deck card count
    await db.deck.update({
      where: { id: deckId },
      data: { cardCount: created.count },
    });

    // Fetch the created cards
    const cards = await db.flashcard.findMany({
      where: { deckId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: { cards, count: created.count },
    });
  } catch (error) {
    console.error('Flashcard generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate flashcards' },
      { status: 500 }
    );
  }
}
