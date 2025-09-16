import { ISetType } from "@/shared/types/workout";

export interface TrainingMethodInfo {
  type: ISetType;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  primaryBenefits: string[];
  whenToUse: string;
  researchNotes?: string;
}

export const TRAINING_METHODS: Record<ISetType, TrainingMethodInfo> = {
  normal: {
    type: "normal",
    title: "Serie Normal",
    shortDescription: "Series tradicionales con descanso completo",
    detailedDescription:
      "Las series normales son la base del entrenamiento de fuerza. Consisten en realizar un número determinado de repeticiones con una carga específica, seguido de un período de descanso completo antes de la siguiente serie. Este método permite el uso de cargas máximas y es fundamental para el desarrollo de fuerza.",
    primaryBenefits: [
      "Desarrollo de fuerza máxima",
      "Permite el uso de cargas pesadas",
      "Recuperación completa entre series",
      "Técnica de ejecución óptima",
      "Base para todos los métodos de entrenamiento",
    ],
    whenToUse:
      "Ideal para principiantes y como base del programa. Perfecto para ejercicios compuestos pesados y cuando el objetivo principal es la fuerza máxima.",
    researchNotes:
      "Método estándar respaldado por décadas de investigación en entrenamiento de fuerza.",
  },
  warmup: {
    type: "warmup",
    title: "Calentamiento",
    shortDescription: "Series preparatorias con cargas ligeras",
    detailedDescription:
      "Las series de calentamiento utilizan cargas progresivamente incrementales (40-70% 1RM) para preparar el sistema neuromuscular y articular. Son esenciales para optimizar el rendimiento y reducir el riesgo de lesiones durante el entrenamiento principal.",
    primaryBenefits: [
      "Activación neuromuscular progresiva",
      "Lubricación articular",
      "Práctica del patrón de movimiento",
      "Reducción del riesgo de lesiones",
      "Preparación psicológica",
    ],
    whenToUse:
      "Siempre al inicio de cada ejercicio o cuando se incrementa significativamente la carga. Especialmente importante en ejercicios compuestos pesados.",
    researchNotes:
      "El calentamiento específico puede mejorar el rendimiento hasta un 5-10% según múltiples estudios.",
  },
  failure: {
    type: "failure",
    title: "Al Fallo",
    shortDescription:
      "Series llevadas hasta la incapacidad de completar otra repetición",
    detailedDescription:
      "El entrenamiento al fallo muscular implica continuar una serie hasta que no se puede completar otra repetición con la técnica adecuada. Es una herramienta potente para maximizar la activación muscular y el estímulo hipertrófico, pero debe usarse estratégicamente.",
    primaryBenefits: [
      "Máxima activación de unidades motoras",
      "Potente estímulo hipertrófico",
      "Mejora de la tolerancia al lactato",
      "Desarrollo de resistencia muscular",
      "Mayor respuesta hormonal anabólica",
    ],
    whenToUse:
      "En las últimas series de ejercicios aislados o al final del entrenamiento. Evitar en ejercicios compuestos pesados por riesgo de lesión.",
    researchNotes:
      "Estudios indican que no es necesario llegar al fallo en cada serie, pero su uso estratégico puede optimizar la hipertrofia.",
  },
  drop: {
    type: "drop",
    title: "Drop Set",
    shortDescription: "Reducción inmediata de peso al alcanzar el fallo",
    detailedDescription:
      "Los drop sets involucran reducir el peso inmediatamente después de alcanzar el fallo muscular (típicamente 15-25%) y continuar la serie. Esta técnica extiende el tiempo bajo tensión y maximiza el reclutamiento muscular cuando el músculo ya está fatigado.",
    primaryBenefits: [
      "Tiempo bajo tensión extendido",
      "Reclutamiento de fibras resistentes",
      "Eficiencia temporal",
      "Fuerte estímulo metabólico",
      "Vaciado completo del glucógeno muscular",
    ],
    whenToUse:
      "Al final del entrenamiento o como serie finalizadora. Ideal para ejercicios de aislamiento y con máquinas donde es fácil cambiar el peso.",
    researchNotes:
      "Investigaciones muestran que pueden generar similar hipertrofia que series adicionales tradicionales con menor tiempo de entrenamiento.",
  },
  cluster: {
    type: "cluster",
    title: "Cluster Set",
    shortDescription: "Series divididas con micro-descansos",
    detailedDescription:
      "Los cluster sets dividen una serie tradicional en segmentos más pequeños con breves períodos de descanso (10-30 segundos) entre ellos. Esto permite mantener una mayor intensidad y calidad de movimiento a lo largo de toda la serie.",
    primaryBenefits: [
      "Mantenimiento de potencia y velocidad",
      "Mayor volumen con cargas pesadas",
      "Mejor calidad técnica",
      "Reducción de la fatiga local",
      "Versatilidad en la periodización",
    ],
    whenToUse:
      "Para entrenamiento de potencia, fuerza-velocidad, o cuando se busca mantener alta intensidad con mayor volumen. Excelente para deportistas.",
    researchNotes:
      "Estudios confirman que permiten mantener mayor velocidad y potencia comparado con series tradicionales continuas.",
  },
  "rest-pause": {
    type: "rest-pause",
    title: "Rest-Pause",
    shortDescription: "Pausas breves para continuar tras el fallo",
    detailedDescription:
      "La técnica rest-pause implica alcanzar el fallo muscular, descansar 10-20 segundos, y luego continuar con 2-5 repeticiones adicionales. Se puede repetir este ciclo 2-3 veces en la misma serie para maximizar el estímulo con cargas pesadas.",
    primaryBenefits: [
      "Extensión del trabajo con cargas pesadas",
      "Máximo reclutamiento de fibras tipo II",
      "Estímulo intenso con tiempo reducido",
      "Mejora de la capacidad de recuperación",
      "Potente adaptación neural",
    ],
    whenToUse:
      "Con ejercicios compuestos o aislados usando cargas del 85-95% 1RM. Ideal para fases de intensificación o cuando el tiempo es limitado.",
    researchNotes:
      "Técnica respaldada por investigación que muestra efectividad similar a múltiples series tradicionales con menor tiempo total.",
  },
  mechanical: {
    type: "mechanical",
    title: "Advantage Mecánica",
    shortDescription: "Progresión desde ejercicios más difíciles a más fáciles",
    detailedDescription:
      "Los drop sets mecánicos implican cambiar a una variación más fácil del mismo ejercicio al alcanzar el fallo, en lugar de reducir peso. Se progresa desde posiciones de mayor dificultad mecánica a posiciones más favorables para extender la serie.",
    primaryBenefits: [
      "Máximo tiempo bajo tensión",
      "Reclutamiento completo de fibras",
      "Estímulo único al músculo",
      "No requiere cambio de peso",
      "Adaptación neuromuscular avanzada",
    ],
    whenToUse:
      "Con ejercicios que tienen variaciones claras de dificultad mecánica. Ideal para entrenamiento de hipertrofia avanzada y cuando se busca variedad.",
    researchNotes:
      "Método emergente con evidencia preliminar prometedora para maximizar el estímulo hipertrófico sin equipamiento adicional.",
  },
};

export const getTrainingMethodInfo = (
  setType: ISetType
): TrainingMethodInfo => {
  return TRAINING_METHODS[setType];
};
