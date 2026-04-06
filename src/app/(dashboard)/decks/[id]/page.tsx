import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { GenerateFlashcardsButton } from '@/components/flashcards/generate-button';

export default async function DeckDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return notFound();

  const deck = await db.deck.findFirst({
    where: { id: params.id, userId: user.id },
    include: { flashcards: { orderBy: { createdAt: 'asc' } } },
  });

  if (!deck) return notFound();

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <Link href="/decks" className="text-sm text-muted-foreground hover:text-foreground mb-2 block">
            &larr; Back to decks
          </Link>
          <h1 className="text-2xl font-bold">{deck.title}</h1>
          <p className="text-muted-foreground">
            {deck.cardCount} cards &middot; {deck.sourceType} &middot; Updated{' '}
            {formatDate(deck.updatedAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/quiz?deck=${deck.id}`}
            className="border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
          >
            Quiz
          </Link>
          <Link
            href={`/review?deck=${deck.id}`}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Review Cards
          </Link>
        </div>
      </div>

      {/* Mastery bar */}
      <div className="border border-border rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">Mastery</p>
          <p className="text-sm text-muted-foreground">{Math.round(deck.masteryPercent)}%</p>
        </div>
        <div className="w-full bg-secondary rounded-full h-3">
          <div
            className="bg-primary rounded-full h-3 transition-all"
            style={{ width: `${deck.masteryPercent}%` }}
          />
        </div>
      </div>

      {/* Flashcards list */}
      {deck.flashcards.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-6 sm:p-12 text-center">
          <p className="text-lg font-medium mb-2">No flashcards yet</p>
          <p className="text-muted-foreground mb-4">
            Generate flashcards from your uploaded content using AI.
          </p>
          <GenerateFlashcardsButton deckId={deck.id} />
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Flashcards ({deck.flashcards.length})</h2>
          {deck.flashcards.map((card, i) => (
            <div key={card.id} className="border border-border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded mt-0.5">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="font-medium mb-1">{card.question}</p>
                  <p className="text-sm text-muted-foreground">{card.answer}</p>
                </div>
                <span className="text-xs text-muted-foreground capitalize">{card.state.toLowerCase()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
