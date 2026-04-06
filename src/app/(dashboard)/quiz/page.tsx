'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { QuizSession } from '@/components/quiz/quiz-session';
import { QuizResults } from '@/components/quiz/quiz-results';

interface Deck {
  id: string;
  title: string;
}

interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'essay';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

type QuizState = 'setup' | 'active' | 'results';

export default function QuizPage() {
  const searchParams = useSearchParams();
  const preselectedDeck = searchParams.get('deck');

  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState(preselectedDeck || '');
  const [questionCount, setQuestionCount] = useState(10);
  const [timed, setTimed] = useState(false);
  const [timeLimit, setTimeLimit] = useState(600);
  const [quizState, setQuizState] = useState<QuizState>('setup');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<{
    score: number;
    correct: number;
    total: number;
    results: { questionId: string; userAnswer: string; isCorrect: boolean }[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDecks() {
      const response = await fetch('/api/decks');
      const result = await response.json();
      if (result.success) {
        setDecks(result.data);
        if (!selectedDeck && result.data.length > 0) {
          setSelectedDeck(result.data[0].id);
        }
      }
    }
    loadDecks();
  }, [selectedDeck]);

  async function startQuiz() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckId: selectedDeck, questionCount }),
      });
      const result = await response.json();

      if (!result.success) {
        setError(result.error);
        return;
      }

      setQuestions(result.data.questions);
      setQuizState('active');
    } catch {
      setError('Failed to generate quiz.');
    } finally {
      setLoading(false);
    }
  }

  const handleComplete = useCallback(
    (data: typeof results) => {
      setResults(data);
      setQuizState('results');
    },
    []
  );

  if (quizState === 'active' && questions.length > 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <QuizSession
          questions={questions}
          deckId={selectedDeck}
          timed={timed}
          timeLimitSeconds={timeLimit}
          onComplete={handleComplete}
        />
      </div>
    );
  }

  if (quizState === 'results' && results) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Quiz Results</h1>
        <QuizResults
          score={results.score}
          correct={results.correct}
          total={results.total}
          results={results.results}
          questions={questions}
          deckId={selectedDeck}
        />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Start a Quiz</h1>
      <p className="text-muted-foreground mb-8">Test your knowledge with AI-generated questions.</p>

      <div className="border border-border rounded-lg p-4 sm:p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Select deck</label>
          <select
            value={selectedDeck}
            onChange={(e) => setSelectedDeck(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {decks.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Number of questions</label>
          <select
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {[5, 10, 15, 20].map((n) => (
              <option key={n} value={n}>
                {n} questions
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Timed mode</p>
            <p className="text-xs text-muted-foreground">Simulate exam conditions</p>
          </div>
          <button
            type="button"
            onClick={() => setTimed(!timed)}
            className={`w-10 h-6 rounded-full transition-colors ${timed ? 'bg-primary' : 'bg-secondary'}`}
          >
            <span
              className={`block w-4 h-4 bg-white rounded-full transition-transform mx-1 ${timed ? 'translate-x-4' : ''}`}
            />
          </button>
        </div>

        {timed && (
          <div>
            <label className="block text-sm font-medium mb-1">Time limit</label>
            <select
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value={300}>5 minutes</option>
              <option value={600}>10 minutes</option>
              <option value={900}>15 minutes</option>
              <option value={1200}>20 minutes</option>
            </select>
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          onClick={startQuiz}
          disabled={loading || !selectedDeck}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Generating Quiz...' : 'Start Quiz'}
        </button>
      </div>
    </div>
  );
}
