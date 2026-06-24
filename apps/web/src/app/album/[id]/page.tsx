'use client';

import { Shuffle, Heart, MoreHorizontal, Play } from 'lucide-react';
import Link from 'next/link';
import { TrackRow } from '@/components/track-row';
import { MusicCard } from '@/components/music-card';

// ---------------------------------------------------------------------------
// Placeholder data
// ---------------------------------------------------------------------------

const ALBUM = {
  title: 'After Hours',
  artist: 'The Weeknd',
  artistId: 1,
  year: 2020,
  songCount: 14,
  duration: '56 min',
  color: '#7f1d1d',
} as const;

const TRACKS = [
  { id:  1, title: 'Alone Again',         duration: '4:10' },
  { id:  2, title: 'Too Late',            duration: '3:59' },
  { id:  3, title: 'Hardest to Love',     duration: '3:31' },
  { id:  4, title: 'Scared to Live',      duration: '3:11' },
  { id:  5, title: 'Snowchild',           duration: '5:02' },
  { id:  6, title: 'Escape from LA',      duration: '5:54' },
  { id:  7, title: 'Until I Bleed Out',   duration: '3:09' },
  { id:  8, title: 'Heartless',           duration: '3:18' },
  { id:  9, title: 'Faith',               duration: '5:42' },
  { id: 10, title: 'Blinding Lights',     duration: '3:20' },
  { id: 11, title: 'In Your Eyes',        duration: '3:57' },
  { id: 12, title: 'Save Your Tears',     duration: '3:35' },
] as const;

const MORE_ALBUMS = [
  { id: 5, title: 'Dawn FM',                            subtitle: '2022', color: '#064e3b' },
  { id: 6, title: 'Starboy',                            subtitle: '2016', color: '#1e3a5f' },
  { id: 7, title: 'Beauty Behind the Madness',          subtitle: '2015', color: '#5b2d8e' },
  { id: 8, title: 'Kiss Land',                          subtitle: '2013', color: '#78350f' },
] as const;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AlbumPage() {
  return (
    <div className="min-h-full">
      {/* Header with gradient background */}
      <div
        className="px-6 pb-6 pt-6"
        style={{
          background: `linear-gradient(to bottom, ${ALBUM.color}55 0%, transparent 100%)`,
        }}
      >
        <div className="flex flex-col md:flex-row gap-6 items-end">
          {/* Cover art */}
          <div
            className="h-56 w-56 rounded-md shadow-2xl shrink-0"
            style={{ backgroundColor: ALBUM.color }}
            aria-hidden
          />
          {/* Meta */}
          <div className="flex flex-col gap-2 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground/70">
              Album
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight line-clamp-2">
              {ALBUM.title}
            </h1>
            <p className="text-sm text-foreground mt-1">
              <Link
                href={`/artist/${ALBUM.artistId}`}
                className="font-semibold hover:underline"
              >
                {ALBUM.artist}
              </Link>
              <span className="text-muted-foreground">
                {' '}· {ALBUM.year} · {ALBUM.songCount} songs, {ALBUM.duration}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Action row */}
      <div className="flex items-center gap-4 px-6 py-4">
        <button
          className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
          aria-label="Play"
          onClick={() => console.log('play album')}
        >
          <Play className="h-6 w-6 fill-current translate-x-0.5" />
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Shuffle">
          <Shuffle className="h-6 w-6" />
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Like album">
          <Heart className="h-6 w-6" />
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="More options">
          <MoreHorizontal className="h-6 w-6" />
        </button>
      </div>

      {/* Track list */}
      <div className="px-3 pb-4">
        {/* Column headers */}
        <div className="flex items-center gap-3 px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground border-b border-border mb-1">
          <div className="w-8 text-center">#</div>
          <div className="w-10" aria-hidden />
          <div className="flex-1">Title</div>
          <div className="w-4" aria-hidden />
          <div className="w-10 text-right">⏱</div>
          <div className="w-4" aria-hidden />
        </div>

        {TRACKS.map((track, i) => (
          <TrackRow
            key={track.id}
            index={i + 1}
            title={track.title}
            artist={ALBUM.artist}
            duration={track.duration}
            onPlay={() => console.log('play', track.title)}
          />
        ))}
      </div>

      {/* More by artist */}
      <div className="px-6 pb-10 mt-4">
        <h2 className="text-xl font-bold text-foreground mb-4">
          More by{' '}
          <Link href={`/artist/${ALBUM.artistId}`} className="hover:underline">
            {ALBUM.artist}
          </Link>
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {MORE_ALBUMS.map((a) => (
            <div key={a.id} className="shrink-0 w-44">
              <MusicCard
                title={a.title}
                subtitle={a.subtitle}
                type="album"
                color={a.color}
                href={`/album/${a.id}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
