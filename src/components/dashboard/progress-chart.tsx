'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ProgressChartProps {
  data: { date: string; cardsReviewed: number; minutesStudied: number }[];
}

export function ProgressChart({ data }: ProgressChartProps) {
  if (data.length === 0) {
    return (
      <div className="border border-border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Study Activity</h3>
        <p className="text-sm text-muted-foreground text-center py-8">
          No study data yet. Start reviewing cards to see your progress!
        </p>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    date: new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }));

  return (
    <div className="border border-border rounded-lg p-6">
      <h3 className="font-semibold mb-4">Study Activity (Last 7 Days)</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="cardsReviewed" fill="hsl(160, 60%, 40%)" name="Cards Reviewed" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
