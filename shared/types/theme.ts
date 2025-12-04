/**
 * Theme Types
 * Centralized type definitions for theming
 */

import { getThemeColors } from "../constants/colors";

/**
 * Type for the colors object returned by useColorScheme()
 * Includes theme-specific colors and all brand color palettes
 */
export type ThemeColors = ReturnType<typeof getThemeColors>;
