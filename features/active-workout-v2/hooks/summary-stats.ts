import { db } from "@/shared/db/client";
import { workout_sessions } from "@/shared/db/schema/workout-session";
import { and, desc, eq, gte, sql } from "drizzle-orm";

export type SummaryStats = {
  workoutNumber: number;
  currentStreak: number;
};

/**
 * Gets summary stats for the workout completion screen.
 * - workoutNumber: Total completed workouts for the user
 * - currentStreak: Current streak of consecutive days with workouts
 */
export async function getSummaryStats(userId: string): Promise<SummaryStats> {
  try {
    // Get total workout count
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(workout_sessions)
      .where(eq(workout_sessions.user_id, userId));

    const workoutNumber = countResult?.count ?? 1;

    // Calculate streak - days with at least one workout
    const streak = await calculateStreak(userId);

    return {
      workoutNumber,
      currentStreak: streak,
    };
  } catch (error) {
    console.error("Error getting summary stats:", error);
    return {
      workoutNumber: 1,
      currentStreak: 1,
    };
  }
}

/**
 * Calculates the current streak of consecutive days with workouts
 */
async function calculateStreak(userId: string): Promise<number> {
  try {
    // Get all sessions in last 30 days, grouped by date
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sessions = await db
      .select({
        started_at: workout_sessions.started_at,
      })
      .from(workout_sessions)
      .where(
        and(
          eq(workout_sessions.user_id, userId),
          gte(workout_sessions.started_at, thirtyDaysAgo.toISOString())
        )
      )
      .orderBy(desc(workout_sessions.started_at));

    if (sessions.length === 0) return 1; // At least today counts

    // Get unique dates (YYYY-MM-DD format)
    const workoutDates = new Set<string>();
    sessions.forEach((s) => {
      const date = new Date(s.started_at).toISOString().split("T")[0];
      workoutDates.add(date);
    });

    // Count consecutive days starting from today
    const today = new Date().toISOString().split("T")[0];
    let streak = 0;
    const currentDate = new Date(today);

    // Check if today has a workout (or consider the most recent as day 1)
    for (let i = 0; i < 30; i++) {
      const dateStr = currentDate.toISOString().split("T")[0];

      if (workoutDates.has(dateStr)) {
        streak++;
      } else if (streak > 0) {
        // Break if we miss a day after starting the streak
        break;
      }

      // Go to previous day
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return Math.max(streak, 1); // At least 1 for completing today
  } catch (error) {
    console.error("Error calculating streak:", error);
    return 1;
  }
}

/**
 * Gets improvements vs the last session of the same routine
 */
export async function getImprovements(
  _routineId: string,
  _userId: string,
  _currentSessionExercises: {
    exerciseId: string;
    exerciseName: string;
    bestWeight: number;
    bestReps: number;
  }[]
): Promise<
  {
    exerciseId: string;
    exerciseName: string;
    previousWeight: number;
    previousReps: number;
    currentWeight: number;
    currentReps: number;
  }[]
> {
  // For now, return empty - can be implemented later to compare with previous session
  // This would require querying the last session with the same routine_id
  // and comparing the best sets for each exercise
  return [];
}
