# Ad Creative Variation Engine (ACVE)

A cloud-native creative production and governance platform that transforms approved ad concepts into scalable, multi-channel, deployment-ready advertising assets.

## What It Does

ACVE replaces fragmented creative workflows — AI generation, manual review, template scripting, file exports, manual uploads — with a unified, metadata-driven creative supply chain.

**Input:** Structured creative briefs and approved concepts
**Output:** Rendered, version-controlled, cost-transparent, API-deployable advertising at scale

## Architecture

```
Turborepo Monorepo
├── apps/
│   ├── web/          → Next.js 14+ (App Router) — UI + API routes
│   └── worker/       → BullMQ background processor — rendering, deployment, ingestion
├── packages/
│   ├── shared/       → Zod schemas, TypeScript types, constants, utilities
│   ├── db/           → Drizzle ORM — PostgreSQL schemas, migrations, client
│   └── ai/           → Pluggable AI providers (Claude + OpenAI via Vercel AI SDK)
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict) |
| Database | PostgreSQL 16 |
| ORM | Drizzle |
| Validation | Zod |
| UI | shadcn/ui + Tailwind CSS |
| State | Zustand |
| Auth | Auth.js v5 |
| Job Queue | BullMQ + Redis |
| AI | Vercel AI SDK (OpenAI + Anthropic) |
| File Storage | S3-compatible (MinIO for dev) |
| Testing | Vitest + Playwright |
| Monorepo | Turborepo |

## Core Capabilities

- **AI Creative Variation** — Generate hundreds of ad variants from structured briefs
- **Weighted Approval Workflows** — Team-based voting with configurable thresholds and veto authority
- **Production Orchestration** — Automated validation, template selection, and render queue management
- **Cloud Rendering** — Parallel multi-format export with cost tracking
- **Direct Platform Deployment** — API integration with Meta, TikTok, Google Ads, and LinkedIn
- **Performance Intelligence** — Creative-level analytics with fatigue detection and regeneration triggers
- **Cost Governance** — Full transparency into AI generation and rendering costs per asset

## Roadmap

| Phase | Focus | Status |
|---|---|---|
| 1 | Foundation — Creative data model, variant generation, brief intake, review UI | Scaffold |
| 2 | Governance & Production — Weighted voting, orchestrator, templates, cloud rendering | Planned |
| 3 | Deployment & Intelligence — Ad platform APIs, performance ingestion, creative intelligence | Planned |
| 4 | Enterprise Scale — Cost governance, localization, dependency graph, multi-agent, RBAC/SSO | Planned |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for PostgreSQL + Redis)

### Setup

```bash
# Clone
git clone https://github.com/francesca-tabor-ai/Ad-Creative-Variation-Engine.git
cd Ad-Creative-Variation-Engine

# Install dependencies
pnpm install

# Start PostgreSQL + Redis
docker compose up -d

# Copy environment variables
cp .env.example .env

# Generate database schema
pnpm db:generate

# Run migrations
pnpm db:migrate

# Start development
pnpm dev
```

### Environment Variables

Copy `.env.example` and fill in your values:

```
DATABASE_URL=postgresql://acve:acve@localhost:5432/acve
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
NEXTAUTH_SECRET=<generate-a-secret>
NEXTAUTH_URL=http://localhost:3000
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=acve-assets
```

## Project Structure

```
.
├── apps/
│   ├── web/                        # Next.js application
│   │   └── src/
│   │       ├── app/                # App Router pages + API routes
│   │       ├── components/         # React components
│   │       └── lib/                # Auth, store, API client
│   └── worker/                     # Background job processor
│       └── src/
│           ├── queues/             # BullMQ queue definitions
│           └── processors/         # Job handlers
├── packages/
│   ├── shared/                     # Shared across all apps
│   │   └── src/
│   │       ├── schemas/            # Zod validation schemas
│   │       ├── types/              # TypeScript types
│   │       ├── constants/          # Enums and constants
│   │       └── utils/              # Shared utilities
│   ├── db/                         # Database layer
│   │   └── src/
│   │       ├── schema/             # Drizzle table definitions
│   │       └── client.ts           # DB client
│   └── ai/                         # AI provider layer
│       └── src/
│           ├── providers/          # OpenAI, Anthropic configs
│           └── services/           # Generation, parsing, cost estimation
├── docker-compose.yml
├── turbo.json
└── package.json
```

## License

Proprietary. All rights reserved.
