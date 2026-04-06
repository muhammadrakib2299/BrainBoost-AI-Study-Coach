'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface QuizScoreChartProps {
  data: { score: number; date: string }[];
}

export function QuizScoreChart({ data }: QuizScoreChartProps) {
  if (data.length === 0) {
    return (
      <div className="border border-border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Quiz Scores</h3>
        <p className="text-sm text-muted-foreground text-center py-8">
          Take a quiz to see your score history.
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
    score: Math.round(d.score),
  }));

  return (
    <div className="border border-border rounded-lg p-6">
      <h3 className="font-semibold mb-4">Quiz Scores</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="score"
            stroke="hsl(160, 60%, 40%)"
            strokeWidth={2}
            dot={{ r: 4 }}
            name="Score %"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
