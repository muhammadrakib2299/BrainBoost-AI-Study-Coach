'use client';

interface StatsCardsProps {
  dueCards: number;
  deckCount: number;
  streak: number;
  examReadiness: number;
}

export function StatsCards({ dueCards, deckCount, streak, examReadiness }: StatsCardsProps) {
  const stats = [
    { label: 'Cards Due', value: dueCards.toString(), icon: '🔁' },
    { label: 'Decks', value: deckCount.toString(), icon: '📚' },
    { label: 'Day Streak', value: streak.toString(), icon: '🔥' },
    { label: 'Exam Readiness', value: `${examReadiness}%`, icon: '🎯' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <span>{stat.icon}</span>
          </div>
          <p className="text-2xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
