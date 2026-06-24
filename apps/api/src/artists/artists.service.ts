import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ArtistDto } from './dto/artist.dto';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

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

  async create(dto: CreateArtistDto): Promise<ArtistDto> {
    const existing = await this.prisma.artist.findUnique({ where: { name: dto.name } });
    if (existing) throw new ConflictException(`Artist "${dto.name}" already exists`);
    const artist = await this.prisma.artist.create({ data: dto });
    return ArtistDto.from(artist);
  }

  async update(id: string, dto: UpdateArtistDto): Promise<ArtistDto> {
    await this.findOne(id);
    if (dto.name) {
      const conflict = await this.prisma.artist.findUnique({ where: { name: dto.name } });
      if (conflict && conflict.id !== id) throw new ConflictException(`Artist "${dto.name}" already exists`);
    }
    const artist = await this.prisma.artist.update({ where: { id }, data: dto });
    return ArtistDto.from(artist);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.artist.delete({ where: { id } });
  }
}
