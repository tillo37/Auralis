import { ApiProperty } from '@nestjs/swagger';
import type { Artist } from '@prisma/client';

export class ArtistDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ nullable: true })
  bio!: string | null;

  @ApiProperty({ nullable: true })
  avatarUrl!: string | null;

  @ApiProperty()
  verified!: boolean;

  @ApiProperty()
  createdAt!: Date;

  static from(artist: Artist): ArtistDto {
    const dto = new ArtistDto();
    dto.id = artist.id;
    dto.name = artist.name;
    dto.bio = artist.bio;
    dto.avatarUrl = artist.avatarUrl;
    dto.verified = artist.verified;
    dto.createdAt = artist.createdAt;
    return dto;
  }
}
