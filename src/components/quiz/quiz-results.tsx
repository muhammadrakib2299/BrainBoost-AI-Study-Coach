'use client';

import Link from 'next/link';

interface QuizResultsProps {
  score: number;
  correct: number;
  total: number;
  results: { questionId: string; userAnswer: string; isCorrect: boolean }[];
  questions: {
    id: string;
    question: string;
    correctAnswer: string;
    explanation: string;
    type: string;
  }[];
  deckId: string;
}

export function QuizResults({ score, correct, total, results, questions, deckId }: QuizResultsProps) {
  const scoreColor = score >= 80 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-destructive';

  return (
    <div>
      {/* Score summary */}
      <div className="text-center py-8 border border-border rounded-lg mb-6">
        <p className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${scoreColor}`}>{Math.round(score)}%</p>
        <p className="text-muted-foreground mt-2">
          {correct} correct out of {total} questions
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {score >= 80 ? 'Great job!' : score >= 50 ? 'Good effort, keep studying!' : 'Review the material and try again.'}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-8 justify-center">
        <Link
          href={`/quiz?deck=${deckId}`}
          className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Retake Quiz
        </Link>
        <Link
          href={`/decks/${deckId}`}
          className="px-4 py-2.5 border border-border rounded-lg text-sm hover:bg-secondary transition-colors"
        >
          Back to Deck
        </Link>
        <Link
          href={`/review?deck=${deckId}`}
          className="px-4 py-2.5 border border-border rounded-lg text-sm hover:bg-secondary transition-colors"
        >
          Review Cards
        </Link>
      </div>

      {/* Question breakdown */}
      <h2 className="text-lg font-semibold mb-4">Question Breakdown</h2>
      <div className="space-y-4">
        {questions.map((q, i) => {
          const result = results.find((r) => r.questionId === q.id);
          const isCorrect = result?.isCorrect;

          return (
            <div
              key={q.id}
              className={`border rounded-lg p-4 ${
                isCorrect ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`text-sm font-medium ${isCorrect ? 'text-green-600' : 'text-destructive'}`}>
                  {isCorrect ? '✓' : '✗'}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-sm mb-1">
                    {i + 1}. {q.question}
                  </p>
                  {!isCorrect && (
                    <>
                      <p className="text-sm text-destructive">
                        Your answer: {result?.userAnswer || '(no answer)'}
                      </p>
                      <p className="text-sm text-green-600">Correct: {q.correctAnswer}</p>
                    </>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">{q.explanation}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
