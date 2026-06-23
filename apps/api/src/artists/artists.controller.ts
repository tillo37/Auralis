import { Controller, Get, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ArtistsService } from './artists.service';
import { ArtistDto } from './dto/artist.dto';

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
}
