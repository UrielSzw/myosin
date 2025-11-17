import { SupabaseFoldersRepository } from "../repositories/supabase-folders-repository";
import { SupabasePRRepository } from "../repositories/supabase-pr-repository";
import { SupabaseRoutinesRepository } from "../repositories/supabase-routines-repository";
import { SupabaseTrackerRepository } from "../repositories/supabase-tracker-repository";
import { SupabaseUserRepository } from "../repositories/supabase-user-repository";
import { SupabaseWorkoutRepository } from "../repositories/supabase-workout-repository";
import type { MutationCode } from "../types/mutations";

// Instancias de repositorios
const foldersRepo = new SupabaseFoldersRepository();
const routinesRepo = new SupabaseRoutinesRepository();
const trackerRepo = new SupabaseTrackerRepository();
const prRepo = new SupabasePRRepository();
const workoutRepo = new SupabaseWorkoutRepository();
const userRepo = new SupabaseUserRepository();

// Dictionary que mapea códigos de mutación a funciones de repositorio
export const supabaseSyncDictionary: Record<MutationCode, Function> = {
  // Routines
  ROUTINE_CREATE: (payload: any) => routinesRepo.createRoutineWithData(payload),
  ROUTINE_UPDATE: (payload: { routineId: string; data: any }) =>
    routinesRepo.updateRoutineWithData(payload.routineId, payload.data),
  ROUTINE_DELETE: (payload: { id: string }) =>
    routinesRepo.deleteRoutineById(payload.id),
  ROUTINE_CLEAR_TRAINING_DAYS: (payload: { routineId: string }) =>
    routinesRepo.clearRoutineTrainingDays(payload.routineId),

  // Folders
  FOLDER_CREATE: (payload: any) => foldersRepo.create(payload),
  FOLDER_UPDATE: (payload: { id: string; data: any }) =>
    foldersRepo.update(payload.id, payload.data),
  FOLDER_DELETE: (payload: { id: string }) => foldersRepo.delete(payload.id),
  FOLDER_REORDER: (payload: { orderedIds: string[] }) =>
    foldersRepo.reorderFolders(payload.orderedIds),

  // Tracker Entries
  TRACKER_ENTRY_CREATE: (payload: any) => trackerRepo.createEntry(payload),
  TRACKER_ENTRY_UPDATE: (payload: { entryId: string; data: any }) =>
    trackerRepo.updateEntry(payload.entryId, payload.data),
  TRACKER_ENTRY_DELETE: (payload: { entryId: string }) =>
    trackerRepo.deleteEntry(payload.entryId),
  TRACKER_ENTRY_FROM_QUICK_ACTION: (payload: {
    quick_action_id: string;
    user_id: string;
    notes?: string;
    recorded_at?: string;
    day_key: string;
  }) => trackerRepo.createEntryFromQuickAction(payload),
  TRACKER_ENTRY_WITH_AGGREGATE: (payload: {
    entry: any;
    dailyAggregate: any;
  }) => trackerRepo.createEntryWithAggregate(payload),
  TRACKER_REPLACE_ENTRY_WITH_AGGREGATE: (payload: {
    entry: any;
    dailyAggregate: any;
  }) => trackerRepo.replaceEntryWithAggregate(payload),
  TRACKER_DELETE_ENTRY_WITH_AGGREGATE: (payload: {
    entryId: string;
    dailyAggregate: any;
  }) => trackerRepo.deleteEntryWithAggregate(payload),

  // Tracker Metrics
  TRACKER_METRIC_CREATE: (payload: any) => trackerRepo.createMetric(payload),
  TRACKER_METRIC_UPDATE: (payload: { metricId: string; data: any }) =>
    trackerRepo.updateMetric(payload.metricId, payload.data),
  TRACKER_METRIC_DELETE: (payload: { metricId: string }) =>
    trackerRepo.deleteMetric(payload.metricId),
  TRACKER_METRIC_RESTORE: (payload: { metricId: string }) =>
    trackerRepo.restoreMetric(payload.metricId),
  TRACKER_METRIC_REORDER: (payload: {
    metricOrders: { id: string; order_index: number }[];
  }) => trackerRepo.reorderMetrics(payload.metricOrders),
  TRACKER_METRIC_FROM_TEMPLATE: (payload: {
    metric: any; // BaseTrackerMetric (con id)
    quickActions?: any[]; // BaseTrackerQuickAction[] (con ids)
  }) => trackerRepo.createMetricFromTemplate(payload),

  // Tracker Quick Actions
  TRACKER_QUICK_ACTION_CREATE: (payload: any) =>
    trackerRepo.createQuickAction(payload),
  TRACKER_QUICK_ACTION_DELETE: (payload: { quickActionId: string }) =>
    trackerRepo.deleteQuickAction(payload.quickActionId),

  // PR
  PR_CREATE: (payload: any) => prRepo.upsertCurrentPR(payload),
  PR_UPDATE: (payload: any) => prRepo.insertPRHistory(payload),

  // Workouts
  WORKOUT_START: (payload: any) =>
    workoutRepo.createWorkoutSessionWithData(payload),
  WORKOUT_COMPLETE: (payload: any) =>
    workoutRepo.createWorkoutSessionWithData(payload),
  WORKOUT_UPDATE: (payload: { sessionId: string; data: any }) =>
    workoutRepo.updateSession(payload.sessionId, payload.data),

  // User Preferences
  USER_PREFERENCES_CREATE: (payload: { userId: string; data: any }) =>
    userRepo.createUserPreferences(payload.userId, payload.data),
  USER_PREFERENCES_UPDATE: (payload: { userId: string; data: any }) =>
    userRepo.updateUserPreferences(payload.userId, payload.data),
};
