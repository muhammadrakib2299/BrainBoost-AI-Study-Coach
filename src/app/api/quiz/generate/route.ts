import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { anthropic } from '@/lib/claude';
import { db } from '@/lib/db';
import { QUIZ_GENERATION_PROMPT } from '@/lib/prompts';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { deckId, questionCount = 10 } = await request.json();

    if (!deckId) {
      return NextResponse.json({ success: false, error: 'Deck ID required' }, { status: 400 });
    }

    const flashcards = await db.flashcard.findMany({
      where: { deck: { id: deckId, userId: user.id } },
      select: { question: true, answer: true },
    });

    if (flashcards.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No flashcards in this deck. Generate flashcards first.' },
        { status: 400 }
      );
    }

    const cardsSummary = flashcards
      .map((c, i) => `${i + 1}. Q: ${c.question}\n   A: ${c.answer}`)
      .join('\n');

    const prompt = `${QUIZ_GENERATION_PROMPT}${cardsSummary}\n\nGenerate exactly ${questionCount} questions.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json(
        { success: false, error: 'Failed to generate quiz' },
        { status: 500 }
      );
    }

    let questions;
    try {
      questions = JSON.parse(textBlock.text);
    } catch {
      const jsonMatch = textBlock.text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        return NextResponse.json(
          { success: false, error: 'Failed to parse quiz response' },
          { status: 500 }
        );
      }
      questions = JSON.parse(jsonMatch[0]);
    }

    // Add IDs to questions
    const questionsWithIds = questions.map((q: Record<string, unknown>, i: number) => ({
      ...q,
      id: `q-${i}`,
    }));

    return NextResponse.json({
      success: true,
      data: { questions: questionsWithIds, deckId },
    });
  } catch (error) {
    console.error('Quiz generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}
