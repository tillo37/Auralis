import { Controller, Get, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AlbumsService } from './albums.service';
import { AlbumDto } from './dto/album.dto';

@ApiTags('albums')
@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  @ApiOperation({ summary: 'List all albums' })
  @ApiOkResponse({ type: AlbumDto, isArray: true })
  findAll(): Promise<AlbumDto[]> {
    return this.albumsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get album by id' })
  @ApiOkResponse({ type: AlbumDto })
  @ApiNotFoundResponse({ description: 'Album not found' })
  findOne(@Param('id') id: string): Promise<AlbumDto> {
    return this.albumsService.findOne(id);
  }
}
