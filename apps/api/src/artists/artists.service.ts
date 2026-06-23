import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ArtistDto } from './dto/artist.dto';

@Injectable()
export class ArtistsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ArtistDto[]> {
    const artists = await this.prisma.artist.findMany({
      orderBy: { name: 'asc' },
    });
    return artists.map(ArtistDto.from);
  }

  async findOne(id: string): Promise<ArtistDto> {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) throw new NotFoundException(`Artist ${id} not found`);
    return ArtistDto.from(artist);
  }
}
