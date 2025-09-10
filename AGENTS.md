# Repository Guidelines

## Scope & Exclusions
- Ignore `mustafasarisin-com/` — it is out of scope for this project. Do not edit, refactor, or include changes from this folder in PRs.
- Run commands and add code only for the main app at the repo root (e.g., `app/`, `drizzle/`, `server.ts`).

## Project Structure & Module Organization
- App code: `app/` (routes in `app/routes`, UI in `app/components`, domain in `app/models`, utilities in `app/utils`).
- Server entry: `server.ts` (Express + React Router v7 SSR).
- Assets: `public/`; styles: `tailwind.config.ts`, `app/app.css`.
- Database: `drizzle/` (schema, seeds, migrations via Drizzle); config in `drizzle.config.ts`.
- Config/env: `.env` (see `.env.example`).

## Build, Test, and Development Commands
- `pnpm dev` — start local server with HMR (requires Postgres running; e.g. `docker compose up`).
- `pnpm build` — production build via React Router.
- `pnpm start` — run built app with `react-router-serve`.
- `pnpm typecheck` — generate route types and run TypeScript.
- Drizzle: `pnpm drizzle:generate`, `pnpm drizzle:migrate`, `pnpm drizzle:push`, `pnpm drizzle:studio`, `pnpm drizzle:seed`.
- DB smoke test: `pnpm tsx test-connection.ts`.

## Coding Style & Naming Conventions
- Language: TypeScript, React 19, React Router v7.
- Format: Prettier (`pnpm format`); 2-space indent; no semicolons required by Prettier.
- Tailwind: use utility-first classes; keep class lists ordered logically.
- Files: `kebab-case.ts/tsx` (e.g., `theme-toggle.tsx`); route segments follow router patterns (e.g., `_layout.tsx`, `_auth.tsx`).
- Components: named exports preferred; colocate small helpers near usage in `app/**`.

## Testing Guidelines
- No test framework is configured yet. If adding tests, prefer Vitest + React Testing Library.
- Name tests `*.test.ts(x)` near sources or under `tests/`.
- Ensure DB interactions are isolated; use seed data in `drizzle/seed.ts` or mock layers.

## Commit & Pull Request Guidelines
- Use Conventional Commits where possible: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`; optional scope: `feat(auth): ...`.
- PRs: include a concise summary, linked issues, screenshots/GIFs for UI changes, and notes for DB changes (migrations/seeds and rollback plan).
- Run `pnpm typecheck` and `pnpm format` before opening a PR.

## Security & Configuration Tips
- Never commit `.env`; base on `.env.example`. Required DB vars: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, optional `DB_SSL`.
- For local Postgres, use `docker compose up`; apply migrations before running: `pnpm drizzle:update`.
- Node >= `22` and `pnpm` are required (see `package.json`).
