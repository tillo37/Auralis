import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(16),
  PORT: z.string().optional().default('3001'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .optional()
    .default('development'),
  MINIO_ENDPOINT: z.string().optional().default('localhost'),
  MINIO_PORT: z.string().optional().default('9000'),
  MINIO_ACCESS_KEY: z.string().optional().default('minioadmin'),
  MINIO_SECRET_KEY: z.string().optional().default('minioadmin'),
  MINIO_BUCKET: z.string().optional().default('auralis'),
  MINIO_PUBLIC_URL: z.string().default('http://localhost:9000'),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    const errors = result.error.issues
      .map((i) => `  ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`Environment validation failed:\n${errors}`);
  }
  return result.data;
}
