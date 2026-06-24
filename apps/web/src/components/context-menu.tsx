'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const BASE_ITEMS = [
  { label: 'Add to playlist', action: 'add-to-playlist' },
  { label: 'Add to queue',    action: 'add-to-queue'    },
  { label: 'Go to artist',    action: 'go-to-artist'    },
  { label: 'Go to album',     action: 'go-to-album'     },
  { label: 'Share',           action: 'share'           },
] as const;

interface ContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'top' | 'bottom';
  showRemove?: boolean;
}

export function ContextMenu({ isOpen, onClose, position = 'bottom', showRemove = false }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={cn(
        'absolute right-0 z-50 w-52 rounded-md border border-border bg-card shadow-lg py-1',
        position === 'top' ? 'bottom-full mb-1' : 'top-full mt-1',
      )}
    >
      {BASE_ITEMS.map(({ label, action }) => (
        <button
          key={action}
          className="w-full px-4 py-2 text-sm text-left text-foreground hover:bg-muted transition-colors"
          onClick={() => { console.log(action); onClose(); }}
        >
          {label}
        </button>
      ))}
      {showRemove && (
        <>
          <div className="my-1 border-t border-border" />
          <button
            className="w-full px-4 py-2 text-sm text-left text-destructive hover:bg-muted transition-colors"
            onClick={() => { console.log('remove-from-playlist'); onClose(); }}
          >
            Remove from playlist
          </button>
        </>
      )}
    </div>
  );
}
