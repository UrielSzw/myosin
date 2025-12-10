import type { MeasurementTemplateId } from "@/shared/types/measurement";
import { prRepository } from "../db/repository/pr";
import {
  exerciseProgressionsRepository,
  userExerciseUnlocksRepository,
} from "../db/repository/progressions";
import type {
  ExerciseProgression,
  UnlockCriteria,
  UnlockProgress,
  UserExerciseUnlockStatus,
} from "../db/schema/progressions";

// ============================================================================
// Types
// ============================================================================

export interface UnlockCheckResult {
  exerciseId: string;
  toExerciseId: string;
  shouldUnlock: boolean;
  progress: UnlockProgress;
  criteria: UnlockCriteria;
}

export interface ExerciseUnlockInfo {
  exerciseId: string;
  exerciseName: string;
  status: UserExerciseUnlockStatus;
  progress: UnlockProgress | null;
  unlockedAt: string | null;
  manuallyUnlocked: boolean;
}

export interface NewUnlockResult {
  unlockedExerciseId: string;
  unlockedByExerciseId: string;
  unlockedByPrId?: string;
  previousProgress: UnlockProgress | null;
  criteria: UnlockCriteria;
}

// ============================================================================
// Unlock Evaluation Logic
// ============================================================================

/**
 * Evaluate if an unlock criteria is met based on PR data
 */
export const evaluateUnlockCriteria = (
  criteria: UnlockCriteria,
  prPrimaryValue: number | null,
  prSecondaryValue: number | null,
  measurementTemplate: MeasurementTemplateId
): UnlockProgress => {
  if (!criteria || !prPrimaryValue) {
    return {
      current_value: 0,
      target_value: criteria?.primary_value || 0,
      percentage: 0,
    };
  }

  const targetValue = criteria.primary_value;
  let currentValue = 0;
  let percentage = 0;

  switch (criteria.type) {
    case "reps":
      // For reps-based criteria, we check the secondary value (reps) from weight_reps template
      // or primary value for other templates
      if (measurementTemplate === "weight_reps") {
        currentValue = prSecondaryValue || 0; // reps is secondary in weight_reps
      } else {
        currentValue = prPrimaryValue;
      }
      percentage = Math.min(100, (currentValue / targetValue) * 100);
      break;

    case "time":
      // For time-based criteria (time_only, weight_time)
      if (measurementTemplate === "weight_time") {
        currentValue = prSecondaryValue || 0; // time is secondary
      } else {
        currentValue = prPrimaryValue; // time_only
      }
      percentage = Math.min(100, (currentValue / targetValue) * 100);
      break;

    case "weight":
      // Pure weight check (primary value in weight_reps)
      currentValue = prPrimaryValue;
      percentage = Math.min(100, (currentValue / targetValue) * 100);
      break;

    case "weight_reps":
      // Both weight AND reps must be met
      const weightTarget = targetValue;
      const repsTarget = criteria.secondary_value || 1;

      const weightMet = prPrimaryValue >= weightTarget;
      const repsMet = (prSecondaryValue || 0) >= repsTarget;

      // Progress is the minimum of both percentages
      const weightProgress = Math.min(
        100,
        (prPrimaryValue / weightTarget) * 100
      );
      const repsProgress = Math.min(
        100,
        ((prSecondaryValue || 0) / repsTarget) * 100
      );

      currentValue = prPrimaryValue; // Show weight as current value
      percentage = Math.min(weightProgress, repsProgress);

      // Only 100% if both criteria are met
      if (weightMet && repsMet) {
        percentage = 100;
      }
      break;

    case "sets_reps":
      // sets_reps: User needs to do X sets of Y reps
      // We can only check reps in PR (sets are harder to track)
      // For now, we consider it "met" if they can do the required reps
      // (the assumption is if they have a PR with those reps, they can do multiple sets)
      const requiredReps = targetValue;
      if (measurementTemplate === "weight_reps") {
        currentValue = prSecondaryValue || 0;
      } else {
        currentValue = prPrimaryValue;
      }
      percentage = Math.min(100, (currentValue / requiredReps) * 100);
      break;

    case "manual":
      // Manual unlocks don't have automatic progress
      return {
        current_value: 0,
        target_value: 0,
        percentage: 0,
      };

    default:
      return {
        current_value: 0,
        target_value: targetValue,
        percentage: 0,
      };
  }

  return {
    current_value: Math.round(currentValue * 10) / 10,
    target_value: targetValue,
    percentage: Math.round(percentage),
  };
};

// ============================================================================
// Progression Service
// ============================================================================

export const progressionService = {
  /**
   * Check if a user should unlock any exercises based on their current PR
   * Called after a new PR is achieved
   */
  checkUnlocksForExercise: async (
    userId: string,
    exerciseId: string
  ): Promise<UnlockCheckResult[]> => {
    const results: UnlockCheckResult[] = [];

    // Get the user's current PR for this exercise
    const currentPR = await prRepository.getCurrentPR(userId, exerciseId);
    if (!currentPR) {
      return results;
    }

    // Get all progressions FROM this exercise (what can be unlocked)
    const progressions =
      await exerciseProgressionsRepository.getProgressionsFrom(exerciseId);

    for (const progression of progressions) {
      const criteria = progression.unlock_criteria as UnlockCriteria | null;

      // Skip if no criteria or manual unlock
      if (!criteria || criteria.type === "manual") {
        continue;
      }

      // Evaluate progress
      const progress = evaluateUnlockCriteria(
        criteria,
        currentPR.best_primary_value,
        currentPR.best_secondary_value,
        currentPR.measurement_template as MeasurementTemplateId
      );

      results.push({
        exerciseId,
        toExerciseId: progression.to_exercise_id,
        shouldUnlock: progress.percentage >= 100,
        progress,
        criteria,
      });
    }

    return results;
  },

  /**
   * Process unlocks after a workout/PR achievement
   * Returns list of newly unlocked exercises
   *
   * Also marks the current exercise and all its prerequisites as mastered
   * (if you can do weighted pull-ups, you've mastered regular pull-ups)
   */
  processUnlocksAfterPR: async (
    userId: string,
    exerciseId: string,
    prId?: string
  ): Promise<NewUnlockResult[]> => {
    const newUnlocks: NewUnlockResult[] = [];

    // First: Mark the current exercise as mastered (they have a PR!)
    await progressionService.markExerciseAndPrerequisitesMastered(
      userId,
      exerciseId
    );

    // Then: Check if this PR unlocks any new exercises
    const checkResults = await progressionService.checkUnlocksForExercise(
      userId,
      exerciseId
    );

    for (const result of checkResults) {
      // Get current unlock status
      const currentUnlock = await userExerciseUnlocksRepository.getUnlock(
        userId,
        result.toExerciseId
      );

      // Skip if already unlocked
      if (
        currentUnlock?.status === "unlocked" ||
        currentUnlock?.status === "mastered"
      ) {
        continue;
      }

      const previousProgress =
        currentUnlock?.current_progress as UnlockProgress | null;

      if (result.shouldUnlock) {
        // Unlock the exercise!
        await userExerciseUnlocksRepository.markUnlocked(
          userId,
          result.toExerciseId,
          exerciseId,
          prId
        );

        newUnlocks.push({
          unlockedExerciseId: result.toExerciseId,
          unlockedByExerciseId: exerciseId,
          unlockedByPrId: prId,
          previousProgress,
          criteria: result.criteria,
        });
      } else if (result.progress.percentage > 0) {
        // Update progress (might transition to "unlocking" state)
        await userExerciseUnlocksRepository.updateProgress(
          userId,
          result.toExerciseId,
          result.progress
        );
      }
    }

    return newUnlocks;
  },

  /**
   * Get unlock status for all exercises in a progression path
   */
  getPathProgress: async (
    userId: string,
    pathSlug: string
  ): Promise<ExerciseUnlockInfo[]> => {
    const { progressionPathsRepository, progressionPathExercisesRepository } =
      await import("../db/repository/progressions");

    const path = await progressionPathsRepository.getBySlug(pathSlug);
    if (!path) return [];

    const pathExercises =
      await progressionPathExercisesRepository.getExercisesForPath(path.id);

    const exerciseIds = pathExercises.map((pe) => pe.exercise_id);
    const unlocks = await userExerciseUnlocksRepository.getUnlocksForExercises(
      userId,
      exerciseIds
    );

    // Get exercise names (would need to import exercises repo)
    const exerciseInfos: ExerciseUnlockInfo[] = [];

    for (const pe of pathExercises) {
      const unlock = unlocks[pe.exercise_id];

      exerciseInfos.push({
        exerciseId: pe.exercise_id,
        exerciseName: "", // Would need to fetch from exercises table
        status: unlock?.status || "locked",
        progress: unlock?.current_progress as UnlockProgress | null,
        unlockedAt: unlock?.unlocked_at || null,
        manuallyUnlocked: unlock?.manually_unlocked || false,
      });
    }

    return exerciseInfos;
  },

  /**
   * Get all progressions for an exercise with unlock status
   */
  getExerciseProgressionStatus: async (
    userId: string,
    exerciseId: string
  ): Promise<{
    canProgressTo: {
      progression: ExerciseProgression;
      status: UserExerciseUnlockStatus;
      progress: UnlockProgress | null;
    }[];
    regressedFrom: {
      progression: ExerciseProgression;
    }[];
  }> => {
    // Get progressions FROM this exercise (what user can progress to)
    const progressionsFrom =
      await exerciseProgressionsRepository.getProgressionsFrom(exerciseId);

    // Get progressions TO this exercise (what's easier - where user came from)
    const progressionsTo =
      await exerciseProgressionsRepository.getProgressionsTo(exerciseId);

    // Get unlock status for "to" exercises
    const toExerciseIds = progressionsFrom.map((p) => p.to_exercise_id);
    const unlocks = await userExerciseUnlocksRepository.getUnlocksForExercises(
      userId,
      toExerciseIds
    );

    // Get current PR to calculate progress
    const currentPR = await prRepository.getCurrentPR(userId, exerciseId);

    const canProgressTo = progressionsFrom.map((progression) => {
      const unlock = unlocks[progression.to_exercise_id];
      const criteria = progression.unlock_criteria as UnlockCriteria | null;

      let progress: UnlockProgress | null = null;

      if (criteria && currentPR && criteria.type !== "manual") {
        progress = evaluateUnlockCriteria(
          criteria,
          currentPR.best_primary_value,
          currentPR.best_secondary_value,
          currentPR.measurement_template as MeasurementTemplateId
        );
      }

      return {
        progression,
        status: (unlock?.status || "locked") as UserExerciseUnlockStatus,
        progress:
          (unlock?.current_progress as UnlockProgress | null) ?? progress,
      };
    });

    const regressedFrom = progressionsTo.map((progression) => ({
      progression,
    }));

    return {
      canProgressTo,
      regressedFrom,
    };
  },

  /**
   * Manually unlock an exercise (for skill assessment or testing)
   */
  manuallyUnlockExercise: async (
    userId: string,
    exerciseId: string
  ): Promise<void> => {
    await userExerciseUnlocksRepository.manuallyUnlock(userId, exerciseId);
  },

  /**
   * Check if an exercise has any progressions defined
   */
  hasProgressions: async (exerciseId: string): Promise<boolean> => {
    return await exerciseProgressionsRepository.hasProgressions(exerciseId);
  },

  /**
   * Auto-detect unlocks based on existing PRs
   * Useful for initial setup or when progressions are first enabled
   */
  autoDetectUnlocksFromExistingPRs: async (
    userId: string
  ): Promise<NewUnlockResult[]> => {
    const allNewUnlocks: NewUnlockResult[] = [];

    // Get all progressions
    const allProgressions = await exerciseProgressionsRepository.findAll();

    // Get unique exercise IDs from "from" side
    const fromExerciseIds = [
      ...new Set(allProgressions.map((p) => p.from_exercise_id)),
    ];

    // Get PRs for those exercises
    const prs = await prRepository.getCurrentPRsForExercises(
      userId,
      fromExerciseIds
    );

    // Check each exercise that has a PR
    for (const exerciseId of fromExerciseIds) {
      const pr = prs[exerciseId];
      if (!pr) continue;

      const newUnlocks = await progressionService.processUnlocksAfterPR(
        userId,
        exerciseId,
        pr.id
      );

      allNewUnlocks.push(...newUnlocks);
    }

    return allNewUnlocks;
  },

  /**
   * Mark an exercise and ALL its prerequisites as mastered
   *
   * If you can do weighted pull-ups, you've obviously mastered:
   * - Regular pull-ups
   * - Chin-ups
   * - Assisted pull-ups
   * - etc.
   *
   * This traverses backwards through the progression tree
   */
  markExerciseAndPrerequisitesMastered: async (
    userId: string,
    exerciseId: string
  ): Promise<string[]> => {
    const masteredIds: string[] = [];
    const visited = new Set<string>();
    const queue = [exerciseId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;

      if (visited.has(currentId)) continue;
      visited.add(currentId);

      // Check current status - skip if already mastered
      const currentUnlock = await userExerciseUnlocksRepository.getUnlock(
        userId,
        currentId
      );

      if (currentUnlock?.status !== "mastered") {
        // Mark as mastered
        await userExerciseUnlocksRepository.markMastered(userId, currentId);
        masteredIds.push(currentId);
      }

      // Find all prerequisites (exercises that lead TO this one)
      const prerequisites =
        await exerciseProgressionsRepository.getProgressionsTo(currentId);

      for (const prereq of prerequisites) {
        if (
          prereq.relationship_type === "progression" &&
          !visited.has(prereq.from_exercise_id)
        ) {
          queue.push(prereq.from_exercise_id);
        }
      }
    }

    return masteredIds;
  },
};

export default progressionService;
