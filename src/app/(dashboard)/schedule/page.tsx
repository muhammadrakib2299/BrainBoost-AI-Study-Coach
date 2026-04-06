'use client';

import { useState, useEffect } from 'react';

interface DailyPlan {
  date: string;
  deckIds: string[];
  topics: string[];
  estimatedMinutes: number;
  completed: boolean;
}

export default function SchedulePage() {
  const [examDate, setExamDate] = useState('');
  const [schedule, setSchedule] = useState<DailyPlan[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadExisting() {
      try {
        const response = await fetch('/api/schedule');
        const result = await response.json();
        if (result.success && result.data) {
          setSchedule(result.data.dailyPlans);
          setExamDate(result.data.examDate.split('T')[0]);
        }
      } catch {
        // No existing schedule
      } finally {
        setLoadingExisting(false);
      }
    }
    loadExisting();
  }, []);

  async function generateSchedule() {
    if (!examDate) {
      setError('Please set your exam date.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examDate }),
      });
      const result = await response.json();

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSchedule(result.data.dailyPlans);
    } catch {
      setError('Failed to generate schedule.');
    } finally {
      setLoading(false);
    }
  }

  function exportCalendar() {
    window.open('/api/calendar', '_blank');
  }

  if (loadingExisting) {
    return <p className="text-muted-foreground">Loading schedule...</p>;
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Study Schedule</h1>
          <p className="text-muted-foreground">AI-generated day-by-day plan for your exam.</p>
        </div>
        {schedule && (
          <button
            onClick={exportCalendar}
            className="border border-border px-4 py-2 rounded-lg text-sm hover:bg-secondary transition-colors"
          >
            Export to Calendar (.ics)
          </button>
        )}
      </div>

      {/* Exam date + generate */}
      <div className="border border-border rounded-lg p-5 mb-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Exam date</label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              min={today}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            onClick={generateSchedule}
            disabled={loading}
            className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Generating...' : schedule ? 'Regenerate' : 'Generate Schedule'}
          </button>
        </div>
        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
      </div>

      {/* Schedule display */}
      {schedule && (
        <div className="space-y-3">
          {schedule.map((plan, i) => {
            const isToday = plan.date === today;
            const isPast = plan.date < today;

            return (
              <div
                key={i}
                className={`border rounded-lg p-4 ${
                  isToday
                    ? 'border-primary bg-primary/5'
                    : isPast
                      ? 'border-border opacity-60'
                      : 'border-border'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isToday && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                        Today
                      </span>
                    )}
                    <p className="text-sm font-medium">
                      {new Date(plan.date + 'T00:00:00').toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">{plan.estimatedMinutes} min</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {plan.topics.map((topic) => (
                    <span
                      key={topic}
                      className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!schedule && (
        <div className="border border-dashed border-border rounded-lg p-12 text-center">
          <p className="text-lg font-medium mb-2">No schedule yet</p>
          <p className="text-muted-foreground">Set your exam date and let AI create an optimal study plan.</p>
        </div>
      )}
    </div>
  );
}
