import type { AdaptiveRetryConfig } from "../types/sync-queue";

// Default configuration
export const DEFAULT_RETRY_CONFIG: AdaptiveRetryConfig = {
  maxRetries: 5,
  baseDelay: 1000, // 1 segundo
  maxDelay: 300000, // 5 minutos
  backoffMultiplier: 2, // Doubling
  jitterFactor: 0.3, // ±30% randomness
  networkRecoveryReset: 30000, // 30 segundos
};

/**
 * Calcula el delay para próximo retry usando exponential backoff
 */
export const calculateBackoffDelay = (
  retryCount: number,
  config: AdaptiveRetryConfig = DEFAULT_RETRY_CONFIG
): number => {
  const { baseDelay, maxDelay, backoffMultiplier, jitterFactor } = config;

  // Exponential calculation
  const exponential = baseDelay * Math.pow(backoffMultiplier, retryCount);

  // Cap at maximum delay
  const capped = Math.min(exponential, maxDelay);

  // Add jitter to avoid thundering herd
  const jitter = Math.random() * jitterFactor;
  const jitterMultiplier = 1 + (jitter - jitterFactor / 2); // ±jitterFactor/2

  return Math.round(capped * jitterMultiplier);
};

/**
 * Calcula la fecha de próximo retry
 */
export const calculateNextRetryDate = (
  retryCount: number,
  config?: AdaptiveRetryConfig
): Date => {
  const delay = calculateBackoffDelay(retryCount, config);
  return new Date(Date.now() + delay);
};

/**
 * Determina si un error debería causar backoff de toda la queue
 */
export const shouldTriggerCircuitBreaker = (error: Error): boolean => {
  const errorMessage = error.message.toLowerCase();

  // Network errors que indican problemas generales
  const networkErrors = [
    "network error",
    "fetch failed",
    "connection refused",
    "timeout",
    "dns",
    "unreachable",
  ];

  // Server errors que indican problemas del backend
  const serverErrors = [
    "internal server error",
    "bad gateway",
    "service unavailable",
    "gateway timeout",
  ];

  const criticalErrors = [...networkErrors, ...serverErrors];

  return criticalErrors.some((pattern) => errorMessage.includes(pattern));
};

/**
 * Formatea delay en texto legible
 */
export const formatDelay = (delayMs: number): string => {
  if (delayMs < 1000) {
    return `${delayMs}ms`;
  } else if (delayMs < 60000) {
    return `${Math.round(delayMs / 1000)}s`;
  } else {
    return `${Math.round(delayMs / 60000)}min`;
  }
};

/**
 * Timeline de retries para debugging
 */
export const getRetryTimeline = (
  maxRetries: number = 5,
  config?: AdaptiveRetryConfig
): { attempt: number; delay: number; total: number; formatted: string }[] => {
  const timeline = [];
  let totalTime = 0;

  for (let i = 0; i <= maxRetries; i++) {
    const delay = i === 0 ? 0 : calculateBackoffDelay(i, config);
    totalTime += delay;

    timeline.push({
      attempt: i + 1,
      delay,
      total: totalTime,
      formatted: formatDelay(totalTime),
    });
  }

  return timeline;
};
