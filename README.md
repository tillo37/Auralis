# Auralis

A music streaming platform built with Next.js, NestJS, and PostgreSQL.

## Architecture

```
auralis/
├── apps/
│   ├── web/           # Next.js 15 frontend (port 3000)
│   └── api/           # NestJS backend (port 3001)
├── packages/
│   ├── shared-types/  # Shared TypeScript types
│   └── eslint-config/ # Shared ESLint configuration
├── prisma/            # Database schema and migrations
├── docker/            # Dockerfiles
├── docker-compose.yml
├── pnpm-workspace.yaml
└── .env.example
```

## Environment Setup

```bash
cp .env.example .env
```

| Variable              | Description                        |
|-----------------------|------------------------------------|
| `DATABASE_URL`        | PostgreSQL connection string       |
| `JWT_SECRET`          | JWT signing secret (min 16 chars)  |
| `NEXT_PUBLIC_API_URL` | Backend URL for the frontend       |

The API validates all required variables at startup and exits with a clear error if any are missing.

## Prerequisites

- Node.js >= 20
- pnpm >= 9
- Docker & Docker Compose

## Development Workflow

```bash
# Install dependencies
pnpm install

# Start PostgreSQL
docker compose up -d

# Start API + Web in parallel
pnpm dev
```

### Individual services

```bash
pnpm --filter @auralis/api dev   # API on :3001
pnpm --filter @auralis/web dev   # Web on :3000
```

## Database (Prisma)

| Script                    | Description                         |
|---------------------------|-------------------------------------|
| `pnpm db:generate`        | Generate Prisma client              |
| `pnpm db:migrate`         | Create and apply dev migration      |
| `pnpm db:migrate:deploy`  | Apply migrations (production)       |
| `pnpm db:studio`          | Open Prisma Studio                  |
| `pnpm db:seed`            | Seed the database                   |

### Migration workflow

1. Edit `prisma/schema.prisma`
2. Run `pnpm db:migrate` — creates a migration file and applies it
3. Commit the generated migration alongside schema changes
4. In CI/production use `pnpm db:migrate:deploy`

## Swagger / OpenAPI

Interactive docs are served at **`/api/docs`** when the API is running:

```
http://localhost:3001/api/docs
```

## API Endpoints

All endpoints are versioned under `/api/v1`:

| Method | Path           | Description  |
|--------|----------------|--------------|
| GET    | /api/v1/health | Health check |

## Build & Quality

```bash
pnpm build      # Build all packages
pnpm typecheck  # Type check all packages
pnpm lint       # Lint all packages
```
