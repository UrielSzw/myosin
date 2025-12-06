/**
 * Logger Service
 *
 * Centraliza todos los logs de la aplicación.
 * En desarrollo: logs en consola
 * En producción: se pueden enviar a Sentry/Crashlytics
 *
 * Uso:
 *   import { logger } from '@/shared/services/logger';
 *   logger.info('Usuario logueado', { userId: '123' });
 *   logger.error('Falló la sincronización', error, { feature: 'sync' });
 */

type LogLevel = "debug" | "info" | "warn" | "error";

type LogContext = {
  feature?: string;
  action?: string;
  userId?: string;
  [key: string]: unknown;
};

const isDev = __DEV__;

const COLORS = {
  debug: "\x1b[36m", // Cyan
  info: "\x1b[32m", // Green
  warn: "\x1b[33m", // Yellow
  error: "\x1b[31m", // Red
  reset: "\x1b[0m",
} as const;

const EMOJIS = {
  debug: "🔍",
  info: "ℹ️",
  warn: "⚠️",
  error: "❌",
} as const;

function formatTimestamp(): string {
  return new Date().toISOString().substring(11, 23); // HH:MM:SS.mmm
}

function formatContext(context?: LogContext): string {
  if (!context || Object.keys(context).length === 0) return "";

  const parts: string[] = [];
  if (context.feature) parts.push(`[${context.feature}]`);
  if (context.action) parts.push(`(${context.action})`);

  // Otros campos
  const otherFields = Object.entries(context)
    .filter(([key]) => !["feature", "action"].includes(key))
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join(" ");

  if (otherFields) parts.push(otherFields);

  return parts.length > 0 ? ` ${parts.join(" ")}` : "";
}

function log(level: LogLevel, message: string, context?: LogContext) {
  if (!isDev && level === "debug") return;

  const timestamp = formatTimestamp();
  const emoji = EMOJIS[level];
  const contextStr = formatContext(context);

  const formattedMessage = `${emoji} ${timestamp} ${message}${contextStr}`;

  switch (level) {
    case "debug":
    case "info":
      console.log(formattedMessage);
      break;
    case "warn":
      console.warn(formattedMessage);
      break;
    case "error":
      console.error(formattedMessage);
      break;
  }
}

export const logger = {
  /**
   * Debug logs - Solo visibles en desarrollo
   */
  debug: (message: string, context?: LogContext) => {
    log("debug", message, context);
  },

  /**
   * Info logs - Información general
   */
  info: (message: string, context?: LogContext) => {
    log("info", message, context);
  },

  /**
   * Warning logs - Algo no esperado pero no crítico
   */
  warn: (message: string, context?: LogContext) => {
    log("warn", message, context);
  },

  /**
   * Error logs - Algo falló
   */
  error: (message: string, error?: Error | unknown, context?: LogContext) => {
    const errorContext: LogContext = {
      ...context,
    };

    if (error instanceof Error) {
      errorContext.errorMessage = error.message;
      errorContext.errorName = error.name;
      // Stack solo en dev para no llenar logs
      if (isDev) {
        errorContext.stack = error.stack?.split("\n").slice(0, 3).join("\n");
      }
    } else if (error) {
      errorContext.errorMessage = String(error);
    }

    log("error", message, errorContext);

    // TODO: En producción, enviar a Sentry/Crashlytics
    // if (!isDev && error instanceof Error) {
    //   Sentry.captureException(error, { extra: context });
    // }
  },

  // ============= Helpers específicos =============

  /**
   * Log de operaciones de sync
   */
  sync: (
    action: string,
    status: "start" | "success" | "fail" | "queue",
    details?: Record<string, unknown>
  ) => {
    const emoji =
      status === "start"
        ? "🔄"
        : status === "success"
        ? "✅"
        : status === "queue"
        ? "📥"
        : "❌";

    const level: LogLevel = status === "fail" ? "error" : "info";

    log(level, `${emoji} Sync: ${action} [${status}]`, {
      feature: "sync",
      action,
      status,
      ...details,
    });
  },

  /**
   * Log de operaciones de base de datos
   */
  db: (
    operation: "query" | "insert" | "update" | "delete" | "transaction",
    table: string,
    details?: Record<string, unknown>
  ) => {
    logger.debug(`DB ${operation}: ${table}`, {
      feature: "database",
      operation,
      table,
      ...details,
    });
  },

  /**
   * Log de navegación
   */
  navigation: (screen: string, params?: Record<string, unknown>) => {
    logger.debug(`Navigate: ${screen}`, {
      feature: "navigation",
      screen,
      ...params,
    });
  },

  /**
   * Log de acciones de usuario
   */
  userAction: (action: string, details?: Record<string, unknown>) => {
    logger.info(`User: ${action}`, {
      feature: "user-action",
      action,
      ...details,
    });
  },

  /**
   * Log de performance
   */
  perf: (operation: string, durationMs: number) => {
    const level: LogLevel = durationMs > 1000 ? "warn" : "debug";
    log(level, `⏱️ ${operation}: ${durationMs}ms`, {
      feature: "performance",
      operation,
      durationMs,
    });
  },

  /**
   * Helper para medir tiempo de operaciones
   */
  time: (operation: string) => {
    const start = performance.now();
    return {
      end: () => {
        const duration = Math.round(performance.now() - start);
        logger.perf(operation, duration);
        return duration;
      },
    };
  },
};

// Export type for consumers
export type Logger = typeof logger;
