import { Controller, Get, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TracksService } from './tracks.service';
import { TrackDto } from './dto/track.dto';

@ApiTags('tracks')
@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  @ApiOperation({ summary: 'List all tracks' })
  @ApiOkResponse({ type: TrackDto, isArray: true })
  findAll(): Promise<TrackDto[]> {
    return this.tracksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get track by id' })
  @ApiOkResponse({ type: TrackDto })
  @ApiNotFoundResponse({ description: 'Track not found' })
  findOne(@Param('id') id: string): Promise<TrackDto> {
    return this.tracksService.findOne(id);
  }
}
