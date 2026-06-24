import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ArtistsService } from './artists.service';
import { ArtistDto } from './dto/artist.dto';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@ApiTags('artists')
@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  @ApiOperation({ summary: 'List all artists' })
  @ApiOkResponse({ type: ArtistDto, isArray: true })
  findAll(): Promise<ArtistDto[]> {
    return this.artistsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get artist by id' })
  @ApiOkResponse({ type: ArtistDto })
  @ApiNotFoundResponse({ description: 'Artist not found' })
  findOne(@Param('id') id: string): Promise<ArtistDto> {
    return this.artistsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new artist' })
  @ApiCreatedResponse({ type: ArtistDto })
  create(@Body() dto: CreateArtistDto): Promise<ArtistDto> {
    return this.artistsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an artist' })
  @ApiOkResponse({ type: ArtistDto })
  @ApiNotFoundResponse({ description: 'Artist not found' })
  update(@Param('id') id: string, @Body() dto: UpdateArtistDto): Promise<ArtistDto> {
    return this.artistsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an artist' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Artist not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.artistsService.remove(id);
  }
}
