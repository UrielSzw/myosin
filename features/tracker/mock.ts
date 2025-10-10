import { IMetricDefinition, IQuickAction, UUID } from './types';

const now = new Date().toISOString();

/**
 * Métricas predefinidas
 */
export const PREDEFINED_METRICS: IMetricDefinition[] = [
  {
    id: 'protein',
    slug: 'protein',
    name: 'Proteína',
    type: 'value',
    unit: 'g',
    canonicalUnit: 'g',
    conversionFactor: 1,
    defaultTarget: 150,
    settings: { step: 1, precision: 0 },
    createdAt: now,
    color: '#10B981', // green-500
    icon: 'Beef',
  },
  {
    id: 'water',
    slug: 'water',
    name: 'Agua',
    type: 'counter',
    unit: 'L',
    canonicalUnit: 'ml',
    conversionFactor: 1000, // 1 L = 1000 ml
    defaultTarget: 2500, // en ml
    settings: { step: 0.1, precision: 1 },
    createdAt: now,
    color: '#3B82F6', // blue-500
    icon: 'Droplets',
  },
  {
    id: 'calories',
    slug: 'calories',
    name: 'Calorías',
    type: 'value',
    unit: 'kcal',
    canonicalUnit: 'kcal',
    conversionFactor: 1,
    defaultTarget: 2000,
    createdAt: now,
    color: '#F59E0B', // amber-500
    icon: 'Flame',
  },
  {
    id: 'steps',
    slug: 'steps',
    name: 'Pasos',
    type: 'counter',
    unit: 'pasos',
    canonicalUnit: 'pasos',
    conversionFactor: 1,
    defaultTarget: 10000,
    createdAt: now,
    color: '#8B5CF6', // violet-500
    icon: 'Footprints',
  },
  {
    id: 'sleep',
    slug: 'sleep',
    name: 'Sueño',
    type: 'value',
    unit: 'horas',
    canonicalUnit: 'min',
    conversionFactor: 60, // horas → minutos
    defaultTarget: 8 * 60,
    createdAt: now,
    color: '#6366F1', // indigo-500
    icon: 'Moon',
  },
  {
    id: 'weight',
    slug: 'weight',
    name: 'Peso',
    type: 'value',
    unit: 'kg',
    canonicalUnit: 'kg',
    conversionFactor: 1,
    createdAt: now,
    color: '#EF4444', // red-500
    icon: 'Scale',
  },
  {
    id: 'mood',
    slug: 'mood',
    name: 'Estado de ánimo',
    type: 'value',
    unit: 'escala',
    canonicalUnit: 'escala',
    conversionFactor: 1,
    settings: { min: 1, max: 5, step: 1 },
    createdAt: now,
    color: '#F59E0B', // amber-500
    icon: 'Smile',
  },
];

/**
 * Quick actions predefinidos
 */
export const PREDEFINED_QUICK_ACTIONS: Record<UUID, IQuickAction[]> = {
  // Protein
  protein: [
    {
      id: 'qa-protein-chicken',
      metricId: 'protein',
      label: 'Pollo (150g)',
      value: 35,
      position: 1,
      createdAt: now,
      icon: 'ChefHat',
      unit: 'g',
    },
    {
      id: 'qa-protein-eggs',
      metricId: 'protein',
      label: 'Huevos (2u)',
      value: 12,
      position: 2,
      createdAt: now,
      icon: 'Egg',
      unit: 'g',
    },
    {
      id: 'qa-protein-shake',
      metricId: 'protein',
      label: 'Shake de proteína',
      value: 25,
      position: 3,
      createdAt: now,
      icon: 'Coffee',
      unit: 'g',
    },
    {
      id: 'qa-protein-yogurt',
      metricId: 'protein',
      label: 'Yogurt griego',
      value: 15,
      position: 4,
      createdAt: now,
      icon: 'Milk',
      unit: 'g',
    },
    {
      id: 'qa-protein-tuna',
      metricId: 'protein',
      label: 'Atún (lata)',
      value: 28,
      position: 5,
      createdAt: now,
      icon: 'Fish',
      unit: 'g',
    },
    {
      id: 'qa-protein-lentils',
      metricId: 'protein',
      label: 'Lentejas (1 taza)',
      value: 18,
      position: 6,
      createdAt: now,
      icon: 'Wheat',
      unit: 'g',
    },
  ],

  // Water
  water: [
    {
      id: 'qa-water-small',
      metricId: 'water',
      label: 'Vaso chico (200ml)',
      value: 0.2,
      position: 1,
      createdAt: now,
      icon: 'CupSoda',
      unit: 'L',
    },
    {
      id: 'qa-water-large',
      metricId: 'water',
      label: 'Vaso grande (300ml)',
      value: 0.3,
      position: 2,
      createdAt: now,
      icon: 'CupSoda',
      unit: 'L',
    },
    {
      id: 'qa-water-bottle',
      metricId: 'water',
      label: 'Botella (500ml)',
      value: 0.5,
      position: 3,
      createdAt: now,
      icon: 'CupSoda',
      unit: 'L',
    },
    {
      id: 'qa-water-bigbottle',
      metricId: 'water',
      label: 'Botella grande (1L)',
      value: 1,
      position: 4,
      createdAt: now,
      icon: 'CupSoda',
      unit: 'L',
    },
  ],

  // Sleep
  sleep: [
    {
      id: 'qa-sleep-nap',
      metricId: 'sleep',
      label: 'Siesta (30min)',
      value: 0.5,
      position: 1,
      createdAt: now,
      icon: 'Bed',
      unit: 'h',
    },
    {
      id: 'qa-sleep-full',
      metricId: 'sleep',
      label: 'Noche completa (8h)',
      value: 8,
      position: 2,
      createdAt: now,
      icon: 'Bed',
      unit: 'h',
    },
  ],

  // Mood
  mood: [
    {
      id: 'qa-mood-great',
      metricId: 'mood',
      label: 'Excelente 😃',
      value: 5,
      position: 1,
      createdAt: now,
      icon: 'Smile',
      unit: 'scale',
    },
    {
      id: 'qa-mood-ok',
      metricId: 'mood',
      label: 'Normal 🙂',
      value: 3,
      position: 2,
      createdAt: now,
      icon: 'Meh',
      unit: 'scale',
    },
    {
      id: 'qa-mood-bad',
      metricId: 'mood',
      label: 'Bajo 😔',
      value: 1,
      position: 3,
      createdAt: now,
      icon: 'Frown',
      unit: 'scale',
    },
  ],
};
