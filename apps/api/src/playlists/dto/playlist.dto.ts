import { ApiProperty } from '@nestjs/swagger';
import type { Playlist } from '@prisma/client';

export class PlaylistDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ nullable: true })
  description!: string | null;

  @ApiProperty({ nullable: true })
  coverUrl!: string | null;

  @ApiProperty()
  ownerId!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  static from(playlist: Playlist): PlaylistDto {
    const dto = new PlaylistDto();
    dto.id = playlist.id;
    dto.title = playlist.title;
    dto.description = playlist.description;
    dto.coverUrl = playlist.coverUrl;
    dto.ownerId = playlist.ownerId;
    dto.createdAt = playlist.createdAt;
    dto.updatedAt = playlist.updatedAt;
    return dto;
  }
}
