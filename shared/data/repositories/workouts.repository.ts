/**
 * Workouts Repository
 *
 * Abstraction layer for workout session operations.
 * Pattern: Component calls ONE method → SQLite + Sync automatically.
 *
 * Sync operations wrapped:
 * - WORKOUT_COMPLETE: Create workout session with all related data
 *
 * Read operations (no sync needed):
 * - findAllWithSummary
 * - findSessionById
 * - getRoutineStats
 * - getExerciseProgression
 * - getLastSetsForExercise
 * - getRecentSessions
 * - hasRoutineBeenPerformed
 *
 * Delete operations (local only, no Supabase sync):
 * - deleteSession
 */

import {
  workoutSessionsRepository,
  type CreateWorkoutSessionData,
  type WorkoutSessionSummary,
} from "@/shared/db/repository/workout-sessions";
import type { WorkoutSessionFull } from "@/shared/db/schema/workout-session";
import { getSyncAdapter } from "../core/sync-adapter";

// ============================================
// TYPES
// ============================================

// Re-export types for consumers
export type {
  CreateWorkoutSessionData,
  WorkoutSessionSummary,
} from "@/shared/db/repository/workout-sessions";
export type { WorkoutSessionFull } from "@/shared/db/schema/workout-session";

// ============================================
// WORKOUTS REPOSITORY
// ============================================

export const workoutsRepository = {
  // ============================================
  // READ OPERATIONS (No sync needed)
  // ============================================

  /**
   * Get all workout sessions with summary data
   */
  async findAllWithSummary(
    limit: number = 50
  ): Promise<WorkoutSessionSummary[]> {
    return workoutSessionsRepository.findAllWithSummary(limit);
  },

  /**
   * Get a complete workout session by ID
   */
  async findSessionById(sessionId: string): Promise<WorkoutSessionFull> {
    return workoutSessionsRepository.findSessionById(sessionId);
  },

  /**
   * Get statistics for a specific routine
   */
  async getRoutineStats(routineId: string) {
    return workoutSessionsRepository.getRoutineStats(routineId);
  },

  /**
   * Get exercise progression data
   */
  async getExerciseProgression(exerciseId: string, limit: number = 10) {
    return workoutSessionsRepository.getExerciseProgression(exerciseId, limit);
  },

  /**
   * Get last sets for a specific exercise (for previous sets display)
   */
  async getLastSetsForExercise(
    exerciseId: string,
    userId: string = "default-user"
  ) {
    return workoutSessionsRepository.getLastSetsForExercise(exerciseId, userId);
  },

  /**
   * Get recent workout sessions
   */
  async getRecentSessions(limit: number = 5) {
    return workoutSessionsRepository.getRecentSessions(limit);
  },

  /**
   * Check if a routine has been performed
   */
  async hasRoutineBeenPerformed(
    routineId: string,
    userId: string = "default-user"
  ): Promise<boolean> {
    return workoutSessionsRepository.hasRoutineBeenPerformed(routineId, userId);
  },

  // ============================================
  // WRITE OPERATIONS (With automatic sync)
  // ============================================

  /**
   * Create a complete workout session with all related data (blocks, exercises, sets)
   * This is the main mutation - saves to SQLite and syncs to Supabase automatically.
   *
   * Sync: WORKOUT_COMPLETE
   */
  async createWorkoutSessionWithData(
    data: CreateWorkoutSessionData
  ): Promise<{ id: string }> {
    // 1. Save to SQLite
    const savedSession =
      await workoutSessionsRepository.createWorkoutSessionWithData(data);

    // 2. Sync to Supabase automatically
    const syncAdapter = getSyncAdapter();
    syncAdapter.sync("WORKOUT_COMPLETE", {
      ...data,
      id: savedSession.id,
    });

    return savedSession;
  },

  /**
   * Delete a workout session (local only - no Supabase sync)
   * Note: Currently this only deletes locally. If remote sync is needed,
   * a new sync operation type would need to be added.
   */
  async deleteSession(sessionId: string): Promise<void> {
    await workoutSessionsRepository.deleteSession(sessionId);
  },
};
