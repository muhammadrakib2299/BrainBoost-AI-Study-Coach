'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatDuration } from '@/lib/utils';

interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'essay';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuizSessionProps {
  questions: Question[];
  deckId: string;
  timed: boolean;
  timeLimitSeconds: number;
  onComplete: (results: {
    score: number;
    correct: number;
    total: number;
    results: { questionId: string; userAnswer: string; isCorrect: boolean }[];
  }) => void;
}

export function QuizSession({
  questions,
  deckId,
  timed,
  timeLimitSeconds,
  onComplete,
}: QuizSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [elapsed, setElapsed] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) return;
    const timer = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (timed && next >= timeLimitSeconds) {
          handleSubmit();
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted, timed, timeLimitSeconds]);

  const handleSubmit = useCallback(async () => {
    if (submitted) return;
    setSubmitted(true);

    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deckId,
          questions,
          answers,
          timeTakenSeconds: elapsed,
        }),
      });
      const result = await response.json();
      if (result.success) {
        onComplete(result.data);
      }
    } catch {
      // Handle error
    }
  }, [submitted, deckId, questions, answers, elapsed, onComplete]);

  const q = questions[currentIndex];
  const timeRemaining = timed ? timeLimitSeconds - elapsed : null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          Question {currentIndex + 1} of {questions.length}
        </p>
        <div className="flex items-center gap-4">
          {timed && timeRemaining !== null && (
            <p
              className={`text-sm font-mono ${timeRemaining < 60 ? 'text-destructive' : 'text-muted-foreground'}`}
            >
              {formatDuration(timeRemaining)}
            </p>
          )}
          <p className="text-sm text-muted-foreground">{formatDuration(elapsed)}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-secondary rounded-full h-2 mb-6">
        <div
          className="bg-primary rounded-full h-2 transition-all"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="border border-border rounded-lg p-4 sm:p-6 mb-6">
        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded mb-3 inline-block">
          {q.type.replace('_', ' ')}
        </span>
        <p className="text-base sm:text-lg font-medium mb-4">{q.question}</p>

        {/* Answer input based on type */}
        {q.type === 'multiple_choice' && q.options && (
          <div className="space-y-2">
            {q.options.map((option) => (
              <button
                key={option}
                onClick={() => setAnswers({ ...answers, [q.id]: option })}
                className={`w-full text-left px-3 sm:px-4 py-3 rounded-lg border transition-colors text-sm sm:text-base min-h-[44px] ${
                  answers[q.id] === option
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:bg-secondary'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {q.type === 'true_false' && (
          <div className="flex gap-2 sm:gap-3">
            {['True', 'False'].map((option) => (
              <button
                key={option}
                onClick={() => setAnswers({ ...answers, [q.id]: option })}
                className={`flex-1 px-3 sm:px-4 py-3 rounded-lg border transition-colors min-h-[44px] ${
                  answers[q.id] === option
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:bg-secondary'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {q.type === 'fill_blank' && (
          <input
            type="text"
            value={answers[q.id] || ''}
            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Type your answer..."
          />
        )}

        {q.type === 'essay' && (
          <textarea
            value={answers[q.id] || ''}
            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
            rows={5}
            className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            placeholder="Write your answer..."
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-secondary transition-colors disabled:opacity-50"
        >
          Previous
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex(currentIndex + 1)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitted}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitted ? 'Submitting...' : 'Submit Quiz'}
          </button>
        )}
      </div>
    </div>
  );
}
