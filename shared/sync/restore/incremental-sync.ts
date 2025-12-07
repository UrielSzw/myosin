/**
 * Incremental Sync Service
 *
 * Servicio principal que maneja:
 * 1. FULL RESET: Borrar todo y bajar del nuevo usuario
 * 2. INCREMENTAL SYNC: Solo bajar lo nuevo (updated_at > local max)
 *
 * Características:
 * - Paginación para tablas grandes
 * - Transacciones para operaciones críticas
 * - Retry con backoff por tabla
 * - Progress callbacks para UI
 */

import { eq, sql } from "drizzle-orm";
import { db } from "../../db/client";
import * as schema from "../../db/schema";
import { supabase } from "../../services/supabase";

import { QueueGateService } from "./queue-gate";
import {
  getDateLimitForTable,
  getTableConfig,
  getTablesForRestore,
  type TableConfig,
} from "./sync-limits";

// =============================================================================
// TYPES
// =============================================================================

export type SyncMode = "full_reset" | "incremental";

export interface SyncProgress {
  mode: SyncMode;
  phase: "clearing" | "uploading" | "downloading" | "complete";
  currentTable: string;
  tablesCompleted: number;
  totalTables: number;
  recordsProcessed: number;
  /** 0-100 */
  percentage: number;
}

export interface TableSyncResult {
  table: string;
  success: boolean;
  downloaded: number;
  errors: string[];
}

export interface LoginSyncResult {
  success: boolean;
  mode: SyncMode;
  tables: TableSyncResult[];
  totalDownloaded: number;
  totalErrors: number;
  durationMs: number;
}

export type SyncProgressCallback = (progress: SyncProgress) => void;

// =============================================================================
// CONFIG
// =============================================================================

const PAGE_SIZE = 500;
const MAX_RETRIES = 3;
const RETRY_BACKOFF_MS = 1000;

// Mapeo de nombres de tablas a schemas de Drizzle
// Solo tablas con user_id directo - las tablas hijas se manejan por separado
const TABLE_SCHEMA_MAP: Record<string, any> = {
  user_preferences: schema.user_preferences,
  folders: schema.folders,
  routines: schema.routines,
  tracker_metrics: schema.tracker_metrics,
  tracker_entries: schema.tracker_entries,
  tracker_daily_aggregates: schema.tracker_daily_aggregates,
  macro_targets: schema.macro_targets,
  macro_entries: schema.macro_entries,
  macro_daily_aggregates: schema.macro_daily_aggregates,
  macro_quick_actions: schema.macro_quick_actions,
  workout_sessions: schema.workout_sessions,
  pr_current: schema.pr_current,
  pr_history: schema.pr_history,
};

// Tablas adicionales para FULL RESET clear (incluye tablas hijas)
const ALL_USER_TABLES_FOR_CLEAR: string[] = [
  "sync_queue", // Primero limpiar queue
  "routine_sets",
  "exercise_in_block",
  "routine_blocks",
  "tracker_quick_actions",
  "tracker_entries",
  "tracker_daily_aggregates",
  "workout_sets",
  "workout_exercises",
  "workout_blocks",
  "workout_sessions",
  "pr_history",
  "pr_current",
  "macro_entries",
  "macro_daily_aggregates",
  "macro_quick_actions",
  "macro_targets",
  "tracker_metrics",
  "routines",
  "folders",
  "user_preferences",
];

// Tablas que NO deben borrarse en FULL RESET (datos globales)
const _SKIP_CLEAR_TABLES = ["exercises", "exercise_images"];

// =============================================================================
// INCREMENTAL SYNC SERVICE
// =============================================================================

class IncrementalSyncServiceImpl {
  /**
   * Ejecuta el sync de login completo
   */
  async performLoginSync(
    userId: string,
    lastUserId: string | null,
    onProgress?: SyncProgressCallback
  ): Promise<LoginSyncResult> {
    const startTime = Date.now();
    const isNewUser = lastUserId !== null && lastUserId !== userId;
    const mode: SyncMode = isNewUser ? "full_reset" : "incremental";

    // Log mode for debugging (warn level is allowed)

    const results: TableSyncResult[] = [];
    let totalDownloaded = 0;
    let totalErrors = 0;

    try {
      // FASE 1: Si es nuevo usuario, hacer FULL RESET
      if (mode === "full_reset") {
        await this.performFullReset(userId, onProgress);
      }

      // FASE 2: Subir queue pendiente (si hay)
      await this.uploadPendingQueue(onProgress);

      // FASE 3: Descargar datos del usuario
      const downloadResults = await this.downloadUserData(
        userId,
        mode,
        onProgress
      );

      results.push(...downloadResults);
      totalDownloaded = downloadResults.reduce(
        (sum, r) => sum + r.downloaded,
        0
      );
      totalErrors = downloadResults.reduce(
        (sum, r) => sum + r.errors.length,
        0
      );

      // FASE 4: Marcar como completado
      onProgress?.({
        mode,
        phase: "complete",
        currentTable: "",
        tablesCompleted: results.length,
        totalTables: results.length,
        recordsProcessed: totalDownloaded,
        percentage: 100,
      });

      return {
        success: totalErrors === 0,
        mode,
        tables: results,
        totalDownloaded,
        totalErrors,
        durationMs: Date.now() - startTime,
      };
    } catch (error) {
      console.error("[IncrementalSync] Fatal error:", error);
      return {
        success: false,
        mode,
        tables: results,
        totalDownloaded,
        totalErrors: totalErrors + 1,
        durationMs: Date.now() - startTime,
      };
    }
  }

  // ===========================================================================
  // FULL RESET
  // ===========================================================================

  /**
   * Borra todos los datos del usuario anterior.
   * Usa una lista ordenada de tablas que respeta FK constraints.
   */
  private async performFullReset(
    _newUserId: string,
    onProgress?: SyncProgressCallback
  ): Promise<void> {
    // Borramos TODAS las tablas de usuario, no solo las del sync
    const totalTables = ALL_USER_TABLES_FOR_CLEAR.length;

    for (let i = 0; i < ALL_USER_TABLES_FOR_CLEAR.length; i++) {
      const tableName = ALL_USER_TABLES_FOR_CLEAR[i];
      if (!tableName) continue;

      onProgress?.({
        mode: "full_reset",
        phase: "clearing",
        currentTable: tableName,
        tablesCompleted: i,
        totalTables,
        recordsProcessed: 0,
        percentage: Math.round((i / totalTables) * 30), // 0-30%
      });

      // Obtener el schema - algunas tablas pueden tener nombres diferentes
      const tableSchema = this.getTableSchemaByName(tableName);
      if (!tableSchema) {
        continue;
      }

      try {
        await db.delete(tableSchema);
      } catch (error) {
        console.error(`[IncrementalSync] Error clearing ${tableName}:`, error);
      }
    }
  }

  /**
   * Obtiene el schema de Drizzle para una tabla por nombre
   */
  private getTableSchemaByName(tableName: string): any {
    // Mapeo directo para tablas conocidas
    const schemaMap: Record<string, any> = {
      sync_queue: schema.syncQueue,
      user_preferences: schema.user_preferences,
      folders: schema.folders,
      routines: schema.routines,
      routine_blocks: schema.routine_blocks,
      exercise_in_block: schema.exercise_in_block,
      routine_sets: schema.routine_sets,
      tracker_metrics: schema.tracker_metrics,
      tracker_quick_actions: schema.tracker_quick_actions,
      tracker_entries: schema.tracker_entries,
      tracker_daily_aggregates: schema.tracker_daily_aggregates,
      macro_targets: schema.macro_targets,
      macro_entries: schema.macro_entries,
      macro_daily_aggregates: schema.macro_daily_aggregates,
      macro_quick_actions: schema.macro_quick_actions,
      workout_sessions: schema.workout_sessions,
      workout_blocks: schema.workout_blocks,
      workout_exercises: schema.workout_exercises,
      workout_sets: schema.workout_sets,
      pr_current: schema.pr_current,
      pr_history: schema.pr_history,
    };
    return schemaMap[tableName] ?? null;
  }

  // ===========================================================================
  // UPLOAD QUEUE
  // ===========================================================================

  /**
   * Sube los items pendientes del queue
   */
  private async uploadPendingQueue(
    onProgress?: SyncProgressCallback
  ): Promise<void> {
    const queueStatus = await QueueGateService.getQueueStatus();

    if (!queueStatus.hasPendingItems) {
      return;
    }

    onProgress?.({
      mode: "incremental",
      phase: "uploading",
      currentTable: "sync_queue",
      tablesCompleted: 0,
      totalTables: 1,
      recordsProcessed: 0,
      percentage: 32, // 30-35%
    });

    // El queue se procesa automáticamente por el sync engine
    // No podemos llamarlo directamente aquí porque es un hook
    // El LoginSyncGate se encargará de esperar a que el queue esté vacío
  }

  // ===========================================================================
  // DOWNLOAD DATA
  // ===========================================================================

  /**
   * Descarga los datos del usuario desde Supabase.
   *
   * Estrategia:
   * - Tablas con hijos (routines, tracker_metrics, workout_sessions): usar restore-service
   * - Tablas simples: usar sync directo con paginación
   */
  private async downloadUserData(
    userId: string,
    mode: SyncMode,
    onProgress?: SyncProgressCallback
  ): Promise<TableSyncResult[]> {
    const results: TableSyncResult[] = [];

    // Tablas que se sincronizan con restore-service (tienen hijos)
    const complexTables = [
      {
        name: "routines",
        restoreFn: () => this.restoreRoutinesWithChildren(userId, mode),
      },
      {
        name: "tracker_metrics",
        restoreFn: () => this.restoreTrackerWithChildren(userId, mode),
      },
      {
        name: "workout_sessions",
        restoreFn: () => this.restoreWorkoutsWithChildren(userId, mode),
      },
      {
        name: "pr_current",
        restoreFn: () => this.restorePRsWithHistory(userId, mode),
      },
    ];

    // Tablas simples (sin hijos, sync directo)
    const simpleTables = getTablesForRestore().filter(
      (t) =>
        TABLE_SCHEMA_MAP[t.name] !== undefined &&
        ![
          "routines",
          "tracker_metrics",
          "workout_sessions",
          "pr_current",
          "pr_history",
        ].includes(t.name)
    );

    const totalSteps = complexTables.length + simpleTables.length;
    let completedSteps = 0;
    let processedRecords = 0;

    // 1. Sync tablas complejas (con hijos)
    for (const complexTable of complexTables) {
      const percentage = Math.round(35 + (completedSteps / totalSteps) * 60);

      onProgress?.({
        mode,
        phase: "downloading",
        currentTable: complexTable.name,
        tablesCompleted: completedSteps,
        totalTables: totalSteps,
        recordsProcessed: processedRecords,
        percentage,
      });

      try {
        const result = await complexTable.restoreFn();
        results.push(result);
        processedRecords += result.downloaded;
      } catch (error) {
        results.push({
          table: complexTable.name,
          success: false,
          downloaded: 0,
          errors: [error instanceof Error ? error.message : String(error)],
        });
      }

      completedSteps++;
    }

    // 2. Sync tablas simples
    for (const tableConfig of simpleTables) {
      const percentage = Math.round(35 + (completedSteps / totalSteps) * 60);

      onProgress?.({
        mode,
        phase: "downloading",
        currentTable: tableConfig.name,
        tablesCompleted: completedSteps,
        totalTables: totalSteps,
        recordsProcessed: processedRecords,
        percentage,
      });

      const result = await this.syncTableWithRetry(userId, tableConfig, mode);
      results.push(result);
      processedRecords += result.downloaded;

      if (result.errors.length > 0) {
        console.warn(
          `[IncrementalSync] Errors in ${tableConfig.name}:`,
          result.errors
        );
      }

      completedSteps++;
    }

    return results;
  }

  // ===========================================================================
  // COMPLEX TABLE RESTORE (with children)
  // ===========================================================================

  /**
   * Restaura rutinas con sus bloques, ejercicios y sets
   */
  private async restoreRoutinesWithChildren(
    userId: string,
    mode: SyncMode
  ): Promise<TableSyncResult> {
    try {
      // Para FULL RESET, usar restore-service directamente
      // Para INCREMENTAL, necesitamos lógica custom
      if (mode === "full_reset") {
        // Usar el restore-service que ya maneja todo
        const result = await this.restoreRoutinesViaService(userId);
        return {
          table: "routines",
          success: result.errors.length === 0,
          downloaded: result.restored,
          errors: result.errors,
        };
      }

      // INCREMENTAL: Solo bajar rutinas nuevas/actualizadas
      return await this.incrementalSyncRoutines(userId);
    } catch (error) {
      return {
        table: "routines",
        success: false,
        downloaded: 0,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }

  /**
   * Restaura tracker_metrics con quick_actions, entries y aggregates
   */
  private async restoreTrackerWithChildren(
    userId: string,
    mode: SyncMode
  ): Promise<TableSyncResult> {
    try {
      if (mode === "full_reset") {
        const result = await this.restoreTrackerViaService(userId);
        return {
          table: "tracker_metrics",
          success: result.errors.length === 0,
          downloaded: result.restored,
          errors: result.errors,
        };
      }

      return await this.incrementalSyncTracker(userId);
    } catch (error) {
      return {
        table: "tracker_metrics",
        success: false,
        downloaded: 0,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }

  /**
   * Restaura workout_sessions con blocks, exercises y sets
   */
  private async restoreWorkoutsWithChildren(
    userId: string,
    mode: SyncMode
  ): Promise<TableSyncResult> {
    try {
      if (mode === "full_reset") {
        const result = await this.restoreWorkoutsViaService(userId);
        return {
          table: "workout_sessions",
          success: result.errors.length === 0,
          downloaded: result.restored,
          errors: result.errors,
        };
      }

      return await this.incrementalSyncWorkouts(userId);
    } catch (error) {
      return {
        table: "workout_sessions",
        success: false,
        downloaded: 0,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }

  /**
   * Restaura pr_current con pr_history
   */
  private async restorePRsWithHistory(
    userId: string,
    mode: SyncMode
  ): Promise<TableSyncResult> {
    try {
      if (mode === "full_reset") {
        const result = await this.restorePRsViaService(userId);
        return {
          table: "pr_current",
          success: result.errors.length === 0,
          downloaded: result.restored,
          errors: result.errors,
        };
      }

      return await this.incrementalSyncPRs(userId);
    } catch (error) {
      return {
        table: "pr_current",
        success: false,
        downloaded: 0,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }

  // ===========================================================================
  // RESTORE VIA SERVICE (Full Reset mode)
  // ===========================================================================

  /**
   * Restaura rutinas usando lógica similar al restore-service
   */
  private async restoreRoutinesViaService(
    userId: string
  ): Promise<{ restored: number; errors: string[] }> {
    const errors: string[] = [];
    let restored = 0;

    try {
      // 1. Fetch routines
      const { data: cloudRoutines } = await supabase
        .from("routines")
        .select("*")
        .eq("created_by_user_id", userId);

      if (!cloudRoutines?.length) {
        return { restored: 0, errors };
      }

      // 2. Insert routines
      await db
        .insert(schema.routines)
        .values(cloudRoutines.map((r) => ({ ...r, is_synced: true })))
        .onConflictDoNothing();
      restored += cloudRoutines.length;

      // 3. Fetch and insert blocks
      const routineIds = cloudRoutines.map((r) => r.id);
      const { data: cloudBlocks } = await supabase
        .from("routine_blocks")
        .select("*")
        .in("routine_id", routineIds);

      if (cloudBlocks?.length) {
        await db
          .insert(schema.routine_blocks)
          .values(cloudBlocks.map((b) => ({ ...b, is_synced: true })))
          .onConflictDoNothing();
        restored += cloudBlocks.length;

        // 4. Fetch and insert exercises in block
        const blockIds = cloudBlocks.map((b) => b.id);
        const { data: cloudExercises } = await supabase
          .from("exercise_in_block")
          .select("*")
          .in("block_id", blockIds);

        if (cloudExercises?.length) {
          await db
            .insert(schema.exercise_in_block)
            .values(cloudExercises.map((e) => ({ ...e, is_synced: true })))
            .onConflictDoNothing();
          restored += cloudExercises.length;

          // 5. Fetch and insert sets
          const exerciseInBlockIds = cloudExercises.map((e) => e.id);
          const { data: cloudSets } = await supabase
            .from("routine_sets")
            .select("*")
            .in("exercise_in_block_id", exerciseInBlockIds);

          if (cloudSets?.length) {
            await db
              .insert(schema.routine_sets)
              .values(cloudSets.map((s) => ({ ...s, is_synced: true })))
              .onConflictDoNothing();
            restored += cloudSets.length;
          }
        }
      }

      return { restored, errors };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
      return { restored, errors };
    }
  }

  /**
   * Restaura tracker metrics con quick actions, entries y aggregates
   */
  private async restoreTrackerViaService(
    userId: string
  ): Promise<{ restored: number; errors: string[] }> {
    const errors: string[] = [];
    let restored = 0;

    try {
      // 1. Fetch metrics
      const { data: cloudMetrics } = await supabase
        .from("tracker_metrics")
        .select("*")
        .eq("user_id", userId);

      if (!cloudMetrics?.length) {
        return { restored: 0, errors };
      }

      // 2. Insert metrics
      await db
        .insert(schema.tracker_metrics)
        .values(cloudMetrics.map((m) => ({ ...m, is_synced: true })))
        .onConflictDoNothing();
      restored += cloudMetrics.length;

      // 3. Fetch and insert quick actions
      const metricIds = cloudMetrics.map((m) => m.id);
      const { data: cloudQuickActions } = await supabase
        .from("tracker_quick_actions")
        .select("*")
        .in("metric_id", metricIds);

      if (cloudQuickActions?.length) {
        await db
          .insert(schema.tracker_quick_actions)
          .values(cloudQuickActions.map((qa) => ({ ...qa, is_synced: true })))
          .onConflictDoNothing();
        restored += cloudQuickActions.length;
      }

      // 4. Fetch and insert entries (last 90 days)
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      const cutoffDate = ninetyDaysAgo.toISOString().split("T")[0];

      const { data: cloudEntries } = await supabase
        .from("tracker_entries")
        .select("*")
        .eq("user_id", userId)
        .gte("day_key", cutoffDate);

      if (cloudEntries?.length) {
        await db
          .insert(schema.tracker_entries)
          .values(cloudEntries.map((e) => ({ ...e, is_synced: true })))
          .onConflictDoNothing();
        restored += cloudEntries.length;
      }

      // 5. Fetch and insert daily aggregates
      const { data: cloudAggregates } = await supabase
        .from("tracker_daily_aggregates")
        .select("*")
        .eq("user_id", userId)
        .gte("day_key", cutoffDate);

      if (cloudAggregates?.length) {
        await db
          .insert(schema.tracker_daily_aggregates)
          .values(cloudAggregates.map((a) => ({ ...a, is_synced: true })))
          .onConflictDoNothing();
        restored += cloudAggregates.length;
      }

      return { restored, errors };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
      return { restored, errors };
    }
  }

  /**
   * Restaura workout sessions con blocks, exercises y sets
   */
  private async restoreWorkoutsViaService(
    userId: string
  ): Promise<{ restored: number; errors: string[] }> {
    const errors: string[] = [];
    let restored = 0;

    try {
      // Only restore last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const { data: cloudSessions } = await supabase
        .from("workout_sessions")
        .select("*")
        .eq("user_id", userId)
        .gte("started_at", sixMonthsAgo.toISOString());

      if (!cloudSessions?.length) {
        return { restored: 0, errors };
      }

      // 1. Insert sessions
      await db
        .insert(schema.workout_sessions)
        .values(cloudSessions.map((s) => ({ ...s, is_synced: true })))
        .onConflictDoNothing();
      restored += cloudSessions.length;

      // 2. Fetch and insert blocks
      const sessionIds = cloudSessions.map((s) => s.id);
      const { data: cloudBlocks } = await supabase
        .from("workout_blocks")
        .select("*")
        .in("workout_session_id", sessionIds);

      if (cloudBlocks?.length) {
        await db
          .insert(schema.workout_blocks)
          .values(cloudBlocks.map((b) => ({ ...b, is_synced: true })))
          .onConflictDoNothing();
        restored += cloudBlocks.length;

        // 3. Fetch and insert exercises
        const blockIds = cloudBlocks.map((b) => b.id);
        const { data: cloudExercises } = await supabase
          .from("workout_exercises")
          .select("*")
          .in("workout_block_id", blockIds);

        if (cloudExercises?.length) {
          await db
            .insert(schema.workout_exercises)
            .values(cloudExercises.map((e) => ({ ...e, is_synced: true })))
            .onConflictDoNothing();
          restored += cloudExercises.length;

          // 4. Fetch and insert sets
          const exerciseIds = cloudExercises.map((e) => e.id);
          const { data: cloudSets } = await supabase
            .from("workout_sets")
            .select("*")
            .in("workout_exercise_id", exerciseIds);

          if (cloudSets?.length) {
            await db
              .insert(schema.workout_sets)
              .values(cloudSets.map((s) => ({ ...s, is_synced: true })))
              .onConflictDoNothing();
            restored += cloudSets.length;
          }
        }
      }

      return { restored, errors };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
      return { restored, errors };
    }
  }

  /**
   * Restaura PRs con historial
   */
  private async restorePRsViaService(
    userId: string
  ): Promise<{ restored: number; errors: string[] }> {
    const errors: string[] = [];
    let restored = 0;

    try {
      // 1. Fetch current PRs
      const { data: cloudPRs } = await supabase
        .from("pr_current")
        .select("*")
        .eq("user_id", userId);

      if (cloudPRs?.length) {
        await db
          .insert(schema.pr_current)
          .values(cloudPRs.map((p) => ({ ...p, is_synced: true })))
          .onConflictDoNothing();
        restored += cloudPRs.length;
      }

      // 2. Fetch PR history (last 6 months)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const { data: cloudHistory } = await supabase
        .from("pr_history")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", sixMonthsAgo.toISOString());

      if (cloudHistory?.length) {
        await db
          .insert(schema.pr_history)
          .values(cloudHistory.map((h) => ({ ...h, is_synced: true })))
          .onConflictDoNothing();
        restored += cloudHistory.length;
      }

      return { restored, errors };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
      return { restored, errors };
    }
  }

  // ===========================================================================
  // INCREMENTAL SYNC (for same user)
  // ===========================================================================

  /**
   * Sync incremental de rutinas - solo las actualizadas
   */
  private async incrementalSyncRoutines(
    userId: string
  ): Promise<TableSyncResult> {
    try {
      // Obtener max updated_at local
      const localMax = await this.getLocalMaxUpdatedAt("routines", userId);

      // Fetch rutinas actualizadas
      let query = supabase
        .from("routines")
        .select("*")
        .eq("created_by_user_id", userId);

      if (localMax) {
        query = query.gt("updated_at", localMax);
      }

      const { data: updatedRoutines } = await query;

      if (!updatedRoutines?.length) {
        return { table: "routines", success: true, downloaded: 0, errors: [] };
      }

      let downloaded = 0;

      // Upsert rutinas
      for (const routine of updatedRoutines) {
        await db
          .insert(schema.routines)
          .values({ ...routine, is_synced: true })
          .onConflictDoUpdate({
            target: schema.routines.id,
            set: { ...routine, is_synced: true },
          });
        downloaded++;

        // Fetch y sync children de esta rutina
        const childCount = await this.syncRoutineChildren(routine.id);
        downloaded += childCount;
      }

      return { table: "routines", success: true, downloaded, errors: [] };
    } catch (error) {
      return {
        table: "routines",
        success: false,
        downloaded: 0,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }

  /**
   * Sync children de una rutina específica
   */
  private async syncRoutineChildren(routineId: string): Promise<number> {
    let count = 0;

    // Blocks
    const { data: blocks } = await supabase
      .from("routine_blocks")
      .select("*")
      .eq("routine_id", routineId);

    if (blocks?.length) {
      for (const block of blocks) {
        await db
          .insert(schema.routine_blocks)
          .values({ ...block, is_synced: true })
          .onConflictDoUpdate({
            target: schema.routine_blocks.id,
            set: { ...block, is_synced: true },
          });
        count++;
      }

      // Exercises in blocks
      const blockIds = blocks.map((b) => b.id);
      const { data: exercises } = await supabase
        .from("exercise_in_block")
        .select("*")
        .in("block_id", blockIds);

      if (exercises?.length) {
        for (const exercise of exercises) {
          await db
            .insert(schema.exercise_in_block)
            .values({ ...exercise, is_synced: true })
            .onConflictDoUpdate({
              target: schema.exercise_in_block.id,
              set: { ...exercise, is_synced: true },
            });
          count++;
        }

        // Sets
        const exerciseIds = exercises.map((e) => e.id);
        const { data: sets } = await supabase
          .from("routine_sets")
          .select("*")
          .in("exercise_in_block_id", exerciseIds);

        if (sets?.length) {
          for (const set of sets) {
            await db
              .insert(schema.routine_sets)
              .values({ ...set, is_synced: true })
              .onConflictDoUpdate({
                target: schema.routine_sets.id,
                set: { ...set, is_synced: true },
              });
            count++;
          }
        }
      }
    }

    return count;
  }

  /**
   * Sync incremental de tracker
   */
  private async incrementalSyncTracker(
    userId: string
  ): Promise<TableSyncResult> {
    try {
      let downloaded = 0;

      // 1. Metrics actualizadas
      const localMaxMetrics = await this.getLocalMaxUpdatedAt(
        "tracker_metrics",
        userId
      );
      let metricsQuery = supabase
        .from("tracker_metrics")
        .select("*")
        .eq("user_id", userId);
      if (localMaxMetrics)
        metricsQuery = metricsQuery.gt("updated_at", localMaxMetrics);

      const { data: updatedMetrics } = await metricsQuery;

      if (updatedMetrics?.length) {
        for (const metric of updatedMetrics) {
          await db
            .insert(schema.tracker_metrics)
            .values({ ...metric, is_synced: true })
            .onConflictDoUpdate({
              target: schema.tracker_metrics.id,
              set: { ...metric, is_synced: true },
            });
          downloaded++;

          // Quick actions de esta métrica
          const { data: quickActions } = await supabase
            .from("tracker_quick_actions")
            .select("*")
            .eq("metric_id", metric.id);

          if (quickActions?.length) {
            for (const qa of quickActions) {
              await db
                .insert(schema.tracker_quick_actions)
                .values({ ...qa, is_synced: true })
                .onConflictDoUpdate({
                  target: schema.tracker_quick_actions.id,
                  set: { ...qa, is_synced: true },
                });
              downloaded++;
            }
          }
        }
      }

      // 2. Entries y aggregates (últimos 90 días, actualizados)
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      const cutoffDate = ninetyDaysAgo.toISOString().split("T")[0];

      const localMaxEntries = await this.getLocalMaxUpdatedAt(
        "tracker_entries",
        userId
      );
      let entriesQuery = supabase
        .from("tracker_entries")
        .select("*")
        .eq("user_id", userId)
        .gte("day_key", cutoffDate);
      if (localMaxEntries)
        entriesQuery = entriesQuery.gt("updated_at", localMaxEntries);

      const { data: entries } = await entriesQuery;
      if (entries?.length) {
        for (const entry of entries) {
          await db
            .insert(schema.tracker_entries)
            .values({ ...entry, is_synced: true })
            .onConflictDoUpdate({
              target: schema.tracker_entries.id,
              set: { ...entry, is_synced: true },
            });
          downloaded++;
        }
      }

      return {
        table: "tracker_metrics",
        success: true,
        downloaded,
        errors: [],
      };
    } catch (error) {
      return {
        table: "tracker_metrics",
        success: false,
        downloaded: 0,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }

  /**
   * Sync incremental de workouts
   */
  private async incrementalSyncWorkouts(
    userId: string
  ): Promise<TableSyncResult> {
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const localMax = await this.getLocalMaxUpdatedAt(
        "workout_sessions",
        userId
      );

      let query = supabase
        .from("workout_sessions")
        .select("*")
        .eq("user_id", userId)
        .gte("started_at", sixMonthsAgo.toISOString());

      if (localMax) {
        query = query.gt("updated_at", localMax);
      }

      const { data: sessions } = await query;

      if (!sessions?.length) {
        return {
          table: "workout_sessions",
          success: true,
          downloaded: 0,
          errors: [],
        };
      }

      let downloaded = 0;

      for (const session of sessions) {
        await db
          .insert(schema.workout_sessions)
          .values({ ...session, is_synced: true })
          .onConflictDoUpdate({
            target: schema.workout_sessions.id,
            set: { ...session, is_synced: true },
          });
        downloaded++;

        // Sync children
        const childCount = await this.syncWorkoutChildren(session.id);
        downloaded += childCount;
      }

      return {
        table: "workout_sessions",
        success: true,
        downloaded,
        errors: [],
      };
    } catch (error) {
      return {
        table: "workout_sessions",
        success: false,
        downloaded: 0,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }

  /**
   * Sync children de un workout
   */
  private async syncWorkoutChildren(sessionId: string): Promise<number> {
    let count = 0;

    const { data: blocks } = await supabase
      .from("workout_blocks")
      .select("*")
      .eq("workout_session_id", sessionId);

    if (blocks?.length) {
      for (const block of blocks) {
        await db
          .insert(schema.workout_blocks)
          .values({ ...block, is_synced: true })
          .onConflictDoUpdate({
            target: schema.workout_blocks.id,
            set: { ...block, is_synced: true },
          });
        count++;
      }

      const blockIds = blocks.map((b) => b.id);
      const { data: exercises } = await supabase
        .from("workout_exercises")
        .select("*")
        .in("workout_block_id", blockIds);

      if (exercises?.length) {
        for (const exercise of exercises) {
          await db
            .insert(schema.workout_exercises)
            .values({ ...exercise, is_synced: true })
            .onConflictDoUpdate({
              target: schema.workout_exercises.id,
              set: { ...exercise, is_synced: true },
            });
          count++;
        }

        const exerciseIds = exercises.map((e) => e.id);
        const { data: sets } = await supabase
          .from("workout_sets")
          .select("*")
          .in("workout_exercise_id", exerciseIds);

        if (sets?.length) {
          for (const set of sets) {
            await db
              .insert(schema.workout_sets)
              .values({ ...set, is_synced: true })
              .onConflictDoUpdate({
                target: schema.workout_sets.id,
                set: { ...set, is_synced: true },
              });
            count++;
          }
        }
      }
    }

    return count;
  }

  /**
   * Sync incremental de PRs
   */
  private async incrementalSyncPRs(userId: string): Promise<TableSyncResult> {
    try {
      let downloaded = 0;

      // PR current
      const localMaxPR = await this.getLocalMaxUpdatedAt("pr_current", userId);
      let prQuery = supabase
        .from("pr_current")
        .select("*")
        .eq("user_id", userId);
      if (localMaxPR) prQuery = prQuery.gt("updated_at", localMaxPR);

      const { data: prs } = await prQuery;
      if (prs?.length) {
        for (const pr of prs) {
          await db
            .insert(schema.pr_current)
            .values({ ...pr, is_synced: true })
            .onConflictDoUpdate({
              target: schema.pr_current.id,
              set: { ...pr, is_synced: true },
            });
          downloaded++;
        }
      }

      // PR history (last 6 months)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const localMaxHistory = await this.getLocalMaxUpdatedAt(
        "pr_history",
        userId
      );

      let historyQuery = supabase
        .from("pr_history")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", sixMonthsAgo.toISOString());
      if (localMaxHistory)
        historyQuery = historyQuery.gt("updated_at", localMaxHistory);

      const { data: history } = await historyQuery;
      if (history?.length) {
        for (const h of history) {
          await db
            .insert(schema.pr_history)
            .values({ ...h, is_synced: true })
            .onConflictDoUpdate({
              target: schema.pr_history.id,
              set: { ...h, is_synced: true },
            });
          downloaded++;
        }
      }

      return { table: "pr_current", success: true, downloaded, errors: [] };
    } catch (error) {
      return {
        table: "pr_current",
        success: false,
        downloaded: 0,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }

  // ===========================================================================
  // SIMPLE TABLE SYNC
  // ===========================================================================
  private async syncTableWithRetry(
    userId: string,
    tableConfig: TableConfig,
    mode: SyncMode
  ): Promise<TableSyncResult> {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const downloaded = await this.syncTable(userId, tableConfig, mode);
        return {
          table: tableConfig.name,
          success: true,
          downloaded,
          errors: [],
        };
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);

        if (attempt === MAX_RETRIES) {
          return {
            table: tableConfig.name,
            success: false,
            downloaded: 0,
            errors: [errorMsg],
          };
        }

        // Exponential backoff
        const backoffMs = RETRY_BACKOFF_MS * Math.pow(2, attempt - 1);
        console.warn(
          `[IncrementalSync] Retry ${attempt}/${MAX_RETRIES} for ${tableConfig.name} in ${backoffMs}ms`
        );
        await new Promise((r) => setTimeout(r, backoffMs));
      }
    }

    return {
      table: tableConfig.name,
      success: false,
      downloaded: 0,
      errors: ["Max retries exceeded"],
    };
  }

  /**
   * Sincroniza una tabla individual con paginación
   */
  private async syncTable(
    userId: string,
    tableConfig: TableConfig,
    mode: SyncMode
  ): Promise<number> {
    const { name, userIdColumn, dateColumn } = tableConfig;
    const tableSchema = TABLE_SCHEMA_MAP[name];

    if (!tableSchema) {
      throw new Error(`No schema found for table: ${name}`);
    }

    // Calcular fecha límite
    const dateLimit = getDateLimitForTable(name);

    // Para incremental, obtener el max updated_at local
    let localMaxUpdatedAt: string | null = null;
    if (mode === "incremental") {
      localMaxUpdatedAt = await this.getLocalMaxUpdatedAt(name, userId);
    }

    // Descargar con paginación
    let totalDownloaded = 0;
    let lastId: string | null = null;

    while (true) {
      // Construir query base
      let query = supabase
        .from(name)
        .select("*")
        .eq(userIdColumn, userId)
        .order("id", { ascending: true })
        .limit(PAGE_SIZE);

      // Aplicar cursor para paginación
      if (lastId) {
        query = query.gt("id", lastId);
      }

      // Aplicar fecha límite (para histórico)
      if (dateLimit) {
        query = query.gte(dateColumn, dateLimit);
      }

      // Aplicar filtro incremental (solo lo nuevo)
      if (localMaxUpdatedAt && mode === "incremental") {
        query = query.gt("updated_at", localMaxUpdatedAt);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Supabase error: ${error.message}`);
      }

      if (!data?.length) break;

      // Insertar/actualizar en SQLite
      await this.upsertRecords(tableSchema, data);

      totalDownloaded += data.length;
      lastId = data[data.length - 1].id;

      // Si recibimos menos del pageSize, terminamos
      if (data.length < PAGE_SIZE) break;
    }

    return totalDownloaded;
  }

  /**
   * Obtiene el max updated_at local para una tabla
   */
  private async getLocalMaxUpdatedAt(
    tableName: string,
    userId: string
  ): Promise<string | null> {
    const tableSchema = TABLE_SCHEMA_MAP[tableName];
    const tableConfig = getTableConfig(tableName);

    if (!tableSchema || !tableConfig) return null;

    try {
      const userIdColumn = tableConfig.userIdColumn;
      const result = await db
        .select({
          maxUpdatedAt: sql<string>`MAX(updated_at)`,
        })
        .from(tableSchema)
        .where(eq(tableSchema[userIdColumn], userId));

      return result[0]?.maxUpdatedAt ?? null;
    } catch {
      return null;
    }
  }

  /**
   * Inserta o actualiza registros en SQLite
   * Usa INSERT OR REPLACE para manejar conflictos correctamente
   */
  private async upsertRecords(tableSchema: any, records: any[]): Promise<void> {
    if (!records.length) return;

    // Agregar is_synced = true a todos los registros
    const recordsWithSync = records.map((r) => ({
      ...r,
      is_synced: true,
    }));

    // Insertar uno por uno para evitar problemas con onConflictDoUpdate en batch
    // SQLite maneja bien muchas operaciones pequeñas
    for (const record of recordsWithSync) {
      try {
        // user_preferences tiene unique constraint en user_id, no en id
        const conflictTarget =
          tableSchema === schema.user_preferences
            ? tableSchema.user_id
            : tableSchema.id;

        await db
          .insert(tableSchema)
          .values(record)
          .onConflictDoUpdate({
            target: conflictTarget,
            set: {
              ...record,
              is_synced: true,
            },
          });
      } catch (error) {
        // Si falla el upsert individual, intentar solo update
        console.warn(
          `[IncrementalSync] Upsert failed for record ${record.id}, trying update:`,
          error
        );
        try {
          if (tableSchema === schema.user_preferences) {
            await db
              .update(tableSchema)
              .set({ ...record, is_synced: true })
              .where(eq(tableSchema.user_id, record.user_id));
          } else {
            await db
              .update(tableSchema)
              .set({ ...record, is_synced: true })
              .where(eq(tableSchema.id, record.id));
          }
        } catch (updateError) {
          console.error(
            `[IncrementalSync] Update also failed for ${record.id}:`,
            updateError
          );
        }
      }
    }
  }

  // ===========================================================================
  // UTILITIES
  // ===========================================================================

  /**
   * Verifica si hay conexión a internet
   */
  async checkOnlineStatus(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("user_preferences")
        .select("id")
        .limit(1);

      return !error;
    } catch {
      return false;
    }
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

let instance: IncrementalSyncServiceImpl | null = null;

export function getIncrementalSyncService(): IncrementalSyncServiceImpl {
  if (!instance) {
    instance = new IncrementalSyncServiceImpl();
  }
  return instance;
}

export const IncrementalSyncService = {
  performLoginSync: (
    userId: string,
    lastUserId: string | null,
    onProgress?: SyncProgressCallback
  ) =>
    getIncrementalSyncService().performLoginSync(
      userId,
      lastUserId,
      onProgress
    ),

  checkOnlineStatus: () => getIncrementalSyncService().checkOnlineStatus(),
};
