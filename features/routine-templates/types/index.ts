// ================================================================================
// ROUTINE TEMPLATES - TYPES
// ================================================================================

/**
 * RoutineTemplate - Para mostrar en la UI, información ligera
 */
export interface RoutineTemplate {
  id: string;
  name: string;
  description: string;
  category: "strength" | "hypertrophy" | "endurance";
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string; // "45-60 min"
  targetMuscles: string[]; // ["chest", "shoulders", "triceps"]
  tags: string[]; // ["push", "upper", "compound"]
  equipment: string[]; // ["barbell", "dumbbell", "bench"]
  weeklyFrequency?: number; // 2, 3, etc (para rutinas individuales)
}

/**
 * ProgramTemplate - Programa completo con múltiples rutinas
 */
export interface ProgramTemplate {
  id: string;
  name: string;
  description: string;
  category: "strength" | "hypertrophy" | "endurance";
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string; // "4 semanas", "8 semanas"
  frequency: string; // "3x semana", "6x semana"
  equipment: string[]; // ["barbell", "dumbbell", "bench"]
  routines: {
    routineId: string; // ID del RoutineTemplate
    assignedDays: string[]; // ["monday", "wednesday", "friday"]
    name?: string; // Override del nombre si es necesario
  }[];
}

/**
 * RoutineTemplateData - ESTE ES EL TYPE MÁS IMPORTANTE
 * Contiene toda la data necesaria para crear la rutina en DB
 * Sigue la estructura exacta de CreateRoutineData pero sin IDs temporales
 */
export interface RoutineTemplateData {
  id: string; // Debe coincidir con RoutineTemplate.id

  // Datos de la rutina principal
  routine: {
    name: string;
    folder_id: string | null;
    training_days: string[] | null; // ["monday", "wednesday", "friday"]
    show_rpe: boolean;
    show_tempo: boolean;
  };

  // Bloques de la rutina
  blocks: {
    type: "individual" | "superset" | "circuit";
    name: string;
    order_index: number;
    rest_time_seconds: number;
    rest_between_exercises_seconds: number;
  }[];

  // Ejercicios en cada bloque
  exercisesInBlock: {
    block_index: number; // Índice del bloque en el array blocks
    exercise_id: string; // ID del ejercicio en la DB
    exercise_name: string; // Nombre para referencia (no se guarda en DB)
    order_index: number; // Orden dentro del bloque
    notes: string | null;
  }[];

  // Sets para cada ejercicio
  sets: {
    exercise_block_index: number; // Índice del ejercicio en exercisesInBlock
    exercise_order_index: number; // Para identificar el ejercicio específico
    order_index: number; // Orden del set
    reps: number | null;
    weight: number | null;
    rpe: number | null;
    tempo: string | null;
    set_type:
      | "normal"
      | "warmup"
      | "drop"
      | "failure"
      | "cluster"
      | "rest-pause"
      | "mechanical"
      | "eccentric"
      | "partial"
      | "isometric";
    reps_type: "reps" | "range" | "time" | "distance";
    reps_range: {
      min: number;
      max: number;
    } | null;
  }[];
}

/**
 * Template unificado para el selector de UI
 */
export type Template =
  | {
      type: "routine";
      template: RoutineTemplate;
    }
  | {
      type: "program";
      template: ProgramTemplate;
    };

/**
 * Configuración para la creación de rutinas por IA
 */
export interface AIRoutineConfig {
  difficulty: "beginner" | "intermediate" | "advanced";
  days: 3 | 4 | 5 | 6;
  distribution:
    | "full-body"
    | "upper-lower"
    | "push-pull-legs"
    | "push-pull-legs-push-pull-legs"
    | "bro-split"
    | "powerlifting"
    | "custom";
  category: "strength" | "hypertrophy" | "endurance";
  equipment:
    | "bodyweight"
    | "dumbbells"
    | "barbell-dumbbells"
    | "full-gym"
    | "machines-only"
    | "home-gym";
}

/**
 * Estructura para el output de la IA
 */
export interface AIRoutineOutput {
  config: AIRoutineConfig;
  routines: RoutineTemplateData[];
  program?: {
    name: string;
    description: string;
    routineDistribution: {
      routineId: string;
      days: string[];
    }[];
  };
}
