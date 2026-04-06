'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/decks', label: 'Decks', icon: '📚' },
  { href: '/review', label: 'Review', icon: '🔁' },
  { href: '/quiz', label: 'Quiz', icon: '✍️' },
  { href: '/chat', label: 'AI Tutor', icon: '💬' },
  { href: '/schedule', label: 'Schedule', icon: '📅' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <aside className="w-64 border-r border-border h-screen flex flex-col bg-card">
      <div className="p-4 border-b border-border">
        <Link href="/dashboard" className="text-xl font-bold text-primary">
          BrainBoost
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              pathname.startsWith(item.href)
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            )}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <p className="text-sm truncate">{user?.email}</p>
          <button
            onClick={signOut}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
