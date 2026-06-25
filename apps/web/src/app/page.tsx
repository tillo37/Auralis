'use client';

import { MusicCard } from '@/components/music-card';
import { useFetch } from '@/hooks/use-fetch';
import { tracks as tracksApi, artists as artistsApi } from '@/lib/api';

// Fallback placeholder data shown on error / empty state
const QUICK_PICKS = [
  { id: 1, title: 'Liked Songs' },
  { id: 2, title: 'Discover Weekly' },
  { id: 3, title: 'Release Radar' },
  { id: 4, title: 'Daily Mix 1' },
  { id: 5, title: 'Top Tracks' },
  { id: 6, title: 'New Arrivals' },
];

const MADE_FOR_YOU = [
  { id: 1, title: 'Daily Mix 1', subtitle: 'Based on your recent listening' },
  { id: 2, title: 'Daily Mix 2', subtitle: 'Curated for your taste' },
  { id: 3, title: 'Discover Weekly', subtitle: 'New music every Monday' },
  { id: 4, title: 'Release Radar', subtitle: 'Fresh releases from artists you follow' },
  { id: 5, title: 'Time Capsule', subtitle: 'Songs from your past' },
];

const RECENTLY_PLAYED = [
  { id: 1, title: 'Chill Vibes', subtitle: 'Playlist' },
  { id: 2, title: 'Workout Mix', subtitle: 'Playlist' },
  { id: 3, title: 'Late Night Jazz', subtitle: 'Playlist' },
  { id: 4, title: 'Focus Flow', subtitle: 'Playlist' },
  { id: 5, title: 'Road Trip Anthems', subtitle: 'Playlist' },
];

const PALETTE = ['#1e3a5f', '#5b2d8e', '#7f1d1d', '#064e3b', '#78350f', '#3b0764', '#14532d', '#713f12'];

function idColor(id: string): string {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) | 0;
  return PALETTE[Math.abs(h) % PALETTE.length];
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function CardSkeleton() {
  return (
    <div className="flex flex-col gap-2 shrink-0 w-44">
      <div className="h-44 w-44 rounded-md bg-muted animate-pulse" />
      <div className="h-3.5 w-3/4 rounded bg-muted animate-pulse" />
      <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
    </div>
  );
}

export default function HomePage() {
  const { data: trackList, isLoading: tracksLoading } = useFetch(tracksApi.getAll, []);
  const { data: artistList, isLoading: artistsLoading } = useFetch(artistsApi.getAll, []);

  const artistMap = new Map((artistList ?? []).map((a) => [a.id, a.name]));
  const displayTracks = trackList && trackList.length > 0 ? trackList.slice(0, 6) : null;
  const displayArtists = artistList && artistList.length > 0 ? artistList.slice(0, 6) : null;

  return (
    <div className="p-8 space-y-10">
      {/* Quick picks grid */}
      <section>
        <h1 className="text-3xl font-bold text-foreground mb-5">{getGreeting()}</h1>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {tracksLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-md bg-secondary h-16 animate-pulse" />
              ))
            : (displayTracks ?? QUICK_PICKS).map((item, i) => {
                if (displayTracks) {
                  const track = displayTracks[i];
                  return (
                    <button
                      key={track.id}
                      className="flex items-center gap-3 rounded-md bg-secondary hover:bg-accent transition-colors cursor-pointer overflow-hidden text-left"
                    >
                      <div className="h-16 w-16 shrink-0" style={{ backgroundColor: idColor(track.id) }} />
                      <span className="font-semibold text-sm text-foreground pr-3 truncate">
                        {track.title}
                      </span>
                    </button>
                  );
                }
                return (
                  <button
                    key={item.id}
                    className="flex items-center gap-3 rounded-md bg-secondary hover:bg-accent transition-colors cursor-pointer overflow-hidden text-left"
                  >
                    <div className="h-16 w-16 bg-muted shrink-0" />
                    <span className="font-semibold text-sm text-foreground pr-3 truncate">
                      {(item as typeof QUICK_PICKS[0]).title}
                    </span>
                  </button>
                );
              })}
        </div>
      </section>

      {/* Made for you */}
      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">Made for you</h2>
        <div className="flex gap-5 overflow-x-auto pb-2 -mx-1 px-1">
          {artistsLoading
            ? Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
            : displayArtists
            ? displayArtists.map((artist) => (
                <div key={artist.id} className="shrink-0 w-44">
                  <MusicCard
                    title={artist.name}
                    subtitle="Artist"
                    type="artist"
                    color={idColor(artist.id)}
                    href={`/artist/${artist.id}`}
                  />
                </div>
              ))
            : MADE_FOR_YOU.map((item) => (
                <div key={item.id} className="flex flex-col gap-2 shrink-0 w-44 cursor-pointer group">
                  <div className="h-44 w-44 rounded-md bg-muted group-hover:bg-accent transition-colors" />
                  <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground truncate leading-tight">{item.subtitle}</p>
                </div>
              ))}
        </div>
      </section>

      {/* Recently played */}
      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">Recently played</h2>
        <div className="flex gap-5 overflow-x-auto pb-2 -mx-1 px-1">
          {tracksLoading
            ? Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
            : displayTracks
            ? displayTracks.map((track) => (
                <div key={track.id} className="shrink-0 w-44">
                  <MusicCard
                    title={track.title}
                    subtitle={artistMap.get(track.artistId) ?? 'Unknown artist'}
                    type="album"
                    color={idColor(track.id)}
                  />
                </div>
              ))
            : RECENTLY_PLAYED.map((item) => (
                <div key={item.id} className="flex flex-col gap-2 shrink-0 w-44 cursor-pointer group">
                  <div className="h-44 w-44 rounded-md bg-secondary group-hover:bg-accent transition-colors" />
                  <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                </div>
              ))}
        </div>
      </section>
    </div>
  );
}
