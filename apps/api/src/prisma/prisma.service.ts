import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit(): Promise<void> {
    let retries = 5;
    while (retries > 0) {
      try {
        await this.$connect();
        console.log('Database connected successfully');
        return;
      } catch (error) {
        retries--;
        console.log(`Database connection failed, retries left: ${retries}`);
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
