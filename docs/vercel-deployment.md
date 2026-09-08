# Vercel Deployment Guide — CSEReviewerPH

This guide outlines how to deploy the Philippine Exam Reviewer Platform (**CSEReviewerPH**) to [Vercel](https://vercel.com) with PostgreSQL (Neon, Supabase, or Vercel Postgres).

---

## 1. Quick Deploy via Vercel Dashboard

1. Push your repository to GitHub / GitLab / Bitbucket.
2. In the [Vercel Dashboard](https://vercel.com/new), select **Add New... > Project** and import the `CSEReviewerPH` repository.
3. Vercel will automatically detect **Next.js** framework preset via `vercel.json` and `next.config.ts`.
4. Configure the environment variables (see below).
5. Click **Deploy**.

---

## 2. Environment Variables in Vercel

Under **Project Settings > Environment Variables**, configure the following:

| Variable | Environment | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` or `POSTGRES_URL` | Production, Preview | PostgreSQL connection URI with SSL enabled (e.g. Neon, Supabase, Vercel Postgres) |
| `NEXT_PUBLIC_APP_URL` | Production | Canonical production domain (e.g. `https://csereviewer.ph`). *Preview deployments automatically fallback to `https://${VERCEL_URL}`.* |
| `BETTER_AUTH_SECRET` | Production, Preview | 32+ character random secret string |
| `BETTER_AUTH_URL` | Production | Canonical auth callback domain (optional if `NEXT_PUBLIC_APP_URL` is configured) |
| `DB_POOL_MAX` | Production, Preview | Maximum pool connections per serverless lambda instance (defaults to `5`) |
| `NEXT_PUBLIC_POSTHOG_KEY` | Production | PostHog API Key (optional during preview) |
| `NEXT_PUBLIC_SENTRY_DSN` | Production | Sentry DSN (optional during preview) |

---

## 3. Database Provisioning & Migrations

CSEReviewerPH uses Drizzle ORM. Before or immediately after your first deploy, run migrations against your production PostgreSQL instance:

### Option A: Using Vercel CLI (Recommended)
```bash
# Link project and pull remote environment variables
npx vercel link
npx vercel env pull .env.local

# Run Drizzle migrations
npm run db:migrate

# Seed initial CSE examination structure & curriculum
npm run db:seed
```

### Option B: Direct Connection
```bash
DATABASE_URL="your-production-postgres-url" npm run db:migrate
DATABASE_URL="your-production-postgres-url" npm run db:seed
```

---

## 4. Serverless Architecture Features

- **Serverless Connection Pooling**: `src/db/index.ts` maintains a global connection pool across warm lambda executions and sets sensible connection limits (`max: 5`) to prevent database connection exhaustion.
- **SSL Auto-Negotiation**: Automatically configures TLS/SSL (`rejectUnauthorized: false`) when connecting to remote cloud database providers like Neon, Supabase, and AWS RDS.
- **Dynamic Preview URLs**: Automatically derives root URLs on ephemeral branch previews using `VERCEL_URL`.
- **Bundler Optimization**: `next.config.ts` declares `@electric-sql/pglite` and `pg` as `serverExternalPackages` to avoid bundling issues with WebAssembly and native modules.
- **Production Security Headers**: Includes HSTS, `X-Frame-Options`, `X-Content-Type-Options`, and `Referrer-Policy`.
- **Deployment Health Check**: `/api/health` returns status code 200 and connectivity diagnostic information for automated uptime monitors.
