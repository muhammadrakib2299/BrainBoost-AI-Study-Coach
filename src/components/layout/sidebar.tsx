'use client';

import { useState } from 'react';
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
  { href: '/summary', label: 'Summary', icon: '📝' },
  { href: '/schedule', label: 'Schedule', icon: '📅' },
  { href: '/pricing', label: 'Upgrade', icon: '⭐' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = (
    <>
      <div className="p-4 border-b border-border flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold text-primary">
          BrainBoost
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-muted-foreground hover:text-foreground"
        >
          &#10005;
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
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
          <p className="text-sm truncate max-w-[140px]">{user?.email}</p>
          <button
            onClick={signOut}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 bg-card border border-border rounded-md p-2 text-sm"
      >
        &#9776;
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transform transition-transform duration-200',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {nav}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-border h-screen flex-col bg-card flex-shrink-0">
        {nav}
      </aside>
    </>
  );
}
