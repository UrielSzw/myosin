import { IExerciseMuscle } from "@/shared/types/workout";

// Tipo para un PR individual en el historial
export type PRHistoryItem = {
  id: string;
  weight: number;
  reps: number;
  estimated_1rm: number;
  achieved_at: string;
  source: "auto" | "manual";
  workout_session_id?: string;
  notes?: string;
};

// Tipo para la información del ejercicio
export type ExerciseInfo = {
  id: string;
  name: string;
  muscle: IExerciseMuscle;
  equipment: string;
};

// Tipo para stats de progreso
export type ProgressStats = {
  totalProgress: number; // Diferencia en kg desde primer al último PR
  timeSpan: string; // "8 meses", "1 año", etc.
  averageIncrease: number; // Promedio de incremento por mes
  bestStreak: number; // Mejor racha de PRs consecutivos
};

// Tipo principal para el detalle de PR
export type PRDetailData = {
  exerciseInfo: ExerciseInfo;
  currentPR: PRHistoryItem;
  history: PRHistoryItem[];
  progressStats: ProgressStats;
};

// Re-export PRListItem para consistency
export type { PRListItem } from "@/features/pr-list-v2/types/pr-list";
