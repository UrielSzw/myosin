import type { MeasurementTemplateId } from "@/shared/types/measurement";
import { IExerciseMuscle } from "@/shared/types/workout";

export type PRListItem = {
  id: string;
  user_id: string;
  exercise_id: string;
  exercise_name: string;
  exercise_muscle: IExerciseMuscle;

  // Template-aware fields (support all measurement templates)
  measurement_template: MeasurementTemplateId;
  best_primary_value: number;
  best_secondary_value: number | null;
  pr_score: number;

  achieved_at: string;
  source: "auto" | "manual";
  created_at: string;
  updated_at: string | null;

  // Datos adicionales calculados
  is_recent?: boolean; // PRs de última semana
  exercise_muscle_category?: string; // chest, back, etc.
  total_workouts?: number;
};

export type PRListStats = {
  totalPRs: number;
  recentPRs: number;
  avgEstimated1RM: number;
  strongestLift: PRListItem | null;
};

export type PRListFilters = {
  searchQuery: string;
  muscleGroups: string[]; // Cambiado a categorías string[]
  showRecent: boolean; // Solo PRs de última semana
};

export const DEFAULT_PR_LIST_FILTERS: PRListFilters = {
  searchQuery: "",
  muscleGroups: [],
  showRecent: false,
};

// Mapeo de muscle groups a categorías principales para filtros
export const MUSCLE_CATEGORY_MAP: Record<IExerciseMuscle, string> = {
  // Chest
  chest: "chest",

  // Back
  upper_back: "back",
  lats: "back",

  // Shoulders
  shoulders_front: "shoulders",
  shoulders_side: "shoulders",
  shoulders_rear: "shoulders",

  // Arms
  biceps: "arms",
  triceps: "arms",
  forearms: "arms",

  // Legs
  glutes: "legs",
  quads: "legs",
  hamstrings: "legs",
  calves: "legs",
  hip_flexors: "legs",

  // Core
  abs: "core",
  obliques: "core",
  lower_back: "core",

  // Other
  full_body: "other",
};

export const MUSCLE_CATEGORY_LABELS: Record<string, string> = {
  // DEPRECATED: Use prListTranslations.muscleCategories instead
  // This is kept for backwards compatibility only
  chest: "Pecho",
  back: "Espalda",
  shoulders: "Hombros",
  arms: "Brazos",
  legs: "Piernas",
  core: "Core",
  other: "Otros",
};
