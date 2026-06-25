'use client';

import { useMemo, useState } from 'react';
import { Heart, Search } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { MusicCard } from '@/components/music-card';
import { useFetch } from '@/hooks/use-fetch';
import { playlists as playlistsApi, albums as albumsApi, artists as artistsApi } from '@/lib/api';
import { cn } from '@/lib/utils';

// Fallback placeholder data
const PLAYLISTS = [
  { id: '2', title: 'Chill Vibes',      subtitle: '24 songs', color: '#1e3a5f' },
  { id: '3', title: 'Workout Mix',      subtitle: '18 songs', color: '#7f1d1d' },
  { id: '4', title: 'Late Night Jazz',  subtitle: '31 songs', color: '#064e3b' },
  { id: '5', title: 'Focus Flow',       subtitle: '12 songs', color: '#3b0764' },
  { id: '6', title: 'Road Trip Anthems',subtitle: '27 songs', color: '#78350f' },
];

const ALBUMS = [
  { id: '1', title: 'After Hours',     subtitle: 'The Weeknd · 2020', color: '#7f1d1d' },
  { id: '2', title: 'Future Nostalgia',subtitle: 'Dua Lipa · 2020',   color: '#5b2d8e' },
  { id: '3', title: 'SOUR',            subtitle: 'Olivia Rodrigo · 2021', color: '#78350f' },
];

const ARTISTS = [
  { id: '1', title: 'The Weeknd', subtitle: 'Artist', color: '#7f1d1d' },
  { id: '2', title: 'Dua Lipa',   subtitle: 'Artist', color: '#5b2d8e' },
  { id: '3', title: 'Drake',      subtitle: 'Artist', color: '#1e3a5f' },
];

const PALETTE = ['#1e3a5f', '#5b2d8e', '#7f1d1d', '#064e3b', '#78350f', '#3b0764'];

function idColor(id: string): string {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) | 0;
  return PALETTE[Math.abs(h) % PALETTE.length];
}

type Tab = 'playlists' | 'albums' | 'artists';
type Sort = 'recent' | 'alphabetical';

const TABS: { id: Tab; label: string }[] = [
  { id: 'playlists', label: 'Playlists' },
  { id: 'albums',    label: 'Albums'    },
  { id: 'artists',   label: 'Artists'   },
];

function CardSkeleton() {
  return (
    <div className="flex flex-col gap-2 p-3">
      <div className="w-full aspect-square rounded-md bg-muted animate-pulse" />
      <div className="h-3.5 w-3/4 rounded bg-muted animate-pulse" />
      <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
    </div>
  );
}

function LibraryContent() {
  const [activeTab, setActiveTab] = useState<Tab>('playlists');
  const [filter, setFilter]       = useState('');
  const [sort, setSort]           = useState<Sort>('recent');

  const { data: playlistData, isLoading: playlistsLoading } = useFetch(playlistsApi.getAll, []);
  const { data: albumData,    isLoading: albumsLoading }    = useFetch(albumsApi.getAll,    []);
  const { data: artistData,   isLoading: artistsLoading }   = useFetch(artistsApi.getAll,   []);

  const q = filter.toLowerCase();

  const displayPlaylists = useMemo(() => {
    const list = playlistData && playlistData.length > 0
      ? playlistData.map((p) => ({ id: p.id, title: p.title, subtitle: p.description ?? 'Playlist', color: idColor(p.id) }))
      : PLAYLISTS;
    const filtered = list.filter((p) => p.title.toLowerCase().includes(q));
    return sort === 'alphabetical' ? [...filtered].sort((a, b) => a.title.localeCompare(b.title)) : filtered;
  }, [playlistData, q, sort]);

  const displayAlbums = useMemo(() => {
    const list = albumData && albumData.length > 0
      ? albumData.map((a) => ({ id: a.id, title: a.title, subtitle: String(a.releaseYear), color: idColor(a.id) }))
      : ALBUMS;
    const filtered = list.filter((a) => a.title.toLowerCase().includes(q));
    return sort === 'alphabetical' ? [...filtered].sort((a, b) => a.title.localeCompare(b.title)) : filtered;
  }, [albumData, q, sort]);

  const displayArtists = useMemo(() => {
    const list = artistData && artistData.length > 0
      ? artistData.map((a) => ({ id: a.id, title: a.name, subtitle: 'Artist', color: idColor(a.id) }))
      : ARTISTS;
    const filtered = list.filter((a) => a.title.toLowerCase().includes(q));
    return sort === 'alphabetical' ? [...filtered].sort((a, b) => a.title.localeCompare(b.title)) : filtered;
  }, [artistData, q, sort]);

  const isLoading =
    (activeTab === 'playlists' && playlistsLoading) ||
    (activeTab === 'albums' && albumsLoading) ||
    (activeTab === 'artists' && artistsLoading);

  return (
    <div className="p-6 space-y-6 max-w-5xl">
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

      {/* Filter + sort */}
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
            {/* Liked Songs pinned */}
            <div
              className="flex flex-col gap-2 p-3 rounded-md cursor-pointer group"
              style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 100%)' }}
            >
              <div className="w-full aspect-square rounded-md flex items-center justify-center bg-white/10">
                <Heart className="h-12 w-12 text-white fill-white" />
              </div>
              <p className="text-sm font-semibold text-white truncate">Liked Songs</p>
              <p className="text-xs text-white/70 truncate mt-0.5">Your favourites</p>
            </div>

            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
              : displayPlaylists.map((p) => (
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
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
              : displayAlbums.map((a) => (
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
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
              : displayArtists.map((a) => (
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
