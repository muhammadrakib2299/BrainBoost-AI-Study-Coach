'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function GenerateFlashcardsButton({ deckId }: { deckId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleGenerate() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/flashcards/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckId }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.refresh();
    } catch {
      setError('Failed to generate flashcards. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? 'Generating with AI...' : 'Generate Flashcards with AI'}
      </button>
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
}
