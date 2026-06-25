'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Play, MoreHorizontal } from 'lucide-react';
import { TrackRow } from '@/components/track-row';
import { MusicCard } from '@/components/music-card';
import { useFetch } from '@/hooks/use-fetch';
import { artists as artistsApi } from '@/lib/api';
import { usePlayer } from '@/context/player-context';

// Fallback placeholder data
const ARTIST_FALLBACK = {
  name: 'The Weeknd',
  bio: 'Abel Makkonen Tesfaye, known professionally as The Weeknd, is a Canadian singer, songwriter, and record producer.',
  color: '#7f1d1d',
};
const POPULAR_FALLBACK = [
  { id: '1', title: 'Blinding Lights', duration: '3:20', plays: '1.8B' },
  { id: '2', title: 'Starboy',         duration: '3:51', plays: '1.6B' },
  { id: '3', title: 'Die For You',     duration: '4:20', plays: '1.3B' },
  { id: '4', title: 'Save Your Tears', duration: '3:35', plays: '1.1B' },
  { id: '5', title: 'The Hills',       duration: '4:02', plays: '987M' },
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

function formatPlays(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function ArtistPage() {
  const { id } = useParams<{ id: string }>();
  const [isFollowing, setIsFollowing] = useState(false);
  const { currentTrack, isPlaying, play } = usePlayer();

  const { data, isLoading } = useFetch(() => artistsApi.getOne(id), [id]);
  const { data: allArtists } = useFetch(artistsApi.getAll, []);

  const color = data ? idColor(data.id) : ARTIST_FALLBACK.color;
  const artistTracks = (data?.tracks ?? []).sort((a, b) => b.playCount - a.playCount).slice(0, 5);
  const artistAlbums = data?.albums ?? [];

  const fansAlsoLike = (allArtists ?? [])
    .filter((a) => a.id !== id)
    .slice(0, 4);

  return (
    <div className="min-h-full">
      {/* Hero banner */}
      <div className="relative h-72 overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundColor: color }} aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute top-8 left-1/2 -translate-x-1/2">
          {isLoading ? (
            <div className="h-32 w-32 rounded-full bg-muted/50 animate-pulse border-4 border-background/30" />
          ) : (
            <div
              className="h-32 w-32 rounded-full border-4 border-background/30 shadow-2xl"
              style={{ backgroundColor: color }}
              aria-hidden
            />
          )}
        </div>
        <div className="absolute bottom-5 left-6">
          {data?.verified && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">✓ Verified Artist</span>
            </div>
          )}
          <h1 className="text-5xl font-bold text-white leading-tight">
            {isLoading ? '...' : (data?.name ?? ARTIST_FALLBACK.name)}
          </h1>
        </div>
      </div>

      {/* Action row */}
      <div className="flex items-center gap-4 px-6 py-5">
        <button
          className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
          aria-label="Play artist"
          onClick={() => artistTracks[0] && play(artistTracks[0])}
        >
          <Play className="h-6 w-6 fill-current translate-x-0.5" />
        </button>
        <button
          onClick={() => setIsFollowing((v) => !v)}
          className="px-5 py-2 rounded-full border text-sm font-semibold transition-colors border-foreground/40 text-foreground hover:border-foreground"
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="More options">
          <MoreHorizontal className="h-6 w-6" />
        </button>
      </div>

      <div className="px-6 pb-10 space-y-10">
        {/* Popular tracks */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">Popular</h2>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 rounded-md bg-muted/50 animate-pulse mb-1" />
              ))
            : artistTracks.length > 0
            ? artistTracks.map((track, i) => (
                <TrackRow
                  key={track.id}
                  index={i + 1}
                  title={track.title}
                  artist={data?.name ?? ''}
                  album={`${formatPlays(track.playCount)} plays`}
                  duration={formatDuration(track.duration)}
                  isPlaying={currentTrack?.id === track.id && isPlaying}
                  onPlay={() => play(track)}
                />
              ))
            : POPULAR_FALLBACK.map((track, i) => (
                <TrackRow
                  key={track.id}
                  index={i + 1}
                  title={track.title}
                  artist={ARTIST_FALLBACK.name}
                  album={`${track.plays} plays`}
                  duration={track.duration}
                  onPlay={() => {}}
                />
              ))}
        </section>

        {/* Discography */}
        {(isLoading || artistAlbums.length > 0) && (
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">Discography</h2>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="shrink-0 w-44 flex flex-col gap-2 p-3">
                      <div className="h-44 w-44 rounded-md bg-muted animate-pulse" />
                      <div className="h-3.5 w-3/4 bg-muted rounded animate-pulse" />
                    </div>
                  ))
                : artistAlbums.map((album) => (
                    <div key={album.id} className="shrink-0 w-44">
                      <MusicCard
                        title={album.title}
                        subtitle={String(album.releaseYear)}
                        type="album"
                        color={idColor(album.id)}
                        href={`/album/${album.id}`}
                      />
                    </div>
                  ))}
            </div>
          </section>
        )}

        {/* Fans also like */}
        {fansAlsoLike.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">Fans also like</h2>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              {fansAlsoLike.map((artist) => (
                <div key={artist.id} className="shrink-0 w-44">
                  <MusicCard
                    title={artist.name}
                    subtitle="Artist"
                    type="artist"
                    color={idColor(artist.id)}
                    href={`/artist/${artist.id}`}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* About */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">About</h2>
          <div className="rounded-xl bg-secondary p-6 max-w-2xl">
            <div className="h-40 w-full rounded-lg mb-4" style={{ backgroundColor: color }} aria-hidden />
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-3 w-full bg-muted rounded animate-pulse" />
                <div className="h-3 w-5/6 bg-muted rounded animate-pulse" />
                <div className="h-3 w-4/6 bg-muted rounded animate-pulse" />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {data?.bio ?? ARTIST_FALLBACK.bio}
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
