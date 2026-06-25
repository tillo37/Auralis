'use client';

import { useParams } from 'next/navigation';
import { Shuffle, Heart, MoreHorizontal, Play } from 'lucide-react';
import Link from 'next/link';
import { TrackRow } from '@/components/track-row';
import { MusicCard } from '@/components/music-card';
import { useFetch } from '@/hooks/use-fetch';
import { albums as albumsApi } from '@/lib/api';
import { usePlayer } from '@/context/player-context';

// Fallback placeholder data
const ALBUM_FALLBACK = { title: 'After Hours', artistName: 'The Weeknd', artistId: '', releaseYear: 2020 };
const TRACKS_FALLBACK = [
  { id: '1', title: 'Alone Again',     duration: '4:10' },
  { id: '2', title: 'Too Late',        duration: '3:59' },
  { id: '3', title: 'Hardest to Love', duration: '3:31' },
  { id: '4', title: 'Scared to Live',  duration: '3:11' },
  { id: '5', title: 'Snowchild',       duration: '5:02' },
] as const;
const MORE_ALBUMS_FALLBACK = [
  { id: '5', title: 'Dawn FM',                         subtitle: '2022', color: '#064e3b' },
  { id: '6', title: 'Starboy',                         subtitle: '2016', color: '#1e3a5f' },
  { id: '7', title: 'Beauty Behind the Madness',       subtitle: '2015', color: '#5b2d8e' },
] as const;

const PALETTE = ['#1e3a5f', '#5b2d8e', '#7f1d1d', '#064e3b', '#78350f', '#3b0764'];

function idColor(id: string): string {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) | 0;
  return PALETTE[Math.abs(h) % PALETTE.length];
}

function formatDuration(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function AlbumPage() {
  const { id } = useParams<{ id: string }>();
  const { currentTrack, isPlaying, play } = usePlayer();

  const { data, isLoading } = useFetch(() => albumsApi.getOne(id), [id]);
  const { data: allAlbums } = useFetch(albumsApi.getAll, []);

  const color = data ? idColor(data.id) : '#7f1d1d';
  const relatedAlbums = (allAlbums ?? [])
    .filter((a) => a.artistId === data?.artistId && a.id !== id)
    .slice(0, 4);

  const albumTracks = data?.tracks ?? [];
  const artistName = data?.artistName ?? ALBUM_FALLBACK.artistName;

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
            <div className="h-56 w-56 rounded-md shadow-2xl shrink-0" style={{ backgroundColor: color }} aria-hidden />
          )}
          <div className="flex flex-col gap-2 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground/70">Album</p>
            {isLoading ? (
              <>
                <div className="h-12 w-64 bg-muted rounded animate-pulse" />
                <div className="h-4 w-48 bg-muted rounded animate-pulse mt-1" />
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight line-clamp-2">
                  {data?.title ?? ALBUM_FALLBACK.title}
                </h1>
                <p className="text-sm text-foreground mt-1">
                  <Link href={`/artist/${data?.artistId ?? ''}`} className="font-semibold hover:underline">
                    {artistName}
                  </Link>
                  <span className="text-muted-foreground">
                    {' '}· {data?.releaseYear ?? ALBUM_FALLBACK.releaseYear}
                    {albumTracks.length > 0 && ` · ${albumTracks.length} songs`}
                  </span>
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
          onClick={() => albumTracks[0] && play(albumTracks[0])}
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

      <div className="px-3 pb-4">
        <div className="flex items-center gap-3 px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground border-b border-border mb-1">
          <div className="w-8 text-center">#</div>
          <div className="w-10" aria-hidden />
          <div className="flex-1">Title</div>
          <div className="w-4" aria-hidden />
          <div className="w-10 text-right">⏱</div>
          <div className="w-4" aria-hidden />
        </div>

        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 rounded-md bg-muted/50 animate-pulse mb-1" />
            ))
          : albumTracks.length > 0
          ? albumTracks.map((track, i) => (
              <TrackRow
                key={track.id}
                index={i + 1}
                title={track.title}
                artist={artistName}
                duration={formatDuration(track.duration)}
                isPlaying={currentTrack?.id === track.id && isPlaying}
                onPlay={() => play(track)}
              />
            ))
          : TRACKS_FALLBACK.map((track, i) => (
              <TrackRow
                key={track.id}
                index={i + 1}
                title={track.title}
                artist={artistName}
                duration={track.duration}
                onPlay={() => {}}
              />
            ))}
      </div>

      <div className="px-6 pb-10 mt-4">
        <h2 className="text-xl font-bold text-foreground mb-4">
          More by{' '}
          <Link href={`/artist/${data?.artistId ?? ''}`} className="hover:underline">
            {artistName}
          </Link>
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {relatedAlbums.length > 0
            ? relatedAlbums.map((a) => (
                <div key={a.id} className="shrink-0 w-44">
                  <MusicCard
                    title={a.title}
                    subtitle={String(a.releaseYear)}
                    type="album"
                    color={idColor(a.id)}
                    href={`/album/${a.id}`}
                  />
                </div>
              ))
            : MORE_ALBUMS_FALLBACK.map((a) => (
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
