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
    type: "counter",
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
    type: "counter",
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
    type: "counter",
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
    type: "counter",
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
    type: "value",
    unit: "horas",
    canonical_unit: "min",
    conversion_factor: 60, // horas → minutos
    default_target: 480, // 8 horas en minutos
    color: "#6366F1",
    icon: "Moon",
    deleted_at: null,
    order_index: 5,
  },
  {
    slug: "weight",
    name: "Peso",
    type: "value",
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
    type: "value",
    unit: "escala",
    canonical_unit: "escala",
    conversion_factor: 1,
    default_target: null,
    color: "#F59E0B",
    icon: "Smile",
    deleted_at: null,
    order_index: 7,
  },
];

/**
 * Templates de quick actions predefinidas (globales, sin user_id ni metric_id)
 * Se asocian por slug de métrica
 */
export const PREDEFINED_QUICK_ACTION_TEMPLATES: Record<
  string,
  Omit<TrackerQuickActionInsert, "user_id" | "metric_id" | "id">[]
> = {
  // Protein
  protein: [
    {
      label: "Pollo (150g)",
      value: 35,
      value_normalized: 35, // ya está en gramos
      icon: "ChefHat",
      position: 1,
    },
    {
      label: "Huevos (2u)",
      value: 12,
      value_normalized: 12,
      icon: "Egg",
      position: 2,
    },
    {
      label: "Shake de proteína",
      value: 25,
      value_normalized: 25,
      icon: "Coffee",
      position: 3,
    },
    {
      label: "Yogurt griego",
      value: 15,
      value_normalized: 15,
      icon: "Milk",
      position: 4,
    },
    {
      label: "Atún (lata)",
      value: 28,
      value_normalized: 28,
      icon: "Fish",
      position: 5,
    },
    {
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
      label: "Vaso chico (200ml)",
      value: 0.2, // en litros (unidad display)
      value_normalized: 200, // en ml (canonical_unit)
      icon: "CupSoda",
      position: 1,
    },
    {
      label: "Vaso grande (300ml)",
      value: 0.3,
      value_normalized: 300,
      icon: "CupSoda",
      position: 2,
    },
    {
      label: "Botella (500ml)",
      value: 0.5,
      value_normalized: 500,
      icon: "CupSoda",
      position: 3,
    },
    {
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
      label: "Siesta (30min)",
      value: 0.5, // en horas (unidad display)
      value_normalized: 30, // en minutos (canonical_unit)
      icon: "Bed",
      position: 1,
    },
    {
      label: "Noche completa (8h)",
      value: 8.0,
      value_normalized: 480, // 8 horas en minutos
      icon: "Bed",
      position: 2,
    },
  ],

  // Mood
  mood: [
    {
      label: "Excelente 😃",
      value: 5,
      value_normalized: 5,
      icon: "Smile",
      position: 1,
    },
    {
      label: "Normal 🙂",
      value: 3,
      value_normalized: 3,
      icon: "Meh",
      position: 2,
    },
    {
      label: "Bajo 😔",
      value: 1,
      value_normalized: 1,
      icon: "Frown",
      position: 3,
    },
  ],

  // Calories
  calories: [
    {
      label: "Desayuno típico",
      value: 400,
      value_normalized: 400,
      icon: "Coffee",
      position: 1,
    },
    {
      label: "Almuerzo completo",
      value: 600,
      value_normalized: 600,
      icon: "UtensilsCrossed",
      position: 2,
    },
    {
      label: "Cena ligera",
      value: 350,
      value_normalized: 350,
      icon: "Moon",
      position: 3,
    },
    {
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
      label: "Caminata corta",
      value: 2000,
      value_normalized: 2000,
      icon: "Footprints",
      position: 1,
    },
    {
      label: "Caminata larga",
      value: 5000,
      value_normalized: 5000,
      icon: "Footprints",
      position: 2,
    },
    {
      label: "Entrenamiento",
      value: 8000,
      value_normalized: 8000,
      icon: "Dumbbell",
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
