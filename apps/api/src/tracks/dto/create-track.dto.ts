import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUrl, Min, MinLength } from 'class-validator';

export class CreateTrackDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  title!: string;

  @ApiProperty()
  @IsString()
  albumId!: string;

  @ApiProperty()
  @IsString()
  artistId!: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  trackNumber!: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  durationSeconds!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  audioUrl?: string;
}
