'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Card {
  id: string;
  question: string;
  answer: string;
  explanation?: string | null;
  state: string;
  deck: { title: string };
}

type Rating = 'again' | 'hard' | 'good' | 'easy';

const ratingButtons: { rating: Rating; label: string; color: string }[] = [
  { rating: 'again', label: 'Again', color: 'bg-red-500 hover:bg-red-600' },
  { rating: 'hard', label: 'Hard', color: 'bg-orange-500 hover:bg-orange-600' },
  { rating: 'good', label: 'Good', color: 'bg-blue-500 hover:bg-blue-600' },
  { rating: 'easy', label: 'Easy', color: 'bg-green-500 hover:bg-green-600' },
];

export default function ReviewPage() {
  const searchParams = useSearchParams();
  const deckFilter = searchParams.get('deck');

  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);

  useEffect(() => {
    async function loadCards() {
      const url = deckFilter
        ? `/api/review/due?deckId=${deckFilter}`
        : '/api/review/due';
      const response = await fetch(url);
      const result = await response.json();
      if (result.success) {
        setCards(result.data.cards);
      }
      setLoading(false);
    }
    loadCards();
  }, [deckFilter]);

  const handleRate = useCallback(async (r: Rating) => {
    if (rating) return;
    setRating(true);

    const card = cards[currentIndex];
    await fetch('/api/review/rate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId: card.id, rating: r }),
    });

    setReviewed((prev) => prev + 1);
    setFlipped(false);

    if (currentIndex + 1 >= cards.length) {
      setSessionDone(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }

    setRating(false);
  }, [cards, currentIndex, rating]);

  if (loading) {
    return <p className="text-muted-foreground">Loading review cards...</p>;
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">🎉</p>
        <p className="text-lg font-medium mb-2">All caught up!</p>
        <p className="text-muted-foreground mb-4">No cards are due for review right now.</p>
        <Link
          href="/dashboard"
          className="text-primary hover:underline text-sm"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  if (sessionDone) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">✅</p>
        <p className="text-lg font-medium mb-2">Review complete!</p>
        <p className="text-muted-foreground mb-4">
          You reviewed {reviewed} card{reviewed !== 1 ? 's' : ''} this session.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/dashboard"
            className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-secondary"
          >
            Dashboard
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90"
          >
            Review more
          </button>
        </div>
      </div>
    );
  }

  const card = cards[currentIndex];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Review</h1>
          <p className="text-sm text-muted-foreground">
            {currentIndex + 1} of {cards.length} &middot; {card.deck.title}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">{reviewed} reviewed</p>
      </div>

      {/* Progress */}
      <div className="w-full bg-secondary rounded-full h-2 mb-6">
        <div
          className="bg-primary rounded-full h-2 transition-all"
          style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div
        className="border border-border rounded-lg p-8 min-h-[280px] flex flex-col items-center justify-center text-center cursor-pointer mb-6"
        onClick={() => setFlipped(!flipped)}
      >
        <motion.div
          key={`${card.id}-${flipped}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {!flipped ? (
            <>
              <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">
                Question &middot; {card.state.toLowerCase()}
              </p>
              <p className="text-xl font-medium">{card.question}</p>
              <p className="text-sm text-muted-foreground mt-6">Tap to reveal answer</p>
            </>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Answer</p>
              <p className="text-xl font-medium mb-3">{card.answer}</p>
              {card.explanation && (
                <p className="text-sm text-muted-foreground border-t border-border pt-3 mt-3">
                  {card.explanation}
                </p>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* Rating buttons (only show when flipped) */}
      {flipped && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-4 gap-3"
        >
          {ratingButtons.map((btn) => (
            <button
              key={btn.rating}
              onClick={() => handleRate(btn.rating)}
              disabled={rating}
              className={`${btn.color} text-white py-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50`}
            >
              {btn.label}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
