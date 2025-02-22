import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

if (!process.env.POSTGRES_URL) {
  throw new Error(
    "Missing environment variable: POSTGRES_URL",
  )
}

export const client = new pg.Client({
  connectionString: process.env.POSTGRES_URL,
});

export const db = drizzle(client, { schema });

async function main() {
  await client.connect();
}

main();