'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Play,
  Mic2,
  Radio,
  Music,
  Headphones,
  Flame,
  TrendingUp,
  Sun,
  Dumbbell,
  Disc3,
  Guitar,
  Piano,
  Podcast,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const CATEGORIES = [
  { id: 1,  label: 'Pop',           icon: Music,      bg: '#1e3a5f' },
  { id: 2,  label: 'Hip-Hop',       icon: Mic2,       bg: '#5b2d8e' },
  { id: 3,  label: 'Rock',          icon: Guitar,     bg: '#7f1d1d' },
  { id: 4,  label: 'Electronic',    icon: Radio,      bg: '#064e3b' },
  { id: 5,  label: 'R&B',           icon: Headphones, bg: '#78350f' },
  { id: 6,  label: 'Jazz',          icon: Disc3,      bg: '#1e3a5f' },
  { id: 7,  label: 'Classical',     icon: Piano,      bg: '#3b0764' },
  { id: 8,  label: 'Podcasts',      icon: Podcast,    bg: '#1c1c1c' },
  { id: 9,  label: 'New Releases',  icon: Flame,      bg: '#7c2d12' },
  { id: 10, label: 'Charts',        icon: TrendingUp, bg: '#14532d' },
  { id: 11, label: 'Mood',          icon: Sun,        bg: '#713f12' },
  { id: 12, label: 'Workout',       icon: Dumbbell,   bg: '#1e3a5f' },
] as const;

const PLACEHOLDER_TRACKS = [
  { id: 1, title: 'Blinding Lights',   artist: 'The Weeknd',     duration: '3:20', color: '#1e3a5f' },
  { id: 2, title: 'Levitating',        artist: 'Dua Lipa',       duration: '3:24', color: '#5b2d8e' },
  { id: 3, title: 'Stay',              artist: 'Kid Laroi',      duration: '2:21', color: '#064e3b' },
  { id: 4, title: 'good 4 u',          artist: 'Olivia Rodrigo', duration: '2:58', color: '#7f1d1d' },
] as const;

const PLACEHOLDER_ARTISTS = [
  { id: 1, name: 'The Weeknd',     color: '#1e3a5f' },
  { id: 2, name: 'Dua Lipa',       color: '#5b2d8e' },
  { id: 3, name: 'Drake',          color: '#064e3b' },
] as const;

const TOP_RESULT = {
  name: 'The Weeknd',
  type: 'Artist',
  color: '#1e3a5f',
} as const;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CategoryCard({
  label,
  icon: Icon,
  bg,
}: {
  label: string;
  icon: React.ElementType;
  bg: string;
}) {
  return (
    <div
      className="relative flex flex-col justify-between rounded-lg p-4 h-28 overflow-hidden cursor-pointer group select-none"
      style={{ backgroundColor: bg }}
    >
      <span className="text-base font-bold text-white leading-tight">{label}</span>
      <Icon
        className="absolute bottom-3 right-3 h-10 w-10 text-white/80 rotate-12 group-hover:scale-110 transition-transform"
        aria-hidden
      />
    </div>
  );
}

function TopResultCard({ name, type, color }: { name: string; type: string; color: string }) {
  return (
    <div className="rounded-lg bg-secondary p-5 flex flex-col gap-4 h-full min-h-56">
      <div
        className="h-24 w-24 rounded-full shrink-0"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      <div className="flex-1">
        <p className="text-2xl font-bold text-foreground">{name}</p>
        <span className="mt-1 inline-block rounded-full bg-background px-3 py-0.5 text-xs font-semibold text-muted-foreground">
          {type}
        </span>
      </div>
      <button
        className="ml-auto h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        aria-label={`Play ${name}`}
      >
        <Play className="h-5 w-5 fill-current translate-x-0.5" />
      </button>
    </div>
  );
}

function SongRow({
  index,
  title,
  artist,
  duration,
  color,
}: {
  index: number;
  title: string;
  artist: string;
  duration: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-accent/50 group cursor-pointer">
      <span className="w-5 text-center text-sm text-muted-foreground group-hover:hidden tabular-nums">
        {index}
      </span>
      <Play className="hidden w-5 h-4 text-foreground group-hover:block fill-current shrink-0" />
      <div className="h-10 w-10 rounded shrink-0" style={{ backgroundColor: color }} aria-hidden />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{artist}</p>
      </div>
      <span className="text-sm text-muted-foreground tabular-nums">{duration}</span>
    </div>
  );
}

function ArtistCard({ name, color }: { name: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-3 cursor-pointer group">
      <div
        className="h-24 w-24 rounded-full group-hover:opacity-80 transition-opacity"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">Artist</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SearchPage() {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce: update active query 300 ms after the user stops typing
  useEffect(() => {
    const id = setTimeout(() => setQuery(input.trim()), 300);
    return () => clearTimeout(id);
  }, [input]);

  const isSearching = query.length > 0;

  return (
    <div className="p-6 space-y-8 max-w-5xl">
      {/* Search bar */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden />
        <input
          ref={inputRef}
          type="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What do you want to listen to?"
          className={cn(
            'w-full rounded-full bg-muted border border-border py-3 pl-10 pr-10',
            'text-sm text-foreground placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
            'transition-colors',
          )}
          aria-label="Search"
        />
        {input && (
          <button
            onClick={() => { setInput(''); inputRef.current?.focus(); }}
            className="absolute right-3.5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Default state — Browse all */}
      {!isSearching && (
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-5">Browse all</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {CATEGORIES.map(({ id, label, icon, bg }) => (
              <CategoryCard key={id} label={label} icon={icon} bg={bg} />
            ))}
          </div>
        </section>
      )}

      {/* Active state — Search results */}
      {isSearching && (
        <div className="space-y-8">
          {/* Top result + Songs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top result */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">Top result</h2>
              <TopResultCard
                name={TOP_RESULT.name}
                type={TOP_RESULT.type}
                color={TOP_RESULT.color}
              />
            </section>

            {/* Songs */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">Songs</h2>
              <div className="flex flex-col">
                {PLACEHOLDER_TRACKS.map((track, i) => (
                  <SongRow
                    key={track.id}
                    index={i + 1}
                    title={track.title}
                    artist={track.artist}
                    duration={track.duration}
                    color={track.color}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Artists */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">Artists</h2>
            <div className="flex gap-8">
              {PLACEHOLDER_ARTISTS.map(({ id, name, color }) => (
                <ArtistCard key={id} name={name} color={color} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
