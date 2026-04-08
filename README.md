# Next.js SaaS Starter

A production-ready Next.js 16 SaaS starter template with authentication, billing, analytics, error tracking, and more — pre-wired so you can focus on building your product.

## Stack

| Category | Technology |
|----------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router), React 19, TypeScript |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Database | [Neon](https://neon.tech) PostgreSQL + [Drizzle ORM](https://orm.drizzle.team) |
| Auth | [better-auth](https://www.better-auth.com) (email/password) |
| Billing | [Stripe](https://stripe.com) (subscriptions, checkout, webhooks) |
| Analytics | [PostHog](https://posthog.com) (client + server) |
| Error Tracking | [Sentry](https://sentry.io) (client, server, edge) |
| Cache | [Upstash](https://upstash.com) Redis + rate limiting |
| Vector DB | [Pinecone](https://pinecone.io) |
| Email | [Resend](https://resend.com) |
| Env Validation | [Zod](https://zod.dev) (type-safe, lazy validation) |
| Build | [Turborepo](https://turbo.build) |

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/gazamba/template-nextjs.git
cd template-nextjs
pnpm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in your credentials. See `.env.example` for descriptions of each variable.

### 3. Set up the database

```bash
pnpm db:push
```

### 4. Start developing

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  api/
    auth/[...all]/          # Auth API (better-auth)
    stripe/checkout/        # Stripe checkout session
    stripe/webhook/         # Stripe webhook handler
  providers.tsx             # Client providers (PostHog)
  layout.tsx                # Root layout

components/
  ui/                       # Shared UI components

lib/
  analytics/                # PostHog server client
  auth/                     # Auth config, client, DB schema
  billing/                  # Stripe client, subscription schema
  cache/                    # Redis client, rate limiter
  db/                       # Database connection (Drizzle + Neon)
  env/                      # Type-safe env validation (server + client)
  vector/                   # Pinecone vector DB client

scripts/
  generate-env-example.ts   # Auto-generate .env.example from schema
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm lint` | Run ESLint |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:push` | Push schema directly to database |
| `pnpm db:studio` | Open Drizzle Studio GUI |
| `pnpm env:example` | Regenerate `.env.example` from Zod schema |

## Environment Variables

All env vars are validated at runtime using Zod with lazy evaluation. The schema is the single source of truth — types, validation, error messages, and `.env.example` all derive from it.

- **Server-side:** `import { env } from "@/lib/env/server"`
- **Client-side:** `import { clientEnv } from "@/lib/env/client"`

Never use `process.env` directly. After adding a new variable, update the schema in `lib/env/server.ts` and run `pnpm env:example` to regenerate the example file.

## License

MIT
