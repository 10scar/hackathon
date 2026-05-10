<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

### Architecture

Single Next.js 16 app (App Router, React 19) with Supabase (Auth + PostgreSQL) and Prisma ORM. No monorepo, no Docker Compose.

### Local Supabase

The app requires a running local Supabase instance (provides Auth + PostgreSQL). Start it with:

```
supabase start   # from repo root; requires Docker running
```

After `supabase start`, grab credentials from `supabase status` and populate `.env.local` and `.env`:

- `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `DATABASE_URL`, `DIRECT_URL`
- `.env`: `DATABASE_URL`, `DIRECT_URL` (used by Prisma CLI via `prisma.config.ts` + `dotenv/config`)

The database connection string follows the pattern: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`

### Prisma

After starting Supabase, push the schema before running the app:

```
npx prisma db push
npx prisma generate   # only needed after schema changes
```

### Running the app

```
npm run dev   # starts Next.js on port 3000
```

### Lint / Build

```
npm run lint   # eslint (note: repo has pre-existing lint errors in page.tsx and middleware.ts)
npm run build  # production build
```

### Gotchas

- The Supabase publishable key env var is `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (not `ANON_KEY`).
- Prisma uses a `pg` Pool adapter (not the default Prisma engine), configured in `src/lib/prisma.ts`.
- Registration auto-seeds demo data via `src/lib/seeding/inject.ts`.
- No Prisma migrations directory exists; the project uses `prisma db push` for schema sync.
- Docker must be running before `supabase start`; on Cloud VMs, dockerd needs the fuse-overlayfs storage driver and iptables-legacy workarounds.
