/**
 * Available Lucide React icons for metrics
 * Organized by category for better UX
 */
export const METRIC_ICONS = {
  // Health & Fitness
  Heart: "Heart",
  Activity: "Activity",
  Zap: "Zap",
  Target: "Target",
  Pulse: "Pulse",
  Dumbbell: "Dumbbell",
  Timer: "Timer",

  // Food & Nutrition
  Apple: "Apple",
  Coffee: "Coffee",
  Utensils: "Utensils",
  UtensilsCrossed: "UtensilsCrossed",
  Milk: "Milk",
  Fish: "Fish",
  Egg: "Egg",
  Wheat: "Wheat",
  Cherry: "Cherry",
  Beef: "Beef",
  Cookie: "Cookie",
  Pizza: "Pizza",

  // Drinks & Hydration
  Droplets: "Droplets",
  Waves: "Waves",
  CupSoda: "CupSoda",
  Wine: "Wine",
  GlassWater: "GlassWater",

  // Body & Wellness
  Brain: "Brain",
  Eye: "Eye",
  Smile: "Smile",
  Frown: "Frown",
  Meh: "Meh",
  Thermometer: "Thermometer",
  Stethoscope: "Stethoscope",
  Pill: "Pill",

  // Sleep & Rest
  Moon: "Moon",
  Bed: "Bed",
  CloudMoon: "CloudMoon",
  Sun: "Sun",
  Sunrise: "Sunrise",
  Sunset: "Sunset",

  // Activities & Movement
  Footprints: "Footprints",
  Bike: "Bike",
  Car: "Car",
  Plane: "Plane",
  MapPin: "MapPin",
  Navigation: "Navigation",
  Compass: "Compass",

  // Time & Schedule
  Clock: "Clock",
  Calendar: "Calendar",
  CalendarDays: "CalendarDays",
  Alarm: "Alarm",
  Watch: "Watch",

  // Measurements & Data
  Scale: "Scale",
  Ruler: "Ruler",
  Gauge: "Gauge",
  TrendingUp: "TrendingUp",
  TrendingDown: "TrendingDown",
  BarChart: "BarChart",
  LineChart: "LineChart",
  PieChart: "PieChart",

  // Work & Study
  Book: "Book",
  BookOpen: "BookOpen",
  GraduationCap: "GraduationCap",
  Briefcase: "Briefcase",
  Monitor: "Monitor",
  Keyboard: "Keyboard",
  Smartphone: "Smartphone",

  // Money & Finance
  DollarSign: "DollarSign",
  CreditCard: "CreditCard",
  Wallet: "Wallet",
  PiggyBank: "PiggyBank",
  Banknote: "Banknote",

  // Nature & Weather
  Leaf: "Leaf",
  Flower: "Flower",
  TreePine: "TreePine",
  Cloud: "Cloud",
  CloudRain: "CloudRain",
  Snowflake: "Snowflake",

  // Achievements & Goals
  Star: "Star",
  Award: "Award",
  Trophy: "Trophy",
  Medal: "Medal",
  Crown: "Crown",
  CheckCircle: "CheckCircle",
  CircleCheck: "CircleCheck",
  Flag: "Flag",

  // General
  Plus: "Plus",
  Minus: "Minus",
  X: "X",
  Check: "Check",
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  Circle: "Circle",
  Square: "Square",
  Triangle: "Triangle",
  Diamond: "Diamond",
  Flame: "Flame",
  Lightbulb: "Lightbulb",
} as const;

export type MetricIconKey = keyof typeof METRIC_ICONS;

/**
 * Array of available icons for metric selection
 * Ordered by categories for better UX
 */
export const METRIC_ICON_OPTIONS: MetricIconKey[] = [
  // Most common for health metrics
  "Activity",
  "Heart",
  "Target",
  "Droplets",
  "Apple",
  "Scale",
  "Moon",
  "Smile",

  // Health & Fitness
  "Zap",
  "Pulse",
  "Dumbbell",
  "Timer",
  "Footprints",
  "TrendingUp",

  // Food & Nutrition
  "Coffee",
  "Utensils",
  "Milk",
  "Fish",
  "Egg",
  "Wheat",
  "Beef",
  "Cherry",

  // Body & Wellness
  "Brain",
  "Eye",
  "Frown",
  "Meh",
  "Thermometer",
  "Pill",

  // Sleep & Time
  "Bed",
  "Clock",
  "Calendar",
  "Sun",
  "Sunrise",

  // Activities
  "Bike",
  "Car",
  "MapPin",
  "Book",
  "Monitor",

  // Measurements
  "Ruler",
  "Gauge",
  "BarChart",
  "LineChart",

  // Achievements
  "Star",
  "Award",
  "Trophy",
  "CheckCircle",
  "Flag",

  // General
  "Circle",
  "Square",
  "Triangle",
  "Flame",
  "Lightbulb",
];

/**
 * Icon categories for organized selection UI
 */
export const METRIC_ICON_CATEGORIES = {
  "Health & Fitness": [
    "Activity",
    "Heart",
    "Zap",
    "Target",
    "Pulse",
    "Dumbbell",
    "Timer",
  ] as MetricIconKey[],
  "Food & Nutrition": [
    "Apple",
    "Coffee",
    "Utensils",
    "Milk",
    "Fish",
    "Egg",
    "Wheat",
    "Beef",
  ] as MetricIconKey[],
  "Body & Wellness": [
    "Brain",
    "Eye",
    "Smile",
    "Frown",
    "Meh",
    "Thermometer",
    "Pill",
  ] as MetricIconKey[],
  "Sleep & Time": [
    "Moon",
    "Bed",
    "Clock",
    "Calendar",
    "Sun",
    "Watch",
  ] as MetricIconKey[],
  Activities: [
    "Footprints",
    "Bike",
    "Car",
    "Book",
    "Monitor",
    "MapPin",
  ] as MetricIconKey[],
  Measurements: [
    "Scale",
    "Ruler",
    "Gauge",
    "TrendingUp",
    "BarChart",
    "LineChart",
  ] as MetricIconKey[],
  Achievements: [
    "Star",
    "Award",
    "Trophy",
    "CheckCircle",
    "Flag",
    "Crown",
  ] as MetricIconKey[],
  General: [
    "Circle",
    "Square",
    "Triangle",
    "Flame",
    "Lightbulb",
    "Plus",
  ] as MetricIconKey[],
} as const;

/**
 * Helper to get icon component name
 */
export const getMetricIconComponent = (iconKey: MetricIconKey): string => {
  return METRIC_ICONS[iconKey];
};
