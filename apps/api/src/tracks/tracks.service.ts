import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TrackDto } from './dto/track.dto';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TracksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TrackDto[]> {
    const tracks = await this.prisma.track.findMany({
      orderBy: [{ artist: { name: 'asc' } }, { album: { releaseYear: 'asc' } }, { title: 'asc' }],
    });
    return tracks.map(TrackDto.from);
  }

  async findOne(id: string): Promise<TrackDto> {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) throw new NotFoundException(`Track ${id} not found`);
    return TrackDto.from(track);
  }

  async create(dto: CreateTrackDto): Promise<TrackDto> {
    const artistExists = await this.prisma.artist.findUnique({ where: { id: dto.artistId } });
    if (!artistExists) throw new NotFoundException(`Artist ${dto.artistId} not found`);

    if (dto.albumId) {
      const albumExists = await this.prisma.album.findUnique({ where: { id: dto.albumId } });
      if (!albumExists) throw new NotFoundException(`Album ${dto.albumId} not found`);
    }

    const track = await this.prisma.track.create({ data: dto });
    return TrackDto.from(track);
  }

  async update(id: string, dto: UpdateTrackDto): Promise<TrackDto> {
    await this.findOne(id);

    if (dto.artistId) {
      const artistExists = await this.prisma.artist.findUnique({ where: { id: dto.artistId } });
      if (!artistExists) throw new NotFoundException(`Artist ${dto.artistId} not found`);
    }
    if (dto.albumId) {
      const albumExists = await this.prisma.album.findUnique({ where: { id: dto.albumId } });
      if (!albumExists) throw new NotFoundException(`Album ${dto.albumId} not found`);
    }

    const track = await this.prisma.track.update({ where: { id }, data: dto });
    return TrackDto.from(track);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.track.delete({ where: { id } });
  }

  async incrementPlayCount(id: string): Promise<void> {
    const exists = await this.prisma.track.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException(`Track ${id} not found`);
    await this.prisma.track.update({
      where: { id },
      data: { playCount: { increment: 1 } },
    });
  }
}
