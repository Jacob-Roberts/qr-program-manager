import { env } from "#/env";
import { type Config } from "drizzle-kit";

export default {
  schema: "./src/server/db/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    uri: env.DATABASE_URL,
  },
  tablesFilter: ["qr-program-manager_*"],
} satisfies Config;
