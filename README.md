# Portal Legislativ — Republica Moldova

Stack modern fullstack TypeScript: **React 18 / Next.js 14** + **NestJS 10** + **PostgreSQL 16** + **Elasticsearch 8** + **Redis 7**.

## Structura proiectului

```
portal-legislativ/
├── apps/
│   ├── web/              # Frontend Next.js 14 (App Router, TypeScript)
│   └── api/              # Backend NestJS 10 (REST API, TypeScript)
├── packages/
│   └── shared/           # Tipuri TypeScript + scheme Zod partajate
├── docker-compose.yml    # Toate serviciile containerizate
└── .env.example          # Variabile de mediu necesare
```

## Cerințe

- Node.js >= 20 LTS
- pnpm >= 9.x (`npm install -g pnpm`)
- Docker + Docker Compose

## Pornire rapidă (recomandat cu Docker)

```bash
# 1. Clonează repository
git clone <repo-url> portal-legislativ
cd portal-legislativ

# 2. Copiază variabilele de mediu
cp .env.example .env
# Editează .env cu valorile tale

# 3. Pornește toate serviciile
docker compose up --build

# Portalul: http://localhost:3000
# API:      http://localhost:3001/api
# Swagger:  http://localhost:3001/api/docs
# MinIO:    http://localhost:9001
```

## Pornire manuală (development)

```bash
# Instalare dependențe
pnpm install

# Variabile de mediu
cp .env.example apps/api/.env
cp .env.example apps/web/.env.local

# Pornire servicii externe (PostgreSQL, Redis, Elasticsearch)
docker compose up postgres redis elasticsearch minio -d

# Migrare baza de date
cd apps/api
pnpm db:migrate
pnpm db:seed

# Pornire development (din root)
cd ../..
pnpm dev
```

## Accese default (după seed)

| Serviciu | URL | Credențiale |
|---|---|---|
| Portal public | http://localhost:3000 | — |
| Admin panel | http://localhost:3000/ro/admin | admin@portal.md / Admin@2024! |
| API Swagger | http://localhost:3001/api/docs | — |
| MinIO Console | http://localhost:9001 | minioadmin / minioadmin |

## Stack tehnologic

| Strat | Tehnologie |
|---|---|
| Frontend | React 18 + Next.js 14 App Router |
| UI | Tailwind CSS + shadcn/ui + Radix UI |
| State | Zustand + TanStack Query |
| Formulare | React Hook Form + Zod |
| Editor WYSIWYG | TipTap 2.x |
| Backend | NestJS 10 (Node.js 20) |
| Baza de date | PostgreSQL 16 + Prisma ORM |
| Căutare | Elasticsearch 8 |
| Cache | Redis 7 |
| Auth | JWT httpOnly cookies + Passport.js |
| PDF | Puppeteer (headless Chromium) |
| Fișiere | MinIO (S3-compatible) |
| Email | Nodemailer + React Email |
| Container | Docker + Docker Compose |
| CI/CD | GitHub Actions (configurabil) |
| i18n | next-intl (RO + RU) |

## Comenzi utile

```bash
pnpm dev          # Development (toate aplicațiile în paralel)
pnpm build        # Build producție
pnpm lint         # Lint toate pachetele
pnpm test         # Teste (Vitest)

# API
cd apps/api
pnpm db:migrate   # Aplică migrări Prisma
pnpm db:seed      # Populare date inițiale
pnpm db:studio    # Prisma Studio (UI vizual BD)

# Frontend
cd apps/web
pnpm dev          # Next.js dev server (port 3000)
```

## Structura API (NestJS)

```
/api/auth/register     POST  — Înregistrare
/api/auth/login        POST  — Autentificare
/api/auth/logout       POST  — Deconectare
/api/documents         GET   — Lista documente (public)
/api/documents/:id     GET   — Detalii document
/api/documents/:id/pdf GET   — Descărcare PDF
/api/search/suggest    GET   — Autocomplete căutare
/api/users/favorites   GET   — Favorite utilizator
/api/admin/documents   CRUD  — Management documente (protejat)
/api/files/upload      POST  — Upload fișiere (protejat)
```

## Design sistem

- **Culori primare**: Navy Blue (#0f2557) — identitate guvernamentală
- **Accent**: Amber (#d97706) — highlights și butoane CTA
- **Fundal**: Slate (#f8fafc) — contrast optim
- **Tipografie**: Inter (variable font, subsete latin + latin-ext)
- **Core Web Vitals țintite**: LCP < 2.5s, INP < 200ms, CLS < 0.1
