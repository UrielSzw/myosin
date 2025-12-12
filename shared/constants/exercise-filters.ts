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
  chest: "chest",

  // Hombros
  shoulders_front: "shoulders",
  shoulders_side: "shoulders",
  shoulders_rear: "shoulders",

  // Brazos
  biceps: "biceps",
  triceps: "triceps",
  forearms: "others",

  // Espalda
  upper_back: "back",
  lats: "back",
  lower_back: "others",

  // Piernas
  quads: "quads",
  hamstrings: "hamstrings",
  glutes: "glutes",
  calves: "calves",
  hip_flexors: "others",

  // Core/Abs
  abs: "abs",
  obliques: "abs",

  // Full body
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
    label: "compound",
    icon: "Layers",
    description: "compound",
  },
  {
    id: "isolation",
    label: "isolation",
    icon: "Target",
    description: "isolation",
  },
  {
    id: "bodyweight",
    label: "bodyweight",
    icon: "User",
    description: "bodyweight",
  },
  {
    id: "free_weights",
    label: "freeWeights",
    icon: "Dumbbell",
    description: "freeWeights",
  },
  {
    id: "machines",
    label: "machines",
    icon: "Settings",
    description: "machines",
  },
];

// Agrupación de equipamiento
export const EQUIPMENT_GROUPS = {
  free_weights: [
    "barbell",
    "ez_bar",
    "dumbbell",
    "kettlebell",
    "plate",
    "trap_bar",
  ] as IExerciseEquipment[],
  machines: [
    "cable",
    "machine",
    "smith_machine",
    "cardio_machine",
  ] as IExerciseEquipment[],
  bodyweight: [
    "bodyweight",
    "pull_up_bar",
    "dip_bars",
    "rings",
    "parallettes",
  ] as IExerciseEquipment[],
  accessories: [
    "resistance_band",
    "suspension_trainer",
    "medicine_ball",
    "landmine",
    "bench",
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

// Tipos para los handlers de filtros
export interface ExerciseFilterHandlers {
  updateFilter: <K extends keyof ExerciseFilters>(
    key: K,
    value: ExerciseFilters[K]
  ) => void;
  toggleQuickFilter: (filterId: QuickFilterType) => void;
  toggleSpecificMuscle: (muscle: IExerciseMuscle) => void;
  toggleSpecificEquipment: (equipment: IExerciseEquipment) => void;
  clearAllFilters: () => void;
}

// Tipos para los datos derivados de los filtros
export interface ExerciseFilterData {
  filteredExercises: import("../db/schema").BaseExercise[];
  activeFiltersCount: number;
  activeFiltersList: {
    id: string;
    label: string;
    type: "category" | "quick" | "muscle" | "equipment";
    onRemove: () => void;
  }[];
  replaceData?: {
    exerciseToReplace: import("../db/schema").BaseExercise;
    similarExercises: import("../db/schema").BaseExercise[];
    hasSimilarExercises: boolean;
  } | null;
}
