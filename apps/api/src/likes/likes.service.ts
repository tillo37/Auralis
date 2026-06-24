import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TrackDto } from '../tracks/dto/track.dto';

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) {}

  async getLikedTracks(userId: string): Promise<TrackDto[]> {
    const rows = await this.prisma.likedTrack.findMany({
      where: { userId },
      include: { track: true },
      orderBy: { likedAt: 'desc' },
    });
    return rows.map((r) => TrackDto.from(r.track));
  }

  async likeTrack(userId: string, trackId: string): Promise<void> {
    const track = await this.prisma.track.findUnique({ where: { id: trackId } });
    if (!track) throw new NotFoundException(`Track ${trackId} not found`);

    const existing = await this.prisma.likedTrack.findUnique({
      where: { userId_trackId: { userId, trackId } },
    });
    if (existing) throw new ConflictException('Track already liked');

    await this.prisma.likedTrack.create({ data: { userId, trackId } });
  }

  async unlikeTrack(userId: string, trackId: string): Promise<void> {
    const existing = await this.prisma.likedTrack.findUnique({
      where: { userId_trackId: { userId, trackId } },
    });
    if (!existing) throw new NotFoundException('Track not in liked tracks');

    await this.prisma.likedTrack.delete({
      where: { userId_trackId: { userId, trackId } },
    });
  }

  async isLiked(userId: string, trackId: string): Promise<boolean> {
    const record = await this.prisma.likedTrack.findUnique({
      where: { userId_trackId: { userId, trackId } },
    });
    return !!record;
  }
}
