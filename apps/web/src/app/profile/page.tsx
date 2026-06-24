'use client';

import { useState } from 'react';
import { User, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Toggle switch
// ---------------------------------------------------------------------------

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={disabled ? undefined : onChange}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        checked ? 'bg-primary' : 'bg-muted',
        disabled && 'cursor-not-allowed opacity-60',
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-6' : 'translate-x-1',
        )}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Setting row
// ---------------------------------------------------------------------------

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const USER = {
  displayName: 'Demo User',
  username:    'demouser',
  email:       'demo@auralis.app',
  initials:    'DU',
} as const;

export default function ProfilePage() {
  // Profile edit state
  const [isEditing, setIsEditing]               = useState(false);
  const [displayName, setDisplayName]           = useState<string>(USER.displayName);
  const [username, setUsername]                 = useState<string>(USER.username);
  const [draftDisplayName, setDraftDisplayName] = useState<string>(USER.displayName);
  const [draftUsername, setDraftUsername]       = useState<string>(USER.username);

  // Playback settings
  const [autoplay, setAutoplay]       = useState(true);
  const [explicit, setExplicit]       = useState(false);

  // Danger zone
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function startEdit() {
    setDraftDisplayName(displayName);
    setDraftUsername(username);
    setIsEditing(true);
  }

  function saveEdit() {
    setDisplayName(draftDisplayName.trim() || displayName);
    setUsername(draftUsername.trim() || username);
    setIsEditing(false);
  }

  function cancelEdit() {
    setIsEditing(false);
  }

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-foreground mb-8">Profile & Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* ---------------------------------------------------------------- */}
        {/* Left column — Profile card                                       */}
        {/* ---------------------------------------------------------------- */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="text-base font-semibold text-foreground">Profile</h2>

          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold text-primary-foreground">{USER.initials}</span>
            </div>
          </div>

          {/* Display / edit */}
          {!isEditing ? (
            <div className="space-y-3 text-center">
              <div>
                <p className="text-lg font-bold text-foreground">{displayName}</p>
                <p className="text-sm text-muted-foreground">@{username}</p>
                <p className="text-sm text-muted-foreground mt-1">{USER.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={startEdit}>
                <User className="h-4 w-4" />
                Edit profile
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Display name
                </label>
                <Input
                  value={draftDisplayName}
                  onChange={(e) => setDraftDisplayName(e.target.value)}
                  placeholder="Display name"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Username
                </label>
                <Input
                  value={draftUsername}
                  onChange={(e) => setDraftUsername(e.target.value)}
                  placeholder="username"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <Button size="sm" onClick={saveEdit}>Save</Button>
                <Button size="sm" variant="ghost" onClick={cancelEdit}>Cancel</Button>
              </div>
            </div>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Right column — Settings                                          */}
        {/* ---------------------------------------------------------------- */}
        <div className="space-y-6">
          {/* Account */}
          <section className="rounded-xl border border-border bg-card p-6 space-y-1">
            <h2 className="text-base font-semibold text-foreground mb-3">Account</h2>
            <div className="divide-y divide-border">
              <SettingRow label="Email" description={USER.email}>
                {/* read-only display */}
                <span className="text-xs text-muted-foreground">Verified</span>
              </SettingRow>
              <SettingRow label="Password">
                <button
                  className="text-sm text-primary hover:underline"
                  onClick={() => console.log('change password')}
                >
                  Change password
                </button>
              </SettingRow>
            </div>
          </section>

          {/* Playback */}
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold text-foreground mb-3">Playback</h2>
            <div className="divide-y divide-border">
              <SettingRow
                label="Autoplay similar content"
                description="Keep the music going after your queue ends"
              >
                <Toggle checked={autoplay} onChange={() => setAutoplay((v) => !v)} />
              </SettingRow>
              <SettingRow
                label="Show explicit content"
                description="Allow explicit tracks to appear in recommendations"
              >
                <Toggle checked={explicit} onChange={() => setExplicit((v) => !v)} />
              </SettingRow>
            </div>
          </section>

          {/* Appearance */}
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold text-foreground mb-3">Appearance</h2>
            <SettingRow
              label="Dark mode"
              description="Auralis always uses dark mode"
            >
              <Toggle checked={true} onChange={() => {}} disabled />
            </SettingRow>
          </section>

          {/* Danger zone */}
          <section className="rounded-xl border border-destructive/40 bg-card p-6">
            <h2 className="text-base font-semibold text-destructive mb-3">Danger zone</h2>

            {!showDeleteConfirm ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete account
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  <p className="text-sm text-destructive">
                    This will permanently delete your account and all data. This action cannot be undone.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => console.log('delete account confirmed')}
                  >
                    Confirm delete
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
