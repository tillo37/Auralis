'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Loader2, Music, UploadCloud } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { playlists as playlistsApi } from '@/lib/api';
import { apiClient } from '@/lib/api/client';

// ---------------------------------------------------------------------------
// Multipart upload helper — browser-only, always called from event handlers
// ---------------------------------------------------------------------------

const TOKEN_KEY = 'auralis_access_token';
const API_BASE  = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function uploadFile(file: File, endpoint: string): Promise<{ url: string }> {
  const token = localStorage.getItem(TOKEN_KEY);
  const form  = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE}/api/v1${endpoint}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as Record<string, unknown>;
    throw new Error((err.message as string | undefined) ?? 'Upload failed');
  }
  return res.json() as Promise<{ url: string }>;
}

// ---------------------------------------------------------------------------
// Upload track section
// ---------------------------------------------------------------------------

function UploadTrackSection() {
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [audioFile,  setAudioFile]  = useState<File | null>(null);
  const [imageFile,  setImageFile]  = useState<File | null>(null);
  const [title,      setTitle]      = useState('');
  const [artistName, setArtistName] = useState('');
  const [albumName,  setAlbumName]  = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [status,    setStatus]    = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg,  setErrorMsg]  = useState('');

  function resetForm() {
    setTitle('');
    setArtistName('');
    setAlbumName('');
    setAudioFile(null);
    setImageFile(null);
    if (audioInputRef.current) audioInputRef.current.value = '';
    if (imageInputRef.current) imageInputRef.current.value = '';
  }

  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.preload = 'metadata';
      audio.onloadedmetadata = () => {
        resolve(Math.round(audio.duration));
        URL.revokeObjectURL(audio.src);
      };
      audio.onerror = () => resolve(0);
      audio.src = URL.createObjectURL(file);
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!audioFile || !title.trim()) return;

    setIsUploading(true);
    setStatus('idle');
    setErrorMsg('');

    try {
      // Step 0: extract real duration from the audio file
      const duration = await getAudioDuration(audioFile);

      // Step 1: upload audio file
      const { url: fileUrl } = await uploadFile(audioFile, '/upload/audio');

      // Step 2: upload cover image if provided
      let coverUrl: string | undefined;
      if (imageFile) {
        const { url } = await uploadFile(imageFile, '/upload/image');
        coverUrl = url;
      }

      // Step 3: create or get the artist, then create the track with its id
      const artist = await apiClient.post<{ id: string }>('/artists', {
        name: artistName.trim() || 'Unknown Artist',
      });

      // Step 4: create track record with the real artistId
      await apiClient.post('/tracks', {
        title: title.trim(),
        fileUrl,
        coverUrl,
        duration,
        artistId: artist.id,
      });

      setStatus('success');
      resetForm();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
      <h2 className="text-lg font-semibold text-foreground">Upload Track</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Audio file drop zone */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Audio file *
          </p>
          <div
            role="button"
            tabIndex={0}
            onClick={() => audioInputRef.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && audioInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/60 transition-colors"
          >
            {audioFile ? (
              <p className="text-sm font-medium text-foreground break-all">{audioFile.name}</p>
            ) : (
              <>
                <Music className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Click to browse audio file</p>
                <p className="text-xs text-muted-foreground mt-1">MP3, WAV, FLAC, OGG · max 50 MB</p>
              </>
            )}
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        {/* Cover image drop zone */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Cover image (optional)
          </p>
          <div
            role="button"
            tabIndex={0}
            onClick={() => imageInputRef.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && imageInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/60 transition-colors"
          >
            {imageFile ? (
              <p className="text-sm font-medium text-foreground break-all">{imageFile.name}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                JPEG, PNG, WebP · max 5 MB
              </p>
            )}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        {/* Track metadata */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Title *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Track title"
              required
            />
          </div>
          <div className="space-y-1.5">
            {/* TODO: replace this free-text field with a real artist picker dropdown */}
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Artist name
            </label>
            <Input
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="Artist name (display only for now)"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Album (optional)
            </label>
            <Input
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              placeholder="Album name"
            />
          </div>
        </div>

        {/* Feedback */}
        {status === 'success' && (
          <div className="flex items-center gap-2 text-sm text-green-500">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Track uploaded successfully!
          </div>
        )}
        {status === 'error' && (
          <p className="text-sm text-destructive">{errorMsg}</p>
        )}

        <Button
          type="submit"
          disabled={isUploading || !audioFile || !title.trim()}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <UploadCloud className="h-4 w-4" />
              Upload track
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Create playlist section
// ---------------------------------------------------------------------------

function CreatePlaylistSection() {
  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [isSaving,    setIsSaving]    = useState(false);
  const [status,      setStatus]      = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg,    setErrorMsg]    = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSaving(true);
    setStatus('idle');
    setErrorMsg('');

    try {
      await playlistsApi.create({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      setStatus('success');
      setTitle('');
      setDescription('');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
      <h2 className="text-lg font-semibold text-foreground">Create Playlist</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Playlist title *
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My playlist"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this playlist about?"
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
          />
        </div>

        {/* Feedback */}
        {status === 'success' && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-green-500">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Playlist created!
            </div>
            <Link href="/library" className="text-sm text-primary hover:underline">
              View in Library →
            </Link>
          </div>
        )}
        {status === 'error' && (
          <p className="text-sm text-destructive">{errorMsg}</p>
        )}

        <Button
          type="submit"
          disabled={isSaving || !title.trim()}
          className="w-full"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating…
            </>
          ) : (
            'Create playlist'
          )}
        </Button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function UploadContent() {
  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <UploadCloud className="h-7 w-7 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Upload &amp; Create</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UploadTrackSection />
        <CreatePlaylistSection />
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <ProtectedRoute>
      <UploadContent />
    </ProtectedRoute>
  );
}
