import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUrl, Min, MinLength } from 'class-validator';

export class CreateTrackDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  title!: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  duration!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl({ require_tld: false })
  fileUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl({ require_tld: false })
  coverUrl?: string;

  @ApiProperty()
  @IsString()
  artistId!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  albumId?: string;
}
