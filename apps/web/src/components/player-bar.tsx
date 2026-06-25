'use client';

import Image from 'next/image';
import { Heart, Loader2, MoreHorizontal, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { usePlayer } from '@/context/player-context';
import { cn } from '@/lib/utils';

const ACCENT = { accentColor: 'var(--primary)' } as const;

function formatTime(s: number): string {
  if (!isFinite(s) || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

export function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    volume,
    isMuted,
    toggle,
    seek,
    setVolume,
    toggleMute,
    playNext,
    playPrev,
  } = usePlayer();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t border-border flex items-center px-4 gap-4 z-20">

      {/* Left: now playing info */}
      <div className="flex items-center gap-3 w-60 min-w-0">
        {/* Cover art */}
        {currentTrack?.coverUrl ? (
          <Image
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            width={48}
            height={48}
            unoptimized
            className="h-12 w-12 rounded object-cover shrink-0"
          />
        ) : (
          <div className="h-12 w-12 rounded bg-muted shrink-0" />
        )}

        <div className="min-w-0 flex-1">
          {currentTrack ? (
            <>
              <p className="text-sm font-medium text-foreground truncate">{currentTrack.title}</p>
              <p className="text-xs text-muted-foreground truncate">
                {currentTrack.artistName ?? currentTrack.artistId}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-foreground truncate">No track playing</p>
              <p className="text-xs text-muted-foreground truncate">—</p>
            </>
          )}
        </div>

        <button
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
          aria-label="Like track"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      {/* Center: controls + seek bar */}
      <div className="flex flex-1 flex-col items-center gap-1">
        {/* Control buttons */}
        <div className="flex items-center gap-4">
          <button
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Shuffle"
          >
            <Shuffle className="h-4 w-4" />
          </button>

          <button
            onClick={playPrev}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Previous track"
          >
            <SkipBack className="h-5 w-5" />
          </button>

          <button
            onClick={toggle}
            disabled={!currentTrack}
            className={cn(
              'h-9 w-9 rounded-full flex items-center justify-center transition-transform',
              'bg-foreground text-background',
              currentTrack ? 'hover:scale-105' : 'opacity-40 cursor-default',
            )}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-4 w-4 fill-current" />
            ) : (
              <Play className="h-4 w-4 fill-current translate-x-0.5" />
            )}
          </button>

          <button
            onClick={playNext}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Next track"
          >
            <SkipForward className="h-5 w-5" />
          </button>

          <button
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Repeat"
          >
            <Repeat className="h-4 w-4" />
          </button>
        </div>

        {/* Seek bar */}
        <div className="w-full max-w-md flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-8 text-right tabular-nums">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.1}
            value={currentTime}
            onChange={(e) => seek(parseFloat(e.target.value))}
            disabled={!currentTrack}
            className="flex-1 h-1 rounded-full appearance-none bg-muted cursor-pointer disabled:cursor-default disabled:opacity-40"
            style={ACCENT}
            aria-label="Seek"
          />
          <span className="text-xs text-muted-foreground w-8 tabular-nums">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Right: volume */}
      <div className="flex items-center gap-2.5 w-60 justify-end">
        <button
          onClick={toggleMute}
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={isMuted ? 0 : volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-24 h-1 rounded-full appearance-none bg-muted cursor-pointer"
          style={ACCENT}
          aria-label="Volume"
        />
      </div>

    </div>
  );
}
