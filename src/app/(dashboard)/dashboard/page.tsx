'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { ProgressChart } from '@/components/dashboard/progress-chart';
import { MasteryChart } from '@/components/dashboard/mastery-chart';
import { QuizScoreChart } from '@/components/dashboard/quiz-score-chart';
import {
  Plus,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  BookOpen,
  Sparkles,
} from 'lucide-react';

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
        setData({
          deckCount: 0, totalCards: 0, dueCards: 0, streak: 0,
          avgMastery: 0, examReadiness: 0, weakSpotCount: 0,
          decks: [], recentQuizzes: [], progress: [],
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here&apos;s your study overview.</p>
        </div>
        <Link
          href="/decks/new"
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Deck
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

      {/* Due cards alert */}
      {data.dueCards > 0 && (
        <div className="rounded-2xl bg-primary p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white">{data.dueCards} cards due for review</p>
              <p className="text-sm text-white/70">Keep your streak going!</p>
            </div>
          </div>
          <Link
            href="/review"
            className="inline-flex items-center gap-2 bg-white text-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            Start Review
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {data.deckCount === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border p-12 sm:p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-2">No decks yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Upload your first PDF, notes, or textbook chapter to start generating flashcards with AI.
          </p>
          <Link
            href="/decks/new"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Create your first deck
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ProgressChart data={data.progress} />
            <QuizScoreChart data={data.recentQuizzes} />
          </div>
          <div className="mb-6">
            <MasteryChart decks={data.decks} />
          </div>
          {data.weakSpotCount > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-amber-800">
                  {data.weakSpotCount} weak spot{data.weakSpotCount !== 1 ? 's' : ''} detected
                </p>
                <p className="text-sm text-amber-600">
                  Try a focused drill session to strengthen your weak areas.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
