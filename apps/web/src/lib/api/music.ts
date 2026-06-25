import { apiClient } from './client';
import type { Track, Album, Artist, Playlist, PlaylistTrackEntry } from './types';

export const tracks = {
  getAll: (): Promise<Track[]> => apiClient.get<Track[]>('/tracks'),
  getOne: (id: string): Promise<Track> => apiClient.get<Track>(`/tracks/${id}`),
  play: (id: string): Promise<void> => apiClient.post<void>(`/tracks/${id}/play`, {}),
};

export const albums = {
  getAll: (): Promise<Album[]> => apiClient.get<Album[]>('/albums'),
  getOne: async (id: string): Promise<Required<Album>> => {
    const album = await apiClient.get<Album>(`/albums/${id}`);
    const [artist, allTracks] = await Promise.all([
      apiClient.get<Artist>(`/artists/${album.artistId}`),
      apiClient.get<Track[]>('/tracks'),
    ]);
    const albumTracks = allTracks
      .filter((t) => t.albumId === id)
      .map((t) => ({ ...t, artistName: artist.name }));
    return {
      ...album,
      artistName: artist.name,
      tracks: albumTracks,
    };
  },
};

export const artists = {
  getAll: (): Promise<Artist[]> => apiClient.get<Artist[]>('/artists'),
  getOne: async (id: string): Promise<Required<Artist>> => {
    const [artist, allTracks, allAlbums] = await Promise.all([
      apiClient.get<Artist>(`/artists/${id}`),
      apiClient.get<Track[]>('/tracks'),
      apiClient.get<Album[]>('/albums'),
    ]);
    const artistTracks = allTracks
      .filter((t) => t.artistId === id)
      .map((t) => ({ ...t, artistName: artist.name }));
    const artistAlbums = allAlbums
      .filter((a) => a.artistId === id)
      .map((a) => ({ ...a, artistName: artist.name, tracks: [] as Track[] }));
    return {
      ...artist,
      tracks: artistTracks,
      albums: artistAlbums,
    };
  },
};

export const playlists = {
  getAll: (): Promise<Playlist[]> => apiClient.get<Playlist[]>('/playlists/mine'),
  getOne: async (id: string): Promise<Required<Playlist>> => {
    const [playlist, rawEntries, allArtists] = await Promise.all([
      apiClient.get<Playlist>(`/playlists/${id}`),
      apiClient.get<Array<{ track: Track; order: number; addedAt: string }>>(`/playlists/${id}/tracks`),
      apiClient.get<Artist[]>('/artists'),
    ]);
    const artistMap = new Map(allArtists.map((a) => [a.id, a.name]));
    const playlistTracks: PlaylistTrackEntry[] = rawEntries
      .sort((a, b) => a.order - b.order)
      .map((entry) => ({
        track: { ...entry.track, artistName: artistMap.get(entry.track.artistId) ?? '' },
        order: entry.order,
        addedAt: entry.addedAt,
      }));
    return { ...playlist, tracks: playlistTracks };
  },
  create: (dto: { title: string; description?: string; coverUrl?: string }): Promise<Playlist> =>
    apiClient.post<Playlist>('/playlists', dto),
  addTrack: (playlistId: string, trackId: string): Promise<void> =>
    apiClient.post<void>(`/playlists/${playlistId}/tracks`, { trackId }),
  removeTrack: (playlistId: string, trackId: string): Promise<void> =>
    apiClient.delete<void>(`/playlists/${playlistId}/tracks/${trackId}`),
};

export const likes = {
  getAll: (): Promise<Track[]> => apiClient.get<Track[]>('/likes'),
  like: (trackId: string): Promise<void> => apiClient.post<void>(`/likes/${trackId}`, {}),
  unlike: (trackId: string): Promise<void> => apiClient.delete<void>(`/likes/${trackId}`),
};
