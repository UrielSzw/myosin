import { metricFormTranslations } from "@/shared/translations/metric-form";
import { METRIC_VALIDATION_RULES } from "../types";

/**
 * Validates metric name
 */
export const validateMetricName = (
  name: string,
  lang: "es" | "en" = "es"
): string | null => {
  const t = metricFormTranslations;
  if (!name.trim()) {
    return t.nameRequired[lang];
  }

  if (name.length < METRIC_VALIDATION_RULES.name.minLength) {
    return t.nameMinLength[lang].replace(
      "{min}",
      METRIC_VALIDATION_RULES.name.minLength.toString()
    );
  }

  if (name.length > METRIC_VALIDATION_RULES.name.maxLength) {
    return t.nameMaxLength[lang].replace(
      "{max}",
      METRIC_VALIDATION_RULES.name.maxLength.toString()
    );
  }

  if (!METRIC_VALIDATION_RULES.name.pattern.test(name)) {
    return t.nameInvalidCharacters[lang];
  }

  return null;
};

/**
 * Validates metric slug
 */
export const validateMetricSlug = (
  slug: string,
  lang: "es" | "en" = "es"
): string | null => {
  const t = metricFormTranslations;
  if (!slug.trim()) {
    return t.slugRequired[lang];
  }

  if (slug.length < METRIC_VALIDATION_RULES.slug.minLength) {
    return `El identificador debe tener al menos ${METRIC_VALIDATION_RULES.slug.minLength} caracteres`;
  }

  if (slug.length > METRIC_VALIDATION_RULES.slug.maxLength) {
    return `El identificador no puede exceder ${METRIC_VALIDATION_RULES.slug.maxLength} caracteres`;
  }

  if (!METRIC_VALIDATION_RULES.slug.pattern.test(slug)) {
    return "El identificador solo puede contener letras minúsculas, números y guiones";
  }

  return null;
};

/**
 * Validates metric unit
 */
export const validateMetricUnit = (
  unit: string,
  lang: "es" | "en" = "es"
): string | null => {
  const t = metricFormTranslations;
  if (!unit.trim()) {
    return t.unitRequired[lang];
  }

  if (unit.length < METRIC_VALIDATION_RULES.unit.minLength) {
    return t.unitMinLength[lang].replace(
      "{min}",
      METRIC_VALIDATION_RULES.unit.minLength.toString()
    );
  }

  if (unit.length > METRIC_VALIDATION_RULES.unit.maxLength) {
    return t.unitMaxLength[lang].replace(
      "{max}",
      METRIC_VALIDATION_RULES.unit.maxLength.toString()
    );
  }

  if (!METRIC_VALIDATION_RULES.unit.pattern.test(unit)) {
    return t.unitInvalidCharacters[lang];
  }

  return null;
};

/**
 * Validates metric target
 */
export const validateMetricTarget = (target?: number): string | null => {
  if (target === undefined || target === null) {
    return null; // Target is optional
  }

  if (target < METRIC_VALIDATION_RULES.target.min) {
    return `El objetivo no puede ser menor a ${METRIC_VALIDATION_RULES.target.min}`;
  }

  if (target > METRIC_VALIDATION_RULES.target.max) {
    return `El objetivo no puede ser mayor a ${METRIC_VALIDATION_RULES.target.max}`;
  }

  return null;
};

/**
 * Generates a slug from a name
 */
export const generateSlugFromName = (name: string): string => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Remove multiple consecutive hyphens
    .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
    .slice(0, METRIC_VALIDATION_RULES.slug.maxLength);
};

/**
 * Validates quick action label
 */
export const validateQuickActionLabel = (
  label: string,
  lang: "es" | "en" = "es"
): string | null => {
  const t = metricFormTranslations;
  if (!label.trim()) {
    return t.labelRequired[lang];
  }

  if (label.length > 50) {
    return t.labelMaxLength[lang];
  }

  return null;
};

/**
 * Validates quick action value
 */
export const validateQuickActionValue = (
  value: number,
  lang: "es" | "en" = "es"
): string | null => {
  const t = metricFormTranslations;
  if (value <= 0) {
    return lang === "es"
      ? "El valor debe ser mayor a 0"
      : "Value must be greater than 0";
  }

  if (value > 999999) {
    return t.valueTooLarge[lang];
  }

  return null;
};
