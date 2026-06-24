import { ApiProperty } from '@nestjs/swagger';
import type { Track } from '@prisma/client';

export class TrackDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  duration!: number;

  @ApiProperty({ nullable: true })
  fileUrl!: string | null;

  @ApiProperty({ nullable: true })
  coverUrl!: string | null;

  @ApiProperty()
  playCount!: number;

  @ApiProperty()
  artistId!: string;

  @ApiProperty({ nullable: true })
  albumId!: string | null;

  @ApiProperty()
  createdAt!: Date;

  static from(track: Track): TrackDto {
    const dto = new TrackDto();
    dto.id = track.id;
    dto.title = track.title;
    dto.duration = track.duration;
    dto.fileUrl = track.fileUrl;
    dto.coverUrl = track.coverUrl;
    dto.playCount = track.playCount;
    dto.artistId = track.artistId;
    dto.albumId = track.albumId;
    dto.createdAt = track.createdAt;
    return dto;
  }
}
