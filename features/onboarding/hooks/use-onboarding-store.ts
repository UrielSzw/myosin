import { create } from "zustand";

export type BiologicalSex = "male" | "female";
export type FitnessGoal = "lose_weight" | "maintain" | "build_muscle";
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

type OnboardingState = {
  // Step data
  biologicalSex: BiologicalSex | null;
  birthDate: Date | null;
  heightCm: number | null;
  weightKg: number | null;
  fitnessGoal: FitnessGoal | null;
  activityLevel: ActivityLevel | null;

  // Navigation
  currentStep: number;
  isCompleting: boolean;

  // Actions
  setBiologicalSex: (sex: BiologicalSex) => void;
  setBirthDate: (date: Date) => void;
  setHeightCm: (height: number) => void;
  setWeightKg: (weight: number) => void;
  setFitnessGoal: (goal: FitnessGoal) => void;
  setActivityLevel: (level: ActivityLevel) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  setIsCompleting: (value: boolean) => void;
  reset: () => void;

  // Computed
  getAge: () => number | null;
  calculateBMR: () => number | null;
  calculateTDEE: () => number | null;
};

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const initialState = {
  biologicalSex: null,
  birthDate: null,
  heightCm: null,
  weightKg: null,
  fitnessGoal: null,
  activityLevel: null,
  currentStep: 0,
  isCompleting: false,
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ...initialState,

  setBiologicalSex: (sex) => set({ biologicalSex: sex }),
  setBirthDate: (date) => set({ birthDate: date }),
  setHeightCm: (height) => set({ heightCm: height }),
  setWeightKg: (weight) => set({ weightKg: weight }),
  setFitnessGoal: (goal) => set({ fitnessGoal: goal }),
  setActivityLevel: (level) => set({ activityLevel: level }),

  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  previousStep: () =>
    set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
  goToStep: (step) => set({ currentStep: step }),
  setIsCompleting: (value) => set({ isCompleting: value }),

  reset: () => set(initialState),

  getAge: () => {
    const { birthDate } = get();
    if (!birthDate) return null;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  },

  /**
   * Mifflin-St Jeor Equation
   * Men: BMR = 10×weight(kg) + 6.25×height(cm) − 5×age(years) + 5
   * Women: BMR = 10×weight(kg) + 6.25×height(cm) − 5×age(years) − 161
   */
  calculateBMR: () => {
    const { biologicalSex, heightCm, weightKg, getAge } = get();
    const age = getAge();

    if (!biologicalSex || !heightCm || !weightKg || !age) return null;

    const baseBMR = 10 * weightKg + 6.25 * heightCm - 5 * age;

    return biologicalSex === "male" ? baseBMR + 5 : baseBMR - 161;
  },

  calculateTDEE: () => {
    const { activityLevel, calculateBMR } = get();
    const bmr = calculateBMR();

    if (!bmr || !activityLevel) return null;

    return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
  },
}));

// Translations for onboarding
export const onboardingTranslations = {
  welcome: {
    title: {
      en: "Welcome to",
      es: "Bienvenido a",
    },
    subtitle: {
      en: "Let's personalize your experience",
      es: "Personalicemos tu experiencia",
    },
    description: {
      en: "Answer a few questions so we can tailor the app to your needs",
      es: "Responde algunas preguntas para adaptar la app a tus necesidades",
    },
    button: {
      en: "Let's start",
      es: "Empecemos",
    },
    quickSteps: {
      en: "quick steps",
      es: "pasos rápidos",
    },
  },
  sex: {
    title: {
      en: "What is your sex assigned at birth?",
      es: "¿Cuál es tu sexo asignado al nacer?",
    },
    subtitle: {
      en: "This helps us calculate your metabolic rate more accurately",
      es: "Esto nos ayuda a calcular tu tasa metabólica con mayor precisión",
    },
    male: {
      en: "Male",
      es: "Masculino",
    },
    female: {
      en: "Female",
      es: "Femenino",
    },
  },
  birthdate: {
    title: {
      en: "When were you born?",
      es: "¿Cuándo naciste?",
    },
    subtitle: {
      en: "Your age affects caloric calculations",
      es: "Tu edad afecta los cálculos calóricos",
    },
    yearsOld: {
      en: "years old",
      es: "años",
    },
    selectYourDate: {
      en: "Select your date",
      es: "Selecciona tu fecha",
    },
  },
  measurements: {
    title: {
      en: "Your measurements",
      es: "Tus medidas",
    },
    subtitle: {
      en: "We need these to personalize your recommendations",
      es: "Las necesitamos para personalizar tus recomendaciones",
    },
    height: {
      en: "Height",
      es: "Altura",
    },
    weight: {
      en: "Weight",
      es: "Peso",
    },
  },
  goal: {
    title: {
      en: "What's your fitness goal?",
      es: "¿Cuál es tu objetivo fitness?",
    },
    subtitle: {
      en: "This helps us customize your journey",
      es: "Esto nos ayuda a personalizar tu camino",
    },
    lose_weight: {
      title: {
        en: "Lose weight",
        es: "Perder peso",
      },
      subtitle: {
        en: "Reduce body fat",
        es: "Reducir grasa corporal",
      },
    },
    maintain: {
      title: {
        en: "Maintain",
        es: "Mantener",
      },
      subtitle: {
        en: "Keep current weight",
        es: "Mantener peso actual",
      },
    },
    build_muscle: {
      title: {
        en: "Build muscle",
        es: "Ganar músculo",
      },
      subtitle: {
        en: "Increase strength & mass",
        es: "Aumentar fuerza y masa",
      },
    },
  },
  activity: {
    title: {
      en: "How active are you?",
      es: "¿Qué tan activo eres?",
    },
    subtitle: {
      en: "Your daily activity level excluding workouts",
      es: "Tu nivel de actividad diaria excluyendo entrenamientos",
    },
    sedentary: {
      title: {
        en: "Sedentary",
        es: "Sedentario",
      },
      subtitle: {
        en: "Office job, little movement",
        es: "Trabajo de oficina, poco movimiento",
      },
    },
    light: {
      title: {
        en: "Lightly active",
        es: "Ligeramente activo",
      },
      subtitle: {
        en: "Light walks, some standing",
        es: "Caminatas ligeras, algo de pie",
      },
    },
    moderate: {
      title: {
        en: "Moderately active",
        es: "Moderadamente activo",
      },
      subtitle: {
        en: "Regular movement throughout day",
        es: "Movimiento regular durante el día",
      },
    },
    active: {
      title: {
        en: "Very active",
        es: "Muy activo",
      },
      subtitle: {
        en: "Physical job or lots of walking",
        es: "Trabajo físico o mucha caminata",
      },
    },
    very_active: {
      title: {
        en: "Extremely active",
        es: "Extremadamente activo",
      },
      subtitle: {
        en: "Demanding physical labor",
        es: "Trabajo físico demandante",
      },
    },
  },
  complete: {
    title: {
      en: "You're all set!",
      es: "¡Todo listo!",
    },
    subtitle: {
      en: "Here's your personalized profile",
      es: "Aquí está tu perfil personalizado",
    },
    bmr: {
      en: "BMR",
      es: "TMB",
    },
    bmrLabel: {
      en: "Basal Metabolic Rate",
      es: "Tasa Metabólica Basal",
    },
    tdee: {
      en: "TDEE",
      es: "TDEE",
    },
    tdeeLabel: {
      en: "Total Daily Energy Expenditure",
      es: "Gasto Energético Diario Total",
    },
    kcalDay: {
      en: "kcal/day",
      es: "kcal/día",
    },
    button: {
      en: "Start training",
      es: "Empezar a entrenar",
    },
    saving: {
      en: "Saving...",
      es: "Guardando...",
    },
  },
  common: {
    continue: {
      en: "Continue",
      es: "Continuar",
    },
    back: {
      en: "Back",
      es: "Atrás",
    },
    skip: {
      en: "Skip",
      es: "Omitir",
    },
  },
};
