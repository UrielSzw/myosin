import type { MeasurementTemplateId } from "@/shared/types/measurement";
import { IExerciseMuscle } from "@/shared/types/workout";

// Tipo para un PR individual en el historial
export type PRHistoryItem = {
  id: string;
  measurement_template: MeasurementTemplateId;
  primary_value: number;
  secondary_value: number | null;
  pr_score: number;
  created_at: string | null;
  source: "auto" | "manual" | "import";
  workout_session_id?: string | null;
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
  totalProgress: number; // Diferencia en score desde primer al último PR
  progressUnit: string; // "kg", "s", "m", etc. based on template
  timeSpan: string; // "8 meses", "1 año", etc.
  averageIncrease: number; // Promedio de incremento por mes
  bestStreak: number; // Mejor racha de PRs consecutivos
};

// Tipo principal para el detalle de PR
export type PRDetailData = {
  exerciseInfo: ExerciseInfo;
  measurementTemplate: MeasurementTemplateId;
  currentPR: PRHistoryItem;
  history: PRHistoryItem[];
  progressStats: ProgressStats;
};

// Re-export PRListItem para consistency
export type { PRListItem } from "@/features/pr-list-v2/types/pr-list";
