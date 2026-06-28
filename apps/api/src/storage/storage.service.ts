import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { randomUUID } from 'crypto';
import type { Env } from '../config/env.validation';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: Minio.Client;
  private readonly bucket: string;
  private readonly endpoint: string;
  private readonly port: number;
  private readonly publicUrl: string;

  constructor(private readonly config: ConfigService<Env, true>) {
    this.endpoint = this.config.get('MINIO_ENDPOINT', { infer: true });
    this.port = parseInt(this.config.get('MINIO_PORT', { infer: true }), 10);
    this.bucket = this.config.get('MINIO_BUCKET', { infer: true });
    this.publicUrl = this.config.get('MINIO_PUBLIC_URL', { infer: true });

    this.client = new Minio.Client({
      endPoint: this.endpoint,
      port: this.port,
      useSSL: false,
      accessKey: this.config.get('MINIO_ACCESS_KEY', { infer: true }),
      secretKey: this.config.get('MINIO_SECRET_KEY', { infer: true }),
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      const exists = await this.client.bucketExists(this.bucket);
      if (!exists) {
        await this.client.makeBucket(this.bucket);
        this.logger.log(`Created MinIO bucket: ${this.bucket}`);
      }
    } catch (err) {
      this.logger.warn(`MinIO not reachable at startup — skipping bucket init: ${(err as Error).message}`);
    }
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const objectName = `${folder}/${randomUUID()}-${safeName}`;

    await this.client.putObject(this.bucket, objectName, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });

    // TODO: In production, configure MinIO bucket policy to allow public read
    // or use presigned URLs via getSignedUrl() for each track before returning it.
    // Use the browser-accessible public URL, not the internal MinIO endpoint
    // (which is 'minio' inside Docker and unreachable from the browser).
    return `${this.publicUrl}/${this.bucket}/${objectName}`;
  }

  async deleteFile(objectName: string): Promise<void> {
    await this.client.removeObject(this.bucket, objectName);
  }

  async getSignedUrl(objectName: string, expiry = 3600): Promise<string> {
    return this.client.presignedGetObject(this.bucket, objectName, expiry);
  }
}
