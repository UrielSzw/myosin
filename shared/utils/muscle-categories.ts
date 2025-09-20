import { IExerciseMuscle } from "../types/workout";

// Días de la semana en español
export type WeekDay =
  | "lunes"
  | "martes"
  | "miercoles"
  | "jueves"
  | "viernes"
  | "sabado"
  | "domingo";

// Categorías principales de músculos para análisis de volumen
export const MUSCLE_CATEGORIES = {
  chest: {
    muscles: ["chest"] as const,
    display: "Pecho",
    icon: "💪",
  },
  back: {
    muscles: ["back", "lats", "traps"] as const,
    display: "Espalda",
    icon: "🔙",
  },
  shoulders: {
    muscles: ["shoulders", "rear_delts"] as const,
    display: "Hombros",
    icon: "🏋️",
  },
  arms: {
    muscles: ["biceps", "triceps", "forearms", "arms"] as const,
    display: "Brazos",
    icon: "💪",
  },
  legs: {
    muscles: ["quads", "hamstrings", "glutes", "calves", "legs"] as const,
    display: "Piernas",
    icon: "🦵",
  },
  core: {
    muscles: ["core", "obliques"] as const,
    display: "Core",
    icon: "🎯",
  },
  other: {
    muscles: ["lower_back", "hip_flexors", "full_body"] as const,
    display: "Otros",
    icon: "⚡",
  },
} as const;

// Tipo para las claves de categorías
export type MuscleCategoryKey = keyof typeof MUSCLE_CATEGORIES;

// Configuración de contribución muscular
export const MUSCLE_CONTRIBUTION = {
  primary: 1.0, // Músculo principal cuenta como 1 serie completa
  secondary: 0.5, // Músculos secundarios cuentan como 0.5 series
} as const;

// Utilidades para trabajar con categorías
export const MuscleCategoryUtils = {
  /**
   * Encuentra la categoría a la que pertenece un músculo específico
   */
  getCategoryForMuscle: (muscle: IExerciseMuscle): MuscleCategoryKey => {
    for (const [categoryKey, category] of Object.entries(MUSCLE_CATEGORIES)) {
      if ((category.muscles as readonly IExerciseMuscle[]).includes(muscle)) {
        return categoryKey as MuscleCategoryKey;
      }
    }
    return "other"; // Fallback por si acaso
  },

  /**
   * Obtiene información de display para una categoría
   */
  getCategoryDisplay: (categoryKey: MuscleCategoryKey) => {
    const category = MUSCLE_CATEGORIES[categoryKey];
    return {
      name: category.display,
      icon: category.icon,
      muscles: category.muscles,
    };
  },

  /**
   * Convierte nombre de día a display
   */
  getWeekDayDisplay: (day: WeekDay): string => {
    const dayNames: Record<WeekDay, string> = {
      lunes: "Lun",
      martes: "Mar",
      miercoles: "Mié",
      jueves: "Jue",
      viernes: "Vie",
      sabado: "Sáb",
      domingo: "Dom",
    };
    return dayNames[day];
  },

  /**
   * Obtiene todas las categorías para mostrar
   */
  getAllCategories: () => {
    return Object.entries(MUSCLE_CATEGORIES).map(([key, category]) => ({
      key: key as MuscleCategoryKey,
      display: category.display,
      icon: category.icon,
      muscles: category.muscles,
    }));
  },
};
