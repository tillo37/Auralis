import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PlaylistDto } from './dto/playlist.dto';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

@Injectable()
export class PlaylistsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<PlaylistDto[]> {
    const playlists = await this.prisma.playlist.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return playlists.map(PlaylistDto.from);
  }

  async findByOwner(ownerId: string): Promise<PlaylistDto[]> {
    const playlists = await this.prisma.playlist.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    });
    return playlists.map(PlaylistDto.from);
  }

  async findOne(id: string): Promise<PlaylistDto> {
    const playlist = await this.prisma.playlist.findUnique({ where: { id } });
    if (!playlist) throw new NotFoundException(`Playlist ${id} not found`);
    return PlaylistDto.from(playlist);
  }

  async create(ownerId: string, dto: CreatePlaylistDto): Promise<PlaylistDto> {
    const playlist = await this.prisma.playlist.create({
      data: { ...dto, ownerId },
    });
    return PlaylistDto.from(playlist);
  }

  async update(id: string, userId: string, dto: UpdatePlaylistDto): Promise<PlaylistDto> {
    const playlist = await this.prisma.playlist.findUnique({ where: { id } });
    if (!playlist) throw new NotFoundException(`Playlist ${id} not found`);
    if (playlist.ownerId !== userId) throw new ForbiddenException('Not your playlist');

    const updated = await this.prisma.playlist.update({ where: { id }, data: dto });
    return PlaylistDto.from(updated);
  }

  async remove(id: string, userId: string): Promise<void> {
    const playlist = await this.prisma.playlist.findUnique({ where: { id } });
    if (!playlist) throw new NotFoundException(`Playlist ${id} not found`);
    if (playlist.ownerId !== userId) throw new ForbiddenException('Not your playlist');
    await this.prisma.playlist.delete({ where: { id } });
  }

  async addTrack(playlistId: string, trackId: string, userId: string): Promise<void> {
    const playlist = await this.prisma.playlist.findUnique({ where: { id: playlistId } });
    if (!playlist) throw new NotFoundException(`Playlist ${playlistId} not found`);
    if (playlist.ownerId !== userId) throw new ForbiddenException('Not your playlist');

    const track = await this.prisma.track.findUnique({ where: { id: trackId } });
    if (!track) throw new NotFoundException(`Track ${trackId} not found`);

    const existing = await this.prisma.playlistTrack.findUnique({
      where: { playlistId_trackId: { playlistId, trackId } },
    });
    if (existing) throw new ConflictException('Track already in playlist');

    const lastItem = await this.prisma.playlistTrack.findFirst({
      where: { playlistId },
      orderBy: { order: 'desc' },
    });
    const order = (lastItem?.order ?? 0) + 1;

    await this.prisma.playlistTrack.create({
      data: { playlistId, trackId, order },
    });
  }

  async removeTrack(playlistId: string, trackId: string, userId: string): Promise<void> {
    const playlist = await this.prisma.playlist.findUnique({ where: { id: playlistId } });
    if (!playlist) throw new NotFoundException(`Playlist ${playlistId} not found`);
    if (playlist.ownerId !== userId) throw new ForbiddenException('Not your playlist');

    const entry = await this.prisma.playlistTrack.findUnique({
      where: { playlistId_trackId: { playlistId, trackId } },
    });
    if (!entry) throw new NotFoundException('Track not in playlist');

    await this.prisma.playlistTrack.delete({
      where: { playlistId_trackId: { playlistId, trackId } },
    });
  }

  async getTracks(playlistId: string) {
    await this.findOne(playlistId);
    return this.prisma.playlistTrack.findMany({
      where: { playlistId },
      orderBy: { order: 'asc' },
      include: { track: true },
    });
  }
}
