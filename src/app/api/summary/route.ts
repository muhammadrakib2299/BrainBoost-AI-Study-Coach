import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { anthropic } from '@/lib/claude';
import { db } from '@/lib/db';
import { SUMMARY_PROMPT } from '@/lib/prompts';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { deckId, level = 'medium', format = 'standard' } = await request.json();

    if (!deckId) {
      return NextResponse.json({ success: false, error: 'Deck ID required' }, { status: 400 });
    }

    const deck = await db.deck.findFirst({
      where: { id: deckId, userId: user.id },
    });

    if (!deck || !deck.sourceContent) {
      return NextResponse.json({ success: false, error: 'Deck not found' }, { status: 404 });
    }

    const content = deck.sourceContent.slice(0, 12000);
    const prompt = SUMMARY_PROMPT.replace('{FORMAT}', format) +
      `\n\nDetail level: ${level}\n\n${content}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json(
        { success: false, error: 'Failed to generate summary' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        summary: textBlock.text,
        level,
        format,
        deckTitle: deck.title,
      },
    });
  } catch (error) {
    console.error('Summary error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
