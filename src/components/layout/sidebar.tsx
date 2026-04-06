'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  RefreshCw,
  PenTool,
  MessageCircle,
  FileText,
  CalendarDays,
  Crown,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/decks', label: 'My Decks', icon: BookOpen },
  { href: '/review', label: 'Review', icon: RefreshCw },
  { href: '/quiz', label: 'Quiz', icon: PenTool },
  { href: '/chat', label: 'AI Tutor', icon: MessageCircle },
  { href: '/summary', label: 'Summary', icon: FileText },
  { href: '/schedule', label: 'Schedule', icon: CalendarDays },
];

const bottomItems = [
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/pricing', label: 'Upgrade to Pro', icon: Crown },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">BrainBoost</span>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        <p className="px-3 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Study
        </p>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              <item.icon className={cn('w-[18px] h-[18px]', isActive ? 'text-white' : '')} />
              {item.label}
              {item.href === '/review' && (
                <span className={cn(
                  'ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                  isActive ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                )}>
                  DUE
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-4">
          <p className="px-3 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Account
          </p>
          {bottomItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  item.href === '/pricing' && !isActive
                    ? 'text-amber-600 hover:bg-amber-500/10'
                    : isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
              >
                <item.icon className={cn('w-[18px] h-[18px]', isActive ? 'text-white' : item.href === '/pricing' ? 'text-amber-500' : '')} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User section */}
      <div className="p-3 mt-auto">
        <div className="rounded-xl bg-secondary/50 p-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.user_metadata?.name || 'Student'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || 'Free Plan'}</p>
            </div>
            <button
              onClick={signOut}
              className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 bg-card border border-border rounded-xl p-2.5 shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border/50 transform transition-transform duration-300 ease-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 border-r border-border/50 h-screen bg-card/50 backdrop-blur-sm flex-shrink-0 sticky top-0">
        {navContent}
      </aside>
    </>
  );
}
