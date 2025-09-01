import type { Config } from "drizzle-kit";

export default {
  schema: "./shared/db/schema",
  out: "./shared/db/drizzle",
  dialect: "sqlite",
  driver: "expo",
} satisfies Config;
