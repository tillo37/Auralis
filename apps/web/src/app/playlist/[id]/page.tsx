'use client';

import { useParams } from 'next/navigation';
import { Shuffle, Heart, MoreHorizontal, Play } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { TrackRow } from '@/components/track-row';
import { useFetch } from '@/hooks/use-fetch';
import { playlists as playlistsApi } from '@/lib/api';
import { usePlayer } from '@/context/player-context';
import type { Track } from '@/lib/api/types';

// Fallback placeholder
const PLAYLIST_FALLBACK = {
  title: 'Chill Vibes',
  description: 'The best songs to relax and unwind after a long day.',
  color: '#1e3a5f',
};

const TRACKS_FALLBACK = [
  { id: '1', title: 'Blinding Lights',  artist: 'The Weeknd',    album: 'After Hours',      dateAdded: 'May 3, 2024',  duration: '3:20', artistId: '', albumId: null, fileUrl: null, coverUrl: null, playCount: 0 },
  { id: '2', title: 'Levitating',       artist: 'Dua Lipa',      album: 'Future Nostalgia', dateAdded: 'Apr 18, 2024', duration: '3:24', artistId: '', albumId: null, fileUrl: null, coverUrl: null, playCount: 0 },
  { id: '3', title: 'Stay',             artist: 'Kid Laroi',     album: 'Stay (EP)',        dateAdded: 'Apr 10, 2024', duration: '2:21', artistId: '', albumId: null, fileUrl: null, coverUrl: null, playCount: 0 },
] as const;

function formatDuration(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return iso;
  }
}

function PlaylistContent() {
  const { id } = useParams<{ id: string }>();
  const { currentTrack, isPlaying, play } = usePlayer();

  const { data, isLoading } = useFetch(() => playlistsApi.getOne(id), [id]);

  const color = '#1e3a5f';
  const playlist = data ?? PLAYLIST_FALLBACK;
  const title = data?.title ?? PLAYLIST_FALLBACK.title;
  const description = data?.description ?? PLAYLIST_FALLBACK.description;
  const trackEntries = data?.tracks ?? [];

  return (
    <div className="min-h-full">
      <div
        className="px-6 pb-6 pt-6"
        style={{ background: `linear-gradient(to bottom, ${color}55 0%, transparent 100%)` }}
      >
        <div className="flex flex-col md:flex-row gap-6 items-end">
          {isLoading ? (
            <div className="h-56 w-56 rounded-md shadow-2xl shrink-0 bg-muted animate-pulse" />
          ) : (
            <div
              className="h-56 w-56 rounded-md shadow-2xl shrink-0"
              style={{ backgroundColor: color }}
              aria-hidden
            />
          )}
          <div className="flex flex-col gap-2 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground/70">Playlist</p>
            {isLoading ? (
              <>
                <div className="h-12 w-64 bg-muted rounded animate-pulse" />
                <div className="h-4 w-48 bg-muted rounded animate-pulse mt-1" />
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight line-clamp-2">
                  {title}
                </h1>
                {description && (
                  <p className="text-sm text-muted-foreground mt-1">{description}</p>
                )}
                <p className="text-sm text-foreground mt-1">
                  <span className="text-muted-foreground">{trackEntries.length} songs</span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 px-6 py-4">
        <button
          className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
          aria-label="Play"
          onClick={() => trackEntries[0] && play(trackEntries[0].track)}
        >
          <Play className="h-6 w-6 fill-current translate-x-0.5" />
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Shuffle">
          <Shuffle className="h-6 w-6" />
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Like playlist">
          <Heart className="h-6 w-6" />
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="More options">
          <MoreHorizontal className="h-6 w-6" />
        </button>
      </div>

      <div className="px-3 pb-8">
        <div className="flex items-center gap-3 px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground border-b border-border mb-1">
          <div className="w-8 text-center">#</div>
          <div className="w-10" aria-hidden />
          <div className="flex-1">Title</div>
          <div className="hidden md:block flex-1">Album</div>
          <div className="hidden lg:block w-28">Date added</div>
          <div className="w-4" aria-hidden />
          <div className="w-10 text-right"><span className="sr-only">Duration</span>⏱</div>
          <div className="w-4" aria-hidden />
        </div>

        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 rounded-md bg-muted/50 animate-pulse mb-1" />
            ))
          : trackEntries.length > 0
          ? trackEntries.map((entry, i) => {
              const t = entry.track;
              return (
                <TrackRow
                  key={t.id}
                  index={i + 1}
                  title={t.title}
                  artist={t.artistName ?? t.artistId}
                  album={t.albumId ?? undefined}
                  dateAdded={formatDate(entry.addedAt)}
                  duration={formatDuration(t.duration)}
                  isPlaying={currentTrack?.id === t.id && isPlaying}
                  onPlay={() => play(t)}
                  showRemove
                />
              );
            })
          : TRACKS_FALLBACK.map((track, i) => (
              <TrackRow
                key={track.id}
                index={i + 1}
                title={track.title}
                artist={track.artist}
                album={track.album}
                dateAdded={track.dateAdded}
                duration={track.duration}
                onPlay={() => {}}
                showRemove
              />
            ))}
      </div>
    </div>
  );
}

export default function PlaylistPage() {
  return (
    <ProtectedRoute>
      <PlaylistContent />
    </ProtectedRoute>
  );
}
