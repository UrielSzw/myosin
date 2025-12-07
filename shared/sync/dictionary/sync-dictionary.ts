import { syncFinishWorkoutToSupabase } from "../../services/finish-workout/supabase-finish-workout-repository";
import { SupabaseFoldersRepository } from "../repositories/supabase-folders-repository";
import { SupabaseMacrosRepository } from "../repositories/supabase-macros-repository";
import { SupabasePRRepository } from "../repositories/supabase-pr-repository";
import { SupabaseRoutinesRepository } from "../repositories/supabase-routines-repository";
import { SupabaseTrackerRepository } from "../repositories/supabase-tracker-repository";
import { SupabaseUserRepository } from "../repositories/supabase-user-repository";
import { SupabaseWorkoutRepository } from "../repositories/supabase-workout-repository";
import type {
  FinishWorkoutSyncPayload,
  FolderCreatePayload,
  FolderDeletePayload,
  FolderReorderPayload,
  FolderUpdatePayload,
  MacroEntryCreatePayload,
  MacroEntryDeletePayload,
  MacroEntryUpdatePayload,
  MacroQuickActionCreatePayload,
  MacroQuickActionDeletePayload,
  MacroQuickActionsInitPayload,
  MacroTargetUpdatePayload,
  MacroTargetUpsertPayload,
  MutationPayloadMap,
  PRCreatePayload,
  PRUpdatePayload,
  RoutineClearTrainingDaysPayload,
  RoutineConvertFromQuickPayload,
  RoutineCreatePayload,
  RoutineCreateQuickWorkoutPayload,
  RoutineDeletePayload,
  RoutineUpdateFolderPayload,
  RoutineUpdatePayload,
  TrackerDeleteEntryWithAggregatePayload,
  TrackerEntryCreatePayload,
  TrackerEntryDeletePayload,
  TrackerEntryFromQuickActionPayload,
  TrackerEntryUpdatePayload,
  TrackerEntryWithAggregatePayload,
  TrackerMetricCreatePayload,
  TrackerMetricDeletePayload,
  TrackerMetricFromTemplatePayload,
  TrackerMetricReorderPayload,
  TrackerMetricRestorePayload,
  TrackerMetricUpdatePayload,
  TrackerQuickActionCreatePayload,
  TrackerQuickActionDeletePayload,
  TrackerReplaceEntryWithAggregatePayload,
  UserPreferencesCreatePayload,
  UserPreferencesUpdatePayload,
  WorkoutCompletePayload,
  WorkoutStartPayload,
  WorkoutUpdatePayload,
} from "../types/mutation-payloads";
import type { MutationCode } from "../types/mutations";

// Repository instances
const foldersRepo = new SupabaseFoldersRepository();
const routinesRepo = new SupabaseRoutinesRepository();
const trackerRepo = new SupabaseTrackerRepository();
const macrosRepo = new SupabaseMacrosRepository();
const prRepo = new SupabasePRRepository();
const workoutRepo = new SupabaseWorkoutRepository();
const userRepo = new SupabaseUserRepository();

/**
 * Type-safe sync function signature.
 * Each function receives its specific payload type.
 */
type SyncFunction<T extends MutationCode> = (
  payload: MutationPayloadMap[T]
) => Promise<unknown>;

/**
 * Dictionary mapping mutation codes to their sync functions.
 * Fully typed - no more `any` in payloads!
 */
export const supabaseSyncDictionary: {
  [K in MutationCode]: SyncFunction<K>;
} = {
  // Routines
  ROUTINE_CREATE: (payload: RoutineCreatePayload) =>
    routinesRepo.createRoutineWithData(payload),
  ROUTINE_UPDATE: (payload: RoutineUpdatePayload) =>
    routinesRepo.updateRoutineWithData(payload.routineId, payload.data),
  ROUTINE_DELETE: (payload: RoutineDeletePayload) =>
    routinesRepo.deleteRoutineById(payload.id),
  ROUTINE_CLEAR_TRAINING_DAYS: (payload: RoutineClearTrainingDaysPayload) =>
    routinesRepo.clearRoutineTrainingDays(payload.routineId),
  ROUTINE_CREATE_QUICK_WORKOUT: (payload: RoutineCreateQuickWorkoutPayload) =>
    routinesRepo.createQuickWorkoutRoutine(payload),
  ROUTINE_CONVERT_FROM_QUICK: (payload: RoutineConvertFromQuickPayload) =>
    routinesRepo.convertQuickWorkoutToRoutine(
      payload.routineId,
      payload.newName
    ),
  ROUTINE_UPDATE_FOLDER: (payload: RoutineUpdateFolderPayload) =>
    routinesRepo.updateRoutineFolderId(payload.routineId, payload.folderId),

  // Folders
  FOLDER_CREATE: (payload: FolderCreatePayload) => foldersRepo.create(payload),
  FOLDER_UPDATE: (payload: FolderUpdatePayload) =>
    foldersRepo.update(payload.id, payload.data),
  FOLDER_DELETE: (payload: FolderDeletePayload) =>
    foldersRepo.delete(payload.id),
  FOLDER_REORDER: (payload: FolderReorderPayload) =>
    foldersRepo.reorderFolders(payload.orderedIds),

  // Tracker Entries
  TRACKER_ENTRY_CREATE: (payload: TrackerEntryCreatePayload) =>
    trackerRepo.createEntry(payload),
  TRACKER_ENTRY_UPDATE: (payload: TrackerEntryUpdatePayload) =>
    trackerRepo.updateEntry(payload.entryId, payload.data),
  TRACKER_ENTRY_DELETE: (payload: TrackerEntryDeletePayload) =>
    trackerRepo.deleteEntry(payload.entryId),
  TRACKER_ENTRY_FROM_QUICK_ACTION: (
    payload: TrackerEntryFromQuickActionPayload
  ) => trackerRepo.createEntryFromQuickAction(payload),
  TRACKER_ENTRY_WITH_AGGREGATE: (payload: TrackerEntryWithAggregatePayload) =>
    trackerRepo.createEntryWithAggregate(payload),
  TRACKER_REPLACE_ENTRY_WITH_AGGREGATE: (
    payload: TrackerReplaceEntryWithAggregatePayload
  ) => trackerRepo.replaceEntryWithAggregate(payload),
  TRACKER_DELETE_ENTRY_WITH_AGGREGATE: (
    payload: TrackerDeleteEntryWithAggregatePayload
  ) => trackerRepo.deleteEntryWithAggregate(payload),

  // Tracker Metrics
  TRACKER_METRIC_CREATE: (payload: TrackerMetricCreatePayload) =>
    trackerRepo.createMetric(payload),
  TRACKER_METRIC_UPDATE: (payload: TrackerMetricUpdatePayload) =>
    trackerRepo.updateMetric(payload.metricId, payload.data),
  TRACKER_METRIC_DELETE: (payload: TrackerMetricDeletePayload) =>
    trackerRepo.deleteMetric(payload.metricId),
  TRACKER_METRIC_RESTORE: (payload: TrackerMetricRestorePayload) =>
    trackerRepo.restoreMetric(payload.metricId),
  TRACKER_METRIC_REORDER: (payload: TrackerMetricReorderPayload) =>
    trackerRepo.reorderMetrics(payload.metricOrders),
  TRACKER_METRIC_FROM_TEMPLATE: (payload: TrackerMetricFromTemplatePayload) =>
    trackerRepo.createMetricFromTemplate(payload),

  // Tracker Quick Actions
  TRACKER_QUICK_ACTION_CREATE: (payload: TrackerQuickActionCreatePayload) =>
    trackerRepo.createQuickAction(payload),
  TRACKER_QUICK_ACTION_DELETE: (payload: TrackerQuickActionDeletePayload) =>
    trackerRepo.deleteQuickAction(payload.quickActionId),

  // Macro Targets
  MACRO_TARGET_UPSERT: (payload: MacroTargetUpsertPayload) =>
    macrosRepo.upsertTarget(payload),
  MACRO_TARGET_UPDATE: (payload: MacroTargetUpdatePayload) =>
    macrosRepo.updateTarget(payload.id, payload),

  // Macro Entries
  MACRO_ENTRY_CREATE: (payload: MacroEntryCreatePayload) =>
    macrosRepo.createEntryWithAggregate(payload),
  MACRO_ENTRY_UPDATE: (payload: MacroEntryUpdatePayload) =>
    macrosRepo.updateEntry(payload.id, payload),
  MACRO_ENTRY_DELETE: (payload: MacroEntryDeletePayload) =>
    macrosRepo.deleteEntryWithAggregate(payload),

  // Macro Quick Actions
  MACRO_QUICK_ACTIONS_INIT: (payload: MacroQuickActionsInitPayload) =>
    macrosRepo.createQuickActionsBulk(payload),
  MACRO_QUICK_ACTION_CREATE: (payload: MacroQuickActionCreatePayload) =>
    macrosRepo.createQuickAction(payload),
  MACRO_QUICK_ACTION_DELETE: (payload: MacroQuickActionDeletePayload) =>
    macrosRepo.deleteQuickAction(payload.quickActionId),

  // PR
  PR_CREATE: (payload: PRCreatePayload) => prRepo.upsertCurrentPR(payload),
  PR_UPDATE: (payload: PRUpdatePayload) => prRepo.insertPRHistory(payload),

  // Workouts
  WORKOUT_START: (payload: WorkoutStartPayload) =>
    workoutRepo.createWorkoutSessionWithData(payload),
  WORKOUT_COMPLETE: (payload: WorkoutCompletePayload) =>
    workoutRepo.createWorkoutSessionWithData(payload),
  WORKOUT_UPDATE: (payload: WorkoutUpdatePayload) =>
    workoutRepo.updateSession(payload.sessionId, payload.data),
  FINISH_WORKOUT: async (payload: FinishWorkoutSyncPayload) => {
    const result = await syncFinishWorkoutToSupabase(payload);
    if (!result.success) {
      throw new Error(result.error || "Failed to sync workout");
    }
    return result;
  },

  // User Preferences
  USER_PREFERENCES_CREATE: (payload: UserPreferencesCreatePayload) =>
    userRepo.createUserPreferences(payload.userId, payload.data),
  USER_PREFERENCES_UPDATE: (payload: UserPreferencesUpdatePayload) =>
    userRepo.updateUserPreferences(payload.userId, payload.data),
};
