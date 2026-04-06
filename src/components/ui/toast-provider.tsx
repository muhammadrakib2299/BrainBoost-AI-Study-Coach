'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'hsl(var(--card))',
          color: 'hsl(var(--card-foreground))',
          border: '1px solid hsl(var(--border))',
          borderRadius: 'var(--radius)',
          fontSize: '14px',
        },
        success: {
          iconTheme: { primary: 'hsl(160, 60%, 40%)', secondary: 'white' },
        },
        error: {
          iconTheme: { primary: 'hsl(0, 84%, 60%)', secondary: 'white' },
        },
      }}
    />
  );
}
