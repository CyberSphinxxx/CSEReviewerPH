import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

const globalForDb = globalThis as unknown as {
  __pgPool?: pg.Pool;
};

/**
 * Generates optimal PostgreSQL pool configuration for Vercel Serverless
 * and local development environments.
 */
export function getPoolConfig(overrideConnectionString?: string): pg.PoolConfig {
  const connectionString =
    overrideConnectionString ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    "postgresql://postgres:postgres@localhost:5432/csereviewer";

  const isLocal =
    connectionString.includes("localhost") ||
    connectionString.includes("127.0.0.1") ||
    connectionString.includes("@postgres:") ||
    connectionString.includes("@db:");

  const requiresSsl =
    !isLocal ||
    connectionString.includes("sslmode=require") ||
    connectionString.includes("neon.tech") ||
    connectionString.includes("supabase.co") ||
    connectionString.includes("vercel-storage.com");

  return {
    connectionString,
    // Keep max connections conservative for serverless concurrency (1 for Vercel lambdas, 5 for local)
    max: process.env.DB_POOL_MAX
      ? parseInt(process.env.DB_POOL_MAX, 10)
      : process.env.VERCEL
        ? 1
        : 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ...(requiresSsl
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : {}),
  };
}

export function getDb(): NodePgDatabase<typeof schema> {
  if (!globalForDb.__pgPool) {
    const config = getPoolConfig();
    globalForDb.__pgPool = new Pool(config);
  }
  return drizzle(globalForDb.__pgPool, { schema });
}

export const db = getDb();
export { schema };
