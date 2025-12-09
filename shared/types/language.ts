/**
 * Centralized language type definitions.
 *
 * When adding a new language:
 * 1. Add the code to SupportedLanguage union type
 * 2. Add the language info to SUPPORTED_LANGUAGES array
 * 3. Add translations in shared/translations/* files
 */

/**
 * Supported language codes.
 * Add new languages here as the app expands.
 */
export type SupportedLanguage = "es" | "en";

/**
 * Generic translation object type.
 * All translation entries should follow this structure.
 */
export type Translation = Record<SupportedLanguage, string>;

/**
 * Default language for the app.
 */
export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

/**
 * Language metadata for UI display.
 */
export interface LanguageInfo {
  code: SupportedLanguage;
  name: string; // Native name (e.g., "Español")
  englishName: string; // English name (e.g., "Spanish")
  flag: string; // Emoji flag
}

/**
 * All supported languages with metadata.
 * Used for language selector UI.
 */
export const SUPPORTED_LANGUAGES: readonly LanguageInfo[] = [
  {
    code: "es",
    name: "Español",
    englishName: "Spanish",
    flag: "🇦🇷",
  },
  {
    code: "en",
    name: "English",
    englishName: "English",
    flag: "🇺🇸",
  },
] as const;

/**
 * Type guard to check if a string is a valid language code.
 */
export const isValidLanguage = (lang: string): lang is SupportedLanguage => {
  return SUPPORTED_LANGUAGES.some((l) => l.code === lang);
};

/**
 * Get language info by code.
 */
export const getLanguageInfo = (
  code: SupportedLanguage
): LanguageInfo | undefined => {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code);
};

/**
 * Safely cast a string to SupportedLanguage, falling back to default.
 */
export const toSupportedLanguage = (
  lang: string | undefined | null
): SupportedLanguage => {
  if (lang && isValidLanguage(lang)) {
    return lang;
  }
  return DEFAULT_LANGUAGE;
};

/**
 * Locale codes for Intl APIs (toLocaleDateString, toLocaleTimeString, etc.)
 * Maps language codes to their full locale identifiers.
 */
export const LANGUAGE_LOCALES: Record<SupportedLanguage, string> = {
  es: "es-ES",
  en: "en-US",
};

/**
 * Get the locale string for a given language.
 * Useful for date/time formatting with Intl APIs.
 */
export const getLocale = (lang: SupportedLanguage): string =>
  LANGUAGE_LOCALES[lang];
