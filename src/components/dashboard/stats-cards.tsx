'use client';

import { RefreshCw, BookOpen, Flame, Target } from 'lucide-react';

interface StatsCardsProps {
  dueCards: number;
  deckCount: number;
  streak: number;
  examReadiness: number;
}

export function StatsCards({ dueCards, deckCount, streak, examReadiness }: StatsCardsProps) {
  const stats = [
    {
      label: 'Cards Due',
      value: dueCards.toString(),
      icon: RefreshCw,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      ring: 'ring-blue-500/20',
    },
    {
      label: 'Total Decks',
      value: deckCount.toString(),
      icon: BookOpen,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10',
      ring: 'ring-violet-500/20',
    },
    {
      label: 'Day Streak',
      value: streak.toString(),
      icon: Flame,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      ring: 'ring-orange-500/20',
    },
    {
      label: 'Exam Readiness',
      value: `${examReadiness}%`,
      icon: Target,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      ring: 'ring-emerald-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-border/50 bg-card p-5 card-hover"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
