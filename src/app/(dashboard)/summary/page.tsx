'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Deck {
  id: string;
  title: string;
}

type DetailLevel = 'brief' | 'medium' | 'deep';
type Format = 'standard' | 'cornell' | 'mindmap';

export default function SummaryPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState('');
  const [level, setLevel] = useState<DetailLevel>('medium');
  const [format, setFormat] = useState<Format>('standard');
  const [summary, setSummary] = useState('');
  const [summaryTitle, setSummaryTitle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadDecks() {
      const response = await fetch('/api/decks');
      const result = await response.json();
      if (result.success) {
        setDecks(result.data);
        if (result.data.length > 0) setSelectedDeck(result.data[0].id);
      }
    }
    loadDecks();
  }, []);

  async function generateSummary() {
    if (!selectedDeck) return;
    setLoading(true);
    setSummary('');

    try {
      const response = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckId: selectedDeck, level, format }),
      });
      const result = await response.json();

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      setSummary(result.data.summary);
      setSummaryTitle(result.data.deckTitle);
      toast.success('Summary generated!');
    } catch {
      toast.error('Failed to generate summary.');
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(summary);
    toast.success('Copied to clipboard!');
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Summary Generator</h1>
        <p className="text-muted-foreground">Generate summaries in different formats and detail levels.</p>
      </div>

      {/* Controls */}
      <div className="border border-border rounded-lg p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Deck</label>
            <select
              value={selectedDeck}
              onChange={(e) => setSelectedDeck(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {decks.map((d) => (
                <option key={d.id} value={d.id}>{d.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Detail Level</label>
            <div className="flex gap-1 border border-border rounded-lg p-1">
              {(['brief', 'medium', 'deep'] as DetailLevel[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLevel(l)}
                  className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${
                    level === l
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Format</label>
            <div className="flex gap-1 border border-border rounded-lg p-1">
              {([
                { key: 'standard', label: 'Standard' },
                { key: 'cornell', label: 'Cornell' },
                { key: 'mindmap', label: 'Mind Map' },
              ] as { key: Format; label: string }[]).map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFormat(f.key)}
                  className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    format === f.key
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={generateSummary}
          disabled={loading || !selectedDeck}
          className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Summary'}
        </button>
      </div>

      {/* Summary display */}
      {summary && (
        <div className="border border-border rounded-lg">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div>
              <p className="font-semibold">{summaryTitle}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {level} &middot; {format === 'mindmap' ? 'Mind Map' : format === 'cornell' ? 'Cornell Notes' : 'Standard'}
              </p>
            </div>
            <button
              onClick={copyToClipboard}
              className="text-xs border border-border px-3 py-1.5 rounded-md hover:bg-secondary transition-colors"
            >
              Copy
            </button>
          </div>
          <div className="p-5">
            <div className={`text-sm leading-relaxed whitespace-pre-wrap ${format === 'mindmap' ? 'font-mono' : ''}`}>
              {summary}
            </div>
          </div>
        </div>
      )}

      {!summary && !loading && (
        <div className="border border-dashed border-border rounded-lg p-12 text-center">
          <p className="text-lg font-medium mb-2">No summary yet</p>
          <p className="text-muted-foreground">Select a deck and generate a summary to get started.</p>
        </div>
      )}
    </div>
  );
}
