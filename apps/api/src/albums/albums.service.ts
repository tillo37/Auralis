import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AlbumDto } from './dto/album.dto';

@Injectable()
export class AlbumsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<AlbumDto[]> {
    const albums = await this.prisma.album.findMany({
      orderBy: [{ releaseYear: 'desc' }, { title: 'asc' }],
    });
    return albums.map(AlbumDto.from);
  }

  async findOne(id: string): Promise<AlbumDto> {
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) throw new NotFoundException(`Album ${id} not found`);
    return AlbumDto.from(album);
  }
}
