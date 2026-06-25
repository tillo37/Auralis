'use client';

import { Volume2, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useState } from 'react';
import { usePlayer } from '@/context/player-context';
import { cn } from '@/lib/utils';

function formatDuration(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function PlayerBar() {
  const { currentTrack, isPlaying, toggle } = usePlayer();
  const [volume, setVolume] = useState(66);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t border-border flex items-center px-4 gap-4 z-20">
      {/* Left: track info */}
      <div className="flex items-center gap-3 w-60 min-w-0">
        <div className="h-12 w-12 rounded bg-muted shrink-0" />
        <div className="min-w-0">
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
      </div>

      {/* Center: playback controls */}
      <div className="flex flex-1 flex-col items-center gap-1.5">
        <div className="flex items-center gap-5">
          <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Previous track">
            <SkipBack className="h-5 w-5" />
          </button>
          <button
            onClick={toggle}
            className={cn(
              'h-9 w-9 rounded-full flex items-center justify-center transition-transform hover:scale-105',
              'bg-foreground text-background',
            )}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 fill-current" />
            ) : (
              <Play className="h-4 w-4 fill-current translate-x-0.5" />
            )}
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Next track">
            <SkipForward className="h-5 w-5" />
          </button>
        </div>

        <div className="w-full max-w-sm flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-8 text-right tabular-nums">0:00</span>
          <div className="flex-1 h-1 rounded-full bg-muted relative group cursor-pointer">
            <div className="h-full w-0 rounded-full bg-foreground transition-all" />
          </div>
          <span className="text-xs text-muted-foreground w-8 tabular-nums">
            {currentTrack ? formatDuration(currentTrack.duration) : '0:00'}
          </span>
        </div>
      </div>

      {/* Right: volume */}
      <div className="flex items-center gap-2.5 w-60 justify-end">
        <Volume2 className="h-4 w-4 text-muted-foreground shrink-0" />
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-24 h-1 rounded-full appearance-none bg-muted accent-primary cursor-pointer"
          aria-label="Volume"
        />
      </div>
    </div>
  );
}
