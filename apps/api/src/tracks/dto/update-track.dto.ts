import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUrl, Min, MinLength } from 'class-validator';

export class UpdateTrackDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  fileUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  coverUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  artistId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  albumId?: string;
}
