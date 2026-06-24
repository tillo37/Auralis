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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PlaylistsService } from './playlists.service';
import { PlaylistDto } from './dto/playlist.dto';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AddTrackDto } from './dto/add-track.dto';

@ApiTags('playlists')
@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Get()
  @ApiOperation({ summary: 'List all playlists' })
  @ApiOkResponse({ type: PlaylistDto, isArray: true })
  findAll(): Promise<PlaylistDto[]> {
    return this.playlistsService.findAll();
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "List current user's playlists" })
  @ApiOkResponse({ type: PlaylistDto, isArray: true })
  findMine(@CurrentUser() userId: string): Promise<PlaylistDto[]> {
    return this.playlistsService.findByOwner(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get playlist by id' })
  @ApiOkResponse({ type: PlaylistDto })
  @ApiNotFoundResponse()
  findOne(@Param('id') id: string): Promise<PlaylistDto> {
    return this.playlistsService.findOne(id);
  }

  @Get(':id/tracks')
  @ApiOperation({ summary: 'Get tracks in playlist' })
  @ApiOkResponse({ description: 'Playlist tracks with track data' })
  @ApiNotFoundResponse()
  getTracks(@Param('id') id: string) {
    return this.playlistsService.getTracks(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a playlist' })
  @ApiCreatedResponse({ type: PlaylistDto })
  create(
    @CurrentUser() userId: string,
    @Body() dto: CreatePlaylistDto,
  ): Promise<PlaylistDto> {
    return this.playlistsService.create(userId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update playlist metadata' })
  @ApiOkResponse({ type: PlaylistDto })
  @ApiNotFoundResponse()
  update(
    @Param('id') id: string,
    @CurrentUser() userId: string,
    @Body() dto: UpdatePlaylistDto,
  ): Promise<PlaylistDto> {
    return this.playlistsService.update(id, userId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a playlist' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  remove(@Param('id') id: string, @CurrentUser() userId: string): Promise<void> {
    return this.playlistsService.remove(id, userId);
  }

  @Post(':id/tracks')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Add a track to playlist' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  addTrack(
    @Param('id') id: string,
    @CurrentUser() userId: string,
    @Body() dto: AddTrackDto,
  ): Promise<void> {
    return this.playlistsService.addTrack(id, dto.trackId, userId);
  }

  @Delete(':id/tracks/:trackId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a track from playlist' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  removeTrack(
    @Param('id') id: string,
    @Param('trackId') trackId: string,
    @CurrentUser() userId: string,
  ): Promise<void> {
    return this.playlistsService.removeTrack(id, trackId, userId);
  }
}
