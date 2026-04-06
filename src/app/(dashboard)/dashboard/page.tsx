'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { ProgressChart } from '@/components/dashboard/progress-chart';
import { MasteryChart } from '@/components/dashboard/mastery-chart';
import { QuizScoreChart } from '@/components/dashboard/quiz-score-chart';

interface DashboardData {
  deckCount: number;
  totalCards: number;
  dueCards: number;
  streak: number;
  avgMastery: number;
  examReadiness: number;
  weakSpotCount: number;
  decks: { id: string; title: string; cardCount: number; masteryPercent: number }[];
  recentQuizzes: { score: number; date: string }[];
  progress: { date: string; cardsReviewed: number; minutesStudied: number }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch('/api/dashboard');
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <p className="text-muted-foreground">Loading dashboard...</p>;
  }

  if (!data) {
    return <p className="text-destructive">Failed to load dashboard.</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s your study overview.</p>
        </div>
        <Link
          href="/decks/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + New Deck
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <StatsCards
          dueCards={data.dueCards}
          deckCount={data.deckCount}
          streak={data.streak}
          examReadiness={data.examReadiness}
        />
      </div>

      {/* Quick actions */}
      {data.dueCards > 0 && (
        <div className="border border-primary/20 bg-primary/5 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="font-medium">You have {data.dueCards} cards due for review</p>
            <p className="text-sm text-muted-foreground">
              Keep your streak going! Review them now.
            </p>
          </div>
          <Link
            href="/review"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
          >
            Start Review
          </Link>
        </div>
      )}

      {data.deckCount === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-12 text-center">
          <p className="text-lg font-medium mb-2">No decks yet</p>
          <p className="text-muted-foreground mb-4">
            Upload your first PDF, notes, or textbook chapter to get started.
          </p>
          <Link
            href="/decks/new"
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90"
          >
            Create your first deck
          </Link>
        </div>
      ) : (
        <>
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ProgressChart data={data.progress} />
            <QuizScoreChart data={data.recentQuizzes} />
          </div>

          {/* Mastery */}
          <div className="mb-6">
            <MasteryChart decks={data.decks} />
          </div>

          {/* Weak spots alert */}
          {data.weakSpotCount > 0 && (
            <div className="border border-orange-200 bg-orange-50/50 rounded-lg p-4">
              <p className="font-medium text-orange-800">
                {data.weakSpotCount} weak spot{data.weakSpotCount !== 1 ? 's' : ''} detected
              </p>
              <p className="text-sm text-orange-600">
                Try a focused drill session to strengthen your weak areas.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
