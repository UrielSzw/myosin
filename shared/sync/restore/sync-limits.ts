/**
 * Sync Limits Configuration
 *
 * Define cuánto histórico descargar por tipo de tabla.
 *
 * IMPORTANTE: Solo incluimos tablas que tienen user_id o created_by_user_id directo.
 * Las tablas hijas (routine_blocks, exercise_in_block, etc.) se sincronizan
 * a través del restore-service existente que hace queries por FK.
 */

// =============================================================================
// TYPES
// =============================================================================

export type TableCategory = "unlimited" | "threeMonths" | "sixMonths";

export interface TableConfig {
  name: string;
  userIdColumn: "user_id" | "created_by_user_id";
  dateColumn: "created_at" | "updated_at";
  /** Orden de borrado (mayor = borrar primero) */
  clearOrder: number;
  /** Si esta tabla tiene tablas hijas que se sincronizan por separado */
  hasChildTables?: boolean;
}

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Tablas por categoría de límite temporal
 *
 * NOTA: Solo tablas con user_id directo. Las tablas hijas (routine_blocks,
 * exercise_in_block, routine_sets, tracker_quick_actions, workout_blocks,
 * workout_exercises, workout_sets) se manejan por el restore-service
 * con queries por FK.
 */
export const SYNC_TABLE_CATEGORIES: Record<TableCategory, TableConfig[]> = {
  // Sin límite - config y datos estructurales
  unlimited: [
    {
      name: "user_preferences",
      userIdColumn: "user_id",
      dateColumn: "updated_at",
      clearOrder: 100,
    },
    {
      name: "folders",
      userIdColumn: "created_by_user_id",
      dateColumn: "updated_at",
      clearOrder: 10,
    },
    {
      name: "routines",
      userIdColumn: "created_by_user_id",
      dateColumn: "updated_at",
      clearOrder: 20,
      hasChildTables: true, // routine_blocks, exercise_in_block, routine_sets
    },
    {
      name: "tracker_metrics",
      userIdColumn: "user_id",
      dateColumn: "updated_at",
      clearOrder: 90,
      hasChildTables: true, // tracker_quick_actions
    },
    {
      name: "macro_targets",
      userIdColumn: "user_id",
      dateColumn: "updated_at",
      clearOrder: 85,
    },
    {
      name: "macro_quick_actions",
      userIdColumn: "user_id",
      dateColumn: "updated_at",
      clearOrder: 75,
    },
    {
      name: "pr_current",
      userIdColumn: "user_id",
      dateColumn: "updated_at",
      clearOrder: 70,
    },
  ],

  // 3 meses - entries de día a día
  threeMonths: [
    {
      name: "tracker_entries",
      userIdColumn: "user_id",
      dateColumn: "created_at",
      clearOrder: 60,
    },
    {
      name: "tracker_daily_aggregates",
      userIdColumn: "user_id",
      dateColumn: "updated_at",
      clearOrder: 55,
    },
    {
      name: "macro_entries",
      userIdColumn: "user_id",
      dateColumn: "created_at",
      clearOrder: 65,
    },
    {
      name: "macro_daily_aggregates",
      userIdColumn: "user_id",
      dateColumn: "updated_at",
      clearOrder: 56,
    },
  ],

  // 6 meses - workouts y PRs históricos
  sixMonths: [
    {
      name: "workout_sessions",
      userIdColumn: "user_id",
      dateColumn: "created_at",
      clearOrder: 15,
      hasChildTables: true, // workout_blocks, workout_exercises, workout_sets
    },
    {
      name: "pr_history",
      userIdColumn: "user_id",
      dateColumn: "created_at",
      clearOrder: 68,
    },
  ],
};

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Obtiene todas las tablas en una sola lista
 */
export function getAllSyncTables(): TableConfig[] {
  return [
    ...SYNC_TABLE_CATEGORIES.unlimited,
    ...SYNC_TABLE_CATEGORIES.threeMonths,
    ...SYNC_TABLE_CATEGORIES.sixMonths,
  ];
}

/**
 * Obtiene las tablas ordenadas para CLEAR (orden inverso de FK)
 */
export function getTablesForClear(): TableConfig[] {
  return getAllSyncTables().sort((a, b) => b.clearOrder - a.clearOrder);
}

/**
 * Obtiene las tablas ordenadas para RESTORE (orden de FK)
 */
export function getTablesForRestore(): TableConfig[] {
  return getAllSyncTables().sort((a, b) => a.clearOrder - b.clearOrder);
}

/**
 * Calcula la fecha límite para una categoría
 */
export function getDateLimitForCategory(
  category: TableCategory
): string | null {
  const now = new Date();

  switch (category) {
    case "unlimited":
      return null;

    case "threeMonths": {
      const threeMonthsAgo = new Date(now);
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return threeMonthsAgo.toISOString();
    }

    case "sixMonths": {
      const sixMonthsAgo = new Date(now);
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return sixMonthsAgo.toISOString();
    }
  }
}

/**
 * Encuentra la categoría de una tabla por nombre
 */
export function getTableCategory(tableName: string): TableCategory | null {
  for (const [category, tables] of Object.entries(SYNC_TABLE_CATEGORIES)) {
    if (tables.some((t) => t.name === tableName)) {
      return category as TableCategory;
    }
  }
  return null;
}

/**
 * Obtiene la config de una tabla por nombre
 */
export function getTableConfig(tableName: string): TableConfig | null {
  for (const tables of Object.values(SYNC_TABLE_CATEGORIES)) {
    const found = tables.find((t) => t.name === tableName);
    if (found) return found;
  }
  return null;
}

/**
 * Obtiene la fecha límite para una tabla específica
 */
export function getDateLimitForTable(tableName: string): string | null {
  const category = getTableCategory(tableName);
  if (!category) return null;
  return getDateLimitForCategory(category);
}
