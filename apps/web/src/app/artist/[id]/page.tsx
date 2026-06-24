'use client';

import { useState } from 'react';
import { Play, MoreHorizontal } from 'lucide-react';
import { TrackRow } from '@/components/track-row';
import { MusicCard } from '@/components/music-card';

// ---------------------------------------------------------------------------
// Placeholder data
// ---------------------------------------------------------------------------

const ARTIST = {
  name: 'The Weeknd',
  followers: '45.2M followers',
  color: '#7f1d1d',
  bio: `Abel Makkonen Tesfaye, known professionally as The Weeknd, is a Canadian singer, songwriter, and record producer. He is known for his sonic versatility and dark lyricism, drawing from personal experience with sex, drugs, and heartbreak. His music blends R&B, pop, and alternative sounds. He rose to prominence in 2011 with his debut mixtape series Trilogy, and has since released critically acclaimed albums including Beauty Behind the Madness, Starboy, After Hours, and Dawn FM.`,
} as const;

const POPULAR = [
  { id:  1, title: 'Blinding Lights',  duration: '3:20', plays: '1.8B' },
  { id:  2, title: 'Starboy',          duration: '3:51', plays: '1.6B' },
  { id:  3, title: 'Die For You',      duration: '4:20', plays: '1.3B' },
  { id:  4, title: 'Save Your Tears',  duration: '3:35', plays: '1.1B' },
  { id:  5, title: 'The Hills',        duration: '4:02', plays: '987M' },
] as const;

const DISCOGRAPHY = [
  { id: 1, title: 'After Hours',                  subtitle: '2020', color: '#7f1d1d' },
  { id: 5, title: 'Dawn FM',                      subtitle: '2022', color: '#064e3b' },
  { id: 6, title: 'Starboy',                      subtitle: '2016', color: '#1e3a5f' },
  { id: 7, title: 'Beauty Behind the Madness',    subtitle: '2015', color: '#5b2d8e' },
] as const;

const FANS_ALSO_LIKE = [
  { id: 2, title: 'Drake',        subtitle: 'Artist', color: '#1e3a5f' },
  { id: 3, title: 'Travis Scott', subtitle: 'Artist', color: '#064e3b' },
  { id: 4, title: 'Post Malone',  subtitle: 'Artist', color: '#78350f' },
  { id: 5, title: 'Future',       subtitle: 'Artist', color: '#3b0764' },
] as const;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ArtistPage() {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="min-h-full">
      {/* Hero banner */}
      <div className="relative h-72 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundColor: ARTIST.color }}
          aria-hidden
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        {/* Circular avatar */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2">
          <div
            className="h-32 w-32 rounded-full border-4 border-background/30 shadow-2xl"
            style={{ backgroundColor: ARTIST.color }}
            aria-hidden
          />
        </div>
        {/* Artist name + meta */}
        <div className="absolute bottom-5 left-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              ✓ Verified Artist
            </span>
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight">{ARTIST.name}</h1>
          <p className="text-sm text-white/70 mt-1">{ARTIST.followers}</p>
        </div>
      </div>

      {/* Action row */}
      <div className="flex items-center gap-4 px-6 py-5">
        <button
          className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
          aria-label="Play artist"
          onClick={() => console.log('play artist')}
        >
          <Play className="h-6 w-6 fill-current translate-x-0.5" />
        </button>
        <button
          onClick={() => setIsFollowing((v) => !v)}
          className="px-5 py-2 rounded-full border text-sm font-semibold transition-colors border-foreground/40 text-foreground hover:border-foreground"
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
        <button
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="More options"
        >
          <MoreHorizontal className="h-6 w-6" />
        </button>
      </div>

      <div className="px-6 pb-10 space-y-10">
        {/* Popular */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">Popular</h2>
          <div className="space-y-0">
            {POPULAR.map((track, i) => (
              <TrackRow
                key={track.id}
                index={i + 1}
                title={track.title}
                artist={ARTIST.name}
                album={`${track.plays} plays`}
                duration={track.duration}
                onPlay={() => console.log('play', track.title)}
              />
            ))}
          </div>
        </section>

        {/* Discography */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Discography</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {DISCOGRAPHY.map((album) => (
              <div key={album.id} className="shrink-0 w-44">
                <MusicCard
                  title={album.title}
                  subtitle={album.subtitle}
                  type="album"
                  color={album.color}
                  href={`/album/${album.id}`}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Fans also like */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Fans also like</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {FANS_ALSO_LIKE.map((artist) => (
              <div key={artist.id} className="shrink-0 w-44">
                <MusicCard
                  title={artist.title}
                  subtitle={artist.subtitle}
                  type="artist"
                  color={artist.color}
                  href={`/artist/${artist.id}`}
                />
              </div>
            ))}
          </div>
        </section>

        {/* About */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">About</h2>
          <div className="rounded-xl bg-secondary p-6 max-w-2xl">
            <div
              className="h-40 w-full rounded-lg mb-4"
              style={{ backgroundColor: ARTIST.color }}
              aria-hidden
            />
            <p className="text-sm text-muted-foreground leading-relaxed">{ARTIST.bio}</p>
            <p className="text-xs text-muted-foreground mt-4 font-medium">
              {ARTIST.followers}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
