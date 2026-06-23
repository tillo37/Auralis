import { ApiProperty } from '@nestjs/swagger';
import type { Album } from '@prisma/client';

export class AlbumDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  artistId!: string;

  @ApiProperty({ nullable: true })
  coverUrl!: string | null;

  @ApiProperty()
  releaseYear!: number;

  @ApiProperty()
  createdAt!: Date;

  static from(album: Album): AlbumDto {
    const dto = new AlbumDto();
    dto.id = album.id;
    dto.title = album.title;
    dto.artistId = album.artistId;
    dto.coverUrl = album.coverUrl;
    dto.releaseYear = album.releaseYear;
    dto.createdAt = album.createdAt;
    return dto;
  }
}
