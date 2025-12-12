// ================================================================================
// ROUTINE TEMPLATES - CONSTANTS
// ================================================================================

import type {
  ProgramTemplate,
  RoutineTemplate,
  RoutineTemplateData,
} from "../types";
import {
  FULL_BODY_BEGINNER_DATA,
  FULL_BODY_BEGINNER_PROGRAM,
  FULL_BODY_BEGINNER_ROUTINES,
} from "./templates/beginner-fullbody";

/**
 * ROUTINE TEMPLATES - Para mostrar en la UI
 * Estos son ligeros, solo para mostrar información y permitir selección
 */
export const ROUTINE_TEMPLATES: RoutineTemplate[] = [
  ...FULL_BODY_BEGINNER_ROUTINES,
];

/**
 * PROGRAM TEMPLATES - Programas completos
 */
export const PROGRAM_TEMPLATES: ProgramTemplate[] = [
  FULL_BODY_BEGINNER_PROGRAM,
];

/**
 * ROUTINE TEMPLATES DATA - LA DATA REAL PARA CREAR EN DB
 * Este es el JSON gigante que vas a llenar con la ayuda de la IA
 * Cada entrada debe tener un ID que coincida con ROUTINE_TEMPLATES
 */
export const ROUTINE_TEMPLATES_DATA: Record<string, RoutineTemplateData> = {
  ...FULL_BODY_BEGINNER_DATA,
};

/**
 * CONFIGURACIONES PREDEFINIDAS PARA LA IA
 */
export const AI_CONFIG_PRESETS = {
  BEGINNER_FULL_BODY: {
    difficulty: "beginner" as const,
    days: 3 as const,
    distribution: "full-body" as const,
    category: "hypertrophy" as const,
    equipment: "barbell-dumbbells" as const,
  },
  INTERMEDIATE_PPL: {
    difficulty: "intermediate" as const,
    days: 6 as const,
    distribution: "push-pull-legs" as const,
    category: "hypertrophy" as const,
    equipment: "full-gym" as const,
  },
  ADVANCED_POWERLIFTING: {
    difficulty: "advanced" as const,
    days: 4 as const,
    distribution: "powerlifting" as const,
    category: "strength" as const,
    equipment: "barbell-dumbbells" as const,
  },
} as const;

/**
 * OPCIONES DISPONIBLES PARA CADA CONFIGURACIÓN
 */
export const AI_CONFIG_OPTIONS = {
  difficulty: ["beginner", "intermediate", "advanced"] as const,
  days: [3, 4, 5, 6] as const,
  distribution: [
    "full-body",
    "upper-lower",
    "push-pull-legs",
    "push-pull-legs-push-pull-legs",
    "bro-split",
    "powerlifting",
    "custom",
  ] as const,
  category: ["strength", "hypertrophy", "endurance"] as const,
  equipment: [
    "bodyweight",
    "dumbbells",
    "barbell-dumbbells",
    "full-gym",
    "machines-only",
    "home-gym",
  ] as const,
} as const;

/**
 * HELPERS PARA BUSCAR TEMPLATES
 */
export const getRoutineTemplateById = (
  id: string
): RoutineTemplate | undefined => {
  return ROUTINE_TEMPLATES.find((template) => template.id === id);
};

export const getProgramTemplateById = (
  id: string
): ProgramTemplate | undefined => {
  return PROGRAM_TEMPLATES.find((template) => template.id === id);
};

export const getRoutineTemplateDataById = (
  id: string
): RoutineTemplateData | undefined => {
  return ROUTINE_TEMPLATES_DATA[id];
};

export const getTemplatesByCategory = (category: string) => {
  return ROUTINE_TEMPLATES.filter((template) => template.category === category);
};

export const getTemplatesByDifficulty = (difficulty: string) => {
  return ROUTINE_TEMPLATES.filter(
    (template) => template.difficulty === difficulty
  );
};

// ================================================================================
// TRANSLATION DICTIONARIES
// ================================================================================

/**
 * Diccionario para traducir músculos objetivo al español
 */
export const TARGET_MUSCLES_TRANSLATIONS: Record<string, string> = {
  // Upper body - Push
  chest: "Pecho",
  shoulders_front: "Hombro frontal",
  shoulders_side: "Hombro lateral",
  shoulders_rear: "Hombro posterior",
  shoulders: "Hombros",
  triceps: "Tríceps",

  // Upper body - Pull
  upper_back: "Espalda alta",
  lats: "Dorsales",
  back: "Espalda",
  biceps: "Bíceps",
  forearms: "Antebrazos",

  // Core
  abs: "Abdominales",
  obliques: "Oblicuos",
  lower_back: "Zona lumbar",
  core: "Core",

  // Lower body
  glutes: "Glúteos",
  quads: "Cuádriceps",
  hamstrings: "Isquiotibiales",
  calves: "Gemelos",
  hip_flexors: "Flexores de cadera",
  legs: "Piernas",

  // Full body
  full_body: "Cuerpo completo",
  "full-body": "Cuerpo completo",
  compound: "Compuestos",
};

/**
 * Diccionario para traducir equipamiento al español
 */
export const EQUIPMENT_TRANSLATIONS: Record<string, string> = {
  // Free weights
  bodyweight: "Peso corporal",
  barbell: "Barra",
  dumbbell: "Mancuerna",
  kettlebell: "Kettlebell",
  ez_bar: "Barra EZ",
  plate: "Disco",

  // Machines & Cable
  cable: "Cable",
  machine: "Máquina",
  smith_machine: "Máquina Smith",
  smith: "Smith",

  // Benches & Bars
  bench: "Banco",
  pull_up_bar: "Barra de dominadas",
  "pull-up-bar": "Barra de dominadas",
  dip_bars: "Barras de fondos",

  // Other equipment
  resistance_band: "Banda elástica",
  trap_bar: "Barra trampa",
  landmine: "Landmine",
  suspension_trainer: "TRX",
  medicine_ball: "Balón medicinal",
  cardio_machine: "Máquina cardio",
  rings: "Anillas",
  parallettes: "Paralelas bajas",

  // Gym types (for templates)
  gym: "Gimnasio",
  home: "Casa",
  minimal: "Mínimo",
  rack: "Rack",
  "barbell-dumbbells": "Barra y mancuernas",
  "full-gym": "Gimnasio completo",
  "machines-only": "Solo máquinas",
  "home-gym": "Gimnasio en casa",
  dumbbells: "Mancuernas",

  // Cardio
  treadmill: "Caminadora",
  bike: "Bicicleta",
  rowing: "Remo",
};

/**
 * Diccionario para traducir categorías al español
 */
export const CATEGORY_TRANSLATIONS: Record<string, string> = {
  strength: "Fuerza",
  hypertrophy: "Hipertrofia",
  endurance: "Resistencia",
  power: "Potencia",
  conditioning: "Acondicionamiento",
};

/**
 * Diccionario para traducir dificultades al español
 */
export const DIFFICULTY_TRANSLATIONS: Record<string, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

/**
 * Diccionario para traducir días de la semana al español
 */
export const WEEKDAYS_TRANSLATIONS: Record<string, string> = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",

  // También versiones abreviadas por si acaso
  mon: "Lun",
  tue: "Mar",
  wed: "Mié",
  thu: "Jue",
  fri: "Vie",
  sat: "Sáb",
  sun: "Dom",
};

/**
 * Helper functions para usar las traducciones
 */
export const translateTargetMuscles = (muscles: string[]): string[] => {
  return muscles.map((muscle) => TARGET_MUSCLES_TRANSLATIONS[muscle] || muscle);
};

export const translateEquipment = (equipment: string[]): string[] => {
  return equipment.map((item) => EQUIPMENT_TRANSLATIONS[item] || item);
};

export const translateCategory = (category: string): string => {
  return CATEGORY_TRANSLATIONS[category] || category;
};

export const translateDifficulty = (difficulty: string): string => {
  return DIFFICULTY_TRANSLATIONS[difficulty] || difficulty;
};

export const translateWeekdays = (days: string[]): string[] => {
  return days.map((day) => WEEKDAYS_TRANSLATIONS[day] || day);
};

export const translateWeekday = (day: string): string => {
  return WEEKDAYS_TRANSLATIONS[day] || day;
};
