# Repository Guidelines

## Project Structure & `M`odule Organization

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
- Strict types: avoid `any`. Use Zod inference and shared types (`ContentEntry<T>`) from `app/cms/types`. Narrow unknowns via runtime checks instead of casting.
- JSX readability: avoid nested/inline ternaries in route components. Compute values first, use boolean guards (`cond && <El/>`) or extract small subcomponents.
- Drizzle models: in UI/read paths, use `Select*` types (e.g., `SelectUser`) rather than `Insert*` to avoid optionals leaking into view code.

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

## TypeScript Rules

### Type Checking & Compilation

- ALWAYS run `pnpm run typecheck` for type checks (includes `--noEmit`).
- If using `tsc` directly, include `--noEmit`.
- NEVER emit JS during checks. Do not run `tsc` without `--noEmit`.

Correct usage:

```bash
# Correct
pnpm run typecheck
tsc --noEmit

# Wrong – creates .js files and pollutes the repo
tsc
tsc some/file.ts
```

Why: emitting JavaScript bypasses the build system and pollutes source with `.js` files.

### Imports

- Imported types go at the very top of the file.

### Basic Principles

- Use English for code/docs; prefer complete words over abbreviations.
- Declare types for variables, params, and return values; avoid `any`.
- Create new types only when necessary; prefer existing types and Zod inference.
- Use JSDoc for public functions/classes; no blank lines inside functions.
- One export per file.

### Nomenclature

- Classes: PascalCase. Variables/functions/methods: camelCase. Files/dirs: kebab-case.
- ENV vars: UPPERCASE. Avoid magic numbers; define constants.
- Boolean names use verbs: `isLoading`, `hasError`, `canDelete`.
- Allowed abbreviations: API, URL; well-known: i/j (loops), err, ctx, req/res/next.
- Prefix internal helpers with `_` (not for class methods).

### Functions

- Keep functions short and single-purpose (<20 instructions).
- Names: verb-first (`getX`, `saveX`, `isX`, `hasX`, `canX`).
- Strongly prefer early returns and guard clauses; keep indentation shallow. Avoid deep nesting and long `if/else` chains. Use map/filter/reduce for iteration.
- Arrow functions for very small utilities; named functions otherwise.
- Use default parameter values; favor RO-RO (Receive Object, Return Object).
- Maintain single level of abstraction per function.

### If/Else & Early Returns

- Prefer guard clauses and early returns to reduce nesting and cognitive load.
- Avoid `if/else` where a clear early return (or splitting into smaller functions) is possible.

### Types

- Use existing domain types (`Select*` for reads in UI) and Zod inference.
- Never use `any` unless explicitly approved.

### Comments

- Use JSDoc (`@param`, `@returns`, `@throws`) for all public functions.
- Use `////////////////////////////////` blocks to delineate logical sections when helpful.

## Extended TypeScript Rules

- See `rules/typescript-rules.md` for extended TypeScript guidance.
- Focus on: no-emit checks, type-only imports, Zod inference, unknown narrowing, and using `Select*` DB types in UI.

## React Rules

- See `rules/react-rules.md` for React-specific patterns.
- Avoid unnecessary `useEffect`; prefer render-time derivation, event handlers, and `useMemo` for caching.
- Prefer early returns and boolean guards over nested ternaries for conditional rendering.

## Content System Notes

- Author files live under `content/`: routable in `content/collections/*`, data-only in `content/datasets/*`.
- Registry + schemas under `app/cms/`. Fetch via `getCollection<typeof Schema>(name)` or `getEntry<typeof Schema>(name, slug)`; datasets via `getDataset<typeof Schema>(name)`.
- Markdown is rendered with `markdown-it` (HTML disabled) and frontmatter parsed via `gray-matter`. Dates are normalized to `YYYY-MM-DD` strings.
