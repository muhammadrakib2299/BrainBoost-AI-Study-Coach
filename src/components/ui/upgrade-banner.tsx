'use client';

import Link from 'next/link';

interface UpgradeBannerProps {
  message: string;
  compact?: boolean;
}

export function UpgradeBanner({ message, compact = false }: UpgradeBannerProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">{message}</span>
        <Link
          href="/pricing"
          className="text-primary font-medium hover:underline"
        >
          Upgrade
        </Link>
      </div>
    );
  }

  return (
    <div className="border border-primary/20 bg-primary/5 rounded-lg p-4 flex items-center justify-between">
      <div>
        <p className="font-medium text-sm">{message}</p>
        <p className="text-xs text-muted-foreground">Upgrade to Pro for unlimited access.</p>
      </div>
      <Link
        href="/pricing"
        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex-shrink-0"
      >
        Upgrade to Pro
      </Link>
    </div>
  );
}
