'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChatInterface } from '@/components/chat/chat-interface';

interface Deck {
  id: string;
  title: string;
}

export default function ChatPage() {
  const searchParams = useSearchParams();
  const preselectedDeck = searchParams.get('deck');
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<string>(preselectedDeck || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDecks() {
      try {
        const response = await fetch('/api/decks');
        const result = await response.json();
        if (result.success) {
          setDecks(result.data);
          if (!selectedDeck && result.data.length > 0) {
            setSelectedDeck(result.data[0].id);
          }
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    }
    loadDecks();
  }, [selectedDeck]);

  const selectedDeckData = decks.find((d) => d.id === selectedDeck);

  if (loading) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  if (decks.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-medium mb-2">No decks to chat about</p>
        <p className="text-muted-foreground">Create a deck first, then come back to chat with your AI tutor.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <select
          value={selectedDeck}
          onChange={(e) => setSelectedDeck(e.target.value)}
          className="px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {decks.map((deck) => (
            <option key={deck.id} value={deck.id}>
              {deck.title}
            </option>
          ))}
        </select>
      </div>

      {selectedDeckData && (
        <ChatInterface
          key={selectedDeck}
          deckId={selectedDeck}
          deckTitle={selectedDeckData.title}
        />
      )}
    </div>
  );
}
