import { ApiProperty } from '@nestjs/swagger';
import type { Track } from '@prisma/client';

export class TrackDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  albumId!: string;

  @ApiProperty()
  artistId!: string;

  @ApiProperty()
  trackNumber!: number;

  @ApiProperty()
  durationSeconds!: number;

  @ApiProperty({ nullable: true })
  audioUrl!: string | null;

  @ApiProperty()
  createdAt!: Date;

  static from(track: Track): TrackDto {
    const dto = new TrackDto();
    dto.id = track.id;
    dto.title = track.title;
    dto.albumId = track.albumId;
    dto.artistId = track.artistId;
    dto.trackNumber = track.trackNumber;
    dto.durationSeconds = track.durationSeconds;
    dto.audioUrl = track.audioUrl;
    dto.createdAt = track.createdAt;
    return dto;
  }
}
