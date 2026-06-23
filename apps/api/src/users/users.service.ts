import { Injectable, NotFoundException } from '@nestjs/common';
import type { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type UserPublic = Omit<User, 'passwordHash'>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UserPublic> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.strip(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByEmailWithHash(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  strip(user: User): UserPublic {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...rest } = user;
    return rest;
  }
}
