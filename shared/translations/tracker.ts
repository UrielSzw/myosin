export const trackerTranslations = {
  // Main Headers
  dailyMetrics: {
    es: "Métricas Diarias",
    en: "Daily Metrics",
  },
  add: {
    es: "Agregar",
    en: "Add",
  },
  loading: {
    es: "Cargando datos del día...",
    en: "Loading day data...",
  },

  // Authentication
  authRequired: {
    es: "Autenticación requerida",
    en: "Authentication required",
  },
  authDescription: {
    es: "Necesitas iniciar sesión para acceder al tracker",
    en: "You need to sign in to access the tracker",
  },

  // Error States
  errorLoading: {
    es: "Error al cargar los datos",
    en: "Error loading data",
  },
  unexpectedError: {
    es: "Ha ocurrido un error inesperado",
    en: "An unexpected error occurred",
  },

  // Empty States
  emptyState: {
    noMetrics: {
      es: "No hay métricas activas",
      en: "No active metrics",
    },
    addMetricsToTrack: {
      es: "Agrega métricas para comenzar a trackear tu progreso",
      en: "Add metrics to start tracking your progress",
    },
    addFirstMetric: {
      es: "Agregar Primera Métrica",
      en: "Add First Metric",
    },
  },

  // Date Picker
  datePicker: {
    today: {
      es: "Hoy",
      en: "Today",
    },
    yesterday: {
      es: "Ayer",
      en: "Yesterday",
    },
  },

  // Modal Header
  modalHeader: {
    current: {
      es: "Actual",
      en: "Current",
    },
  },

  // Quick Actions Section
  quickActions: {
    title: {
      es: "Opciones Rápidas",
      en: "Quick Options",
    },
    addSelection: {
      es: "Agregar selección",
      en: "Add selection",
    },
  },

  // Manual Input Section
  manualInput: {
    title: {
      es: "Cantidad Manual",
      en: "Manual Amount",
    },
    placeholder: {
      es: "Cantidad en",
      en: "Amount in",
    },
    addButton: {
      es: "Agregar",
      en: "Add",
    },
  },

  // Daily History Section
  dailyHistory: {
    title: {
      es: "Historial de Hoy",
      en: "Today's History",
    },
  },

  // Daily Summary Section
  dailySummary: {
    title: {
      es: "Progreso del Día",
      en: "Daily Progress",
    },
    current: {
      es: "Actual",
      en: "Current",
    },
    goal: {
      es: "Meta",
      en: "Goal",
    },
    completed: {
      es: "completado",
      en: "completed",
    },
  },

  // States
  states: {
    notRecorded: {
      es: "Sin registrar",
      en: "Not recorded",
    },
    completed: {
      es: "Completado",
      en: "Completed",
    },
    notCompleted: {
      es: "No realizado",
      en: "Not completed",
    },
    level: {
      es: "Nivel",
      en: "Level",
    },
  },

  // Metric Names (by slug - predefined metrics)
  metricNames: {
    protein: { es: "Proteína", en: "Protein" },
    water: { es: "Agua", en: "Water" },
    calories: { es: "Calorías", en: "Calories" },
    steps: { es: "Pasos", en: "Steps" },
    sleep: { es: "Sueño", en: "Sleep" },
    weight: { es: "Peso", en: "Weight" },
    mood: { es: "Estado de ánimo", en: "Mood" },
    sleep_quality: { es: "Calidad del Sueño", en: "Sleep Quality" },
    stress_level: { es: "Nivel de Estrés", en: "Stress Level" },
    focus_time: { es: "Tiempo de Concentración", en: "Focus Time" },
    meditation: { es: "Meditación", en: "Meditation" },
    reading_time: { es: "Tiempo de Lectura", en: "Reading Time" },
    creatine: { es: "Creatina", en: "Creatine" },
    vitamins: { es: "Vitaminas", en: "Vitamins" },
    sunlight_exposure: { es: "Exposición Solar", en: "Sunlight Exposure" },
  },

  // Metric Units (by slug)
  metricUnits: {
    protein: { es: "g", en: "g" },
    water: { es: "L", en: "L" },
    calories: { es: "kcal", en: "kcal" },
    steps: { es: "pasos", en: "steps" },
    sleep: { es: "horas", en: "hours" },
    weight: { es: "kg", en: "kg" },
    mood: { es: "nivel", en: "level" },
    sleep_quality: { es: "nivel", en: "level" },
    stress_level: { es: "nivel", en: "level" },
    focus_time: { es: "min", en: "min" },
    meditation: { es: "min", en: "min" },
    reading_time: { es: "min", en: "min" },
    creatine: { es: "g", en: "g" },
    vitamins: { es: "completado", en: "completed" },
    sunlight_exposure: { es: "min", en: "min" },
  },

  // Quick Action Labels (by slug - predefined quick actions)
  quickActionLabels: {
    // Protein
    protein_chicken_150g: { es: "Pollo (150g)", en: "Chicken (150g)" },
    protein_eggs_2u: { es: "Huevos (2u)", en: "Eggs (2u)" },
    protein_shake: { es: "Shake de proteína", en: "Protein Shake" },
    protein_yogurt_greek: { es: "Yogurt griego", en: "Greek Yogurt" },
    protein_tuna_can: { es: "Atún (lata)", en: "Tuna (can)" },
    protein_lentils_cup: { es: "Lentejas (1 taza)", en: "Lentils (1 cup)" },

    // Water
    water_glass_small_200ml: {
      es: "Vaso chico (200ml)",
      en: "Small glass (200ml)",
    },
    water_glass_large_300ml: {
      es: "Vaso grande (300ml)",
      en: "Large glass (300ml)",
    },
    water_bottle_500ml: { es: "Botella (500ml)", en: "Bottle (500ml)" },
    water_bottle_large_1L: {
      es: "Botella grande (1L)",
      en: "Large bottle (1L)",
    },

    // Sleep
    sleep_nap_30min: { es: "Siesta (30min)", en: "Nap (30min)" },
    sleep_full_night_8h: {
      es: "Noche completa (8h)",
      en: "Full night (8h)",
    },

    // Calories
    calories_breakfast_typical: {
      es: "Desayuno típico",
      en: "Typical breakfast",
    },
    calories_lunch_complete: {
      es: "Almuerzo completo",
      en: "Complete lunch",
    },
    calories_dinner_light: { es: "Cena ligera", en: "Light dinner" },
    calories_snack_healthy: { es: "Snack saludable", en: "Healthy snack" },

    // Steps
    steps_walk_short: { es: "Caminata corta", en: "Short walk" },
    steps_walk_long: { es: "Caminata larga", en: "Long walk" },
    steps_workout: { es: "Entrenamiento", en: "Workout" },

    // Focus Time
    focus_pomodoro: { es: "Pomodoro (25min)", en: "Pomodoro (25min)" },
    focus_deep_session: {
      es: "Sesión profunda (45min)",
      en: "Deep session (45min)",
    },
    focus_flow_state: {
      es: "Estado de flow (90min)",
      en: "Flow state (90min)",
    },

    // Meditation
    meditation_breathing: { es: "Respiración (5min)", en: "Breathing (5min)" },
    meditation_guided: {
      es: "Meditación guiada (10min)",
      en: "Guided meditation (10min)",
    },
    meditation_deep: {
      es: "Sesión profunda (20min)",
      en: "Deep session (20min)",
    },

    // Reading Time
    reading_quick: {
      es: "Lectura rápida (10min)",
      en: "Quick reading (10min)",
    },
    reading_session: {
      es: "Sesión de lectura (30min)",
      en: "Reading session (30min)",
    },
    reading_deep: {
      es: "Lectura profunda (60min)",
      en: "Deep reading (60min)",
    },

    // Creatine
    creatine_scoop_small: { es: "1/2 scoop (2.5g)", en: "1/2 scoop (2.5g)" },
    creatine_scoop_full: { es: "1 scoop (5g)", en: "1 scoop (5g)" },
    creatine_loading: { es: "Carga (10g)", en: "Loading (10g)" },

    // Sunlight Exposure
    sun_brief: { es: "Breve (5min)", en: "Brief (5min)" },
    sun_walk: { es: "Caminata (15min)", en: "Walk (15min)" },
    sun_outdoor: {
      es: "Actividad exterior (30min)",
      en: "Outdoor activity (30min)",
    },
  },

  // Scale Labels (for scale_discrete input types)
  scaleLabels: {
    mood: {
      terrible: { es: "Terrible", en: "Terrible" },
      bad: { es: "Malo", en: "Bad" },
      normal: { es: "Normal", en: "Normal" },
      good: { es: "Bueno", en: "Good" },
      excellent: { es: "Excelente", en: "Excellent" },
    },
    sleep_quality: {
      terrible: { es: "Terrible", en: "Terrible" },
      bad: { es: "Malo", en: "Bad" },
      regular: { es: "Regular", en: "Regular" },
      good: { es: "Bueno", en: "Good" },
      excellent: { es: "Excelente", en: "Excellent" },
    },
    stress_level: {
      very_relaxed: { es: "Muy relajado", en: "Very relaxed" },
      relaxed: { es: "Relajado", en: "Relaxed" },
      normal: { es: "Normal", en: "Normal" },
      stressed: { es: "Estresado", en: "Stressed" },
      very_stressed: { es: "Muy estresado", en: "Very stressed" },
    },
  },

  // Boolean Labels (for boolean_toggle input types)
  booleanLabels: {
    vitamins: {
      false: { es: "No tomé vitaminas", en: "Didn't take vitamins" },
      true: { es: "Tomé vitaminas", en: "Took vitamins" },
    },
  },

  // Date Picker
  today: {
    es: "Hoy",
    en: "Today",
  },
  yesterday: {
    es: "Ayer",
    en: "Yesterday",
  },
  tomorrow: {
    es: "Mañana",
    en: "Tomorrow",
  },

  // Metric Card
  target: {
    es: "Meta",
    en: "Target",
  },
  progress: {
    es: "Progreso",
    en: "Progress",
  },
  completed: {
    es: "Completado",
    en: "Completed",
  },

  // Metric Modal
  enterValue: {
    es: "Ingresa un valor",
    en: "Enter a value",
  },
  selectAValue: {
    es: "Selecciona un valor",
    en: "Select a value",
  },
  howDidItGoToday: {
    es: "¿Cómo te fue hoy?",
    en: "How did it go today?",
  },
  yes: {
    es: "Sí",
    en: "Yes",
  },
  confirm: {
    es: "Confirmar",
    en: "Confirm",
  },
  notes: {
    es: "Notas",
    en: "Notes",
  },
  notesPlaceholder: {
    es: "Notas opcionales...",
    en: "Optional notes...",
  },
  save: {
    es: "Guardar",
    en: "Save",
  },
  cancel: {
    es: "Cancelar",
    en: "Cancel",
  },

  // Metric Selector Modal
  selectMetric: {
    es: "Selecciona una métrica",
    en: "Select a metric",
  },
  searchMetrics: {
    es: "Buscar métricas...",
    en: "Search metrics...",
  },
  predefinedMetrics: {
    es: "Métricas Predefinidas",
    en: "Predefined Metrics",
  },
  customMetrics: {
    es: "Métricas Personalizadas",
    en: "Custom Metrics",
  },
  createNew: {
    es: "Crear nueva métrica",
    en: "Create new metric",
  },
  addMetrics: {
    es: "Agregar Métricas",
    en: "Add Metrics",
  },
  customizeYourTracking: {
    es: "Personaliza tu seguimiento",
    en: "Customize your tracking",
  },
  deletedMetricSingle: {
    es: "métrica eliminada",
    en: "deleted metric",
  },
  deletedMetricPlural: {
    es: "métricas eliminadas",
    en: "deleted metrics",
  },
  noTemplatesAvailable: {
    es: "No hay templates disponibles para agregar",
    en: "No templates available to add",
  },
  createCustomMetric: {
    es: "Crear Métrica Personalizada",
    en: "Create Custom Metric",
  },
  loadingMetrics: {
    es: "Cargando métricas...",
    en: "Loading metrics...",
  },
  goal: {
    es: "Meta",
    en: "Goal",
  },

  // Target Editor Modal
  targetEditor: {
    title: {
      es: "Configuración de Métrica",
      en: "Metric Settings",
    },
    targetGoal: {
      es: "Meta Diaria",
      en: "Daily Goal",
    },
    optional: {
      es: "Opcional",
      en: "Optional",
    },
    enterTarget: {
      es: "Ingresa tu meta diaria",
      en: "Enter your daily goal",
    },
    saveChanges: {
      es: "Guardar Cambios",
      en: "Save Changes",
    },
    deleteMetric: {
      es: "Eliminar Métrica",
      en: "Delete Metric",
    },
    deleteConfirmTitle: {
      es: "Eliminar Métrica",
      en: "Delete Metric",
    },
    deleteConfirmMessage: {
      es: "¿Estás seguro de que quieres eliminar",
      en: "Are you sure you want to delete",
    },
    deleteConfirmNote: {
      es: "Esta acción se puede deshacer desde el selector de métricas.",
      en: "This action can be undone from the metric selector.",
    },
  },
} as const;

/**
 * Helper function to get metric name (predefined or custom)
 */
export const getMetricName = (
  metric: { slug: string | null; name: string },
  lang: "es" | "en"
): string => {
  if (
    metric.slug &&
    trackerTranslations.metricNames[
      metric.slug as keyof typeof trackerTranslations.metricNames
    ]
  ) {
    return trackerTranslations.metricNames[
      metric.slug as keyof typeof trackerTranslations.metricNames
    ][lang];
  }
  return metric.name;
};

/**
 * Helper function to get quick action label (predefined or custom)
 */
export const getQuickActionLabel = (
  action: { slug: string | null; label: string },
  lang: "es" | "en"
): string => {
  if (
    action.slug &&
    trackerTranslations.quickActionLabels[
      action.slug as keyof typeof trackerTranslations.quickActionLabels
    ]
  ) {
    return trackerTranslations.quickActionLabels[
      action.slug as keyof typeof trackerTranslations.quickActionLabels
    ][lang];
  }
  return action.label;
};

/**
 * Helper function to get metric unit (predefined or custom)
 */
export const getMetricUnit = (
  metric: { slug: string | null; unit: string },
  lang: "es" | "en",
  weightUnit?: "kg" | "lb" | "lbs"
): string => {
  // Special case for weight - use user's preference
  if (metric.slug === "weight" && weightUnit) {
    return weightUnit;
  }

  if (
    metric.slug &&
    trackerTranslations.metricUnits[
      metric.slug as keyof typeof trackerTranslations.metricUnits
    ]
  ) {
    return trackerTranslations.metricUnits[
      metric.slug as keyof typeof trackerTranslations.metricUnits
    ][lang];
  }
  return metric.unit;
};

// Additional UI translations
export const trackerUiTranslations = {
  noMetrics: {
    es: "Sin métricas",
    en: "No metrics",
  },
  noTargetsDefined: {
    es: "Sin objetivos definidos",
    en: "No targets defined",
  },
  todayProgress: {
    es: "Progreso del día",
    en: "Today's progress",
  },
  progressOfDate: {
    es: "Progreso del",
    en: "Progress of",
  },
  manualEntry: {
    es: "Entrada manual",
    en: "Manual entry",
  },
  scaleInputEntry: {
    es: "Entrada de escala",
    en: "Scale input entry",
  },
  booleanInputEntry: {
    es: "Entrada booleana",
    en: "Boolean input entry",
  },
  errorAddingEntries: {
    es: "Error al agregar entradas",
    en: "Error adding entries",
  },
  unknownError: {
    es: "Error desconocido",
    en: "Unknown error",
  },
  userNotAuthenticated: {
    es: "Usuario no autenticado",
    en: "User not authenticated",
  },
} as const;
