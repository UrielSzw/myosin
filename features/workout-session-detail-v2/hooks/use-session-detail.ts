import { workoutSessionsRepository } from "@/shared/db/repository/workout-sessions";
import { WorkoutSessionFull } from "@/shared/db/schema/workout-session";
import { queryKeys } from "@/shared/queries/query-keys";
import {
  hasWeightMeasurement,
  supportsPRCalculation,
} from "@/shared/types/measurement";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export type SessionAnalytics = {
  totalVolume: number;
  averageRPE: number | null;
  prCount: number;
  completionByBlock: Record<
    string,
    { completed: number; total: number; percentage: number }
  >;
  plannedVsActual: {
    weightDifference: number;
    repsDifference: number;
    rpeUsage: number; // Porcentaje de sets con RPE
  };
  muscleGroupVolume: {
    group: string;
    sets: number;
    percentage: number;
  }[];
  bestSets: {
    exerciseName: string;
    weight: number;
    reps: number;
    estimatedOneRM?: number;
    isPR: boolean;
  }[];
};

const calculateSessionAnalytics = (
  session: WorkoutSessionFull
): SessionAnalytics => {
  let totalVolume = 0;
  let totalRPE = 0;
  let rpeCount = 0;
  let prCount = 0;
  let totalWeightDifference = 0;
  let totalRepsDifference = 0;
  let totalSetsWithPlanned = 0;
  const completionByBlock: Record<
    string,
    { completed: number; total: number; percentage: number }
  > = {};
  const muscleGroupSets: Record<string, number> = {};
  const bestSets: SessionAnalytics["bestSets"] = [];

  session.blocks.forEach((block) => {
    let blockCompleted = 0;
    let blockTotal = 0;

    block.exercises.forEach((exercise) => {
      const muscleGroup = exercise.exercise.main_muscle_group;

      exercise.sets.forEach((set) => {
        blockTotal++;

        if (set.completed) {
          blockCompleted++;

          // Volume calculation - only for weight-based exercises
          if (hasWeightMeasurement(set.measurement_template)) {
            const weight = set.actual_primary_value || 0;
            const reps = set.actual_secondary_value || 0;
            totalVolume += weight * reps;
          }

          // RPE tracking
          if (set.actual_rpe) {
            totalRPE += set.actual_rpe;
            rpeCount++;
          }

          // PR tracking - only for exercises that support PR calculation
          if (
            supportsPRCalculation(set.measurement_template) &&
            set.actual_primary_value &&
            set.actual_secondary_value
          ) {
            const weight = set.actual_primary_value;
            const reps = set.actual_secondary_value;
            const estimatedOneRM = weight * (1 + reps / 30);

            // Simple heuristic: if estimated 1RM is unusually high for this weight/rep combo
            const isLikelyPR = estimatedOneRM > weight * 1.2;

            if (isLikelyPR) {
              prCount++;
            }

            // Add to best sets
            bestSets.push({
              exerciseName: exercise.exercise.name,
              weight,
              reps,
              estimatedOneRM,
              isPR: isLikelyPR,
            });
          }

          // Muscle group tracking
          if (muscleGroup) {
            muscleGroupSets[muscleGroup] =
              (muscleGroupSets[muscleGroup] || 0) + 1;
          }
        }

        // Planned vs Actual comparison - only for weight-based exercises
        if (hasWeightMeasurement(set.measurement_template)) {
          if (set.planned_primary_value && set.actual_primary_value) {
            totalWeightDifference +=
              set.actual_primary_value - set.planned_primary_value;
            totalSetsWithPlanned++;
          }
          if (set.planned_secondary_value && set.actual_secondary_value) {
            totalRepsDifference +=
              set.actual_secondary_value - set.planned_secondary_value;
          }
        }
      });
    });

    completionByBlock[block.id] = {
      completed: blockCompleted,
      total: blockTotal,
      percentage:
        blockTotal > 0 ? Math.round((blockCompleted / blockTotal) * 100) : 0,
    };
  });

  // Convert muscle groups to percentage
  const totalMuscleGroupSets = Object.values(muscleGroupSets).reduce(
    (sum, sets) => sum + sets,
    0
  );
  const muscleGroupVolume = Object.entries(muscleGroupSets).map(
    ([group, sets]) => ({
      group: group.charAt(0).toUpperCase() + group.slice(1),
      sets,
      percentage:
        totalMuscleGroupSets > 0
          ? Math.round((sets / totalMuscleGroupSets) * 100)
          : 0,
    })
  );

  // Sort best sets by estimated 1RM
  bestSets.sort((a, b) => (b.estimatedOneRM || 0) - (a.estimatedOneRM || 0));

  return {
    totalVolume: Math.round(totalVolume),
    averageRPE:
      rpeCount > 0 ? Math.round((totalRPE / rpeCount) * 10) / 10 : null,
    prCount,
    completionByBlock,
    plannedVsActual: {
      weightDifference:
        totalSetsWithPlanned > 0
          ? Math.round((totalWeightDifference / totalSetsWithPlanned) * 10) / 10
          : 0,
      repsDifference:
        totalSetsWithPlanned > 0
          ? Math.round((totalRepsDifference / totalSetsWithPlanned) * 10) / 10
          : 0,
      rpeUsage:
        session.total_sets_completed > 0
          ? Math.round((rpeCount / session.total_sets_completed) * 100)
          : 0,
    },
    muscleGroupVolume,
    bestSets: bestSets.slice(0, 5), // Top 5 sets
  };
};

export const useSessionDetail = (sessionId: string) => {
  const {
    data: sessionData,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.sessions.detail(sessionId),
    queryFn: () => workoutSessionsRepository.findSessionById(sessionId),
    enabled: !!sessionId,
  });

  const analytics = useMemo(() => {
    if (!sessionData) return null;
    return calculateSessionAnalytics(sessionData);
  }, [sessionData]);

  return {
    data: sessionData,
    analytics,
    isLoading,
    error,
  };
};
