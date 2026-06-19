# Auralis

A music streaming platform built with Next.js, NestJS, and PostgreSQL.

## Folder Structure

```
auralis/
├── apps/
│   ├── web/          # Next.js 15 frontend (port 3000)
│   └── api/          # NestJS backend (port 3001)
├── packages/
│   ├── shared-types/ # Shared TypeScript types
│   └── eslint-config/# Shared ESLint configuration
├── prisma/           # Database schema and migrations
├── docs/             # Documentation
├── docker/           # Dockerfiles
├── docker-compose.yml
├── pnpm-workspace.yaml
└── .env.example
```

## Prerequisites

- Node.js >= 20
- pnpm >= 9
- Docker & Docker Compose

## Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
```

## Local Development

### Start everything with Docker

```bash
docker compose up
```

Services:
- Web: http://localhost:3000
- API: http://localhost:3001
- PostgreSQL: localhost:5432

### Start services individually

```bash
# API (requires PostgreSQL running)
cd apps/api && pnpm dev

# Frontend
cd apps/web && pnpm dev
```

### Database

```bash
# Apply Prisma schema
pnpm dlx prisma migrate dev --schema=prisma/schema.prisma

# Open Prisma Studio
pnpm dlx prisma studio --schema=prisma/schema.prisma
```

## API Endpoints

| Method | Path    | Description  |
|--------|---------|--------------|
| GET    | /health | Health check |

## Scripts

```bash
# Build all packages
pnpm build

# Type check all packages
pnpm typecheck

# Lint all packages
pnpm lint
```
