'use client';

import { Shuffle, Heart, MoreHorizontal, Play } from 'lucide-react';
import { TrackRow } from '@/components/track-row';

// ---------------------------------------------------------------------------
// Placeholder data (same regardless of id)
// ---------------------------------------------------------------------------

const PLAYLIST = {
  title: 'Chill Vibes',
  description: 'The best songs to relax and unwind after a long day.',
  owner: 'Demo User',
  songCount: 12,
  duration: '47 min',
  color: '#1e3a5f',
} as const;

const TRACKS = [
  { id:  1, title: 'Blinding Lights',        artist: 'The Weeknd',          album: 'After Hours',          dateAdded: 'May 3, 2024',  duration: '3:20' },
  { id:  2, title: 'Levitating',              artist: 'Dua Lipa',            album: 'Future Nostalgia',     dateAdded: 'Apr 18, 2024', duration: '3:24' },
  { id:  3, title: 'Stay',                    artist: 'Kid Laroi',           album: 'Stay (EP)',            dateAdded: 'Apr 10, 2024', duration: '2:21' },
  { id:  4, title: 'Good 4 U',                artist: 'Olivia Rodrigo',      album: 'SOUR',                 dateAdded: 'Mar 29, 2024', duration: '2:58' },
  { id:  5, title: 'As It Was',               artist: 'Harry Styles',        album: "Harry's House",        dateAdded: 'Mar 14, 2024', duration: '2:38' },
  { id:  6, title: 'Heat Waves',              artist: 'Glass Animals',       album: 'Dreamland',            dateAdded: 'Feb 27, 2024', duration: '3:59' },
  { id:  7, title: 'Industry Baby',           artist: 'Lil Nas X',          album: 'Montero',              dateAdded: 'Feb 11, 2024', duration: '3:32' },
  { id:  8, title: 'Peaches',                 artist: 'Justin Bieber',       album: 'Justice',              dateAdded: 'Jan 30, 2024', duration: '3:18' },
  { id:  9, title: 'Montero',                 artist: 'Lil Nas X',          album: 'Montero',              dateAdded: 'Jan 15, 2024', duration: '2:17' },
  { id: 10, title: 'Permission to Dance',     artist: 'BTS',                 album: 'Permission to Dance',  dateAdded: 'Jan 5, 2024',  duration: '3:05' },
  { id: 11, title: 'Love Story (Taylor\'s Version)', artist: 'Taylor Swift', album: "Fearless (Taylor's Version)", dateAdded: 'Dec 20, 2023', duration: '3:55' },
  { id: 12, title: 'Anti-Hero',               artist: 'Taylor Swift',        album: 'Midnights',            dateAdded: 'Dec 10, 2023', duration: '3:20' },
] as const;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PlaylistPage() {
  return (
    <div className="min-h-full">
      {/* Header with gradient background */}
      <div
        className="px-6 pb-6 pt-6"
        style={{
          background: `linear-gradient(to bottom, ${PLAYLIST.color}55 0%, transparent 100%)`,
        }}
      >
        <div className="flex flex-col md:flex-row gap-6 items-end md:items-end">
          {/* Cover art */}
          <div
            className="h-56 w-56 rounded-md shadow-2xl shrink-0"
            style={{ backgroundColor: PLAYLIST.color }}
            aria-hidden
          />
          {/* Meta */}
          <div className="flex flex-col gap-2 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground/70">
              Playlist
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight line-clamp-2">
              {PLAYLIST.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{PLAYLIST.description}</p>
            <p className="text-sm text-foreground mt-1">
              <span className="font-semibold">{PLAYLIST.owner}</span>
              <span className="text-muted-foreground">
                {' '}· {PLAYLIST.songCount} songs, {PLAYLIST.duration}
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
          onClick={() => console.log('play playlist')}
        >
          <Play className="h-6 w-6 fill-current translate-x-0.5" />
        </button>
        <button
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Shuffle"
        >
          <Shuffle className="h-6 w-6" />
        </button>
        <button
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Like playlist"
        >
          <Heart className="h-6 w-6" />
        </button>
        <button
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="More options"
        >
          <MoreHorizontal className="h-6 w-6" />
        </button>
      </div>

      {/* Track list */}
      <div className="px-3 pb-8">
        {/* Column headers */}
        <div className="flex items-center gap-3 px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground border-b border-border mb-1">
          <div className="w-8 text-center">#</div>
          <div className="w-10" aria-hidden />
          <div className="flex-1">Title</div>
          <div className="hidden md:block flex-1">Album</div>
          <div className="hidden lg:block w-28">Date added</div>
          <div className="w-4" aria-hidden /> {/* heart spacer */}
          <div className="w-10 text-right">
            <span className="sr-only">Duration</span>⏱
          </div>
          <div className="w-4" aria-hidden /> {/* more spacer */}
        </div>

        {TRACKS.map((track, i) => (
          <TrackRow
            key={track.id}
            index={i + 1}
            title={track.title}
            artist={track.artist}
            album={track.album}
            dateAdded={track.dateAdded}
            duration={track.duration}
            onPlay={() => console.log('play', track.title)}
            showRemove
          />
        ))}
      </div>
    </div>
  );
}
