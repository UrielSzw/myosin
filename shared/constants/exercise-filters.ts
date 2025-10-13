import {
  IExerciseEquipment,
  IExerciseMuscle,
  IExerciseType,
} from "../types/workout";

// Categorías principales basadas en músculos específicos
export type MainCategory =
  | "all"
  | "chest"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "back"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "abs"
  | "others";

export const MAIN_CATEGORIES: MainCategory[] = [
  "all",
  "chest",
  "shoulders",
  "biceps",
  "triceps",
  "back",
  "quads",
  "hamstrings",
  "glutes",
  "calves",
  "abs",
  "others",
];

export const MAIN_CATEGORY_LABELS: Record<MainCategory, string> = {
  all: "Todos",
  chest: "Pecho",
  shoulders: "Hombros",
  biceps: "Bíceps",
  triceps: "Tríceps",
  back: "Espalda",
  quads: "Cuádriceps",
  hamstrings: "Isquiotibiales",
  glutes: "Glúteos",
  calves: "Gemelos",
  abs: "Abdominales",
  others: "Otros",
};

// Iconos minimalistas para categorías
export const MAIN_CATEGORY_ICONS: Record<string, string> = {
  all: "LayoutGrid",
  others: "MoreHorizontal",
};

// Mapeo de músculos a categorías principales
export const MUSCLE_TO_CATEGORY: Record<IExerciseMuscle, MainCategory> = {
  // Pecho
  chest_upper: "chest",
  chest_middle: "chest",
  chest_lower: "chest",

  // Hombros
  front_delts: "shoulders",
  side_delts: "shoulders",
  rear_delts: "shoulders",

  // Brazos
  biceps: "biceps",
  triceps: "triceps",
  forearms: "others",

  // Espalda
  lats: "back",
  rhomboids: "back",
  mid_traps: "others",
  lower_traps: "others",
  upper_traps: "others",

  // Piernas
  quads: "quads",
  hamstrings: "hamstrings",
  glutes: "glutes",
  calves: "calves",
  hip_flexors: "others",
  hip_adductors: "others",
  hip_abductors: "others",

  // Core/Abs
  rectus_abdominis: "abs",
  obliques: "abs",
  transverse_abdominis: "abs",
  erector_spinae: "others",
  lower_back: "others",

  // Specialized
  serratus_anterior: "others",
  rotator_cuff: "others",
  full_body: "others",
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
