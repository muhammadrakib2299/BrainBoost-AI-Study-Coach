'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

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
  const [scheduleId, setScheduleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editMinutes, setEditMinutes] = useState(0);

  useEffect(() => {
    async function loadExisting() {
      try {
        const response = await fetch('/api/schedule');
        const result = await response.json();
        if (result.success && result.data) {
          setSchedule(result.data.dailyPlans);
          setScheduleId(result.data.id);
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
      toast.error('Please set your exam date.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examDate }),
      });
      const result = await response.json();

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      setSchedule(result.data.dailyPlans);
      setScheduleId(result.data.scheduleId);
      toast.success('Schedule generated!');
    } catch {
      toast.error('Failed to generate schedule.');
    } finally {
      setLoading(false);
    }
  }

  function toggleComplete(index: number) {
    if (!schedule) return;
    const updated = [...schedule];
    updated[index] = { ...updated[index], completed: !updated[index].completed };
    setSchedule(updated);
    saveScheduleUpdate(updated);
  }

  function startEdit(index: number) {
    if (!schedule) return;
    setEditingIndex(index);
    setEditMinutes(schedule[index].estimatedMinutes);
  }

  function saveEdit() {
    if (editingIndex === null || !schedule) return;
    const updated = [...schedule];
    updated[editingIndex] = { ...updated[editingIndex], estimatedMinutes: editMinutes };
    setSchedule(updated);
    setEditingIndex(null);
    saveScheduleUpdate(updated);
  }

  function removePlan(index: number) {
    if (!schedule) return;
    const updated = schedule.filter((_, i) => i !== index);
    setSchedule(updated);
    saveScheduleUpdate(updated);
    toast.success('Day removed from schedule.');
  }

  async function saveScheduleUpdate(plans: DailyPlan[]) {
    if (!scheduleId) return;
    try {
      await fetch('/api/schedule/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduleId, dailyPlans: plans }),
      });
    } catch {
      // Silent save
    }
  }

  function exportCalendar() {
    window.open('/api/calendar', '_blank');
    toast.success('Calendar file downloading...');
  }

  if (loadingExisting) {
    return <p className="text-muted-foreground">Loading schedule...</p>;
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
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
        <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
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
                  plan.completed
                    ? 'border-green-200 bg-green-50/50 opacity-75'
                    : isToday
                      ? 'border-primary bg-primary/5'
                      : isPast
                        ? 'border-border opacity-60'
                        : 'border-border'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleComplete(i)}
                      className={`w-5 h-5 border rounded flex items-center justify-center text-xs transition-colors ${
                        plan.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      {plan.completed ? '✓' : ''}
                    </button>
                    {isToday && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                        Today
                      </span>
                    )}
                    <p className={`text-sm font-medium ${plan.completed ? 'line-through' : ''}`}>
                      {new Date(plan.date + 'T00:00:00').toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {editingIndex === i ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={editMinutes}
                          onChange={(e) => setEditMinutes(Number(e.target.value))}
                          className="w-16 px-2 py-1 border border-border rounded text-xs"
                          min={5}
                        />
                        <span className="text-xs text-muted-foreground">min</span>
                        <button onClick={saveEdit} className="text-xs text-primary hover:underline">Save</button>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs text-muted-foreground">{plan.estimatedMinutes} min</p>
                        <button
                          onClick={() => startEdit(i)}
                          className="text-xs text-muted-foreground hover:text-foreground"
                          title="Edit time"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => removePlan(i)}
                          className="text-xs text-muted-foreground hover:text-destructive"
                          title="Remove day"
                        >
                          ✕
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 ml-7">
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
        <div className="border border-dashed border-border rounded-lg p-6 sm:p-12 text-center">
          <p className="text-lg font-medium mb-2">No schedule yet</p>
          <p className="text-muted-foreground">Set your exam date and let AI create an optimal study plan.</p>
        </div>
      )}
    </div>
  );
}
