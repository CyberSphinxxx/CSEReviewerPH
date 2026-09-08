import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getPoolConfig } from "@/db/index";

describe("PostgreSQL Pool Configuration for Serverless / Vercel", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.DATABASE_URL;
    delete process.env.POSTGRES_URL;
    delete process.env.POSTGRES_PRISMA_URL;
    delete process.env.DB_POOL_MAX;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("configures local development connection without SSL by default", () => {
    const config = getPoolConfig("postgresql://postgres:postgres@localhost:5432/csereviewer");
    expect(config.connectionString).toBe("postgresql://postgres:postgres@localhost:5432/csereviewer");
    expect(config.ssl).toBeUndefined();
    expect(config.max).toBe(5);
  });

  it("enables SSL when connecting to Neon cloud database", () => {
    const config = getPoolConfig("postgresql://user:pass@ep-cool-project.ap-southeast-1.aws.neon.tech/neondb");
    expect(config.ssl).toBeDefined();
    expect(config.ssl).toEqual({ rejectUnauthorized: false });
  });

  it("enables SSL when connecting to Supabase cloud database", () => {
    const config = getPoolConfig("postgresql://postgres:pass@db.abcdefghijklmnopqrst.supabase.co:5432/postgres");
    expect(config.ssl).toBeDefined();
    expect(config.ssl).toEqual({ rejectUnauthorized: false });
  });

  it("enables SSL when connecting to Vercel Postgres storage", () => {
    const config = getPoolConfig("postgres://default:pass@ep-round-pond.vercel-storage.com:5432/verceldb");
    expect(config.ssl).toBeDefined();
    expect(config.ssl).toEqual({ rejectUnauthorized: false });
  });

  it("respects POSTGRES_URL environment variable if DATABASE_URL is unset", () => {
    process.env.POSTGRES_URL = "postgres://vercel_user:secret@ep-example.ap-southeast-1.aws.neon.tech/verceldb";
    const config = getPoolConfig();
    expect(config.connectionString).toBe("postgres://vercel_user:secret@ep-example.ap-southeast-1.aws.neon.tech/verceldb");
    expect(config.ssl).toBeDefined();
  });

  it("allows overriding pool max through DB_POOL_MAX", () => {
    process.env.DB_POOL_MAX = "10";
    const config = getPoolConfig();
    expect(config.max).toBe(10);
  });
});
