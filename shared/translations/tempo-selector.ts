export const tempoSelectorTranslations = {
  // Phase descriptions
  phases: {
    eccentric: {
      es: "Fase de descenso",
      en: "Lowering phase",
    },
    pause1: {
      es: "Pausa en el fondo",
      en: "Bottom pause",
    },
    concentric: {
      es: "Fase de subida",
      en: "Lifting phase",
    },
    pause2: {
      es: "Pausa arriba",
      en: "Top pause",
    },
  },

  // Presets
  presets: {
    standard: {
      label: {
        es: "Estándar",
        en: "Standard",
      },
      description: {
        es: "Tempo controlado básico",
        en: "Basic controlled tempo",
      },
    },
    strength: {
      label: {
        es: "Fuerza",
        en: "Strength",
      },
      description: {
        es: "Enfoque en fuerza máxima",
        en: "Focus on maximum strength",
      },
    },
    eccentric: {
      label: {
        es: "Excéntrico",
        en: "Eccentric",
      },
      description: {
        es: "Énfasis en fase negativa",
        en: "Emphasis on negative phase",
      },
    },
    explosive: {
      label: {
        es: "Explosivo",
        en: "Explosive",
      },
      description: {
        es: "Potencia y velocidad",
        en: "Power and speed",
      },
    },
    hypertrophy: {
      label: {
        es: "Hipertrofia",
        en: "Hypertrophy",
      },
      description: {
        es: "Tiempo bajo tensión",
        en: "Time under tension",
      },
    },
    metabolic: {
      label: {
        es: "Metabólico",
        en: "Metabolic",
      },
      description: {
        es: "Stress metabólico alto",
        en: "High metabolic stress",
      },
    },
  },

  // UI labels
  selectTempo: {
    es: "Selecciona el tempo",
    en: "Select tempo",
  },
  selectTempoForExercise: {
    es: "Selecciona un tempo para el ejercicio",
    en: "Select a tempo for the exercise",
  },
  customTempo: {
    es: "Tempo personalizado",
    en: "Custom tempo",
  },
  presetsLabel: {
    es: "Presets",
    en: "Presets",
  },
  delete: {
    es: "Eliminar",
    en: "Delete",
  },
  save: {
    es: "Guardar",
    en: "Save",
  },
  custom: {
    es: "Personalizado",
    en: "Custom",
  },
  noTempoAssigned: {
    es: "Sin tempo asignado",
    en: "No tempo assigned",
  },
  sec: {
    es: "seg",
    en: "sec",
  },
  seconds: {
    es: "segundos",
    en: "seconds",
  },
  tempoPhaseLabels: {
    es: "Excéntrica - Pausa - Concéntrica - Pausa",
    en: "Eccentric - Pause - Concentric - Pause",
  },
} as const;
