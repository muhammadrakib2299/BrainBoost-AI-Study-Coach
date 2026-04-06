import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';

export default async function DecksPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const decks = user
    ? await db.deck.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: 'desc' },
      })
    : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Your Decks</h1>
          <p className="text-muted-foreground">{decks.length} deck{decks.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/decks/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + New Deck
        </Link>
      </div>

      {decks.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-12 text-center">
          <p className="text-lg font-medium mb-2">No decks yet</p>
          <p className="text-muted-foreground mb-4">Upload your study material to create your first deck.</p>
          <Link
            href="/decks/new"
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Create your first deck
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map((deck) => (
            <Link
              key={deck.id}
              href={`/decks/${deck.id}`}
              className="border border-border rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold truncate">{deck.title}</h3>
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                  {deck.sourceType}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {deck.cardCount} cards &middot; {Math.round(deck.masteryPercent)}% mastery
              </p>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2 transition-all"
                  style={{ width: `${deck.masteryPercent}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Updated {formatDate(deck.updatedAt)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
