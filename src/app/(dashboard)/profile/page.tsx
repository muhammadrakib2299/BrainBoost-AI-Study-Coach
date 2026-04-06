'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useAuth();
  const [emailReminders, setEmailReminders] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);
  const [saving, setSaving] = useState(false);

  async function savePreferences() {
    setSaving(true);
    try {
      const response = await fetch('/api/profile/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailReminders, streakAlerts }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Preferences saved!');
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error('Failed to save preferences.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Profile</h1>
      <p className="text-muted-foreground mb-8">Manage your account and notification preferences.</p>

      {/* Account info */}
      <div className="border border-border rounded-lg p-5 mb-6">
        <h2 className="font-semibold mb-4">Account</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-sm font-medium">{user?.email || 'Loading...'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="text-sm font-medium">{user?.user_metadata?.name || 'Not set'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Member since</p>
            <p className="text-sm font-medium">
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Loading...'}
            </p>
          </div>
        </div>
      </div>

      {/* Email preferences */}
      <div className="border border-border rounded-lg p-5 mb-6">
        <h2 className="font-semibold mb-4">Email Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Daily study reminders</p>
              <p className="text-xs text-muted-foreground">Get notified when you have cards due for review</p>
            </div>
            <button
              type="button"
              onClick={() => setEmailReminders(!emailReminders)}
              className={`w-10 h-6 rounded-full transition-colors ${emailReminders ? 'bg-primary' : 'bg-secondary'}`}
            >
              <span
                className={`block w-4 h-4 bg-white rounded-full transition-transform mx-1 ${emailReminders ? 'translate-x-4' : ''}`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Streak-at-risk alerts</p>
              <p className="text-xs text-muted-foreground">Get warned if your study streak is about to break</p>
            </div>
            <button
              type="button"
              onClick={() => setStreakAlerts(!streakAlerts)}
              className={`w-10 h-6 rounded-full transition-colors ${streakAlerts ? 'bg-primary' : 'bg-secondary'}`}
            >
              <span
                className={`block w-4 h-4 bg-white rounded-full transition-transform mx-1 ${streakAlerts ? 'translate-x-4' : ''}`}
              />
            </button>
          </div>
        </div>

        <button
          onClick={savePreferences}
          disabled={saving}
          className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>

      {/* Danger zone */}
      <div className="border border-destructive/30 rounded-lg p-5">
        <h2 className="font-semibold text-destructive mb-2">Danger Zone</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Permanently delete your account and all study data.
        </p>
        <button className="border border-destructive text-destructive px-4 py-2 rounded-lg text-sm hover:bg-destructive/10 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
}
