import type { Config } from "drizzle-kit";

if (!process.env.POSTGRES_URL) {
  throw new Error(
    "Missing environment variable: POSTGRES_URL",
  )
}

export default {
  dialect: "postgresql",
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dbCredentials: {
    url: process.env.POSTGRES_URL,
  }
} satisfies Config;