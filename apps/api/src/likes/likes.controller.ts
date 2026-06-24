import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { LikesService } from './likes.service';
import { TrackDto } from '../tracks/dto/track.dto';

@ApiTags('likes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all liked tracks for current user' })
  @ApiOkResponse({ type: TrackDto, isArray: true })
  getLikedTracks(@CurrentUser() userId: string): Promise<TrackDto[]> {
    return this.likesService.getLikedTracks(userId);
  }

  @Post(':trackId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Like a track' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  likeTrack(
    @CurrentUser() userId: string,
    @Param('trackId') trackId: string,
  ): Promise<void> {
    return this.likesService.likeTrack(userId, trackId);
  }

  @Delete(':trackId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Unlike a track' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  unlikeTrack(
    @CurrentUser() userId: string,
    @Param('trackId') trackId: string,
  ): Promise<void> {
    return this.likesService.unlikeTrack(userId, trackId);
  }
}
