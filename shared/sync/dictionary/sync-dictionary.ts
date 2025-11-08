import { SupabaseFoldersRepository } from "../repositories/supabase-folders-repository";
import { SupabasePRRepository } from "../repositories/supabase-pr-repository";
import { SupabaseRoutinesRepository } from "../repositories/supabase-routines-repository";
import { SupabaseTrackerRepository } from "../repositories/supabase-tracker-repository";
import { SupabaseWorkoutRepository } from "../repositories/supabase-workout-repository";
import type { MutationCode } from "../types/mutations";

// Instancias de repositorios
const foldersRepo = new SupabaseFoldersRepository();
const routinesRepo = new SupabaseRoutinesRepository();
const trackerRepo = new SupabaseTrackerRepository();
const prRepo = new SupabasePRRepository();
const workoutRepo = new SupabaseWorkoutRepository();

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

  // Tracker Metrics
  TRACKER_METRIC_CREATE: (payload: any) => trackerRepo.createMetric(payload),
  TRACKER_METRIC_DELETE: (payload: { actionId: string }) =>
    trackerRepo.deleteQuickAction(payload.actionId),

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
};
