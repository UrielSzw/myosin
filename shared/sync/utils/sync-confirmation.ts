/**
 * Sync Confirmation Utilities
 *
 * Funciones para confirmar que una entidad fue sincronizada exitosamente.
 * Después de un sync exitoso, marca is_synced=true en la entidad correspondiente.
 */

import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import {
  macro_daily_aggregates,
  macro_entries,
  macro_quick_actions,
  macro_targets,
} from "../../db/schema/macros";
import { pr_current, pr_history } from "../../db/schema/pr";
import {
  exercise_in_block,
  folders,
  routine_blocks,
  routine_sets,
  routines,
} from "../../db/schema/routine";
import {
  tracker_daily_aggregates,
  tracker_entries,
  tracker_metrics,
  tracker_quick_actions,
} from "../../db/schema/tracker";
import { user_preferences } from "../../db/schema/user";
import {
  workout_blocks,
  workout_exercises,
  workout_sessions,
  workout_sets,
} from "../../db/schema/workout-session";
import type { MutationCode } from "../types/mutations";

// ============================================
// TYPES
// ============================================

/**
 * Información de la entidad a marcar como sincronizada.
 * Se incluye en el payload de cada mutation.
 */
export interface SyncEntityInfo {
  /** ID de la entidad principal */
  _entityId?: string;
  /** Tabla de la entidad principal */
  _entityTable?: SyncableTable;
  /** IDs adicionales (para operaciones que afectan múltiples entidades) */
  _relatedEntities?: { id: string; table: SyncableTable }[];
}

/**
 * Tablas que soportan sync tracking
 */
export type SyncableTable =
  | "folders"
  | "routines"
  | "routine_blocks"
  | "exercise_in_block"
  | "routine_sets"
  | "tracker_metrics"
  | "tracker_quick_actions"
  | "tracker_entries"
  | "tracker_daily_aggregates"
  | "macro_targets"
  | "macro_entries"
  | "macro_daily_aggregates"
  | "macro_quick_actions"
  | "workout_sessions"
  | "workout_blocks"
  | "workout_exercises"
  | "workout_sets"
  | "user_preferences"
  | "pr_current"
  | "pr_history";

// ============================================
// TABLE MAP
// ============================================

/**
 * Mapeo de nombre de tabla a schema de Drizzle
 */
const tableSchemaMap = {
  folders,
  routines,
  routine_blocks,
  exercise_in_block,
  routine_sets,
  tracker_metrics,
  tracker_quick_actions,
  tracker_entries,
  tracker_daily_aggregates,
  macro_targets,
  macro_entries,
  macro_daily_aggregates,
  macro_quick_actions,
  workout_sessions,
  workout_blocks,
  workout_exercises,
  workout_sets,
  user_preferences,
  pr_current,
  pr_history,
} as const;

// ============================================
// MARK SYNCED FUNCTIONS
// ============================================

/**
 * Marca una entidad como sincronizada (is_synced = true)
 */
export const markEntitySynced = async (
  table: SyncableTable,
  entityId: string
): Promise<void> => {
  const tableSchema = tableSchemaMap[table];

  if (!tableSchema) {
    console.warn(`[markEntitySynced] Unknown table: ${table}`);
    return;
  }

  try {
    await db
      .update(tableSchema)
      .set({ is_synced: true } as any)
      .where(eq((tableSchema as any).id, entityId));
  } catch (error) {
    // Non-fatal: log but don't throw
    console.error(
      `[markEntitySynced] Failed to mark ${table}:${entityId}:`,
      error
    );
  }
};

/**
 * Marca múltiples entidades como sincronizadas
 */
export const markEntitiesSynced = async (
  entities: { table: SyncableTable; id: string }[]
): Promise<void> => {
  for (const { table, id } of entities) {
    await markEntitySynced(table, id);
  }
};

/**
 * Procesa el payload de una mutation completada y marca las entidades correspondientes
 */
export const confirmSyncFromPayload = async (
  mutationCode: MutationCode,
  payload: Record<string, any>
): Promise<void> => {
  // Extraer entity info del payload
  const entityId = payload._entityId;
  const entityTable = payload._entityTable as SyncableTable | undefined;
  const relatedEntities = payload._relatedEntities as
    | { id: string; table: SyncableTable }[]
    | undefined;

  // Marcar entidad principal
  if (entityId && entityTable) {
    await markEntitySynced(entityTable, entityId);
  }

  // Marcar entidades relacionadas
  if (relatedEntities?.length) {
    await markEntitiesSynced(relatedEntities);
  }

  // Fallback: inferir de mutation code si no hay _entityId
  if (!entityId && !relatedEntities?.length) {
    await inferAndMarkFromMutation(mutationCode, payload);
  }
};

/**
 * Infiere qué entidades marcar basándose en el mutation code y payload
 * (fallback cuando no se incluye _entityId)
 */
const inferAndMarkFromMutation = async (
  code: MutationCode,
  payload: Record<string, any>
): Promise<void> => {
  switch (code) {
    // Folders
    case "FOLDER_CREATE":
    case "FOLDER_UPDATE":
      if (payload.id) await markEntitySynced("folders", payload.id);
      break;
    case "FOLDER_DELETE":
      if (payload.id) await markEntitySynced("folders", payload.id);
      break;
    case "FOLDER_REORDER":
      // payload: { orderedIds: string[] }
      if (payload.orderedIds?.length) {
        for (const id of payload.orderedIds) {
          await markEntitySynced("folders", id);
        }
      }
      break;

    // Routines (including child entities)
    case "ROUTINE_CREATE":
    case "ROUTINE_CREATE_QUICK_WORKOUT":
      // Mark routine
      if (payload.routine?.id) {
        await markEntitySynced("routines", payload.routine.id);
      }
      // Mark all blocks
      if (payload.blocks?.length) {
        for (const block of payload.blocks) {
          if (block.id) await markEntitySynced("routine_blocks", block.id);
        }
      }
      // Mark all exercises in block
      if (payload.exercisesInBlock?.length) {
        for (const eib of payload.exercisesInBlock) {
          if (eib.id) await markEntitySynced("exercise_in_block", eib.id);
        }
      }
      // Mark all sets
      if (payload.sets?.length) {
        for (const set of payload.sets) {
          if (set.id) await markEntitySynced("routine_sets", set.id);
        }
      }
      break;

    case "ROUTINE_UPDATE":
      // Mark routine
      if (payload.routineId) {
        await markEntitySynced("routines", payload.routineId);
      }
      // Mark all blocks (in data)
      if (payload.data?.blocks?.length) {
        for (const block of payload.data.blocks) {
          if (block.id) await markEntitySynced("routine_blocks", block.id);
        }
      }
      // Mark all exercises in block (in data)
      if (payload.data?.exercisesInBlock?.length) {
        for (const eib of payload.data.exercisesInBlock) {
          if (eib.id) await markEntitySynced("exercise_in_block", eib.id);
        }
      }
      // Mark all sets (in data)
      if (payload.data?.sets?.length) {
        for (const set of payload.data.sets) {
          if (set.id) await markEntitySynced("routine_sets", set.id);
        }
      }
      break;

    case "ROUTINE_DELETE":
      if (payload.id) await markEntitySynced("routines", payload.id);
      break;

    case "ROUTINE_CLEAR_TRAINING_DAYS":
      if (payload.routineId)
        await markEntitySynced("routines", payload.routineId);
      break;

    case "ROUTINE_CONVERT_FROM_QUICK":
      if (payload.routineId)
        await markEntitySynced("routines", payload.routineId);
      break;

    // Tracker Metrics
    case "TRACKER_METRIC_CREATE":
    case "TRACKER_METRIC_UPDATE":
    case "TRACKER_METRIC_DELETE":
    case "TRACKER_METRIC_RESTORE":
      if (payload.id) {
        await markEntitySynced("tracker_metrics", payload.id);
      }
      if (payload.metricId) {
        await markEntitySynced("tracker_metrics", payload.metricId);
      }
      break;

    // Tracker Metric Reorder
    case "TRACKER_METRIC_REORDER":
      // payload: { metricOrders: { id: string, order_index: number }[] }
      if (payload.metricOrders?.length) {
        for (const item of payload.metricOrders) {
          if (item.id) await markEntitySynced("tracker_metrics", item.id);
        }
      }
      break;

    // Tracker Metric from Template (has nested structure)
    case "TRACKER_METRIC_FROM_TEMPLATE":
      // Mark the metric
      if (payload.metric?.id) {
        await markEntitySynced("tracker_metrics", payload.metric.id);
      }
      // Mark all quick actions
      if (payload.quickActions?.length) {
        for (const qa of payload.quickActions) {
          if (qa.id) {
            await markEntitySynced("tracker_quick_actions", qa.id);
          }
        }
      }
      break;

    // Tracker Entries
    case "TRACKER_ENTRY_CREATE":
    case "TRACKER_ENTRY_UPDATE":
    case "TRACKER_ENTRY_DELETE":
    case "TRACKER_ENTRY_FROM_QUICK_ACTION":
      if (payload.id) await markEntitySynced("tracker_entries", payload.id);
      if (payload.entryId)
        await markEntitySynced("tracker_entries", payload.entryId);
      break;

    // Tracker with Aggregate (multiple entities)
    case "TRACKER_ENTRY_WITH_AGGREGATE":
    case "TRACKER_REPLACE_ENTRY_WITH_AGGREGATE":
      if (payload.entry?.id)
        await markEntitySynced("tracker_entries", payload.entry.id);
      // Support both 'aggregate' and 'dailyAggregate' field names
      if (payload.aggregate?.id)
        await markEntitySynced(
          "tracker_daily_aggregates",
          payload.aggregate.id
        );
      if (payload.dailyAggregate?.id)
        await markEntitySynced(
          "tracker_daily_aggregates",
          payload.dailyAggregate.id
        );
      break;
    case "TRACKER_DELETE_ENTRY_WITH_AGGREGATE":
      if (payload.entryId)
        await markEntitySynced("tracker_entries", payload.entryId);
      if (payload.aggregateId)
        await markEntitySynced("tracker_daily_aggregates", payload.aggregateId);
      if (payload.dailyAggregateId)
        await markEntitySynced(
          "tracker_daily_aggregates",
          payload.dailyAggregateId
        );
      break;

    // Tracker Quick Actions
    case "TRACKER_QUICK_ACTION_CREATE":
      if (payload.id)
        await markEntitySynced("tracker_quick_actions", payload.id);
      break;
    case "TRACKER_QUICK_ACTION_DELETE":
      if (payload.quickActionId)
        await markEntitySynced("tracker_quick_actions", payload.quickActionId);
      break;

    // Macro Targets
    case "MACRO_TARGET_UPSERT":
    case "MACRO_TARGET_UPDATE":
      if (payload.id) await markEntitySynced("macro_targets", payload.id);
      break;

    // Macro Entries
    case "MACRO_ENTRY_CREATE":
      if (payload.entry?.id)
        await markEntitySynced("macro_entries", payload.entry.id);
      if (payload.aggregate?.id)
        await markEntitySynced("macro_daily_aggregates", payload.aggregate.id);
      break;
    case "MACRO_ENTRY_UPDATE":
      if (payload.id) await markEntitySynced("macro_entries", payload.id);
      break;
    case "MACRO_ENTRY_DELETE":
      if (payload.entryId)
        await markEntitySynced("macro_entries", payload.entryId);
      if (payload.aggregateId)
        await markEntitySynced("macro_daily_aggregates", payload.aggregateId);
      break;

    // Macro Quick Actions
    case "MACRO_QUICK_ACTIONS_INIT":
      // Bulk create - payload is the array directly
      if (Array.isArray(payload)) {
        for (const qa of payload) {
          if (qa.id) await markEntitySynced("macro_quick_actions", qa.id);
        }
      } else if (payload.quickActions?.length) {
        for (const qa of payload.quickActions) {
          if (qa.id) await markEntitySynced("macro_quick_actions", qa.id);
        }
      }
      break;
    case "MACRO_QUICK_ACTION_CREATE":
      if (payload.id) await markEntitySynced("macro_quick_actions", payload.id);
      break;
    case "MACRO_QUICK_ACTION_DELETE":
      if (payload.quickActionId)
        await markEntitySynced("macro_quick_actions", payload.quickActionId);
      break;

    // PR
    case "PR_CREATE":
      if (payload.id) await markEntitySynced("pr_current", payload.id);
      break;
    case "PR_UPDATE":
      if (payload.currentPR?.id)
        await markEntitySynced("pr_current", payload.currentPR.id);
      if (payload.historyEntry?.id)
        await markEntitySynced("pr_history", payload.historyEntry.id);
      break;

    // Workouts (including child entities)
    case "WORKOUT_START":
    case "WORKOUT_COMPLETE":
      // Mark session
      if (payload.session?.id) {
        await markEntitySynced("workout_sessions", payload.session.id);
      }
      // Mark all blocks
      if (payload.blocks?.length) {
        for (const block of payload.blocks) {
          if (block.id) await markEntitySynced("workout_blocks", block.id);
        }
      }
      // Mark all exercises
      if (payload.exercises?.length) {
        for (const exercise of payload.exercises) {
          if (exercise.id)
            await markEntitySynced("workout_exercises", exercise.id);
        }
      }
      // Mark all sets
      if (payload.sets?.length) {
        for (const set of payload.sets) {
          if (set.id) await markEntitySynced("workout_sets", set.id);
        }
      }
      break;

    case "WORKOUT_UPDATE":
      if (payload.sessionId)
        await markEntitySynced("workout_sessions", payload.sessionId);
      break;

    // Finish Workout (unified payload with workout + routine update + PRs)
    case "FINISH_WORKOUT":
      // Mark workout session
      if (payload.workoutSession?.session?.id) {
        await markEntitySynced(
          "workout_sessions",
          payload.workoutSession.session.id
        );
      }
      // Mark workout blocks
      if (payload.workoutSession?.blocks?.length) {
        for (const block of payload.workoutSession.blocks) {
          if (block.id) await markEntitySynced("workout_blocks", block.id);
        }
      }
      // Mark workout exercises
      if (payload.workoutSession?.exercises?.length) {
        for (const exercise of payload.workoutSession.exercises) {
          if (exercise.id)
            await markEntitySynced("workout_exercises", exercise.id);
        }
      }
      // Mark workout sets
      if (payload.workoutSession?.sets?.length) {
        for (const set of payload.workoutSession.sets) {
          if (set.id) await markEntitySynced("workout_sets", set.id);
        }
      }
      // Mark routine updates (if any)
      if (payload.routineUpdate) {
        for (const block of payload.routineUpdate.blocks || []) {
          if (block.id) await markEntitySynced("routine_blocks", block.id);
        }
        for (const exercise of payload.routineUpdate.exercises || []) {
          if (exercise.id)
            await markEntitySynced("exercise_in_block", exercise.id);
        }
        for (const set of payload.routineUpdate.sets || []) {
          if (set.id) await markEntitySynced("routine_sets", set.id);
        }
      }
      // Mark PRs
      if (payload.prs?.current?.length) {
        for (const pr of payload.prs.current) {
          if (pr.id) await markEntitySynced("pr_current", pr.id);
        }
      }
      if (payload.prs?.history?.length) {
        for (const pr of payload.prs.history) {
          if (pr.id) await markEntitySynced("pr_history", pr.id);
        }
      }
      break;

    // User Preferences
    case "USER_PREFERENCES_CREATE":
    case "USER_PREFERENCES_UPDATE":
      // user_preferences usa user_id como identificador único, no id
      // El sync se maneja diferente aquí
      break;

    default:
      console.warn(`[inferAndMarkFromMutation] Unhandled mutation: ${code}`);
  }
};

// ============================================
// QUERY HELPERS
// ============================================

/**
 * Obtiene el conteo de entidades no sincronizadas por tabla
 */
export const getUnsyncedCounts = async (
  _userId: string
): Promise<Record<SyncableTable, number>> => {
  const counts: Partial<Record<SyncableTable, number>> = {};

  // Folders
  const foldersResult = await db
    .select({ count: db.$count(folders.id) })
    .from(folders)
    .where(eq(folders.is_synced, false));
  counts.folders = foldersResult[0]?.count ?? 0;

  // Routines
  const routinesResult = await db
    .select({ count: db.$count(routines.id) })
    .from(routines)
    .where(eq(routines.is_synced, false));
  counts.routines = routinesResult[0]?.count ?? 0;

  // Tracker metrics
  const metricsResult = await db
    .select({ count: db.$count(tracker_metrics.id) })
    .from(tracker_metrics)
    .where(eq(tracker_metrics.is_synced, false));
  counts.tracker_metrics = metricsResult[0]?.count ?? 0;

  // Tracker entries
  const entriesResult = await db
    .select({ count: db.$count(tracker_entries.id) })
    .from(tracker_entries)
    .where(eq(tracker_entries.is_synced, false));
  counts.tracker_entries = entriesResult[0]?.count ?? 0;

  // Add more as needed...

  return counts as Record<SyncableTable, number>;
};

/**
 * Obtiene el total de entidades pendientes de sync
 */
export const getTotalUnsyncedCount = async (
  userId: string
): Promise<number> => {
  const counts = await getUnsyncedCounts(userId);
  return Object.values(counts).reduce((sum, count) => sum + count, 0);
};
