export const metricFormTranslations = {
  // Header
  editMetric: {
    es: "Editar Métrica",
    en: "Edit Metric",
  },
  newMetric: {
    es: "Nueva Métrica",
    en: "New Metric",
  },
  saving: {
    es: "Guardando...",
    en: "Saving...",
  },
  save: {
    es: "Guardar",
    en: "Save",
  },
  create: {
    es: "Crear",
    en: "Create",
  },

  // Basic Info Section
  basicInformation: {
    es: "Información Básica",
    en: "Basic Information",
  },
  metricNameLabel: {
    es: "Nombre de la Métrica",
    en: "Metric Name",
  },
  metricNamePlaceholder: {
    es: "Ej: Mi Métrica Personalizada",
    en: "E.g.: My Custom Metric",
  },
  metricTypeLabel: {
    es: "Tipo de Métrica",
    en: "Metric Type",
  },
  counterType: {
    es: "📊 Contador",
    en: "📊 Counter",
  },
  counterDescription: {
    es: "Se acumula durante el día (ej: agua, calorías, pasos)",
    en: "Accumulates during the day (e.g.: water, calories, steps)",
  },
  valueType: {
    es: "📈 Valor",
    en: "📈 Value",
  },
  valueDescription: {
    es: "Valor único del día (ej: peso, estado de ánimo)",
    en: "Single daily value (e.g.: weight, mood)",
  },
  unitLabel: {
    es: "Unidad de Medida",
    en: "Unit of Measurement",
  },
  unitPlaceholder: {
    es: "Ej: kg, ml, reps, %",
    en: "E.g.: kg, ml, reps, %",
  },
  targetLabel: {
    es: "Objetivo Diario (Opcional)",
    en: "Daily Goal (Optional)",
  },
  targetPlaceholder: {
    es: "Ej: 100",
    en: "E.g.: 100",
  },
  targetHelpText: {
    es: "Si estableces un objetivo, verás tu progreso en la tarjeta de la métrica",
    en: "If you set a goal, you'll see your progress on the metric card",
  },

  // Style Section
  icon: {
    es: "Icono",
    en: "Icon",
  },
  iconDescription: {
    es: "Selecciona un icono que represente tu métrica",
    en: "Select an icon that represents your metric",
  },
  color: {
    es: "Color",
    en: "Color",
  },
  colorDescription: {
    es: "Elige un color para personalizar tu métrica",
    en: "Choose a color to personalize your metric",
  },

  // Quick Actions Section
  quickActions: {
    es: "Quick Actions",
    en: "Quick Actions",
  },
  hide: {
    es: "Ocultar",
    en: "Hide",
  },
  add: {
    es: "Agregar",
    en: "Add",
  },
  quickActionsDescription: {
    es: "Crea atajos para registrar valores comunes rápidamente",
    en: "Create shortcuts to quickly log common values",
  },
  quickActionsExtendedDescription: {
    es: 'Crea atajos para registrar valores comunes rápidamente. Por ejemplo, para agua podrías crear "Vaso chico (200ml)" con valor 0.2.',
    en: 'Create shortcuts to quickly log common values. For example, for water you could create "Small glass (200ml)" with value 0.2.',
  },
  addQuickAction: {
    es: "Agregar Quick Action",
    en: "Add Quick Action",
  },

  // Preview Section
  preview: {
    es: "Vista Previa",
    en: "Preview",
  },
  metricNameDefault: {
    es: "Nombre de la métrica",
    en: "Metric name",
  },
  unit: {
    es: "unidad",
    en: "unit",
  },

  // Validation Errors
  nameRequired: {
    es: "El nombre es requerido",
    en: "Name is required",
  },
  nameMinLength: {
    es: "El nombre debe tener al menos {min} caracteres",
    en: "Name must be at least {min} characters",
  },
  nameMaxLength: {
    es: "El nombre no puede exceder {max} caracteres",
    en: "Name cannot exceed {max} characters",
  },
  nameInvalidCharacters: {
    es: "El nombre solo puede contener letras, números, espacios y guiones",
    en: "Name can only contain letters, numbers, spaces and hyphens",
  },
  slugRequired: {
    es: "El identificador es requerido",
    en: "Identifier is required",
  },
  unitRequired: {
    es: "La unidad es requerida",
    en: "Unit is required",
  },
  unitMinLength: {
    es: "La unidad debe tener al menos {min} caracter",
    en: "Unit must be at least {min} character",
  },
  unitMaxLength: {
    es: "La unidad no puede exceder {max} caracteres",
    en: "Unit cannot exceed {max} characters",
  },
  unitInvalidCharacters: {
    es: "La unidad contiene caracteres no válidos",
    en: "Unit contains invalid characters",
  },
  labelRequired: {
    es: "La etiqueta es requerida",
    en: "Label is required",
  },
  labelMaxLength: {
    es: "La etiqueta no puede exceder 50 caracteres",
    en: "Label cannot exceed 50 characters",
  },
  valueTooLarge: {
    es: "El valor es demasiado grande",
    en: "Value is too large",
  },
} as const;
