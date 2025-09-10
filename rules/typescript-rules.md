# TypeScript Rules (Extended)

Focused guidance for TypeScript usage in this repository. Use with the primary rules in `AGENTS.md`.

## Type Checking & Build
- Always use `pnpm run typecheck` for checks (includes `--noEmit`).
- If running `tsc` directly, include `--noEmit`.
- Never emit `.js` files during checks; builds are handled by the project’s tooling.

## Imports & Module Syntax
- Put `import type { ... }` statements at the top of files.
- Prefer `import type` for types to avoid runtime baggage; keep value imports separate when helpful.
- Use `satisfies` to enforce shape without widening when appropriate.

## Type Safety & Inference
- Never use `any`. Prefer Zod inference (`z.infer<typeof Schema>`) and shared types like `ContentEntry<T>`.
- Narrow `unknown` with runtime checks (e.g., property existence) rather than casting.
- Favor discriminated unions and type guards over ad‑hoc casting.
- Prefer `readonly` arrays/tuples and `as const` where it clarifies intent without hiding errors.

## Domain Types
- Database in UI/read code: use `Select*` types (e.g., `SelectUser`). Use `Insert*` only at creation boundaries.
- Content loader generics: pass the schema type parameter (e.g., `getCollection<typeof ArticleSchema>(...)`).

## Naming & Organization
- One export per file; avoid sprawling modules.
- Keep files and directories kebab-case; types/interfaces/classes in PascalCase; values in camelCase.

## Errors & Guards
- Use guard clauses and early returns to keep type‑narrowing local and readable.
- Avoid nested ternaries; compute values first, then render.

