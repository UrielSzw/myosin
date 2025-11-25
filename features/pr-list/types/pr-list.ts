import { IExerciseMuscle } from "@/shared/types/workout";

export type PRListItem = {
  id: string;
  user_id: string;
  exercise_id: string;
  exercise_name: string;
  exercise_muscle: IExerciseMuscle;
  best_weight: number;
  best_reps: number;
  estimated_1rm: number;
  achieved_at: string;
  source: "auto" | "manual";
  created_at: string;
  updated_at: string;
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
  chest_upper: "chest",
  chest_middle: "chest",
  chest_lower: "chest",

  // Back
  lats: "back",
  rhomboids: "back",
  mid_traps: "back",
  lower_traps: "back",
  upper_traps: "back",

  // Shoulders
  front_delts: "shoulders",
  side_delts: "shoulders",
  rear_delts: "shoulders",

  // Arms
  triceps: "arms",
  biceps: "arms",
  forearms: "arms",

  // Legs
  quads: "legs",
  hamstrings: "legs",
  glutes: "legs",
  calves: "legs",
  hip_flexors: "legs",
  hip_adductors: "legs",
  hip_abductors: "legs",

  // Core
  rectus_abdominis: "core",
  obliques: "core",
  transverse_abdominis: "core",
  erector_spinae: "core",
  lower_back: "core",

  // Other
  serratus_anterior: "other",
  rotator_cuff: "other",
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
