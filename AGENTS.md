# AGENTS.md

## Cursor Cloud specific instructions

### Product overview

Yarn workspaces + Turborepo monorepo for **george.barbu.es**: a Next.js web CV site (`apps/web`) and an Expo native app (`apps/native`). Resume content is loaded from **Sanity GraphQL** (hosted); PDFs use **Vercel Blob**. There is no backend in this repo.

### Environment variables (required for web)

Next.js validates env at startup via `apps/web/env.ts` and `packages/env`. Create **`apps/web/.env.local`** (gitignored) with all `NEXT_PUBLIC_*` keys from `packages/env/src/schema.ts` plus web-only fields in `apps/web/env.ts`. Without this file, `yarn web:dev` / `yarn web:build` will throw on missing variables.

For local dev, set `NEXT_PUBLIC_API_URL=http://localhost:3000`. Other values match production (they are already embedded in the public client bundle on https://george.barbu.es) or can be supplied via Cursor secrets.

### Node / Yarn

- Use **Node 20+** (Node 22 works in Cloud).
- Pin **Yarn 1.22.19** via Corepack: `corepack prepare yarn@1.22.19 --activate` (see root `packageManager` in `package.json`).

### Web app (primary dev surface)

| Task | Command (from repo root) |
|------|---------------------------|
| Install deps | `yarn install` (runs `apps/web` `postinstall` font copy) |
| Dev server | `yarn web:dev` → http://localhost:3000 |
| Lint | `yarn web:lint` |
| Build | `yarn web:build` |
| Production serve | `yarn web:start` (after build) |

**Sanity** is remote only—no local CMS container. Smoke-test a CMS-backed page: `/frontend-platform-lead` or `/senior-frontend-engineer`.

**PDF pipeline** (`yarn web:pdf:dev`, `yarn web:pdf:blob`) needs Puppeteer/Chromium and valid Vercel Blob tokens; not required for basic resume viewing.

### Native app (optional)

| Task | Command |
|------|---------|
| Expo web | `yarn native:web` |
| Expo dev | `yarn workspace native dev` |

Requires `apps/native/.env` with the shared Sanity `NEXT_PUBLIC_*` keys (see `apps/native/env.ts`).

### Run both apps

`yarn dev` (Turborepo) starts web + native dev together.

### Gotchas

- `yarn web:postinstall` copies fonts to `apps/web/public/fonts`; if fonts are missing, run it explicitly.
- Apollo client hardcodes Sanity GraphQL dataset path `production` in `packages/libs/src/graphql/apolloClient.ts` (independent of `NEXT_PUBLIC_SANITY_DATASET` for the URL).
- No automated test suite in the repo; verify with lint, build, and manual/browser checks on resume routes.
