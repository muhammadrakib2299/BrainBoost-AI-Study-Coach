'use client';

interface MasteryChartProps {
  decks: { id: string; title: string; masteryPercent: number; cardCount: number }[];
}

export function MasteryChart({ decks }: MasteryChartProps) {
  if (decks.length === 0) return null;

  return (
    <div className="border border-border rounded-lg p-6">
      <h3 className="font-semibold mb-4">Topic Mastery</h3>
      <div className="space-y-3">
        {decks.map((deck) => (
          <div key={deck.id}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="truncate mr-2">{deck.title}</span>
              <span className="text-muted-foreground flex-shrink-0">
                {Math.round(deck.masteryPercent)}%
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2.5">
              <div
                className="bg-primary rounded-full h-2.5 transition-all"
                style={{ width: `${deck.masteryPercent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
