import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s your study overview.</p>
        </div>
        <Link
          href="/decks/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + New Deck
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Cards Due', value: '0', icon: '🔁' },
          { label: 'Decks', value: '0', icon: '📚' },
          { label: 'Day Streak', value: '0', icon: '🔥' },
          { label: 'Mastery', value: '0%', icon: '🎯' },
        ].map((stat) => (
          <div key={stat.label} className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <span>{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Empty state */}
      <div className="border border-dashed border-border rounded-lg p-12 text-center">
        <p className="text-lg font-medium mb-2">No decks yet</p>
        <p className="text-muted-foreground mb-4">
          Upload your first PDF, notes, or textbook chapter to get started.
        </p>
        <Link
          href="/decks/new"
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Create your first deck
        </Link>
      </div>
    </div>
  );
}
