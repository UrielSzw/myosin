import { InferSelectModel, relations } from "drizzle-orm";
import {
  blob,
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { timestamps } from "../utils/schema-utils";
import { generateUUID } from "../utils/uuid";

// ---------------- Definiciones de Métricas ----------------
export const tracker_metrics = sqliteTable(
  "tracker_metrics",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateUUID()),
    user_id: text("user_id").notNull().default("default-user"),

    // Identificadores y metadata
    slug: text("slug").notNull(), // 'water', 'protein', 'weight'
    name: text("name").notNull(), // 'Agua', 'Proteína', 'Peso'
    type: text("type").$type<"value" | "counter">().notNull(),

    // Unidades y conversión
    unit: text("unit").notNull(), // 'ml', 'g', 'kg'
    canonical_unit: text("canonical_unit"), // unidad normalizada
    conversion_factor: real("conversion_factor").default(1), // multiplier a canonical

    // Configuración
    default_target: real("default_target"), // objetivo diario opcional

    // Visualización
    color: text("color").notNull(), // hex color
    icon: text("icon").notNull(), // icon key

    // Estado
    deleted_at: text("deleted_at"), // NULL = activa, timestamp = eliminada/desactivada

    // Orden
    order_index: integer("order_index").default(0).notNull(),

    ...timestamps,
  },
  (t) => [
    index("idx_tracker_metrics_user_id").on(t.user_id),
    index("idx_tracker_metrics_slug").on(t.slug),
    index("idx_tracker_metrics_type").on(t.type),
    index("idx_tracker_metrics_deleted_at").on(t.deleted_at),
  ]
);

// ---------------- Acciones Rápidas ----------------
export const tracker_quick_actions = sqliteTable(
  "tracker_quick_actions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateUUID()),
    metric_id: text("metric_id")
      .references(() => tracker_metrics.id, { onDelete: "cascade" })
      .notNull(),

    // Contenido
    label: text("label").notNull(), // "Vaso grande (300ml)"
    value: real("value").notNull(), // valor en la unidad de la métrica
    value_normalized: real("value_normalized"), // pre-calculado en canonical_unit

    // Visualización
    icon: text("icon"), // icon key opcional
    position: integer("position").default(0).notNull(), // orden de display

    ...timestamps,
  },
  (t) => [
    index("idx_tracker_quick_actions_metric").on(t.metric_id),
    index("idx_tracker_quick_actions_position").on(t.position),
  ]
);

// ---------------- Entradas (Registros) ----------------
export const tracker_entries = sqliteTable(
  "tracker_entries",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateUUID()),
    user_id: text("user_id").notNull().default("default-user"),
    metric_id: text("metric_id")
      .references(() => tracker_metrics.id, { onDelete: "cascade" })
      .notNull(),

    // Valores
    value: real("value").notNull(), // valor tal como lo ingresó el usuario
    value_normalized: real("value_normalized").notNull(), // valor en canonical_unit
    unit: text("unit").notNull(), // snapshot de la unidad al momento del registro

    // Metadata
    notes: text("notes"), // comentarios opcionales
    source: text("source")
      .$type<"manual" | "quick_action" | "sync" | "import">()
      .default("manual")
      .notNull(),

    // Temporal
    day_key: text("day_key").notNull(), // 'YYYY-MM-DD' calculado al insertar
    recorded_at: text("recorded_at").notNull(), // ISO timestamp cuando se registró

    // Extensibilidad
    meta: blob("meta", { mode: "json" }).$type<Record<string, any>>(), // datos adicionales

    ...timestamps,
  },
  (t) => [
    index("idx_tracker_entries_user_metric").on(t.user_id, t.metric_id),
    index("idx_tracker_entries_day_key").on(t.day_key),
    index("idx_tracker_entries_recorded_at").on(t.recorded_at),
    index("idx_tracker_entries_source").on(t.source),
  ]
);

// ---------------- Agregados Diarios (Cache) ----------------
export const tracker_daily_aggregates = sqliteTable(
  "tracker_daily_aggregates",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateUUID()),
    user_id: text("user_id").notNull().default("default-user"),
    metric_id: text("metric_id")
      .references(() => tracker_metrics.id, { onDelete: "cascade" })
      .notNull(),

    // Identificador temporal
    day_key: text("day_key").notNull(), // 'YYYY-MM-DD'

    // Agregaciones
    sum_normalized: real("sum_normalized").notNull(), // suma total en canonical_unit
    count: integer("count").notNull(), // número de entries

    // Estadísticas adicionales (útiles para métricas tipo 'value')
    min_normalized: real("min_normalized"), // valor mínimo
    max_normalized: real("max_normalized"), // valor máximo
    avg_normalized: real("avg_normalized"), // promedio

    // Para comparaciones
    previous_day_sum: real("previous_day_sum"), // suma del día anterior (tendencia)

    ...timestamps,
  },
  (t) => [
    // Constraint único por usuario, métrica y día
    index("idx_tracker_aggregates_unique").on(
      t.user_id,
      t.metric_id,
      t.day_key
    ),
    index("idx_tracker_aggregates_day_key").on(t.day_key),
    // UNIQUE constraint para evitar duplicados
    uniqueIndex("unique_user_metric_day").on(t.user_id, t.metric_id, t.day_key),
  ]
);

// ---------------- Relaciones ----------------
export const trackerMetricsRelations = relations(
  tracker_metrics,
  ({ many }) => ({
    quick_actions: many(tracker_quick_actions),
    entries: many(tracker_entries),
    daily_aggregates: many(tracker_daily_aggregates),
  })
);

export const trackerQuickActionsRelations = relations(
  tracker_quick_actions,
  ({ one }) => ({
    metric: one(tracker_metrics, {
      fields: [tracker_quick_actions.metric_id],
      references: [tracker_metrics.id],
    }),
  })
);

export const trackerEntriesRelations = relations(
  tracker_entries,
  ({ one }) => ({
    metric: one(tracker_metrics, {
      fields: [tracker_entries.metric_id],
      references: [tracker_metrics.id],
    }),
  })
);

export const trackerDailyAggregatesRelations = relations(
  tracker_daily_aggregates,
  ({ one }) => ({
    metric: one(tracker_metrics, {
      fields: [tracker_daily_aggregates.metric_id],
      references: [tracker_metrics.id],
    }),
  })
);

// ---------------- Tipos Base ----------------
export type BaseTrackerMetric = InferSelectModel<typeof tracker_metrics>;
export type BaseTrackerQuickAction = InferSelectModel<
  typeof tracker_quick_actions
>;
export type BaseTrackerEntry = InferSelectModel<typeof tracker_entries>;
export type BaseTrackerDailyAggregate = InferSelectModel<
  typeof tracker_daily_aggregates
>;

// ---------------- Tipos con Relaciones ----------------
export type TrackerMetricWithQuickActions = BaseTrackerMetric & {
  quick_actions: BaseTrackerQuickAction[];
};

export type TrackerMetricWithAggregates = BaseTrackerMetric & {
  daily_aggregates: BaseTrackerDailyAggregate[];
};

export type TrackerEntryWithMetric = BaseTrackerEntry & {
  metric: BaseTrackerMetric;
};

export type MainMetric = BaseTrackerMetric & {
  entries: BaseTrackerEntry[];
  aggregate: BaseTrackerDailyAggregate | null;
  quick_actions: BaseTrackerQuickAction[];
};

export type TrackerDayData = {
  day_key: string;
  metrics: MainMetric[];
};

// ---------------- Tipos para Inserts ----------------
export type TrackerMetricInsert = Omit<
  BaseTrackerMetric,
  "id" | "created_at" | "updated_at"
>;
export type TrackerQuickActionInsert = Omit<
  BaseTrackerQuickAction,
  "id" | "created_at" | "updated_at"
>;
export type TrackerEntryInsert = Omit<
  BaseTrackerEntry,
  "id" | "created_at" | "updated_at"
>;
export type TrackerDailyAggregateInsert = Omit<
  BaseTrackerDailyAggregate,
  "id" | "created_at" | "updated_at"
>;
