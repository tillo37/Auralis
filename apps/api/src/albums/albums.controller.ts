import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AlbumsService } from './albums.service';
import { AlbumDto } from './dto/album.dto';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

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

  @Post()
  @ApiOperation({ summary: 'Create a new album' })
  @ApiCreatedResponse({ type: AlbumDto })
  @ApiNotFoundResponse({ description: 'Artist not found' })
  create(@Body() dto: CreateAlbumDto): Promise<AlbumDto> {
    return this.albumsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an album' })
  @ApiOkResponse({ type: AlbumDto })
  @ApiNotFoundResponse({ description: 'Album not found' })
  update(@Param('id') id: string, @Body() dto: UpdateAlbumDto): Promise<AlbumDto> {
    return this.albumsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an album' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Album not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.albumsService.remove(id);
  }
}
