'use client';

import { useState } from 'react';
import { Heart, Search } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { MusicCard } from '@/components/music-card';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Placeholder data
// ---------------------------------------------------------------------------

const PLAYLISTS = [
  { id: 2,  title: 'Chill Vibes',        subtitle: '24 songs',    color: '#1e3a5f' },
  { id: 3,  title: 'Workout Mix',         subtitle: '18 songs',    color: '#7f1d1d' },
  { id: 4,  title: 'Late Night Jazz',     subtitle: '31 songs',    color: '#064e3b' },
  { id: 5,  title: 'Focus Flow',          subtitle: '12 songs',    color: '#3b0764' },
  { id: 6,  title: 'Road Trip Anthems',   subtitle: '27 songs',    color: '#78350f' },
  { id: 7,  title: 'Indie Mix',           subtitle: '20 songs',    color: '#1c1c1c' },
] as const;

const ALBUMS = [
  { id: 1, title: 'After Hours',                  subtitle: 'The Weeknd · 2020',    color: '#7f1d1d' },
  { id: 2, title: 'Future Nostalgia',             subtitle: 'Dua Lipa · 2020',      color: '#5b2d8e' },
  { id: 3, title: 'Certified Lover Boy',          subtitle: 'Drake · 2021',         color: '#1e3a5f' },
  { id: 4, title: 'SOUR',                         subtitle: 'Olivia Rodrigo · 2021',color: '#78350f' },
  { id: 5, title: 'Dawn FM',                      subtitle: 'The Weeknd · 2022',    color: '#064e3b' },
  { id: 6, title: 'Happier Than Ever',            subtitle: 'Billie Eilish · 2021', color: '#14532d' },
] as const;

const ARTISTS = [
  { id: 1, title: 'The Weeknd',    subtitle: 'Artist', color: '#7f1d1d' },
  { id: 2, title: 'Dua Lipa',      subtitle: 'Artist', color: '#5b2d8e' },
  { id: 3, title: 'Drake',         subtitle: 'Artist', color: '#1e3a5f' },
  { id: 4, title: 'Olivia Rodrigo',subtitle: 'Artist', color: '#78350f' },
  { id: 5, title: 'Billie Eilish', subtitle: 'Artist', color: '#14532d' },
  { id: 6, title: 'Taylor Swift',  subtitle: 'Artist', color: '#713f12' },
] as const;

type Tab = 'playlists' | 'albums' | 'artists';
type Sort = 'recent' | 'alphabetical';

const TABS: { id: Tab; label: string }[] = [
  { id: 'playlists', label: 'Playlists' },
  { id: 'albums',    label: 'Albums'    },
  { id: 'artists',   label: 'Artists'   },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function LibraryContent() {
  const [activeTab, setActiveTab] = useState<Tab>('playlists');
  const [filter, setFilter]       = useState('');
  const [sort, setSort]           = useState<Sort>('recent');

  const q = filter.toLowerCase();

  const filteredPlaylists = PLAYLISTS.filter((p) => p.title.toLowerCase().includes(q));
  const filteredAlbums    = ALBUMS.filter((a)    => a.title.toLowerCase().includes(q));
  const filteredArtists   = ARTISTS.filter((a)   => a.title.toLowerCase().includes(q));

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Your Library</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
              activeTab === id
                ? 'bg-foreground text-background'
                : 'bg-secondary text-foreground hover:bg-accent',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Filter + sort row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by name"
            className="w-full rounded-md bg-muted border border-border py-2 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          onClick={() => setSort((s) => (s === 'recent' ? 'alphabetical' : 'recent'))}
          className="px-3 py-2 rounded-md bg-secondary text-sm text-foreground hover:bg-accent transition-colors"
        >
          {sort === 'recent' ? 'Recents' : 'Alphabetical'}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'playlists' && (
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {/* Liked Songs pinned card */}
            <div
              className="flex flex-col gap-2 p-3 rounded-md hover:bg-secondary transition-colors cursor-pointer group"
              style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 100%)' }}
            >
              <div className="relative w-full">
                <div className="w-full aspect-square rounded-md flex items-center justify-center bg-white/10">
                  <Heart className="h-12 w-12 text-white fill-white" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">Liked Songs</p>
                <p className="text-xs text-white/70 truncate mt-0.5">342 songs</p>
              </div>
            </div>

            {filteredPlaylists.map((p) => (
              <MusicCard
                key={p.id}
                title={p.title}
                subtitle={p.subtitle}
                type="playlist"
                color={p.color}
                href={`/playlist/${p.id}`}
              />
            ))}
          </div>
        </section>
      )}

      {activeTab === 'albums' && (
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {filteredAlbums.map((a) => (
              <MusicCard
                key={a.id}
                title={a.title}
                subtitle={a.subtitle}
                type="album"
                color={a.color}
                href={`/album/${a.id}`}
              />
            ))}
          </div>
        </section>
      )}

      {activeTab === 'artists' && (
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {filteredArtists.map((a) => (
              <MusicCard
                key={a.id}
                title={a.title}
                subtitle={a.subtitle}
                type="artist"
                color={a.color}
                href={`/artist/${a.id}`}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function LibraryPage() {
  return (
    <ProtectedRoute>
      <LibraryContent />
    </ProtectedRoute>
  );
}
