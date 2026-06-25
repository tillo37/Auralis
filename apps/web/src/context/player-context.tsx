'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import { tracks as tracksApi } from '@/lib/api';
import type { Track } from '@/lib/api/types';

interface PlayerContextValue {
  currentTrack: Track | null;
  isPlaying: boolean;
  play: (track: Track) => void;
  pause: () => void;
  toggle: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback((track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    tracksApi.play(track.id).catch(() => {});
  }, []);

  const pause = useCallback(() => setIsPlaying(false), []);
  const toggle = useCallback(() => setIsPlaying((p) => !p), []);

  return (
    <PlayerContext.Provider value={{ currentTrack, isPlaying, play, pause, toggle }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used inside <PlayerProvider>');
  return ctx;
}
