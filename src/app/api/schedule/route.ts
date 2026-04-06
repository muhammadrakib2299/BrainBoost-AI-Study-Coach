import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { anthropic } from '@/lib/claude';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { examDate, deckIds } = await request.json();

    if (!examDate) {
      return NextResponse.json(
        { success: false, error: 'Exam date required' },
        { status: 400 }
      );
    }

    // Get decks with their mastery and weak spots
    const decks = await db.deck.findMany({
      where: { userId: user.id, ...(deckIds?.length ? { id: { in: deckIds } } : {}) },
      include: {
        flashcards: { select: { state: true, stability: true } },
        weakSpots: { select: { concept: true, mistakeCount: true } },
      },
    });

    const deckSummary = decks
      .map((d) => {
        const newCards = d.flashcards.filter((c) => c.state === 'NEW').length;
        const weakTopics = d.weakSpots.map((ws) => `${ws.concept} (${ws.mistakeCount} mistakes)`);
        return `Deck: ${d.title}\n  Cards: ${d.cardCount}, New: ${newCards}, Mastery: ${Math.round(d.masteryPercent)}%\n  Weak topics: ${weakTopics.join(', ') || 'none'}`;
      })
      .join('\n\n');

    const today = new Date().toISOString().split('T')[0];

    const prompt = `You are a study schedule planner. Create an optimal daily study plan.

Exam date: ${examDate}
Today: ${today}

Student's decks:
${deckSummary}

Rules:
- Prioritize weak topics and low-mastery decks
- Space out topics across days (don't cram one topic)
- Include review days before the exam
- Keep daily load reasonable (30-60 min)
- Include specific deck names and topics for each day

Return ONLY a valid JSON array (no markdown, no code blocks):
[
  {
    "date": "2025-01-15",
    "deckIds": ["id1"],
    "topics": ["Topic A", "Topic B"],
    "estimatedMinutes": 45,
    "completed": false
  }
]`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json(
        { success: false, error: 'Failed to generate schedule' },
        { status: 500 }
      );
    }

    let dailyPlans;
    try {
      dailyPlans = JSON.parse(textBlock.text);
    } catch {
      const jsonMatch = textBlock.text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        return NextResponse.json(
          { success: false, error: 'Failed to parse schedule' },
          { status: 500 }
        );
      }
      dailyPlans = JSON.parse(jsonMatch[0]);
    }

    const schedule = await db.studySchedule.create({
      data: {
        userId: user.id,
        examDate: new Date(examDate),
        dailyPlans,
      },
    });

    return NextResponse.json({
      success: true,
      data: { scheduleId: schedule.id, dailyPlans },
    });
  } catch (error) {
    console.error('Schedule generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate schedule' },
      { status: 500 }
    );
  }
}

// Get existing schedule
export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const schedule = await db.studySchedule.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: schedule });
  } catch (error) {
    console.error('Get schedule error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch schedule' },
      { status: 500 }
    );
  }
}
