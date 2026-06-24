import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new track' })
  @ApiCreatedResponse({ type: TrackDto })
  @ApiNotFoundResponse({ description: 'Artist or Album not found' })
  create(@Body() dto: CreateTrackDto): Promise<TrackDto> {
    return this.tracksService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a track' })
  @ApiOkResponse({ type: TrackDto })
  @ApiNotFoundResponse({ description: 'Track not found' })
  update(@Param('id') id: string, @Body() dto: UpdateTrackDto): Promise<TrackDto> {
    return this.tracksService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a track' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Track not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.tracksService.remove(id);
  }

  @Post(':id/play')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Increment play count' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Track not found' })
  play(@Param('id') id: string): Promise<void> {
    return this.tracksService.incrementPlayCount(id);
  }
}
