import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

// Connection pool configuration
const connectionString = process.env.DATABASE_URL;

let pool: pg.Pool | null = null;

export function getDb() {
  if (!pool) {
    pool = new Pool({
      connectionString: connectionString || "postgresql://postgres:postgres@localhost:5432/csereviewer",
    });
  }
  return drizzle(pool, { schema });
}

export const db = getDb();
export { schema };
