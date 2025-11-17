import { InferSelectModel } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamps } from "../utils/schema-utils";
import { generateUUID } from "../utils/uuid";

export const syncQueue = sqliteTable(
  "sync_queue",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateUUID()),

    // Mutation data
    mutation_code: text("mutation_code").notNull(),
    payload: text("payload").notNull(), // JSON serializado

    // Timing & ordering
    scheduled_at: text("scheduled_at").notNull(), // Para backoff scheduling

    // Retry logic
    retry_count: integer("retry_count").notNull().default(0),
    max_retries: integer("max_retries").notNull().default(5),

    // Status tracking
    status: text("status")
      .$type<"pending" | "processing" | "completed" | "failed">()
      .notNull()
      .default("pending"),

    error_message: text("error_message"),

    ...timestamps,
  },
  (t) => [
    index("sync_queue_status_idx").on(t.status),
    index("sync_queue_scheduled_idx").on(t.scheduled_at),
    index("sync_queue_created_idx").on(t.created_at),
  ]
);

export const syncEngineState = sqliteTable("sync_engine_state", {
  id: text("id").primaryKey().default("singleton"), // Solo un record

  // Circuit breaker state
  status: text("status")
    .$type<"healthy" | "degraded" | "failed">()
    .notNull()
    .default("healthy"),

  consecutive_failures: integer("consecutive_failures").notNull().default(0),
  last_failure_at: text("last_failure_at"),
  backoff_until: text("backoff_until"), // ISO timestamp

  // Network state
  network_state: text("network_state")
    .$type<"online" | "offline" | "poor">()
    .notNull()
    .default("offline"),
  last_network_change: text("last_network_change"),

  ...timestamps,
});

// Types for TypeScript
export type SyncQueueEntry = InferSelectModel<typeof syncQueue>;
export type SyncEngineStateRecord = InferSelectModel<typeof syncEngineState>;

export type SyncQueueInsert = {
  mutation_code: string;
  payload: string;
  scheduled_at?: string;
  max_retries?: number;
};

export type SyncQueueStatus = "pending" | "processing" | "completed" | "failed";
