import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AlbumDto } from './dto/album.dto';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

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

  async create(dto: CreateAlbumDto): Promise<AlbumDto> {
    const artistExists = await this.prisma.artist.findUnique({ where: { id: dto.artistId } });
    if (!artistExists) throw new NotFoundException(`Artist ${dto.artistId} not found`);
    const album = await this.prisma.album.create({ data: dto });
    return AlbumDto.from(album);
  }

  async update(id: string, dto: UpdateAlbumDto): Promise<AlbumDto> {
    await this.findOne(id);
    if (dto.artistId) {
      const artistExists = await this.prisma.artist.findUnique({ where: { id: dto.artistId } });
      if (!artistExists) throw new NotFoundException(`Artist ${dto.artistId} not found`);
    }
    const album = await this.prisma.album.update({ where: { id }, data: dto });
    return AlbumDto.from(album);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.album.delete({ where: { id } });
  }
}
