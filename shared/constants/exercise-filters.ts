import {
  IExerciseEquipment,
  IExerciseMuscle,
  IExerciseType,
} from "../types/workout";

// Categorías principales simplificadas
export type MainCategory = "all" | "push" | "pull" | "legs";

export const MAIN_CATEGORIES: MainCategory[] = ["all", "push", "pull", "legs"];

export const MAIN_CATEGORY_LABELS: Record<MainCategory, string> = {
  all: "Todos",
  push: "Empuje",
  pull: "Tracción",
  legs: "Piernas",
};

// Iconos minimalistas para categorías
export const MAIN_CATEGORY_ICONS: Record<MainCategory, string> = {
  all: "LayoutGrid",
  push: "TrendingUp",
  pull: "TrendingDown",
  legs: "Footprints",
};

// Mapeo de músculos a categorías principales
export const MUSCLE_TO_CATEGORY: Record<IExerciseMuscle, MainCategory> = {
  // Push
  chest_upper: "push",
  chest_middle: "push",
  chest_lower: "push",
  front_delts: "push",
  side_delts: "push",
  rear_delts: "push",
  triceps: "push",

  // Pull
  lats: "pull",
  rhomboids: "pull",
  mid_traps: "pull",
  lower_traps: "pull",
  upper_traps: "pull",
  biceps: "pull",
  forearms: "pull",

  // Legs & Core
  quads: "legs",
  hamstrings: "legs",
  glutes: "legs",
  calves: "legs",
  hip_flexors: "legs",
  hip_adductors: "legs",
  hip_abductors: "legs",
  rectus_abdominis: "legs",
  obliques: "legs",
  transverse_abdominis: "legs",
  erector_spinae: "legs",
  lower_back: "legs",

  // Specialized
  serratus_anterior: "push",
  rotator_cuff: "pull",
  full_body: "all",
};

// Filtros rápidos más comunes
export type QuickFilterType =
  | IExerciseType
  | "bodyweight"
  | "free_weights"
  | "machines";

export interface QuickFilter {
  id: QuickFilterType;
  label: string;
  icon: string;
  description: string;
}

export const QUICK_FILTERS: QuickFilter[] = [
  {
    id: "compound",
    label: "Compuesto",
    icon: "Layers",
    description: "Ejercicios multiarticulares",
  },
  {
    id: "isolation",
    label: "Aislamiento",
    icon: "Target",
    description: "Ejercicios de aislamiento",
  },
  {
    id: "bodyweight",
    label: "Peso corporal",
    icon: "User",
    description: "Solo peso corporal",
  },
  {
    id: "free_weights",
    label: "Pesas libres",
    icon: "Dumbbell",
    description: "Pesas libres",
  },
  {
    id: "machines",
    label: "Máquinas",
    icon: "Settings",
    description: "Máquinas",
  },
];

// Agrupación de equipamiento
export const EQUIPMENT_GROUPS = {
  free_weights: [
    "barbell",
    "ez_curl_bar",
    "dumbbell",
    "kettlebell",
    "weight_plate",
  ] as IExerciseEquipment[],
  machines: [
    "cable_machine",
    "smith_machine",
    "leg_press",
    "lat_pulldown",
    "chest_press_machine",
    "leg_curl_machine",
    "leg_extension_machine",
    "seated_row_machine",
    "shoulder_press_machine",
  ] as IExerciseEquipment[],
  bodyweight: [
    "bodyweight",
    "pull_up_bar",
    "dip_station",
    "parallel_bars",
  ] as IExerciseEquipment[],
  accessories: [
    "resistance_band",
    "suspension_trainer",
    "medicine_ball",
    "stability_ball",
    "foam_roller",
    "ab_wheel",
  ] as IExerciseEquipment[],
  benches: [
    "flat_bench",
    "incline_bench",
    "decline_bench",
    "preacher_bench",
  ] as IExerciseEquipment[],
};

// Tipos para el estado de filtros
export interface ExerciseFilters {
  searchQuery: string;
  mainCategory: MainCategory;
  quickFilters: QuickFilterType[];
  specificMuscles: IExerciseMuscle[];
  specificEquipment: IExerciseEquipment[];
}

export const DEFAULT_FILTERS: ExerciseFilters = {
  searchQuery: "",
  mainCategory: "all",
  quickFilters: [],
  specificMuscles: [],
  specificEquipment: [],
};
