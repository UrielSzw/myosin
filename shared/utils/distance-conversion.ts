/**
 * Distance Unit Conversion Utilities
 *
 * Architecture: Canonical METRIC Storage
 * - Short distances stored in METERS (m)
 * - Long distances stored in KILOMETERS (km)
 * - Conversion to user's preferred system happens only at UI layer
 * - Maximum precision in storage, smart rounding in display
 */

export type DistanceUnit = "metric" | "imperial";

/**
 * Conversion factors (international standards)
 * 1 km = 0.621371 miles
 * 1 m = 3.28084 feet
 */
const KM_TO_MILES = 0.621371;
const MILES_TO_KM = 1.60934;
const METERS_TO_FEET = 3.28084;
const FEET_TO_METERS = 0.3048;

// ============================================================================
// SHORT DISTANCES (meters / feet)
// ============================================================================

/**
 * Convert meters (from DB) to user's preferred unit for display
 *
 * @param meters - Value stored in DB (always meters)
 * @param system - User's preferred system
 * @param decimals - Decimal places for display (default: 0)
 * @returns Converted value rounded for display
 *
 * @example
 * fromMeters(100, "metric") // 100
 * fromMeters(100, "imperial") // 328 (feet)
 */
export const fromMeters = (
  meters: number,
  system: DistanceUnit,
  decimals: number = 0
): number => {
  if (system === "metric") {
    return parseFloat(meters.toFixed(decimals));
  }
  // Imperial: convert to feet
  const feet = meters * METERS_TO_FEET;
  return parseFloat(feet.toFixed(decimals));
};

/**
 * Convert user input to meters for DB storage
 *
 * @param value - User input value
 * @param system - User's current system
 * @returns Value in meters (for DB storage)
 *
 * @example
 * toMeters(100, "metric") // 100
 * toMeters(328, "imperial") // ~100 (from feet)
 */
export const toMeters = (value: number, system: DistanceUnit): number => {
  if (system === "metric") return value;
  // Imperial: convert from feet to meters
  return value * FEET_TO_METERS;
};

// ============================================================================
// LONG DISTANCES (kilometers / miles)
// ============================================================================

/**
 * Convert kilometers (from DB) to user's preferred unit for display
 *
 * @param km - Value stored in DB (always km)
 * @param system - User's preferred system
 * @param decimals - Decimal places for display (default: 1)
 * @returns Converted value rounded for display
 *
 * @example
 * fromKm(10, "metric") // 10.0
 * fromKm(10, "imperial") // 6.2 (miles)
 */
export const fromKm = (
  km: number,
  system: DistanceUnit,
  decimals: number = 1
): number => {
  if (system === "metric") {
    return parseFloat(km.toFixed(decimals));
  }
  // Imperial: convert to miles
  const miles = km * KM_TO_MILES;
  return parseFloat(miles.toFixed(decimals));
};

/**
 * Convert user input to kilometers for DB storage
 *
 * @param value - User input value
 * @param system - User's current system
 * @returns Value in kilometers (for DB storage)
 *
 * @example
 * toKm(10, "metric") // 10
 * toKm(6.2, "imperial") // ~10 (from miles)
 */
export const toKm = (value: number, system: DistanceUnit): number => {
  if (system === "metric") return value;
  // Imperial: convert from miles to km
  return value * MILES_TO_KM;
};

// ============================================================================
// UNIT LABELS
// ============================================================================

/**
 * Get display unit label for short distances
 */
export const getShortDistanceUnit = (system: DistanceUnit): string => {
  return system === "metric" ? "m" : "ft";
};

/**
 * Get display unit label for short distances (uppercase for headers)
 */
export const getShortDistanceLabel = (system: DistanceUnit): string => {
  return system === "metric" ? "METROS" : "FEET";
};

/**
 * Get display unit label for long distances
 */
export const getLongDistanceUnit = (system: DistanceUnit): string => {
  return system === "metric" ? "km" : "mi";
};

/**
 * Get display unit label for long distances (uppercase for headers)
 */
export const getLongDistanceLabel = (system: DistanceUnit): string => {
  return system === "metric" ? "KM" : "MI";
};

// ============================================================================
// FORMATTING
// ============================================================================

/**
 * Format short distance value for display with unit label
 *
 * @param meters - Value from DB (in meters)
 * @param system - User's preferred system
 * @param decimals - Decimal places (default: 0)
 * @returns Formatted string with unit
 *
 * @example
 * formatShortDistance(100, "metric") // "100 m"
 * formatShortDistance(100, "imperial") // "328 ft"
 */
export const formatShortDistance = (
  meters: number,
  system: DistanceUnit,
  decimals: number = 0
): string => {
  const value = fromMeters(meters, system, decimals);
  const unit = getShortDistanceUnit(system);
  return `${value} ${unit}`;
};

/**
 * Format long distance value for display with unit label
 *
 * @param km - Value from DB (in km)
 * @param system - User's preferred system
 * @param decimals - Decimal places (default: 1)
 * @returns Formatted string with unit
 *
 * @example
 * formatLongDistance(10, "metric") // "10.0 km"
 * formatLongDistance(10, "imperial") // "6.2 mi"
 */
export const formatLongDistance = (
  km: number,
  system: DistanceUnit,
  decimals: number = 1
): string => {
  const value = fromKm(km, system, decimals);
  const unit = getLongDistanceUnit(system);
  return `${value} ${unit}`;
};
