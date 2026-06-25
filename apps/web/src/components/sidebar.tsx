'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Library, Music2, ListMusic, LogOut, UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';

const NAV_LINKS = [
  { href: '/',        icon: Home,         label: 'Home'    },
  { href: '/search',  icon: Search,       label: 'Search'  },
  { href: '/library', icon: Library,      label: 'Library' },
  { href: '/upload',  icon: UploadCloud,  label: 'Upload'  },
] as const;

const PLAYLISTS = [
  { id: 1, name: 'Chill Vibes'       },
  { id: 2, name: 'Workout Mix'       },
  { id: 3, name: 'Late Night Jazz'   },
  { id: 4, name: 'Focus Flow'        },
  { id: 5, name: 'Road Trip Anthems' },
] as const;

function getInitials(displayName: string): string {
  return displayName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 bottom-20 w-60 flex flex-col bg-card border-r border-border overflow-y-auto z-10">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
        <Music2 className="h-7 w-7 text-primary shrink-0" />
        <span className="text-xl font-bold tracking-tight text-foreground">Auralis</span>
      </div>

      <nav className="flex flex-col gap-1 px-3 pt-4">
        {NAV_LINKS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 px-3 pt-6 pb-4">
        <div className="flex items-center gap-2 px-3 mb-1">
          <ListMusic className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Playlists
          </span>
        </div>
        {PLAYLISTS.map(({ id, name }) => {
          const href = `/playlist/${id}`;
          const isActive = pathname === href;
          return (
            <Link
              key={id}
              href={href}
              className={cn(
                'flex items-start w-full px-3 py-2 rounded-md text-sm transition-colors',
                isActive
                  ? 'text-foreground bg-accent'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
              )}
            >
              {name}
            </Link>
          );
        })}
      </div>

      {/* User section */}
      <div className="mt-auto px-3 pb-4 border-t border-border pt-3">
        {isLoading ? (
          <div className="h-12 rounded-md bg-muted animate-pulse" />
        ) : user ? (
          <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent/50 transition-colors">
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary-foreground">
                {getInitials(user.displayName)}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">{user.displayName}</p>
              <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
            </div>
            <button
              onClick={logout}
              aria-label="Sign out"
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        )}
      </div>
    </aside>
  );
}
