import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { anthropic } from '@/lib/claude';
import { db } from '@/lib/db';
import { RECALL_EVALUATION_PROMPT } from '@/lib/prompts';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { deckId, topic, userResponse } = await request.json();

    if (!deckId || !userResponse) {
      return NextResponse.json(
        { success: false, error: 'Deck ID and response required' },
        { status: 400 }
      );
    }

    const deck = await db.deck.findFirst({
      where: { id: deckId, userId: user.id },
    });

    if (!deck || !deck.sourceContent) {
      return NextResponse.json({ success: false, error: 'Deck not found' }, { status: 404 });
    }

    const content = deck.sourceContent.slice(0, 10000);
    const prompt = `${RECALL_EVALUATION_PROMPT}${content}\n\nStudent's recall attempt:\n${userResponse}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json(
        { success: false, error: 'Failed to evaluate recall' },
        { status: 500 }
      );
    }

    let evaluation;
    try {
      evaluation = JSON.parse(textBlock.text);
    } catch {
      const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return NextResponse.json(
          { success: false, error: 'Failed to parse evaluation' },
          { status: 500 }
        );
      }
      evaluation = JSON.parse(jsonMatch[0]);
    }

    // Save recall attempt
    const attempt = await db.recallAttempt.create({
      data: {
        userId: user.id,
        deckId,
        topic: topic || deck.title,
        userResponse,
        completenessScore: evaluation.score,
        missedConcepts: evaluation.missedConcepts || [],
      },
    });

    // Update weak spots based on missed concepts
    if (evaluation.missedConcepts?.length > 0) {
      for (const concept of evaluation.missedConcepts) {
        await db.weakSpot.upsert({
          where: {
            id: `${user.id}-${deckId}-${concept}`.slice(0, 25),
          },
          create: {
            userId: user.id,
            deckId,
            concept,
            mistakeCount: 1,
            mistakePattern: 'missed_in_recall',
          },
          update: {
            mistakeCount: { increment: 1 },
            lastMistakeAt: new Date(),
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        attemptId: attempt.id,
        score: evaluation.score,
        missedConcepts: evaluation.missedConcepts,
        feedback: evaluation.feedback,
      },
    });
  } catch (error) {
    console.error('Recall evaluation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to evaluate recall' },
      { status: 500 }
    );
  }
}
