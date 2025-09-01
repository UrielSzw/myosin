import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";
import * as schema from "./schema";

const DATABASE_NAME = "workout";

export const sqlite = SQLite.openDatabaseSync(DATABASE_NAME, {
  enableChangeListener: true,
});

export const db = drizzle(sqlite, { schema });
