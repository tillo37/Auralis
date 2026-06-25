export interface Track {
  id: string;
  title: string;
  duration: number;
  fileUrl: string | null;
  coverUrl: string | null;
  playCount: number;
  artistId: string;
  albumId: string | null;
  artistName?: string;
  albumTitle?: string;
}

export interface Album {
  id: string;
  title: string;
  coverUrl: string | null;
  releaseYear: number;
  artistId: string;
  artistName?: string;
  tracks?: Track[];
}

export interface Artist {
  id: string;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  verified: boolean;
  tracks?: Track[];
  albums?: Album[];
}

export interface Playlist {
  id: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  ownerId: string;
  tracks?: PlaylistTrackEntry[];
}

export interface PlaylistTrackEntry {
  track: Track;
  order: number;
  addedAt: string;
}
