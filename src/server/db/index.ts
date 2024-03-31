import { env } from "#/env";
import { neon } from "@neondatabase/serverless";
import { type NeonHttpClient, drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: NeonHttpClient | undefined;
};

const conn = globalForDb.conn ?? neon(env.DATABASE_URL);
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
