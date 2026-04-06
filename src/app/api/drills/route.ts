import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { anthropic } from '@/lib/claude';
import { db } from '@/lib/db';
import { WEAK_SPOT_DRILL_PROMPT } from '@/lib/prompts';

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

    const weakSpots = await db.weakSpot.findMany({
      where: { userId: user.id, ...(deckId ? { deckId } : {}) },
      orderBy: { mistakeCount: 'desc' },
      take: 10,
    });

    if (weakSpots.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No weak spots found. Complete some reviews first.' },
        { status: 400 }
      );
    }

    const weakSpotSummary = weakSpots
      .map((ws) => `- ${ws.concept} (${ws.mistakeCount} mistakes, pattern: ${ws.mistakePattern})`)
      .join('\n');

    const prompt = WEAK_SPOT_DRILL_PROMPT.replace('{WEAK_SPOTS}', weakSpotSummary);

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json(
        { success: false, error: 'Failed to generate drills' },
        { status: 500 }
      );
    }

    let drills;
    try {
      drills = JSON.parse(textBlock.text);
    } catch {
      const jsonMatch = textBlock.text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        return NextResponse.json(
          { success: false, error: 'Failed to parse drills' },
          { status: 500 }
        );
      }
      drills = JSON.parse(jsonMatch[0]);
    }

    return NextResponse.json({ success: true, data: drills });
  } catch (error) {
    console.error('Drill generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate drills' },
      { status: 500 }
    );
  }
}
