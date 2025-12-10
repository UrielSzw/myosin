import { db } from "@/shared/db/client";
import {
  exerciseProgressionsRepository,
  userExerciseUnlocksRepository,
} from "@/shared/db/repository/progressions";
import { exercises, type BaseExercise } from "@/shared/db/schema";
import type {
  ExerciseProgression,
  UnlockProgress,
} from "@/shared/db/schema/progressions";
import { useAuth } from "@/shared/providers/auth-provider";
import { inArray } from "drizzle-orm";
import { useCallback, useEffect, useState } from "react";
import type { PathExercise, ProgressionPath } from "../types";

// ============================================================================
// Category Mapping
// ============================================================================

// Map muscle groups to broader movement categories
const muscleGroupToCategory: Record<string, string> = {
  // Pull movements
  back: "pull",
  biceps: "pull",
  lats: "pull",
  rear_delts: "pull",
  // Push movements
  chest: "push",
  chest_upper: "push",
  chest_lower: "push",
  triceps: "push",
  front_delts: "push",
  shoulders: "push",
  // Core
  rectus_abdominis: "core",
  obliques: "core",
  transverse_abdominis: "core",
  lower_back: "core",
  // Lower body
  quads: "lower_body",
  hamstrings: "lower_body",
  glutes: "lower_body",
  calves: "lower_body",
  hip_flexors: "lower_body",
};

// ============================================================================
// Hook: useProgressionPaths
// ============================================================================

interface UseProgressionPathsReturn {
  paths: ProgressionPath[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useProgressionPaths(): UseProgressionPathsReturn {
  const { user } = useAuth();
  const [paths, setPaths] = useState<ProgressionPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPaths = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Get all progressions from DB
      const allProgressions: ExerciseProgression[] =
        await exerciseProgressionsRepository.findAll();

      // 2. Get all user unlocks
      const allUnlocks = await userExerciseUnlocksRepository.getAllForUser(
        user.id
      );

      // 3. Build a map of exercise IDs to their unlock status
      const unlockMap = new Map(
        allUnlocks.map((u) => [
          u.exercise_id,
          {
            status: u.status as
              | "locked"
              | "unlocking"
              | "unlocked"
              | "mastered",
            progress: u.current_progress as UnlockProgress | undefined,
          },
        ])
      );

      // 4. Get unique exercise IDs from progressions
      const exerciseIds = new Set<string>();
      allProgressions.forEach((p) => {
        exerciseIds.add(p.from_exercise_id);
        exerciseIds.add(p.to_exercise_id);
      });

      // 5. Fetch exercise details
      let exerciseMap = new Map<string, BaseExercise>();
      if (exerciseIds.size > 0) {
        const exercisesList = await db
          .select()
          .from(exercises)
          .where(inArray(exercises.id, Array.from(exerciseIds)));
        exerciseMap = new Map(exercisesList.map((e) => [e.id, e]));
      }

      // 6. Group progressions by "path" (using the ultimate skill as identifier)
      // We'll identify paths by finding exercises that have no further progressions (ultimate skills)
      const fromExercises = new Set(
        allProgressions.map((p) => p.from_exercise_id)
      );
      const toExercises = new Set(allProgressions.map((p) => p.to_exercise_id));

      // Ultimate skills: exercises that are "to" but never "from"
      const ultimateSkillIds = Array.from(toExercises).filter(
        (id) => !fromExercises.has(id)
      );

      // 7. For each ultimate skill, trace back to build the full path
      const pathsResult: ProgressionPath[] = [];

      for (const ultimateId of ultimateSkillIds) {
        const ultimateExercise = exerciseMap.get(ultimateId);
        if (!ultimateExercise) continue;

        // Trace back through progressions
        const pathExercises: PathExercise[] = [];
        const visited = new Set<string>();
        const queue = [ultimateId];

        // BFS backwards to find all exercises in this path
        while (queue.length > 0) {
          const currentId = queue.shift()!;
          if (visited.has(currentId)) continue;
          visited.add(currentId);

          const exercise = exerciseMap.get(currentId);
          if (!exercise) continue;

          const unlockInfo = unlockMap.get(currentId);

          pathExercises.push({
            exerciseId: currentId,
            exerciseName: exercise.name,
            order: 0, // Will be set later
            status: unlockInfo?.status || "locked",
            progress: unlockInfo?.progress,
            // Include full exercise data to avoid loading delay when viewing details
            exerciseData: exercise,
          });

          // Find progressions leading to this exercise
          const incomingProgressions = allProgressions.filter(
            (p) => p.to_exercise_id === currentId
          );
          for (const prog of incomingProgressions) {
            if (!visited.has(prog.from_exercise_id)) {
              queue.push(prog.from_exercise_id);
            }
          }
        }

        // Sort by progression order (earliest first)
        // Proper topological sort using Kahn's algorithm
        const orderedExercises: PathExercise[] = [];
        const remaining = new Set(pathExercises.map((e) => e.exerciseId));

        // Build in-degree map (how many prerequisites each exercise has within this path)
        const inDegree = new Map<string, number>();
        for (const ex of pathExercises) {
          const prereqCount = allProgressions.filter(
            (p) =>
              p.to_exercise_id === ex.exerciseId &&
              remaining.has(p.from_exercise_id) &&
              p.relationship_type === "progression"
          ).length;
          inDegree.set(ex.exerciseId, prereqCount);
        }

        // Process exercises with no prerequisites first
        let safetyCounter = pathExercises.length + 10;
        while (remaining.size > 0 && safetyCounter > 0) {
          safetyCounter--;

          // Find all exercises with in-degree 0 (no pending prerequisites)
          const ready: PathExercise[] = [];
          for (const exercise of pathExercises) {
            if (!remaining.has(exercise.exerciseId)) continue;
            if ((inDegree.get(exercise.exerciseId) || 0) === 0) {
              ready.push(exercise);
            }
          }

          if (ready.length === 0) {
            // Cycle or orphaned nodes - add remaining in any order
            for (const ex of pathExercises) {
              if (remaining.has(ex.exerciseId)) {
                ex.order = orderedExercises.length;
                orderedExercises.push(ex);
                remaining.delete(ex.exerciseId);
              }
            }
            break;
          }

          // Add all ready exercises (sorted by name for consistency)
          ready.sort((a, b) => a.exerciseName.localeCompare(b.exerciseName));
          for (const exercise of ready) {
            exercise.order = orderedExercises.length;
            orderedExercises.push(exercise);
            remaining.delete(exercise.exerciseId);

            // Decrease in-degree of exercises that depend on this one
            for (const prog of allProgressions) {
              if (
                prog.from_exercise_id === exercise.exerciseId &&
                prog.relationship_type === "progression" &&
                remaining.has(prog.to_exercise_id)
              ) {
                const current = inDegree.get(prog.to_exercise_id) || 0;
                inDegree.set(prog.to_exercise_id, Math.max(0, current - 1));
              }
            }
          }
        }

        // Mark the first exercise(s) as unlocked if they have no status
        // (entry points to the path should be available by default)
        for (const exercise of orderedExercises) {
          // Check if this exercise has any prerequisites in the path
          const hasPrerequisite = allProgressions.some(
            (p) =>
              p.to_exercise_id === exercise.exerciseId &&
              p.relationship_type === "progression" &&
              orderedExercises.some((e) => e.exerciseId === p.from_exercise_id)
          );

          // If no prerequisites and currently locked, mark as unlocked
          if (!hasPrerequisite && exercise.status === "locked") {
            exercise.status = "unlocked";
          } else {
            // Stop at first exercise with prerequisites
            break;
          }
        }

        // Enrich each exercise with unlock criteria for the next level
        for (let i = 0; i < orderedExercises.length; i++) {
          const exercise = orderedExercises[i];
          const nextExerciseInPath = orderedExercises[i + 1];

          if (exercise && nextExerciseInPath) {
            // Find the progression from this exercise to the next
            const progressionToNext = allProgressions.find(
              (p) =>
                p.from_exercise_id === exercise.exerciseId &&
                p.to_exercise_id === nextExerciseInPath.exerciseId &&
                p.relationship_type === "progression"
            );

            if (progressionToNext?.unlock_criteria) {
              exercise.unlockCriteriaForNext =
                progressionToNext.unlock_criteria;
              exercise.nextExerciseName = nextExerciseInPath.exerciseName;
            }
          }
        }

        // Calculate current level (only count MASTERED exercises as completed)
        // "unlocked" means available to practice, not completed
        const completedCount = orderedExercises.filter(
          (e) => e.status === "mastered"
        ).length;

        // Find current and next exercises
        const currentExercise =
          orderedExercises.find((e) => e.status === "unlocking") ||
          orderedExercises.find((e) => e.status === "unlocked");

        const nextExercise = orderedExercises.find(
          (e) =>
            e.status === "locked" &&
            orderedExercises.some(
              (prev) =>
                (prev.status === "unlocked" || prev.status === "mastered") &&
                allProgressions.some(
                  (p) =>
                    p.from_exercise_id === prev.exerciseId &&
                    p.to_exercise_id === e.exerciseId
                )
            )
        );

        // Determine category from exercise muscle group using the mapping
        const muscleGroup = ultimateExercise.main_muscle_group || "";
        const category = muscleGroupToCategory[muscleGroup] || "skills";

        pathsResult.push({
          pathId: ultimateId,
          pathName: `${ultimateExercise.name} Path`,
          category,
          subcategory: undefined,
          ultimateSkill: ultimateExercise.name,
          ultimateSkillId: ultimateId,
          exercises: orderedExercises,
          currentLevel: completedCount,
          maxLevel: orderedExercises.length,
          currentExercise: currentExercise || null,
          nextExercise: nextExercise || null,
        });
      }

      // Sort paths by category and then by name
      pathsResult.sort((a, b) => {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.pathName.localeCompare(b.pathName);
      });

      setPaths(pathsResult);
    } catch (err) {
      console.error("Error loading progression paths:", err);
      setError("Failed to load progression paths");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadPaths();
  }, [loadPaths]);

  return {
    paths,
    isLoading,
    error,
    refresh: loadPaths,
  };
}
