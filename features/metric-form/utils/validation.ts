import { METRIC_VALIDATION_RULES } from "../types";

/**
 * Validates metric name
 */
export const validateMetricName = (name: string): string | null => {
  if (!name.trim()) {
    return "El nombre es requerido";
  }

  if (name.length < METRIC_VALIDATION_RULES.name.minLength) {
    return `El nombre debe tener al menos ${METRIC_VALIDATION_RULES.name.minLength} caracteres`;
  }

  if (name.length > METRIC_VALIDATION_RULES.name.maxLength) {
    return `El nombre no puede exceder ${METRIC_VALIDATION_RULES.name.maxLength} caracteres`;
  }

  if (!METRIC_VALIDATION_RULES.name.pattern.test(name)) {
    return "El nombre solo puede contener letras, números, espacios y guiones";
  }

  return null;
};

/**
 * Validates metric slug
 */
export const validateMetricSlug = (slug: string): string | null => {
  if (!slug.trim()) {
    return "El identificador es requerido";
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
export const validateMetricUnit = (unit: string): string | null => {
  if (!unit.trim()) {
    return "La unidad es requerida";
  }

  if (unit.length < METRIC_VALIDATION_RULES.unit.minLength) {
    return `La unidad debe tener al menos ${METRIC_VALIDATION_RULES.unit.minLength} caracter`;
  }

  if (unit.length > METRIC_VALIDATION_RULES.unit.maxLength) {
    return `La unidad no puede exceder ${METRIC_VALIDATION_RULES.unit.maxLength} caracteres`;
  }

  if (!METRIC_VALIDATION_RULES.unit.pattern.test(unit)) {
    return "La unidad contiene caracteres no válidos";
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
export const validateQuickActionLabel = (label: string): string | null => {
  if (!label.trim()) {
    return "La etiqueta es requerida";
  }

  if (label.length > 50) {
    return "La etiqueta no puede exceder 50 caracteres";
  }

  return null;
};

/**
 * Validates quick action value
 */
export const validateQuickActionValue = (value: number): string | null => {
  if (value <= 0) {
    return "El valor debe ser mayor a 0";
  }

  if (value > 999999) {
    return "El valor es demasiado grande";
  }

  return null;
};
