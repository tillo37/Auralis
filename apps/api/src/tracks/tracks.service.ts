import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TrackDto } from './dto/track.dto';

@Injectable()
export class TracksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TrackDto[]> {
    const tracks = await this.prisma.track.findMany({
      orderBy: [{ artist: { name: 'asc' } }, { album: { releaseYear: 'asc' } }, { trackNumber: 'asc' }],
    });
    return tracks.map(TrackDto.from);
  }

  async findOne(id: string): Promise<TrackDto> {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) throw new NotFoundException(`Track ${id} not found`);
    return TrackDto.from(track);
  }
}
