import { db } from "@/shared/db/client";
import {
  exerciseProgressionsRepository,
  progressionPathExercisesRepository,
  progressionPathsRepository,
  userExerciseUnlocksRepository,
} from "@/shared/db/repository/progressions";
import { exercises, type BaseExercise } from "@/shared/db/schema";
import type { UnlockProgress } from "@/shared/db/schema/progressions";
import { useAuth } from "@/shared/providers/auth-provider";
import { inArray } from "drizzle-orm";
import { useCallback, useEffect, useState } from "react";
import type { PathExercise, ProgressionPath } from "../types";

// ============================================================================
// Path Name Translations (from name_key)
// ============================================================================

const PATH_NAMES: Record<string, { en: string; es: string }> = {
  "paths.pull_up.name": {
    en: "Pull-up Progression",
    es: "Progresión de Dominadas",
  },
  "paths.row.name": { en: "Row to Front Lever", es: "Remo a Front Lever" },
  "paths.dip.name": { en: "Dip Progression", es: "Progresión de Fondos" },
  "paths.push_up.name": {
    en: "Push-up Progression",
    es: "Progresión de Flexiones",
  },
  "paths.squat.name": {
    en: "Squat Progression",
    es: "Progresión de Sentadillas",
  },
  "paths.hinge.name": {
    en: "Nordic Curl Progression",
    es: "Progresión de Nordic Curl",
  },
  "paths.muscle_up.name": {
    en: "Muscle-up Progression",
    es: "Progresión de Muscle-up",
  },
  "paths.hspu.name": { en: "HSPU Progression", es: "Progresión de HSPU" },
  "paths.l_sit.name": { en: "L-sit Progression", es: "Progresión de L-sit" },
  "paths.front_lever.name": { en: "Front Lever", es: "Front Lever" },
  "paths.planche.name": {
    en: "Planche Progression",
    es: "Progresión de Planche",
  },
  "paths.back_lever.name": { en: "Back Lever", es: "Back Lever" },
  "paths.dragon_flag.name": { en: "Dragon Flag", es: "Dragon Flag" },
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
      // 1. Get all progression paths from DB (the 13 skill trees)
      const allPaths = await progressionPathsRepository.findAll();

      // 2. Get all path exercises (links between paths and exercises)
      const allPathExercises =
        await progressionPathExercisesRepository.findAll();

      // 3. Get all exercise progressions (for unlock criteria)
      const allProgressions = await exerciseProgressionsRepository.findAll();

      // 4. Get all user unlocks
      const allUnlocks = await userExerciseUnlocksRepository.getAllForUser(
        user.id
      );

      // 5. Build unlock status map
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

      // 6. Get all unique exercise IDs needed
      const exerciseIds = new Set<string>();
      allPathExercises.forEach((pe) => exerciseIds.add(pe.exercise_id));
      allPaths.forEach((p) => {
        if (p.ultimate_exercise_id) exerciseIds.add(p.ultimate_exercise_id);
      });

      // 7. Fetch all exercise details in one query
      let exerciseMap = new Map<string, BaseExercise>();
      if (exerciseIds.size > 0) {
        const exercisesList = await db
          .select()
          .from(exercises)
          .where(inArray(exercises.id, Array.from(exerciseIds)));
        exerciseMap = new Map(exercisesList.map((e) => [e.id, e]));
      }

      // 8. Build progression map for unlock criteria lookup
      // Key: "fromId->toId", Value: progression data
      const progressionMap = new Map(
        allProgressions.map((p) => [
          `${p.from_exercise_id}->${p.to_exercise_id}`,
          p,
        ])
      );

      // 9. Build each path
      const pathsResult: ProgressionPath[] = [];

      for (const path of allPaths) {
        // Get exercises for this path, ordered by level
        const pathExerciseLinks = allPathExercises
          .filter((pe) => pe.path_id === path.id)
          .sort((a, b) => a.level - b.level);

        if (pathExerciseLinks.length === 0) continue;

        // Build PathExercise array
        const pathExercises: PathExercise[] = [];

        for (let i = 0; i < pathExerciseLinks.length; i++) {
          const link = pathExerciseLinks[i]!;
          const exercise = exerciseMap.get(link.exercise_id);
          if (!exercise) continue;

          const unlockInfo = unlockMap.get(link.exercise_id);
          const nextLink = pathExerciseLinks[i + 1];

          // Find unlock criteria for the next exercise
          let unlockCriteriaForNext = undefined;
          let nextExerciseName = undefined;

          if (nextLink) {
            const nextExercise = exerciseMap.get(nextLink.exercise_id);
            if (nextExercise) {
              nextExerciseName = nextExercise.name;
              // Look for progression from current to next
              const progression = progressionMap.get(
                `${link.exercise_id}->${nextLink.exercise_id}`
              );
              if (progression?.unlock_criteria) {
                unlockCriteriaForNext = progression.unlock_criteria;
              }
            }
          }

          // Determine status - first exercise in path is always unlocked if no status
          let status = unlockInfo?.status || "locked";
          if (i === 0 && status === "locked") {
            status = "unlocked";
          }

          pathExercises.push({
            exerciseId: link.exercise_id,
            exerciseName: exercise.name,
            order: i,
            status,
            progress: unlockInfo?.progress,
            unlockCriteriaForNext,
            nextExerciseName,
            exerciseData: exercise,
          });
        }

        // Calculate stats
        const completedCount = pathExercises.filter(
          (e) => e.status === "mastered"
        ).length;

        const currentExercise =
          pathExercises.find((e) => e.status === "unlocking") ||
          pathExercises.find((e) => e.status === "unlocked");

        // Find next locked exercise after current
        const currentIndex = currentExercise
          ? pathExercises.findIndex(
              (e) => e.exerciseId === currentExercise.exerciseId
            )
          : -1;
        const nextExercise =
          currentIndex >= 0 ? pathExercises[currentIndex + 1] || null : null;

        // Get ultimate exercise
        const ultimateExercise = path.ultimate_exercise_id
          ? exerciseMap.get(path.ultimate_exercise_id)
          : pathExercises[pathExercises.length - 1]?.exerciseData;

        // Get translated path name
        const pathName =
          PATH_NAMES[path.name_key]?.en || path.slug.replace(/_/g, " ");

        pathsResult.push({
          pathId: path.id,
          pathName,
          category: path.category,
          subcategory: undefined,
          ultimateSkill: ultimateExercise?.name || pathName,
          ultimateSkillId:
            path.ultimate_exercise_id ||
            pathExercises[pathExercises.length - 1]?.exerciseId ||
            "",
          exercises: pathExercises,
          currentLevel: completedCount,
          maxLevel: pathExercises.length,
          currentExercise: currentExercise || null,
          nextExercise: nextExercise || null,
        });
      }

      // Sort paths by category and then by name
      const categoryOrder = [
        "vertical_pull",
        "horizontal_pull",
        "vertical_push",
        "horizontal_push",
        "squat",
        "hinge",
        "core",
        "skill",
      ];

      pathsResult.sort((a, b) => {
        const aIndex = categoryOrder.indexOf(a.category);
        const bIndex = categoryOrder.indexOf(b.category);
        if (aIndex !== bIndex) {
          return (
            (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex)
          );
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
