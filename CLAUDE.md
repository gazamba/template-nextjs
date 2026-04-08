@AGENTS.md

## Project overview

Next.js 16 SaaS starter template with authentication, billing, analytics, error tracking, caching, and vector search — all pre-wired and ready to build on.

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** Neon PostgreSQL via Drizzle ORM
- **Auth:** better-auth (email/password)
- **Billing:** Stripe (checkout sessions, webhook handling, subscriptions)
- **Analytics:** PostHog (client + server)
- **Error tracking:** Sentry (client, server, edge)
- **Cache/Rate limiting:** Upstash Redis
- **Vector DB:** Pinecone
- **Email:** Resend
- **Env validation:** Zod (lazy proxy, server/client split)
- **Build:** Turborepo

## Project structure

```
app/                        # Next.js App Router
  api/
    auth/[...all]/route.ts  # better-auth catch-all handler
    stripe/
      checkout/route.ts     # Stripe checkout session creation
      webhook/route.ts      # Stripe webhook handler
  providers.tsx             # Client-side providers (PostHog)
  layout.tsx                # Root layout

components/
  ui/                       # Shared UI components

lib/
  analytics/                # PostHog server client
  auth/                     # better-auth config, client, schema
  billing/                  # Stripe client, subscription schema
  cache/                    # Upstash Redis, rate limiter
  db/                       # Drizzle ORM + Neon connection
  env/                      # Zod env validation (server.ts, client.ts)
  vector/                   # Pinecone client

scripts/
  generate-env-example.ts   # Auto-generates .env.example from Zod schema

sentry.client.config.ts     # Sentry client init
sentry.server.config.ts     # Sentry server init
sentry.edge.config.ts       # Sentry edge init
instrumentation.ts          # Next.js instrumentation (Sentry registration)
instrumentation-client.ts   # Client-side instrumentation
```

## Conventions

- **Imports:** Always use the `@/` path alias (e.g., `@/lib/auth/auth`). No relative imports.
- **Env vars:** Never use `process.env` directly. Use `env` from `@/lib/env/server` (server-side) or `clientEnv` from `@/lib/env/client` (client-side). Add new vars to the schema in `lib/env/server.ts`.
- **Components:** Shared components go in `components/`. Feature-specific components go in `_components/` co-located within route groups.
- **Exports:** Use named exports, not default exports. camelCase naming.
- **Database schema:** Drizzle `pgTable` with text IDs, `timestamp` fields with `defaultNow()` and `$onUpdate()`. Define relations separately.

## Commands

```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm lint             # Run ESLint
pnpm db:generate      # Generate Drizzle migrations
pnpm db:migrate       # Run migrations
pnpm db:push          # Push schema to database
pnpm db:studio        # Open Drizzle Studio
pnpm env:example      # Regenerate .env.example from Zod schema
```
