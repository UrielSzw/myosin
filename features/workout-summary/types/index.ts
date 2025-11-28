// Types for workout summary screen

export type WorkoutSummaryData = {
  // Session info
  sessionId: string;
  routineName: string;
  routineId: string;

  // Stats
  totalExercises: number;
  totalSetsCompleted: number;
  totalSetsPlanned: number;
  durationSeconds: number;

  // Streak
  currentStreak: number;
  workoutNumber: number;

  // PRs from this session
  prs: SessionPR[];

  // Improvements vs last time
  improvements: ExerciseImprovement[];
};

export type SessionPR = {
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  estimated1RM: number;
};

export type ExerciseImprovement = {
  exerciseId: string;
  exerciseName: string;
  previousBest: {
    weight: number;
    reps: number;
  };
  currentBest: {
    weight: number;
    reps: number;
  };
  improvementType: "weight" | "reps" | "both";
};
