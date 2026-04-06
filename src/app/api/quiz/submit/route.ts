import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
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

    const { deckId, questions, answers, timeTakenSeconds } = await request.json();

    // Calculate score
    let correct = 0;
    const results = questions.map((q: { id: string; correctAnswer: string; type: string }) => {
      const userAnswer = answers[q.id] || '';
      let isCorrect = false;

      if (q.type === 'essay') {
        // Essay questions are not auto-graded, marked as pending
        isCorrect = false;
      } else {
        isCorrect = userAnswer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
      }

      if (isCorrect) correct++;
      return { questionId: q.id, userAnswer, isCorrect };
    });

    const totalQuestions = questions.filter(
      (q: { type: string }) => q.type !== 'essay'
    ).length;
    const score = totalQuestions > 0 ? (correct / totalQuestions) * 100 : 0;

    // Save quiz attempt
    const attempt = await db.quizAttempt.create({
      data: {
        userId: user.id,
        deckId,
        questions,
        answers: results,
        score,
        totalQuestions: questions.length,
        timeTakenSeconds,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        attemptId: attempt.id,
        score,
        correct,
        total: totalQuestions,
        results,
      },
    });
  } catch (error) {
    console.error('Quiz submit error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}
