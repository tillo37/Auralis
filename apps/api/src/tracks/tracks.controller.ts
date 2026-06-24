import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TracksService } from './tracks.service';
import { TrackDto } from './dto/track.dto';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

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

  @Post()
  @ApiOperation({ summary: 'Create a new track' })
  @ApiCreatedResponse({ type: TrackDto })
  @ApiNotFoundResponse({ description: 'Album or Artist not found' })
  create(@Body() dto: CreateTrackDto): Promise<TrackDto> {
    return this.tracksService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a track' })
  @ApiOkResponse({ type: TrackDto })
  @ApiNotFoundResponse({ description: 'Track not found' })
  update(@Param('id') id: string, @Body() dto: UpdateTrackDto): Promise<TrackDto> {
    return this.tracksService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a track' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Track not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.tracksService.remove(id);
  }
}
