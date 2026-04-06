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

    // Decks with mastery
    const decks = await db.deck.findMany({
      where: { userId: user.id },
      select: { id: true, title: true, cardCount: true, masteryPercent: true },
    });

    // Cards due today
    const dueCards = await db.flashcard.count({
      where: {
        deck: { userId: user.id },
        dueDate: { lte: new Date() },
      },
    });

    // Total cards
    const totalCards = await db.flashcard.count({
      where: { deck: { userId: user.id } },
    });

    // Quiz attempts (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentQuizzes = await db.quizAttempt.findMany({
      where: { userId: user.id, createdAt: { gte: sevenDaysAgo } },
      select: { score: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    // Study progress (last 7 days)
    const progress = await db.studyProgress.findMany({
      where: { userId: user.id, date: { gte: sevenDaysAgo } },
      orderBy: { date: 'asc' },
    });

    // Streak calculation
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      const hasProgress = progress.find(
        (p) => p.date.toISOString().split('T')[0] === dateStr
      );
      if (hasProgress && hasProgress.cardsReviewed > 0) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    // Exam readiness (average mastery across all decks)
    const avgMastery =
      decks.length > 0
        ? decks.reduce((sum, d) => sum + d.masteryPercent, 0) / decks.length
        : 0;

    // Weak spots count
    const weakSpotCount = await db.weakSpot.count({
      where: { userId: user.id },
    });

    return NextResponse.json({
      success: true,
      data: {
        deckCount: decks.length,
        totalCards,
        dueCards,
        streak,
        avgMastery: Math.round(avgMastery),
        examReadiness: Math.round(avgMastery),
        weakSpotCount,
        decks,
        recentQuizzes: recentQuizzes.map((q) => ({
          score: q.score,
          date: q.createdAt.toISOString().split('T')[0],
        })),
        progress: progress.map((p) => ({
          date: p.date.toISOString().split('T')[0],
          cardsReviewed: p.cardsReviewed,
          minutesStudied: p.minutesStudied,
        })),
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load dashboard' },
      { status: 500 }
    );
  }
}
