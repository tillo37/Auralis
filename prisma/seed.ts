import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Seeding database...');

  const demo = await prisma.user.upsert({
    where: { email: 'demo@auralis.app' },
    update: {},
    create: {
      email: 'demo@auralis.app',
      username: 'demo',
      // bcrypt hash of "Demo1234!" — replace with real hashing in auth implementation
      passwordHash:
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lewwd4h5WJeHaIFde',
      displayName: 'Demo User',
      isVerified: true,
    },
  });

  console.log(`Upserted demo user: ${demo.email} (id: ${demo.id})`);
  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
