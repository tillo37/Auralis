'use client';

import { useState } from 'react';
import { Play, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContextMenu } from './context-menu';

function AnimatedBars() {
  return (
    <div className="flex items-end justify-center gap-px w-4 h-4">
      {([0, 0.15, 0.3] as const).map((delay, i) => (
        <div
          key={i}
          className="w-1 rounded-sm bg-primary"
          style={{
            height: '100%',
            animation: `eq-bar 0.8s ease-in-out ${delay}s infinite alternate`,
            transformOrigin: 'bottom',
          }}
        />
      ))}
    </div>
  );
}

export interface TrackRowProps {
  index: number;
  title: string;
  artist: string;
  album?: string;
  dateAdded?: string;
  duration: string;
  isPlaying?: boolean;
  onPlay?: () => void;
  showRemove?: boolean;
}

export function TrackRow({
  index,
  title,
  artist,
  album,
  dateAdded,
  duration,
  isPlaying = false,
  onPlay,
  showRemove = false,
}: TrackRowProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={cn(
        'group flex items-center gap-3 px-3 py-2 rounded-md transition-colors select-none',
        isPlaying ? '' : 'hover:bg-muted/50',
      )}
    >
      {/* Index / play icon */}
      <div className="w-8 flex items-center justify-center shrink-0">
        {isPlaying ? (
          <AnimatedBars />
        ) : (
          <>
            <span className="text-sm text-muted-foreground tabular-nums group-hover:hidden">
              {index}
            </span>
            <button
              className="hidden group-hover:flex items-center justify-center text-foreground"
              onClick={onPlay}
              aria-label="Play"
            >
              <Play className="h-4 w-4 fill-current" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail */}
      <div className="h-10 w-10 rounded bg-muted shrink-0" />

      {/* Title + artist */}
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium truncate', isPlaying ? 'text-primary' : 'text-foreground')}>
          {title}
        </p>
        <p className="text-xs text-muted-foreground truncate">{artist}</p>
      </div>

      {/* Album column (hidden on mobile) */}
      {album !== undefined && (
        <span className="hidden md:block text-sm text-muted-foreground truncate min-w-0 max-w-[180px] flex-1">
          {album}
        </span>
      )}

      {/* Date added column (hidden on mobile) */}
      {dateAdded !== undefined && (
        <span className="hidden lg:block text-sm text-muted-foreground truncate w-28 shrink-0">
          {dateAdded}
        </span>
      )}

      {/* Heart */}
      <button
        onClick={() => setIsLiked((v) => !v)}
        aria-label={isLiked ? 'Unlike' : 'Like'}
        className={cn(
          'shrink-0 transition-colors',
          isLiked
            ? 'text-primary'
            : 'text-muted-foreground opacity-0 group-hover:opacity-100',
        )}
      >
        <Heart className={cn('h-4 w-4', isLiked && 'fill-current')} />
      </button>

      {/* Duration */}
      <span className="w-10 text-right text-sm text-muted-foreground tabular-nums shrink-0">
        {duration}
      </span>

      {/* More options + context menu */}
      <div className="relative shrink-0">
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="More options"
          className="text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground transition-colors"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
        <ContextMenu
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          showRemove={showRemove}
        />
      </div>
    </div>
  );
}
