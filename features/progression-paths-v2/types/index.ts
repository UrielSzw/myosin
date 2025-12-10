import type { BaseExercise } from "@/shared/db/schema";
import type {
  UnlockCriteria,
  UnlockProgress,
} from "@/shared/db/schema/progressions";

// ============================================================================
// Path Types
// ============================================================================

export interface ProgressionPath {
  pathId: string;
  pathName: string;
  category: string;
  subcategory?: string;
  ultimateSkill: string;
  ultimateSkillId: string;
  exercises: PathExercise[];
  currentLevel: number;
  maxLevel: number;
  currentExercise: PathExercise | null;
  nextExercise: PathExercise | null;
}

export interface PathExercise {
  exerciseId: string;
  exerciseName: string;
  order: number;
  status: "locked" | "unlocking" | "unlocked" | "mastered";
  progress?: UnlockProgress;
  /** Criteria to unlock the NEXT exercise in the path (what you need to achieve with this exercise) */
  unlockCriteriaForNext?: UnlockCriteria;
  /** Name of the next exercise in the path */
  nextExerciseName?: string;
  /** Full exercise data (pre-loaded to avoid loading delay when viewing details) */
  exerciseData?: BaseExercise;
}

// ============================================================================
// Category Types
// ============================================================================

export type PathCategory =
  | "upper_pull"
  | "upper_push"
  | "core"
  | "lower_body"
  | "skills";

export interface CategoryInfo {
  id: PathCategory;
  label: { es: string; en: string };
  icon: string;
}

export const CATEGORY_INFO: Record<PathCategory, CategoryInfo> = {
  upper_pull: {
    id: "upper_pull",
    label: { es: "Tirón", en: "Pull" },
    icon: "arrow-down",
  },
  upper_push: {
    id: "upper_push",
    label: { es: "Empuje", en: "Push" },
    icon: "arrow-up",
  },
  core: {
    id: "core",
    label: { es: "Core", en: "Core" },
    icon: "circle",
  },
  lower_body: {
    id: "lower_body",
    label: { es: "Piernas", en: "Legs" },
    icon: "footprints",
  },
  skills: {
    id: "skills",
    label: { es: "Skills", en: "Skills" },
    icon: "star",
  },
};
