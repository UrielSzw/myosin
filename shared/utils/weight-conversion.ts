/**
 * Weight Unit Conversion Utilities
 *
 * Architecture: Canonical KG Storage
 * - All weights stored in DB as kilograms (kg)
 * - Conversion to user's preferred unit (lbs) happens only at UI layer
 * - Maximum precision in storage, smart rounding in display
 */

export type WeightUnit = "kg" | "lbs";

/**
 * Conversion factor (international standard)
 * 1 kg = 2.20462262185 lbs
 */
const KG_TO_LBS_FACTOR = 2.20462262185;

/**
 * Convert any weight value to canonical unit (kg) for DB storage
 *
 * @param value - Weight value
 * @param unit - Current unit of the value
 * @returns Value in kilograms (for DB storage)
 *
 * @example
 * toKg(100, "kg") // 100
 * toKg(220.5, "lbs") // 100.0227...
 */
export const toKg = (value: number, unit: WeightUnit): number => {
  if (unit === "kg") return value;
  return value / KG_TO_LBS_FACTOR;
};

/**
 * Convert weight from canonical unit (kg) to user's preferred unit
 *
 * @param kgValue - Value stored in DB (always kg)
 * @param targetUnit - User's preferred unit
 * @param decimals - Decimal places for display (default: 1)
 * @returns Converted value rounded for display
 *
 * @example
 * fromKg(100, "kg", 1) // 100.0
 * fromKg(100, "lbs", 1) // 220.5
 * fromKg(53.0704, "lbs", 1) // 117.0 (exact round-trip)
 */
export const fromKg = (
  kgValue: number,
  targetUnit: WeightUnit,
  decimals: number = 1
): number => {
  const converted = targetUnit === "kg" ? kgValue : kgValue * KG_TO_LBS_FACTOR;
  return parseFloat(converted.toFixed(decimals));
};

/**
 * Format weight value for display with unit label
 *
 * @param kgValue - Value from DB (in kg)
 * @param unit - User's preferred unit
 * @param decimals - Decimal places (default: 1)
 * @returns Formatted string with unit
 *
 * @example
 * formatWeight(100, "kg") // "100 kg"
 * formatWeight(100, "lbs") // "220.5 lbs"
 */
export const formatWeight = (
  kgValue: number,
  unit: WeightUnit,
  decimals: number = 1
): string => {
  const value = fromKg(kgValue, unit, decimals);
  return `${value} ${unit}`;
};
