/**
 * Restore Service - Recuperación de datos desde Supabase
 *
 * Este servicio permite restaurar toda la data de un usuario desde Supabase
 * a SQLite local. Se usa cuando:
 * - Usuario instala la app en un nuevo dispositivo
 * - Usuario reinstala la app
 * - Se necesita recuperar data perdida localmente
 *
 * El flujo es:
 * 1. Detectar si necesitamos restaurar (SQLite vacío + Supabase tiene data)
 * 2. Pull all data from Supabase por tabla
 * 3. Insert into SQLite con is_synced = true (ya viene de cloud)
 */

import { supabase } from "../../services/supabase";

// =============================================================================
// TYPES
// =============================================================================

export interface RestoreResult {
  success: boolean;
  tables: {
    [tableName: string]: {
      restored: number;
      errors: string[];
    };
  };
  totalRestored: number;
  errors: string[];
}

export interface RestoreProgress {
  currentTable: string;
  tablesCompleted: number;
  totalTables: number;
  itemsRestored: number;
}

export type RestoreProgressCallback = (progress: RestoreProgress) => void;

// =============================================================================
// RESTORE SERVICE
// =============================================================================

class RestoreServiceImpl {
  /**
   * Detecta si el usuario necesita restaurar datos
   * (SQLite vacío pero Supabase tiene datos)
   */
  async needsRestore(userId: string): Promise<boolean> {
    try {
      // Importar dinámicamente para evitar circular dependencies
      const { db } = await import("../../db/client");
      const { routines } = await import("../../db/schema/routine");
      const { eq, and, isNull } = await import("drizzle-orm");

      // Check si hay rutinas locales (indicador de que hay data)
      const localRoutines = await db
        .select({ id: routines.id })
        .from(routines)
        .where(
          and(
            eq(routines.created_by_user_id, userId),
            isNull(routines.deleted_at)
          )
        )
        .limit(1);

      // Si hay data local, no necesitamos restore
      if (localRoutines.length > 0) {
        return false;
      }

      // Check si hay data en Supabase
      const { count } = await supabase
        .from("routines")
        .select("*", { count: "exact", head: true })
        .eq("created_by_user_id", userId)
        .is("deleted_at", null);

      return (count ?? 0) > 0;
    } catch (error) {
      console.error(
        "[RestoreService] Error checking if restore needed:",
        error
      );
      return false;
    }
  }

  /**
   * Ejecuta el restore completo de todas las tablas
   */
  async restoreAll(
    userId: string,
    onProgress?: RestoreProgressCallback
  ): Promise<RestoreResult> {
    const result: RestoreResult = {
      success: true,
      tables: {},
      totalRestored: 0,
      errors: [],
    };

    const tables = [
      { name: "folders", fn: () => this.restoreFolders(userId) },
      { name: "routines", fn: () => this.restoreRoutines(userId) },
      {
        name: "user_preferences",
        fn: () => this.restoreUserPreferences(userId),
      },
      { name: "tracker_metrics", fn: () => this.restoreTrackerMetrics(userId) },
      { name: "macro_targets", fn: () => this.restoreMacroTargets(userId) },
      {
        name: "macro_quick_actions",
        fn: () => this.restoreMacroQuickActions(userId),
      },
      { name: "pr_current", fn: () => this.restorePRCurrent(userId) },
      {
        name: "workout_sessions",
        fn: () => this.restoreWorkoutSessions(userId),
      },
    ];

    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];
      if (!table) continue;

      onProgress?.({
        currentTable: table.name,
        tablesCompleted: i,
        totalTables: tables.length,
        itemsRestored: result.totalRestored,
      });

      try {
        const tableResult = await table.fn();
        result.tables[table.name] = tableResult;
        result.totalRestored += tableResult.restored;

        if (tableResult.errors.length > 0) {
          result.errors.push(
            ...tableResult.errors.map((e) => `[${table.name}] ${e}`)
          );
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        result.tables[table.name] = { restored: 0, errors: [errorMsg] };
        result.errors.push(`[${table.name}] ${errorMsg}`);
        result.success = false;
      }
    }

    onProgress?.({
      currentTable: "complete",
      tablesCompleted: tables.length,
      totalTables: tables.length,
      itemsRestored: result.totalRestored,
    });

    return result;
  }

  // =============================================================================
  // INDIVIDUAL TABLE RESTORE FUNCTIONS
  // =============================================================================

  private async restoreFolders(
    userId: string
  ): Promise<{ restored: number; errors: string[] }> {
    const errors: string[] = [];

    try {
      const { data: cloudFolders } = await supabase
        .from("folders")
        .select("*")
        .eq("created_by_user_id", userId);

      if (!cloudFolders?.length) {
        return { restored: 0, errors };
      }

      const { db } = await import("../../db/client");
      const { folders } = await import("../../db/schema/routine");

      // Insert con is_synced = true (ya viene de cloud)
      await db
        .insert(folders)
        .values(
          cloudFolders.map((f) => ({
            id: f.id,
            name: f.name,
            color: f.color,
            icon: f.icon,
            order_index: f.order_index,
            created_by_user_id: f.created_by_user_id,
            created_at: f.created_at,
            updated_at: f.updated_at,
            is_synced: true,
          }))
        )
        .onConflictDoNothing();

      return { restored: cloudFolders.length, errors };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
      return { restored: 0, errors };
    }
  }

  private async restoreRoutines(
    userId: string
  ): Promise<{ restored: number; errors: string[] }> {
    const errors: string[] = [];
    let restored = 0;

    try {
      // 1. Fetch all routines with their related data
      const { data: cloudRoutines } = await supabase
        .from("routines")
        .select("*")
        .eq("created_by_user_id", userId);

      if (!cloudRoutines?.length) {
        return { restored: 0, errors };
      }

      const { db } = await import("../../db/client");
      const { routines, routine_blocks, exercise_in_block, routine_sets } =
        await import("../../db/schema/routine");

      // 2. Insert routines
      await db
        .insert(routines)
        .values(
          cloudRoutines.map((r) => ({
            ...r,
            is_synced: true,
          }))
        )
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
          .insert(routine_blocks)
          .values(
            cloudBlocks.map((b) => ({
              ...b,
              is_synced: true,
            }))
          )
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
            .insert(exercise_in_block)
            .values(
              cloudExercises.map((e) => ({
                ...e,
                is_synced: true,
              }))
            )
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
              .insert(routine_sets)
              .values(
                cloudSets.map((s) => ({
                  ...s,
                  is_synced: true,
                }))
              )
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

  private async restoreUserPreferences(
    userId: string
  ): Promise<{ restored: number; errors: string[] }> {
    const errors: string[] = [];

    try {
      const { data: cloudPrefs } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (!cloudPrefs) {
        return { restored: 0, errors };
      }

      const { db } = await import("../../db/client");
      const { user_preferences } = await import("../../db/schema/user");

      await db
        .insert(user_preferences)
        .values({
          ...cloudPrefs,
          is_synced: true,
        })
        .onConflictDoNothing();

      return { restored: 1, errors };
    } catch (error) {
      // No preferences is not an error
      if ((error as any)?.code === "PGRST116") {
        return { restored: 0, errors };
      }
      errors.push(error instanceof Error ? error.message : String(error));
      return { restored: 0, errors };
    }
  }

  private async restoreTrackerMetrics(
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

      const { db } = await import("../../db/client");
      const {
        tracker_metrics,
        tracker_quick_actions,
        tracker_entries,
        tracker_daily_aggregates,
      } = await import("../../db/schema/tracker");

      // 2. Insert metrics
      await db
        .insert(tracker_metrics)
        .values(
          cloudMetrics.map((m) => ({
            ...m,
            is_synced: true,
          }))
        )
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
          .insert(tracker_quick_actions)
          .values(
            cloudQuickActions.map((qa) => ({
              ...qa,
              is_synced: true,
            }))
          )
          .onConflictDoNothing();
        restored += cloudQuickActions.length;
      }

      // 4. Fetch and insert entries (last 90 days for performance)
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
          .insert(tracker_entries)
          .values(
            cloudEntries.map((e) => ({
              ...e,
              is_synced: true,
            }))
          )
          .onConflictDoNothing();
        restored += cloudEntries.length;
      }

      // 5. Fetch and insert daily aggregates (last 90 days)
      const { data: cloudAggregates } = await supabase
        .from("tracker_daily_aggregates")
        .select("*")
        .eq("user_id", userId)
        .gte("day_key", cutoffDate);

      if (cloudAggregates?.length) {
        await db
          .insert(tracker_daily_aggregates)
          .values(
            cloudAggregates.map((a) => ({
              ...a,
              is_synced: true,
            }))
          )
          .onConflictDoNothing();
        restored += cloudAggregates.length;
      }

      return { restored, errors };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
      return { restored, errors };
    }
  }

  private async restoreMacroTargets(
    userId: string
  ): Promise<{ restored: number; errors: string[] }> {
    const errors: string[] = [];
    let restored = 0;

    try {
      const { data: cloudTargets } = await supabase
        .from("macro_targets")
        .select("*")
        .eq("user_id", userId);

      if (!cloudTargets?.length) {
        return { restored: 0, errors };
      }

      const { db } = await import("../../db/client");
      const { macro_targets, macro_entries, macro_daily_aggregates } =
        await import("../../db/schema/macros");

      // Insert targets
      await db
        .insert(macro_targets)
        .values(
          cloudTargets.map((t) => ({
            ...t,
            is_synced: true,
          }))
        )
        .onConflictDoNothing();
      restored += cloudTargets.length;

      // Fetch and insert entries (last 90 days)
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      const cutoffDate = ninetyDaysAgo.toISOString().split("T")[0];

      const { data: cloudEntries } = await supabase
        .from("macro_entries")
        .select("*")
        .eq("user_id", userId)
        .gte("day_key", cutoffDate);

      if (cloudEntries?.length) {
        await db
          .insert(macro_entries)
          .values(
            cloudEntries.map((e) => ({
              ...e,
              is_synced: true,
            }))
          )
          .onConflictDoNothing();
        restored += cloudEntries.length;
      }

      // Fetch and insert aggregates (last 90 days)
      const { data: cloudAggregates } = await supabase
        .from("macro_daily_aggregates")
        .select("*")
        .eq("user_id", userId)
        .gte("day_key", cutoffDate);

      if (cloudAggregates?.length) {
        await db
          .insert(macro_daily_aggregates)
          .values(
            cloudAggregates.map((a) => ({
              ...a,
              is_synced: true,
            }))
          )
          .onConflictDoNothing();
        restored += cloudAggregates.length;
      }

      return { restored, errors };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
      return { restored, errors };
    }
  }

  private async restoreMacroQuickActions(
    userId: string
  ): Promise<{ restored: number; errors: string[] }> {
    const errors: string[] = [];

    try {
      const { data: cloudActions } = await supabase
        .from("macro_quick_actions")
        .select("*")
        .eq("user_id", userId);

      if (!cloudActions?.length) {
        return { restored: 0, errors };
      }

      const { db } = await import("../../db/client");
      const { macro_quick_actions } = await import("../../db/schema/macros");

      await db
        .insert(macro_quick_actions)
        .values(
          cloudActions.map((a) => ({
            ...a,
            is_synced: true,
          }))
        )
        .onConflictDoNothing();

      return { restored: cloudActions.length, errors };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
      return { restored: 0, errors };
    }
  }

  private async restorePRCurrent(
    userId: string
  ): Promise<{ restored: number; errors: string[] }> {
    const errors: string[] = [];
    let restored = 0;

    try {
      const { data: cloudPRs } = await supabase
        .from("pr_current")
        .select("*")
        .eq("user_id", userId);

      if (!cloudPRs?.length) {
        return { restored: 0, errors };
      }

      const { db } = await import("../../db/client");
      const { pr_current, pr_history } = await import("../../db/schema/pr");

      // Insert current PRs
      await db
        .insert(pr_current)
        .values(
          cloudPRs.map((p) => ({
            ...p,
            is_synced: true,
          }))
        )
        .onConflictDoNothing();
      restored += cloudPRs.length;

      // Fetch and insert PR history
      const { data: cloudHistory } = await supabase
        .from("pr_history")
        .select("*")
        .eq("user_id", userId);

      if (cloudHistory?.length) {
        await db
          .insert(pr_history)
          .values(
            cloudHistory.map((h) => ({
              ...h,
              is_synced: true,
            }))
          )
          .onConflictDoNothing();
        restored += cloudHistory.length;
      }

      return { restored, errors };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
      return { restored, errors };
    }
  }

  private async restoreWorkoutSessions(
    userId: string
  ): Promise<{ restored: number; errors: string[] }> {
    const errors: string[] = [];
    let restored = 0;

    try {
      // Only restore last 6 months of workouts for performance
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

      const { db } = await import("../../db/client");
      const {
        workout_sessions,
        workout_blocks,
        workout_exercises,
        workout_sets,
      } = await import("../../db/schema/workout-session");

      // 1. Insert sessions
      await db
        .insert(workout_sessions)
        .values(
          cloudSessions.map((s) => ({
            ...s,
            is_synced: true,
          }))
        )
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
          .insert(workout_blocks)
          .values(
            cloudBlocks.map((b) => ({
              ...b,
              is_synced: true,
            }))
          )
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
            .insert(workout_exercises)
            .values(
              cloudExercises.map((e) => ({
                ...e,
                is_synced: true,
              }))
            )
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
              .insert(workout_sets)
              .values(
                cloudSets.map((s) => ({
                  ...s,
                  is_synced: true,
                }))
              )
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
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const restoreService = new RestoreServiceImpl();
