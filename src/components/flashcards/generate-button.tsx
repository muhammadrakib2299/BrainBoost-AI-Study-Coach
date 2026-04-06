'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

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
        toast.error(result.error);
        return;
      }

      toast.success(`${result.data.count} flashcards generated!`);
      router.refresh();
    } catch {
      setError('Failed to generate flashcards. Please try again.');
      toast.error('Failed to generate flashcards.');
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
