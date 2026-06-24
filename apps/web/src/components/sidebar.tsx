'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Library, Music2, ListMusic } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/',        icon: Home,    label: 'Home'    },
  { href: '/search',  icon: Search,  label: 'Search'  },
  { href: '/library', icon: Library, label: 'Library' },
] as const;

const PLAYLISTS = [
  { id: 1, name: 'Chill Vibes'       },
  { id: 2, name: 'Workout Mix'       },
  { id: 3, name: 'Late Night Jazz'   },
  { id: 4, name: 'Focus Flow'        },
  { id: 5, name: 'Road Trip Anthems' },
] as const;

export function Sidebar() {
  const pathname = usePathname();

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
    </aside>
  );
}
