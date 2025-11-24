import {
  TrackerMetricInsert,
  TrackerQuickActionInsert,
} from "@/shared/db/schema/tracker";

/**
 * Templates de métricas predefinidas (globales, sin user_id)
 * Estos son los templates que se muestran al usuario para agregar
 */
export const PREDEFINED_METRIC_TEMPLATES: Omit<
  TrackerMetricInsert,
  "user_id" | "id"
>[] = [
  {
    slug: "protein",
    name: "Proteína",
    input_type: "numeric_accumulative",
    behavior: "accumulate",
    unit: "g",
    canonical_unit: "g",
    conversion_factor: 1,
    default_target: 150,
    color: "#10B981",
    icon: "Beef",
    deleted_at: null,
    order_index: 1,
  },
  {
    slug: "water",
    name: "Agua",
    input_type: "numeric_accumulative",
    behavior: "accumulate",
    unit: "L",
    canonical_unit: "ml",
    conversion_factor: 1000,
    default_target: 2500, // en ml
    color: "#3B82F6",
    icon: "Droplets",
    deleted_at: null,
    order_index: 2,
  },
  {
    slug: "calories",
    name: "Calorías",
    input_type: "numeric_accumulative",
    behavior: "accumulate",
    unit: "kcal",
    canonical_unit: "kcal",
    conversion_factor: 1,
    default_target: 2000,
    color: "#F59E0B",
    icon: "Flame",
    deleted_at: null,
    order_index: 3,
  },
  {
    slug: "steps",
    name: "Pasos",
    input_type: "numeric_accumulative",
    behavior: "accumulate",
    unit: "pasos",
    canonical_unit: "pasos",
    conversion_factor: 1,
    default_target: 10000,
    color: "#8B5CF6",
    icon: "Footprints",
    deleted_at: null,
    order_index: 4,
  },
  {
    slug: "sleep",
    name: "Sueño",
    input_type: "numeric_single",
    behavior: "replace",
    unit: "horas",
    canonical_unit: "horas",
    conversion_factor: 1,
    default_target: 8,
    color: "#6366F1",
    icon: "Moon",
    deleted_at: null,
    order_index: 5,
  },
  {
    slug: "weight",
    name: "Peso",
    input_type: "numeric_single",
    behavior: "replace",
    unit: "kg",
    canonical_unit: "kg",
    conversion_factor: 1,
    default_target: null,
    color: "#EF4444",
    icon: "Scale",
    deleted_at: null,
    order_index: 6,
  },
  {
    slug: "mood",
    name: "Estado de ánimo",
    input_type: "scale_discrete",
    behavior: "replace",
    unit: "nivel",
    canonical_unit: "scale",
    conversion_factor: 1,
    default_target: null,
    color: "#F59E0B",
    icon: "Smile",
    deleted_at: null,
    order_index: 7,
  },
  {
    slug: "sleep_quality",
    name: "Calidad del Sueño",
    input_type: "scale_discrete",
    behavior: "replace",
    unit: "nivel",
    canonical_unit: "scale",
    conversion_factor: 1,
    default_target: null,
    color: "#6366F1",
    icon: "Moon",
    deleted_at: null,
    order_index: 8,
  },
  {
    slug: "stress_level",
    name: "Nivel de Estrés",
    input_type: "scale_discrete",
    behavior: "replace",
    unit: "nivel",
    canonical_unit: "scale",
    conversion_factor: 1,
    default_target: null,
    color: "#EF4444",
    icon: "Brain",
    deleted_at: null,
    order_index: 9,
  },
  {
    slug: "focus_time",
    name: "Tiempo de Concentración",
    input_type: "numeric_accumulative",
    behavior: "accumulate",
    unit: "min",
    canonical_unit: "min",
    conversion_factor: 1,
    default_target: 120,
    color: "#0891B2",
    icon: "Brain",
    deleted_at: null,
    order_index: 10,
  },
  {
    slug: "meditation",
    name: "Meditación",
    input_type: "numeric_accumulative",
    behavior: "accumulate",
    unit: "min",
    canonical_unit: "min",
    conversion_factor: 1,
    default_target: 20,
    color: "#8B5CF6",
    icon: "CloudSun",
    deleted_at: null,
    order_index: 11,
  },
  {
    slug: "reading_time",
    name: "Tiempo de Lectura",
    input_type: "numeric_accumulative",
    behavior: "accumulate",
    unit: "min",
    canonical_unit: "min",
    conversion_factor: 1,
    default_target: 30,
    color: "#059669",
    icon: "Book",
    deleted_at: null,
    order_index: 12,
  },
  {
    slug: "creatine",
    name: "Creatina",
    input_type: "numeric_accumulative",
    behavior: "accumulate",
    unit: "g",
    canonical_unit: "g",
    conversion_factor: 1,
    default_target: 5, // 5g diarios (estándar científico)
    color: "#7C3AED",
    icon: "Zap",
    deleted_at: null,
    order_index: 13,
  },
  {
    slug: "vitamins",
    name: "Vitaminas",
    input_type: "boolean_toggle",
    behavior: "replace",
    unit: "completado",
    canonical_unit: "boolean",
    conversion_factor: 1,
    default_target: null,
    color: "#F59E0B",
    icon: "Pill",
    deleted_at: null,
    order_index: 14,
  },
  {
    slug: "sunlight_exposure",
    name: "Exposición Solar",
    input_type: "numeric_accumulative",
    behavior: "accumulate",
    unit: "min",
    canonical_unit: "min",
    conversion_factor: 1,
    default_target: 20,
    color: "#F59E0B",
    icon: "Sun",
    deleted_at: null,
    order_index: 15,
  },
];

/**
 * Templates de quick actions predefinidas (globales, sin user_id ni metric_id)
 * Se asocian por slug de métrica
 */
export const PREDEFINED_QUICK_ACTION_TEMPLATES: Record<
  string,
  (Omit<TrackerQuickActionInsert, "user_id" | "metric_id"> & { id: string })[]
> = {
  // Protein
  protein: [
    {
      id: "protein_chicken_150g",
      label: "Pollo (150g)",
      value: 35,
      value_normalized: 35, // ya está en gramos
      icon: "ChefHat",
      position: 1,
    },
    {
      id: "protein_eggs_2u",
      label: "Huevos (2u)",
      value: 12,
      value_normalized: 12,
      icon: "Egg",
      position: 2,
    },
    {
      id: "protein_shake",
      label: "Shake de proteína",
      value: 25,
      value_normalized: 25,
      icon: "Coffee",
      position: 3,
    },
    {
      id: "protein_yogurt_greek",
      label: "Yogurt griego",
      value: 15,
      value_normalized: 15,
      icon: "Milk",
      position: 4,
    },
    {
      id: "protein_tuna_can",
      label: "Atún (lata)",
      value: 28,
      value_normalized: 28,
      icon: "Fish",
      position: 5,
    },
    {
      id: "protein_lentils_cup",
      label: "Lentejas (1 taza)",
      value: 18,
      value_normalized: 18,
      icon: "Wheat",
      position: 6,
    },
  ],

  // Water
  water: [
    {
      id: "water_glass_small_200ml",
      label: "Vaso chico (200ml)",
      value: 0.2, // en litros (unidad display)
      value_normalized: 200, // en ml (canonical_unit)
      icon: "CupSoda",
      position: 1,
    },
    {
      id: "water_glass_large_300ml",
      label: "Vaso grande (300ml)",
      value: 0.3,
      value_normalized: 300,
      icon: "CupSoda",
      position: 2,
    },
    {
      id: "water_bottle_500ml",
      label: "Botella (500ml)",
      value: 0.5,
      value_normalized: 500,
      icon: "CupSoda",
      position: 3,
    },
    {
      id: "water_bottle_large_1L",
      label: "Botella grande (1L)",
      value: 1.0,
      value_normalized: 1000,
      icon: "CupSoda",
      position: 4,
    },
  ],

  // Sleep
  sleep: [
    {
      id: "sleep_nap_30min",
      label: "Siesta (30min)",
      value: 0.5,
      value_normalized: 0.5,
      icon: "Bed",
      position: 1,
    },
    {
      id: "sleep_full_night_8h",
      label: "Noche completa (8h)",
      value: 8.0,
      value_normalized: 8.0,
      icon: "Bed",
      position: 2,
    },
  ],

  // Calories
  calories: [
    {
      id: "calories_breakfast_typical",
      label: "Desayuno típico",
      value: 400,
      value_normalized: 400,
      icon: "Coffee",
      position: 1,
    },
    {
      id: "calories_lunch_complete",
      label: "Almuerzo completo",
      value: 600,
      value_normalized: 600,
      icon: "UtensilsCrossed",
      position: 2,
    },
    {
      id: "calories_dinner_light",
      label: "Cena ligera",
      value: 350,
      value_normalized: 350,
      icon: "Moon",
      position: 3,
    },
    {
      id: "calories_snack_healthy",
      label: "Snack saludable",
      value: 150,
      value_normalized: 150,
      icon: "Apple",
      position: 4,
    },
  ],

  // Steps
  steps: [
    {
      id: "steps_walk_short",
      label: "Caminata corta",
      value: 2000,
      value_normalized: 2000,
      icon: "Footprints",
      position: 1,
    },
    {
      id: "steps_walk_long",
      label: "Caminata larga",
      value: 5000,
      value_normalized: 5000,
      icon: "Footprints",
      position: 2,
    },
    {
      id: "steps_workout",
      label: "Entrenamiento",
      value: 8000,
      value_normalized: 8000,
      icon: "Dumbbell",
      position: 3,
    },
  ],

  // Focus Time
  focus_time: [
    {
      id: "focus_pomodoro",
      label: "Pomodoro (25min)",
      value: 25,
      value_normalized: 25,
      icon: "Timer",
      position: 1,
    },
    {
      id: "focus_deep_session",
      label: "Sesión profunda (45min)",
      value: 45,
      value_normalized: 45,
      icon: "Brain",
      position: 2,
    },
    {
      id: "focus_flow_state",
      label: "Estado de flow (90min)",
      value: 90,
      value_normalized: 90,
      icon: "Zap",
      position: 3,
    },
  ],

  // Meditation
  meditation: [
    {
      id: "meditation_breathing",
      label: "Respiración (5min)",
      value: 5,
      value_normalized: 5,
      icon: "Wind",
      position: 1,
    },
    {
      id: "meditation_guided",
      label: "Meditación guiada (10min)",
      value: 10,
      value_normalized: 10,
      icon: "CloudSun",
      position: 2,
    },
    {
      id: "meditation_deep",
      label: "Sesión profunda (20min)",
      value: 20,
      value_normalized: 20,
      icon: "CloudSun",
      position: 3,
    },
  ],

  // Reading Time
  reading_time: [
    {
      id: "reading_quick",
      label: "Lectura rápida (10min)",
      value: 10,
      value_normalized: 10,
      icon: "BookOpen",
      position: 1,
    },
    {
      id: "reading_session",
      label: "Sesión de lectura (30min)",
      value: 30,
      value_normalized: 30,
      icon: "Book",
      position: 2,
    },
    {
      id: "reading_deep",
      label: "Lectura profunda (60min)",
      value: 60,
      value_normalized: 60,
      icon: "GraduationCap",
      position: 3,
    },
  ],

  // Creatine
  creatine: [
    {
      id: "creatine_scoop_small",
      label: "1/2 scoop (2.5g)",
      value: 2.5,
      value_normalized: 2.5,
      icon: "Zap",
      position: 1,
    },
    {
      id: "creatine_scoop_full",
      label: "1 scoop (5g)",
      value: 5,
      value_normalized: 5,
      icon: "Zap",
      position: 2,
    },
    {
      id: "creatine_loading",
      label: "Carga (10g)",
      value: 10,
      value_normalized: 10,
      icon: "Zap",
      position: 3,
    },
  ],

  // Sunlight Exposure
  sunlight_exposure: [
    {
      id: "sun_brief",
      label: "Breve (5min)",
      value: 5,
      value_normalized: 5,
      icon: "Sun",
      position: 1,
    },
    {
      id: "sun_walk",
      label: "Caminata (15min)",
      value: 15,
      value_normalized: 15,
      icon: "Sun",
      position: 2,
    },
    {
      id: "sun_outdoor",
      label: "Actividad exterior (30min)",
      value: 30,
      value_normalized: 30,
      icon: "Sun",
      position: 3,
    },
  ],
};

/**
 * Utilidad para obtener template por slug
 */
export const getMetricTemplate = (slug: string) => {
  return PREDEFINED_METRIC_TEMPLATES.find((template) => template.slug === slug);
};

/**
 * Utilidad para obtener quick action templates por slug
 */
export const getQuickActionTemplates = (slug: string) => {
  return PREDEFINED_QUICK_ACTION_TEMPLATES[slug] || [];
};

/**
 * Configuraciones de input para métricas que usan inputConfig
 */
export const getInputConfig = (slug: string) => {
  const configs = {
    mood: {
      min: 1,
      max: 5,
      step: 1,
      scaleLabels: ["Terrible", "Malo", "Normal", "Bueno", "Excelente"],
      scaleIcons: ["Frown", "Meh", "Minus", "Smile", "Laugh"],
    },
    energy: {
      min: 1,
      max: 10,
      step: 1,
      scaleLabels: [
        "Agotado",
        "Muy bajo",
        "Bajo",
        "Regular",
        "Normal",
        "Bueno",
        "Muy bueno",
        "Alto",
        "Muy alto",
        "Máximo",
      ],
      scaleIcons: [
        "BatteryLow",
        "Battery",
        "Battery",
        "Battery",
        "Battery",
        "Battery",
        "Zap",
        "Zap",
        "Zap",
        "Flame",
      ],
    },
    supplements: {
      booleanLabels: {
        false: "No tomé",
        true: "Tomé suplementos",
      },
    },
    sleep_quality: {
      min: 1,
      max: 5,
      step: 1,
      scaleLabels: ["Terrible", "Malo", "Regular", "Bueno", "Excelente"],
      scaleIcons: ["AlertTriangle", "Frown", "Minus", "Smile", "Star"],
    },
    stress_level: {
      min: 1,
      max: 5,
      step: 1,
      scaleLabels: [
        "Muy relajado",
        "Relajado",
        "Normal",
        "Estresado",
        "Muy estresado",
      ],
      scaleIcons: ["CloudSun", "Sun", "Minus", "CloudDrizzle", "Zap"],
    },
    vitamins: {
      booleanLabels: {
        false: "No tomé vitaminas",
        true: "Tomé vitaminas",
      },
    },
  };

  return configs[slug as keyof typeof configs] || null;
};
