'use client';

import { useRouter } from 'next/navigation';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MusicCardProps {
  title: string;
  subtitle: string;
  type: 'album' | 'playlist' | 'artist';
  color?: string;
  href?: string;
}

export function MusicCard({ title, subtitle, type, color = '#1e3a5f', href }: MusicCardProps) {
  const router = useRouter();
  const isArtist = type === 'artist';

  return (
    <div
      className="flex flex-col gap-2 p-3 rounded-md hover:bg-secondary transition-colors cursor-pointer group"
      onClick={() => href && router.push(href)}
      role={href ? 'link' : undefined}
    >
      <div className="relative w-full">
        <div
          className={cn('w-full aspect-square', isArtist ? 'rounded-full' : 'rounded-md')}
          style={{ backgroundColor: color }}
          aria-hidden
        />
        <button
          className={cn(
            'absolute bottom-2 right-2 h-10 w-10 rounded-full bg-primary text-primary-foreground',
            'flex items-center justify-center shadow-lg',
            'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0',
            'transition-all duration-200',
          )}
          aria-label={`Play ${title}`}
          onClick={(e) => { e.stopPropagation(); console.log('play', title); }}
        >
          <Play className="h-4 w-4 fill-current translate-x-0.5" />
        </button>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{title}</p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}
